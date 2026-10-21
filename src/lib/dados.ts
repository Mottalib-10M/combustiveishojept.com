/**
 * Les données du jour, chargées UNE fois au build (jamais dans le navigateur en entier) et les références
 * qu'en tirent les pages et les calculateurs : moyennes par concelho et district, postes les moins chers,
 * estimation du lundi, décomposition du litre, Madeira, historique mensuel. Tout chiffre d'une page vient d'ici
 * ou du moteur ; aucun n'est écrit à la main (CONTRIBUTING-PAGES.md).
 */
import postosRaw from '../data/postos.json';
import pmdRaw from '../data/pmd.json';
import enseRaw from '../data/ense.json';
import madeiraRaw from '../data/madeira.json';
import estadoRaw from '../data/estado.json';
import type { Fuel, PostosFile, PmdFile, EnseFile, MadeiraFile, Estado } from './engine/tipos';
import { FUELS } from './engine/tipos';
import { comPreco, stats, maisBaratos, agrupar, type PostoPreco, type Stats } from './engine/precos';
import { estimativa, SERIE, addDays, diaSemana, segundaDe, type Estimativa } from './engine/previsao';

export const POSTOS = postosRaw as unknown as PostosFile;
export const PMD = pmdRaw as unknown as PmdFile;
export const ENSE = enseRaw as unknown as EnseFile;
export const MADEIRA = madeiraRaw as unknown as MadeiraFile;
export const ESTADO = estadoRaw as unknown as Estado;
export { FUELS };
export type { Fuel };

export const FUEL_NOME: Record<'pt' | 'en', Record<Fuel, string>> = {
  pt: { gs: 'Gasóleo simples', ge: 'Gasóleo especial', g95: 'Gasolina simples 95', g95e: 'Gasolina especial 95', g98: 'Gasolina 98', gpl: 'GPL Auto' },
  en: { gs: 'Diesel (standard)', ge: 'Diesel (premium)', g95: 'Petrol 95 (standard)', g95e: 'Petrol 95 (premium)', g98: 'Petrol 98', gpl: 'LPG (autogas)' },
};

/** Les 18 districts du continent, avec leur segment d'URL. */
export const DISTRITOS = [...new Set(POSTOS.concelhos.map(([d]) => d))].sort((a, b) => a.localeCompare(b, 'pt'));
export const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const concelhosDe = (distrito: string) => POSTOS.concelhos.filter(([d]) => d === distrito).map(([, c]) => c).sort((a, b) => a.localeCompare(b, 'pt'));

const cache = new Map<string, PostoPreco[]>();
/** Postes qui affichent ce combustível (filtrés par district et concelho si donnés). */
export function lista(fuel: Fuel, distrito?: string, concelho?: string): PostoPreco[] {
  const k = `${fuel}|${distrito ?? ''}|${concelho ?? ''}`;
  if (!cache.has(k)) cache.set(k, comPreco(POSTOS.postos, fuel, (p) => (!distrito || p.d === distrito) && (!concelho || p.c === concelho)));
  return cache.get(k)!;
}
export const statsDe = (fuel: Fuel, distrito?: string, concelho?: string): Stats | null => stats(lista(fuel, distrito, concelho));
export const baratos = (fuel: Fuel, n = 5, distrito?: string, concelho?: string) => maisBaratos(lista(fuel, distrito, concelho), n);
export const porConcelho = (fuel: Fuel, distrito?: string) => agrupar(lista(fuel, distrito), (p) => p.concelho);
export const porDistrito = (fuel: Fuel) => agrupar(lista(fuel), (p) => p.distrito);
export const porMarca = (fuel: Fuel) => agrupar(lista(fuel), (p) => p.marca || '—');
export const porTipo = (fuel: Fuel) => agrupar(lista(fuel), (p) => p.tipo);

/** Dernier jour du prix moyen journalier (DGEG). */
export const DIAS_PMD = Object.keys(PMD.dias).sort();
export const ULTIMO_PMD = DIAS_PMD[DIAS_PMD.length - 1];
export const HOJE = ESTADO.hoje;
export function pmd(fuel: Fuel, dia = ULTIMO_PMD) {
  const v = PMD.dias[dia]?.[fuel];
  return v ? { dia, media: v[0], min: v[1], max: v[2], n: v[3], semDesconto: v[4] } : null;
}
/** Le même jour une semaine, un mois ou un an avant (ou le jour publié le plus proche avant). */
export function pmdAntes(fuel: Fuel, dias: number, de = ULTIMO_PMD) {
  let d = addDays(de, -dias);
  for (let i = 0; i < 7 && !PMD.dias[d]?.[fuel]; i++) d = addDays(d, -1);
  return pmd(fuel, d);
}

