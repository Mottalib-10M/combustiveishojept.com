/**
 * Données passées par props aux calculateurs (build). Jamais le fichier des 3 000 postes entier :
 * - `zonas` : moyenne, minimum et nombre de postes par concelho (et `*` pour tout le district), par combustível ;
 * - `postos` : les 5 postes les moins chers du district de la page, par concelho et par combustível ;
 *   les autres districts se chargent après un choix du visiteur depuis /dados/<district>.json (même forme).
 * Les prix sont reproduits tels que la DGEG les publie, avec la date-heure de leur mise à jour (conditions DGEG).
 */
import { POSTOS, DISTRITOS, FUELS, lista, porConcelho, statsDe, baratos, pmd, slug, type Fuel } from './dados';
import type { PostoLinha } from '../components/calc/kit';

export type Trio = [number, number, number];
export type ZonaStats = Partial<Record<Fuel, Trio>>;
export type PostosDistrito = Record<string, Partial<Record<Fuel, PostoLinha[]>>>;
export interface BundlePrecos {
  lido: string;
  distritos: string[];
  zonas: Record<string, Record<string, ZonaStats>>;
  nacional: Partial<Record<Fuel, { media: number; min: number; n: number; pmd: number; pmdDia: string }>>;
  distrito: string;
  postos: PostosDistrito;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const linha = (p: ReturnType<typeof baratos>[number]): PostoLinha => [p.nome, p.marca, p.localidade, p.preco, p.atualizado];

let ZONAS: BundlePrecos['zonas'] | null = null;
export function zonas() {
  if (ZONAS) return ZONAS;
  const z: BundlePrecos['zonas'] = {};
  for (const d of DISTRITOS) {
    z[d] = { '*': {} };
    for (const f of FUELS) {
      const s = statsDe(f, d);
      if (s) z[d]['*'][f] = [r3(s.media), s.min, s.n];
      for (const [c, cs] of Object.entries(porConcelho(f, d))) (z[d][c] ??= {})[f] = [r3(cs.media), cs.min, cs.n];
    }
  }
  return (ZONAS = z);
}

export function postosDistrito(d: string, n = 5): PostosDistrito {
  const out: PostosDistrito = { '*': {} };
  for (const f of FUELS) {
    const l = baratos(f, n, d);
    if (l.length) out['*'][f] = l.map(linha);
    for (const c of Object.keys(porConcelho(f, d))) (out[c] ??= {})[f] = baratos(f, n, d, c).map(linha);
  }
  return out;
}

export function nacional(): BundlePrecos['nacional'] {
  const o: BundlePrecos['nacional'] = {};
  for (const f of FUELS) {
    const s = statsDe(f), p = pmd(f);
    if (s && p) o[f] = { media: r3(s.media), min: s.min, n: s.n, pmd: p.media, pmdDia: p.dia };
  }
  return o;
}

export function bundlePrecos(distrito = 'Lisboa'): BundlePrecos {
  return { lido: POSTOS.ultimaAtualizacao, distritos: DISTRITOS, zonas: zonas(), nacional: nacional(), distrito, postos: postosDistrito(distrito) };
}
export const ficheiroDistrito = (d: string) => `/dados/${slug(d)}.json`;
export { lista };
