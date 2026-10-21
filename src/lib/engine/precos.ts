/**
 * Agrégats calculés à partir des prix affichés par poste (DGEG) : moyenne simple des postes d'un concelho ou
 * d'un district, minimum, postes les moins chers. Fonctions pures, testées (engine.test.ts).
 *
 * La moyenne d'un concelho est NOTRE calcul (moyenne simple des prix affichés, sans pondération par les
 * volumes vendus ni remise de carte) ; elle diffère donc du prix moyen journalier de la DGEG, pondéré par les
 * quantités et net des remises. Les pages le disent.
 */
import type { Fuel, Posto } from './tipos';

export interface Stats { media: number; min: number; max: number; n: number }
export interface PostoPreco { id: number; nome: string; marca: string; tipo: string; distrito: string; concelho: string; localidade: string; preco: number; atualizado: string }

const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** Postes qui affichent ce combustible, éventuellement filtrés. Un prix nul ou absurde (< 0,3 € ou > 5 €) est écarté. */
export function comPreco(postos: Posto[], fuel: Fuel, filtro: (p: Posto) => boolean = () => true): PostoPreco[] {
  const out: PostoPreco[] = [];
  for (const p of postos) {
    const v = p.p[fuel];
    if (!v || !(v[0] >= 0.3 && v[0] <= 5) || !filtro(p)) continue;
    out.push({ id: p.id, nome: p.n, marca: p.m, tipo: p.t, distrito: p.d, concelho: p.c, localidade: p.l, preco: v[0], atualizado: v[1] });
  }
  return out;
}

export function stats(lista: { preco: number }[]): Stats | null {
  if (!lista.length) return null;
  let s = 0, min = Infinity, max = -Infinity;
  for (const x of lista) { s += x.preco; if (x.preco < min) min = x.preco; if (x.preco > max) max = x.preco; }
  return { media: r3(s / lista.length), min, max, n: lista.length };
}

/** Les n postes les moins chers ; à prix égal, le plus récemment mis à jour d'abord. */
export function maisBaratos(lista: PostoPreco[], n = 5): PostoPreco[] {
  return [...lista].sort((a, b) => a.preco - b.preco || b.atualizado.localeCompare(a.atualizado) || a.nome.localeCompare(b.nome)).slice(0, n);
}

/** Statistiques par clé (concelho, district, marque, type de poste). */
export function agrupar(lista: PostoPreco[], chave: (p: PostoPreco) => string): Record<string, Stats> {
  const g: Record<string, PostoPreco[]> = {};
  for (const p of lista) (g[chave(p)] ??= []).push(p);
  return Object.fromEntries(Object.entries(g).map(([k, v]) => [k, stats(v)!]));
}

/** Écart entre deux prix au litre, en cêntimos (arrondi au dixième). */
export const centimos = (a: number, b: number) => Math.round((a - b) * 1000) / 10;

/** Date-heure la plus récente d'une liste. */
export const maisRecente = (lista: PostoPreco[]) => lista.reduce((m, p) => (p.atualizado > m ? p.atualizado : m), '');
