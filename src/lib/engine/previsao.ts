/**
 * Estimativa da variação de segunda-feira (méthode publiée sur la page Método).
 *
 * Au Portugal, les postes revoient leurs prix le lundi en suivant les cotations de la semaine écoulée. Le prix
 * de référence quotidien de l'ENSE (cotation internationale + fret + biocarburants + logistique + ISP + IVA,
 * sans la marge de détail) résume ces cotations. On estime :
 *
 *   variação(segunda M) = β × [ média ENSE (seg.–sex. da semana antes de M) − média ENSE (seg.–sex. da semana anterior) ]
 *   preço estimado(M)   = preço médio DGEG da segunda-feira anterior + variação
 *
 * β est ajusté par moindres carrés (droite passant par zéro) sur toutes les semaines passées, sans jamais voir
 * la semaine estimée (rétro-test honnête). L'estimation n'est publiée pour un combustível que si, sur les
 * semaines de test, son erreur moyenne est inférieure à celle de « le prix ne bouge pas ».
 */
import type { EnseSerie, Fuel, PmdFile } from './tipos';

export const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
/** 0 = segunda … 6 = domingo */
export const diaSemana = (iso: string) => (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7;
export const segundaDe = (iso: string) => addDays(iso, -diaSemana(iso));
/** Segunda-feira seguinte (estritamente depois de iso). */
export const proximaSegunda = (iso: string) => addDays(segundaDe(iso), 7);

/** Série ENSE de référence pour chaque combustível. */
export const SERIE: Record<Fuel, EnseSerie> = { gs: 'gasoleo', ge: 'gasoleo', g95: 'gasolina', g95e: 'gasolina', g98: 'gasolina', gpl: 'gpl' };

/** Moyenne des jours ouvrés publiés d'une semaine [seg, seg+5[, limitée aux jours <= ate. */
export function mediaSemana(ref: Record<string, number>, segunda: string, ate?: string): { media: number; dias: number } | null {
  const v: number[] = [];
  for (let i = 0; i < 5; i++) { const d = addDays(segunda, i); if (ate && d > ate) break; if (ref[d] != null) v.push(ref[d]); }
  return v.length ? { media: v.reduce((s, x) => s + x, 0) / v.length, dias: v.length } : null;
}

export interface Semana { segunda: string; x: number; y: number }

/** Couples (variation ENSE de la semaine précédente, variation réelle du prix moyen DGEG lundi/lundi). */
export function semanas(ref: Record<string, number>, pmd: PmdFile['dias'], fuel: Fuel): Semana[] {
  const out: Semana[] = [];
  const dias = Object.keys(pmd).sort();
  if (!dias.length) return out;
  for (let m = proximaSegunda(addDays(dias[0], 13)); m <= dias[dias.length - 1]; m = addDays(m, 7)) {
    const ant = addDays(m, -7);
    const a = mediaSemana(ref, ant), b = mediaSemana(ref, addDays(ant, -7));
    const pm = pmd[m]?.[fuel]?.[0], pa = pmd[ant]?.[fuel]?.[0];
    if (!a || !b || a.dias < 3 || b.dias < 3 || pm == null || pa == null) continue;
    out.push({ segunda: m, x: a.media - b.media, y: pm - pa });
  }
  return out;
}

/** β des moindres carrés à travers l'origine. */
export function beta(s: Pick<Semana, 'x' | 'y'>[]): number {
  const sxx = s.reduce((a, r) => a + r.x * r.x, 0);
  return sxx > 0 ? s.reduce((a, r) => a + r.x * r.y, 0) / sxx : 0;
}

export interface LinhaTeste { segunda: string; estimada: number; real: number; erro: number; beta: number }
/** Rétro-test : chaque semaine est estimée avec le β des semaines antérieures seulement (au moins `minimo`). */
export function retroteste(s: Semana[], minimo = 52): LinhaTeste[] {
  const out: LinhaTeste[] = [];
  for (let i = minimo; i < s.length; i++) {
    const b = beta(s.slice(0, i));
    const est = b * s[i].x;
    out.push({ segunda: s[i].segunda, estimada: est, real: s[i].y, erro: est - s[i].y, beta: b });
  }
  return out;
}

export interface Qualidade { semanas: number; mae: number; maeIgual: number; sentido: number; publica: boolean }
/** Erreur moyenne absolue de l'estimation et de « rien ne bouge », part des semaines où le sens est juste. */
export function qualidade(t: LinhaTeste[]): Qualidade {
  if (!t.length) return { semanas: 0, mae: 0, maeIgual: 0, sentido: 0, publica: false };
  const mae = t.reduce((a, r) => a + Math.abs(r.erro), 0) / t.length;
  const maeIgual = t.reduce((a, r) => a + Math.abs(r.real), 0) / t.length;
  // Sens : une variation réelle de moins de 0,5 cêntimo compte comme « estável » et toute estimation de moins de 0,5 aussi.
  const s = (v: number) => (Math.abs(v) < 0.005 ? 0 : Math.sign(v));
  const sentido = t.filter((r) => s(r.estimada) === s(r.real)).length / t.length;
  return { semanas: t.length, mae, maeIgual, sentido, publica: mae < maeIgual };
}

export interface Estimativa {
  fuel: Fuel;
  /** segunda-feira estimada */ segunda: string;
  /** segunda-feira de base (prix en vigueur) */ base: string;
  precoBase: number;
  variacao: number;
  preco: number;
  beta: number;
  /** jours ouvrés ENSE déjà publiés pour la semaine en cours (5 = estimation complète) */
  dias: number;
  ultimoEnse: string;
  qualidade: Qualidade;
  ultimas: LinhaTeste[];
}

/** Estimation du prochain lundi après `hoje` (dernier jour de données). */
export function estimativa(ref: Record<string, number>, pmd: PmdFile['dias'], fuel: Fuel, hoje: string): Estimativa | null {
  const seg = proximaSegunda(hoje), base = addDays(seg, -7);
  const s = semanas(ref, pmd, fuel).filter((r) => r.segunda < seg);
  const ultimoEnse = Object.keys(ref).filter((d) => d <= hoje).sort().pop() ?? '';
  const a = mediaSemana(ref, base, hoje), b = mediaSemana(ref, addDays(base, -7));
  // prix de base : le lundi en cours ; à défaut (données en retard), le dernier jour publié de la semaine
  const diasPmd = Object.keys(pmd).filter((d) => d >= base && d <= hoje && pmd[d]?.[fuel]).sort();
  const precoBase = pmd[base]?.[fuel]?.[0] ?? (diasPmd.length ? pmd[diasPmd[0]][fuel]![0] : undefined);
  if (!a || !b || precoBase == null || s.length < 20) return null;
  const bt = beta(s);
  const variacao = bt * (a.media - b.media);
  const t = retroteste(s);
  return { fuel, segunda: seg, base, precoBase, variacao, preco: precoBase + variacao, beta: bt, dias: a.dias, ultimoEnse, qualidade: qualidade(t), ultimas: t.slice(-12) };
}
