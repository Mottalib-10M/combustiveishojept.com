/** Props (build) de chaque calculateur, calculées depuis les données officielles : un seul endroit, partagé par les pages et l'accueil. */
import { FUELS, est, ispLitro, mensal, pmd, statsDe, porMarca, porTipo, efeitoDiaSemana, semanasCompletas, MADEIRA, ULTIMO_PMD, type Fuel } from './dados';
import { IVA_CONTINENTE } from './engine/custos';
import { P } from './params';
import type { Estimativa } from './engine/previsao';

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const porFuel = <T,>(f: (x: Fuel) => T | null | undefined) => Object.fromEntries(FUELS.map((x) => [x, f(x)]).filter(([, v]) => v != null)) as Partial<Record<Fuel, T>>;

export const precoAfixado = () => porFuel((f) => { const s = statsDe(f); return s ? r3(s.media) : null; });
export const precoMinimo = () => porFuel((f) => statsDe(f)?.min);
export const consumos = (): Record<Fuel, number> => { const e = P.exemplos; return { gs: e.consumo_gasoleo, ge: e.consumo_gasoleo, g95: e.consumo_gasolina, g95e: e.consumo_gasolina, g98: e.consumo_gasolina, gpl: e.consumo_gpl }; };
export const ests = (): Partial<Record<Fuel, Estimativa | null>> => Object.fromEntries(FUELS.map((f) => [f, est(f)]));
export const isps = (): Record<Fuel, number> => Object.fromEntries(FUELS.map((f) => [f, ispLitro(f)])) as Record<Fuel, number>;
export const meses = () => porFuel((f) => mensal(f).map((m) => [m.mes, r3(m.media), m.min, m.max, m.dias] as [string, number, number, number, number]));
export const ultimo = () => porFuel((f) => { const p = pmd(f); return p ? ([p.dia, p.media] as [string, number]) : null; });
const grupos = (g: Record<string, { media: number; min: number; n: number }>, minimo: number) => Object.entries(g).filter(([, s]) => s.n >= minimo).sort((a, b) => b[1].n - a[1].n).map(([k, s]) => [k, r3(s.media), s.min, s.n] as [string, number, number, number]);
export const marcas = () => porFuel((f) => grupos(porMarca(f), 20).slice(0, 14));
export const tipos = () => porFuel((f) => grupos(porTipo(f), 1));
export const DESDE_EFEITO = '2025-01-06';
export const efeitos = () => porFuel((f) => efeitoDiaSemana(f, DESDE_EFEITO));
export const segundas = () => porFuel((f) => { const e = est(f); return e && e.qualidade.publica ? { variacao: e.variacao, data: e.segunda } : null; });
export const continente = () => ({ g95: pmd('g95')!.media, gs: pmd('gs')!.media, dia: ULTIMO_PMD });
export const aditivado = () => {
  const a = precoAfixado();
  return {
    gasoleo: { simples: pmd('gs')!.media, especial: pmd('ge')!.media, afixSimples: a.gs!, afixEspecial: a.ge! },
    gasolina: { simples: pmd('g95')!.media, especial: pmd('g95e')!.media, afixSimples: a.g95!, afixEspecial: a.g95e! },
  };
};
export function toolProps(tool: string) {
  switch (tool) {
    case 'previsao': return { ests: ests() };
    case 'impostos': return { isp: isps(), precos: precoAfixado(), iva: IVA_CONTINENTE };
    case 'custo': return { precos: precoAfixado(), minimos: precoMinimo(), consumos: consumos() };
    case 'historico': return { meses: meses(), ultimo: ultimo() };
    case 'marcas': return { marcas: marcas(), tipos: tipos(), nacional: precoAfixado() };
    case 'madeira': return { despachos: MADEIRA.despachos, continente: continente() };
    case 'acores': { const c = consumos(); return { continente: continente(), consumos: { gs: c.gs, g95: c.g95 } }; }
    case 'quando': return { efeito: efeitos(), semanas: semanasCompletas(DESDE_EFEITO), segunda: segundas() };
    case 'aditivado': { const c = consumos(); return { precos: aditivado(), consumos: { gasoleo: c.gs, gasolina: c.g95 }, dia: ULTIMO_PMD }; }
    default: return {};
  }
}
