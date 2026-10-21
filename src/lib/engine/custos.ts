/** Coût d'un plein, budget annuel, part des impôts dans le litre. Fonctions pures. */

import P from '../../data/params-2026.json';
/** Taux normal de l'IVA sur le continent (Código do IVA, art. 18.º, n.º 1, c)). */
export const IVA_CONTINENTE: number = P.iva.continente;

export const deposito = (litros: number, preco: number) => litros * preco;

/** Litres et euros par an pour `km` kilomètres à `consumo` l/100 km. */
export function anual(km: number, consumo: number, preco: number) {
  const litros = (km * consumo) / 100;
  return { litros, custo: litros * preco, mes: (litros * preco) / 12, porKm: (consumo / 100) * preco };
}

/** Économie annuelle d'un écart de prix au litre, pour une consommation annuelle en litres. */
export const poupancaAnual = (litrosAno: number, diferenca: number) => litrosAno * diferenca;

export interface Decomposicao { preco: number; iva: number; isp: number; semImpostos: number; partImpostos: number }
/**
 * Décompose un prix à la pompe TTC : IVA = preço × t/(1+t) ; ISP (avec contribution de service routier et taxe
 * carbone, comme l'ENSE le présente) = montant par litre lu dans la dernière décomposition de l'ENSE ; le reste
 * est le produit, la logistique, les biocarburants et la marge du poste.
 */
export function decompor(preco: number, ispLitro: number, taxaIva: number = IVA_CONTINENTE): Decomposicao {
  const iva = (preco * taxaIva) / (1 + taxaIva);
  const isp = Math.min(ispLitro, preco - iva);
  const semImpostos = preco - iva - isp;
  return { preco, iva, isp, semImpostos, partImpostos: (iva + isp) / preco };
}

/** Économie d'attendre (ou d'avancer) un plein quand on attend une variation de `variacao` €/l lundi. */
export const efeitoVariacao = (litros: number, variacao: number) => litros * variacao;
