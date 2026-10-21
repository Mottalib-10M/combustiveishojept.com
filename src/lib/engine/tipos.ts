/** Types des données officielles lues par scripts/update-data.py (src/data/*.json). */

/** Clés courtes des combustíveis suivis : gasóleo simples, gasóleo especial (aditivado), gasolina simples 95,
 *  gasolina especial 95, gasolina 98, GPL Auto. */
export type Fuel = 'gs' | 'ge' | 'g95' | 'g95e' | 'g98' | 'gpl';
export const FUELS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];

/** Un posto tel que publié par la DGEG : prix affiché (€/l) et date-heure de sa dernière mise à jour. */
export interface Posto {
  id: number;
  /** nome */ n: string;
  /** marca */ m: string;
  /** tipo de posto : « Outro », « Área comercial (Hipermercados) », « Auto-estrada » */ t: string;
  /** distrito */ d: string;
  /** concelho */ c: string;
  /** localidade */ l: string;
  /** prix par combustível : [€/l, « AAAA-MM-JJ HH:MM »] */
  p: Partial<Record<Fuel, [number, string]>>;
}
export interface PostosFile { lido: string; ultimaAtualizacao: string; concelhos: [string, string][]; postos: Posto[] }

/** Jour du prix moyen journalier (PMD) de la DGEG : [média com descontos, mínimo, máximo, nº postos, média sem descontos]. */
export type PmdDia = Partial<Record<Fuel, [number, number, number, number, number]>>;
export interface PmdFile { lido: string; dias: Record<string, PmdDia> }

export type EnseSerie = 'gasolina' | 'gasoleo' | 'gpl';
export interface EnseFile {
  lido: string;
  ref: Record<EnseSerie, Record<string, number>>;
  decomp: { labels: string[] } & Record<EnseSerie, { preco: number; partes: number[] }>;
}
export interface MadeiraDespacho { vigor: string; despacho: string; g95: number; gs: number; colorido: number | null; url: string }
export interface MadeiraFile { lido: string; despachos: MadeiraDespacho[] }
export interface Estado { gerado: string; hoje: string; erros: string[] }