/** Moyennes mensuelles du PMD (simple moyenne des jours publiés). */
export function mensal(fuel: Fuel): Array<{ mes: string; media: number; min: number; max: number; dias: number }> {
  const g: Record<string, number[]> = {};
  for (const d of DIAS_PMD) { const v = PMD.dias[d][fuel]; if (v) (g[d.slice(0, 7)] ??= []).push(v[0]); }
  return Object.entries(g).map(([mes, v]) => ({ mes, media: v.reduce((s, x) => s + x, 0) / v.length, min: Math.min(...v), max: Math.max(...v), dias: v.length }));
}
/** Série journalière du PMD depuis une date. */
export const serie = (fuel: Fuel, desde: string) => DIAS_PMD.filter((d) => d >= desde && PMD.dias[d][fuel]).map((d) => ({ dia: d, media: PMD.dias[d][fuel]![0] }));

/** Écart moyen de chaque jour de la semaine à la moyenne de sa semaine (semaines complètes depuis `desde`), en €/l. */
export function efeitoDiaSemana(fuel: Fuel, desde: string): number[] {
  const acc = Array.from({ length: 7 }, () => [] as number[]);
  for (let m = segundaDe(desde); m <= ULTIMO_PMD; m = addDays(m, 7)) {
    const v = Array.from({ length: 7 }, (_, i) => PMD.dias[addDays(m, i)]?.[fuel]?.[0]);
    if (v.some((x) => x == null)) continue;
    const med = (v as number[]).reduce((s, x) => s + x, 0) / 7;
    v.forEach((x, i) => acc[i].push((x as number) - med));
  }
  return acc.map((a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0));
}
export const semanasCompletas = (desde: string) => { let n = 0; for (let m = segundaDe(desde); addDays(m, 6) <= ULTIMO_PMD; m = addDays(m, 7)) if (Array.from({ length: 7 }, (_, i) => PMD.dias[addDays(m, i)]?.gs).every(Boolean)) n++; return n; };

/** Estimation du prochain lundi pour chaque combustível (null si les données manquent). */
const EST: Partial<Record<Fuel, Estimativa | null>> = {};
export function est(fuel: Fuel): Estimativa | null {
  if (!(fuel in EST)) EST[fuel] = estimativa(ENSE.ref[SERIE[fuel]], PMD.dias, fuel, HOJE);
  return EST[fuel]!;
}
export const ULTIMO_ENSE = Object.keys(ENSE.ref.gasoleo).sort().pop()!;

/** ISP par litre (avec CSR et taxe carbone) de la dernière décomposition ENSE pour la série du combustível. */
export function ispLitro(fuel: Fuel): number {
  const d = ENSE.decomp[SERIE[fuel]];
  return d.partes[ENSE.decomp.labels.indexOf('ISP')];
}
export const decompEnse = (fuel: Fuel) => {
  const d = ENSE.decomp[SERIE[fuel]], L = ENSE.decomp.labels;
  return { preco: d.preco, partes: L.map((l, i) => ({ label: l, valor: d.partes[i] ?? 0 })) };
};

export const MADEIRA_ATUAL = MADEIRA.despachos[MADEIRA.despachos.length - 1];
export { diaSemana };

/* ——— Références par district pour les textes (toujours recalculées : un classement change d'un jour à l'autre) ——— */
/** Rang du district parmi les 18 pour ce combustível (1 = moyenne affichée la plus basse). */
export function rankDistrito(fuel: Fuel, distrito: string) {
  const g = porDistrito(fuel);
  const ordem = Object.entries(g).sort((a, b) => a[1].media - b[1].media).map(([d]) => d);
  return { pos: ordem.indexOf(distrito) + 1, de: ordem.length, maisBarato: ordem[0], maisCaro: ordem[ordem.length - 1] };
}
/** Tous les postes du district (quel que soit le combustível), et le nombre par type de poste. */
export function postosDistrito(distrito: string) {
  const l = POSTOS.postos.filter((p) => p.d === distrito);
  const tipo = (t: string) => l.filter((p) => p.t === t).length;
  return { total: l.length, autoestrada: tipo('Auto-estrada'), hiper: tipo('Área comercial (Hipermercados)'), rua: tipo('Outro'), gpl: l.filter((p) => p.p.gpl).length, concelhos: concelhosDe(distrito).length };
}
/** Moyenne par type de poste dans le district. */
export const tipoDistrito = (fuel: Fuel, distrito: string) => agrupar(lista(fuel, distrito), (p) => p.tipo);
/** Marques du district, de la plus présente à la moins présente. */
export function marcasDistrito(fuel: Fuel, distrito: string, n = 5) {
  return Object.entries(agrupar(lista(fuel, distrito), (p) => p.marca || '—')).sort((a, b) => b[1].n - a[1].n).slice(0, n).map(([marca, s]) => ({ marca, ...s }));
}
/** Concelhos du district classés par moyenne (au moins `minimo` postes). */
export function concelhosOrdenados(fuel: Fuel, distrito: string, minimo = 2) {
  return Object.entries(porConcelho(fuel, distrito)).filter(([, s]) => s.n >= minimo).sort((a, b) => a[1].media - b[1].media).map(([concelho, s]) => ({ concelho, ...s }));
}
/** Écart moyen du district à la moyenne affichée du continent, en €/l. */
export const desvioDistrito = (fuel: Fuel, distrito: string) => (statsDe(fuel, distrito)?.media ?? 0) - (statsDe(fuel)?.media ?? 0);
