import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { Fuel } from '../../lib/engine/tipos';
const D = 'Bragança';
const Z = { media: 0, min: 0, max: 0, n: 0 };
const FS: Fuel[] = ['gs', 'ge', 'g95', 'g95e', 'g98', 'gpl'];

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, gpl = h.D.statsDe('gpl', D), gplPt = h.D.statsDe('gpl');
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D), rg = h.D.rankDistrito('g95', D);
  const marcas = h.D.marcasDistrito('gs', D, 4);
  const tabela = FS.map((f) => ({ f, s: h.D.statsDe(f, D), pt: h.D.statsDe(f), r: h.D.rankDistrito(f, D) })).filter((x) => x.s && x.pt);
  const conc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s })).sort((a, b) => a.media - b.media);
  const viz = (['Vila Real', 'Viseu', 'Guarda'] as const).map((n) => ({ n, s: h.D.statsDe('gs', n) })).filter((x) => x.s);
  return { gs, g95, gpl, gplPt, p, r, rg, marcas, tabela, conc, viz };
}
/** Situe un rang dans le classement sans écrire en dur « le plus cher ». */
const zona = (h: Helpers, pos: number, de: number) => {
  const pt = h.lang === 'pt';
  if (pos === 1) return pt ? 'o mais barato de todos' : 'the cheapest of all';
  if (pos === de) return pt ? 'o mais caro de todos' : 'the dearest of all';
  if (pos <= de / 3) return pt ? 'no terço mais barato' : 'in the cheapest third';
  if (pos > (2 * de) / 3) return pt ? 'no terço mais caro' : 'in the dearest third';
  return pt ? 'a meio da tabela' : 'mid-table';
};

export default defineGuide({
  id: 'braganca', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['vila-real', 'guarda', 'viseu', 'preco-gpl-auto', 'precos-por-marca'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'braganca', nav: 'Bragança', card: 'Onde fica Bragança entre os distritos em cada combustível, e quais as marcas e os concelhos mais baratos.',
    title: 'Combustíveis em Bragança hoje: preços e lugar no ranking',
    description: 'Combustíveis hoje no distrito de Bragança: o lugar do distrito em cada combustível, as marcas com mais postos, onde há GPL Auto e os concelhos mais baratos.',
    h1: 'Preços dos combustíveis no distrito de Bragança',
    intro: (h) => `Todos os combustíveis, ${h.num(h.D.postosDistrito(D).concelhos)} concelhos e a comparação com os outros distritos do continente, a partir dos preços afixados hoje.`,
    resume: (h) => {
      const { gs, g95, p, r, rg, marcas } = dados(h);
      const m0 = marcas[0];
      return `Hoje, no distrito de Bragança, o gasóleo simples custa em média ${h.l(gs.media)} e a gasolina simples 95 ${h.l(g95.media)}. Ordenando os ${h.num(r.de)} distritos do continente do mais barato para o mais caro, Bragança fica em ${h.ord(r.pos)} lugar no gasóleo, ${zona(h, r.pos, r.de)}, e em ${h.ord(rg.pos)} na gasolina, ${zona(h, rg.pos, rg.de)}. Em cêntimos, o gasóleo do distrito está ${h.c(h.D.desvioDistrito('gs', D), true)} por litro face à média do continente, uma distância que num depósito de 50 litros vale ${h.eur(Math.abs(h.D.desvioDistrito('gs', D)) * 50, 2)}. São ${h.num(p.total)} postos no registo da DGEG, ${p.autoestrada ? `${h.num(p.autoestrada)} deles em autoestrada` : 'nenhum deles em autoestrada'}. ${m0 ? `A marca com mais postos de gasóleo no distrito é ${m0.marca}, com ${h.num(m0.n)}, a uma média de ${h.l(m0.media)}.` : ''} Dentro do distrito, o posto mais barato pede ${h.l(gs.min)} e o mais caro ${h.l(gs.max)}, e é essa diferença, mais do que a média, que decide quanto se paga ao fim do mês.`;
    },
    faqs: (h) => [
      { q: 'Há postos de combustível em autoestrada no distrito de Bragança?', a: (() => { const { p } = dados(h); return p.autoestrada ? `Sim: a DGEG lista hoje ${h.num(p.autoestrada)} postos em áreas de serviço de autoestrada no distrito, entre ${h.num(p.total)} postos ao todo. Os restantes são postos de rua${p.hiper ? ` e ${h.num(p.hiper)} de hipermercado` : ''}. Os preços de cada um aparecem na calculadora, com a hora da última atualização comunicada.` : `Hoje a DGEG não lista nenhum posto em área de serviço de autoestrada no distrito: os ${h.num(p.total)} postos registados são de rua${p.hiper ? ` ou de hipermercado (${h.num(p.hiper)})` : ''}. Numa viagem pelo distrito, abastece-se por isso nos postos das localidades por onde se passa, com preços de posto de rua.`; })() },
      { q: 'Quantos postos vendem GPL Auto no distrito de Bragança?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Hoje são ${h.num(p.gpl)}, entre os ${h.num(p.total)} postos do distrito, com preço médio de ${h.l(gpl.media)}${gplPt ? ` (${h.c(gpl.media - gplPt.media, true)} face ao continente)` : ''}. Com tão poucos postos, convém saber onde estão antes de sair: escolha GPL Auto na calculadora e veja os concelhos com posto e a hora de cada preço.` : `Hoje nenhum posto do distrito comunica preço de GPL Auto à DGEG. Quem tem carro a GPL deve contar com abastecer nos distritos próximos; a calculadora mostra os postos com GPL em cada distrito.`; })() },
      { q: 'Qual é a marca com mais postos de combustível no distrito de Bragança?', a: (() => { const { marcas, gs } = dados(h); const m0 = marcas[0], m1 = marcas[1]; return m0 ? `Hoje é ${m0.marca}, com ${h.num(m0.n)} postos que vendem gasóleo, ${h.pct(m0.n / Math.max(gs.n, 1))} do total do distrito, a uma média de ${h.l(m0.media)}.${m1 ? ` Segue-se ${m1.marca}, com ${h.num(m1.n)} postos e média de ${h.l(m1.media)}.` : ''} A contagem é feita sobre os postos que comunicam preço de gasóleo simples à DGEG.` : 'Hoje não há postos suficientes com preço comunicado para fazer a contagem por marca. A calculadora mostra os postos do distrito à medida que atualizam os preços.'; })() },
    ],
    body: (h) => {
      const { gs, tabela, marcas, conc, viz, gpl, p } = dados(h);
      const lo = conc[0], hi = conc[conc.length - 1];
      return `<h2>Bragança na tabela dos distritos</h2>
<p>A posição de um distrito não é a mesma em todos os combustíveis. A tabela compara a média de Bragança com a do continente em cada um e indica o lugar do distrito, do preço mais baixo para o mais alto.${gpl ? ` No GPL Auto, a média assenta em apenas ${h.num(p.gpl)} postos, o que a torna mais instável.` : ''} Gasolina e gasóleo nem sempre andam juntos, e um distrito pode estar barato num e caro no outro no mesmo dia.</p>
${h.table(['Combustível', 'Bragança', 'Continente', 'Lugar'], tabela.map((x) => [h.fn(x.f), h.l(x.s!.media), h.l(x.pt!.media), `${h.ord(x.r.pos)} de ${x.r.de}`]), 'Média afixada hoje por combustível', ['l', 'r', 'r', 'r'])}
<h2>Concelho a concelho</h2>
<p>${lo && hi && conc.length > 1 ? `O gasóleo tem hoje a média mais baixa em ${lo.concelho} (${h.l(lo.media)}) e a mais alta em ${hi.concelho} (${h.l(hi.media)}). Esta distância de ${h.c(hi.media - lo.media)} por litro é maior do que a que separa a maior parte dos distritos entre si.` : 'Hoje há poucos concelhos com dados para comparar.'} Em concelhos com um ou dois postos, a média é o preço desses postos e muda com eles.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], conc.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho', ['l', 'r', 'r', 'r'])}
<h2>As marcas da rede</h2>
<p>${marcas.map((m) => `${m.marca}: ${h.num(m.n)} postos, média de ${h.l(m.media)}`).join('; ')}. A composição da rede pesa na média do distrito tanto como os preços de cada posto. A comparação nacional está na página ${h.a('precos-por-marca', 'preços por marca')}.</p>
<h2>Vizinhos e fronteira</h2>
<p>O distrito faz fronteira com Espanha; este site mostra apenas os postos portugueses. Dos distritos vizinhos, ${viz.map((x) => `${h.a(h.D.slug(x.n), x.n)} tem o gasóleo a ${h.l(x.s!.media)} (${h.c(x.s!.media - gs.media, true)} face a Bragança)`).join(', ')}.</p>`;
    },
  },
  en: {
    slug: 'braganca', nav: 'Bragança', card: 'Where Bragança ranks among the districts for each fuel, and which brands and municipalities are cheapest.',
    title: 'Fuel prices in Bragança today: how the district ranks',
    description: 'Fuel prices today in Bragança district: where it ranks for each fuel, the brands with the most stations, where to find LPG and the cheapest municipalities.',
    h1: 'Fuel prices in Bragança district',
    intro: (h) => `Every fuel, ${h.num(h.D.postosDistrito(D).concelhos)} municipalities and a comparison with the other mainland districts, based on prices posted today.`,
    resume: (h) => {
      const { gs, g95, p, r, rg, marcas } = dados(h);
      const m0 = marcas[0];
      return `Today in Bragança district, standard diesel costs ${h.l(gs.media)} on average and standard petrol 95 ${h.l(g95.media)}. Ranking the ${h.num(r.de)} mainland districts from cheapest to dearest, Bragança comes ${h.ord(r.pos)} for diesel, ${zona(h, r.pos, r.de)}, and ${h.ord(rg.pos)} for petrol, ${zona(h, rg.pos, rg.de)}. In cents, the district's diesel is ${h.c(h.D.desvioDistrito('gs', D), true)} a litre against the mainland average, a gap worth ${h.eur(Math.abs(h.D.desvioDistrito('gs', D)) * 50, 2)} on a 50-litre tank. There are ${h.num(p.total)} stations in the DGEG register, ${p.autoestrada ? `${h.num(p.autoestrada)} of them on motorways` : 'none of them on a motorway'}. ${m0 ? `The brand with the most diesel stations in the district is ${m0.marca}, with ${h.num(m0.n)}, averaging ${h.l(m0.media)}.` : ''} Within the district, the cheapest station asks ${h.l(gs.min)} and the dearest ${h.l(gs.max)}, and it is that spread, more than the average, that decides what you pay by the end of the month.`;
    },
    faqs: (h) => [
      { q: 'Are there motorway fuel stations in Bragança district?', a: (() => { const { p } = dados(h); return p.autoestrada ? `Yes: the DGEG lists ${h.num(p.autoestrada)} motorway service-area stations in the district today, out of ${h.num(p.total)} in all. The rest are street stations${p.hiper ? ` and ${h.num(p.hiper)} hypermarket stations` : ''}. Each one's prices appear in the calculator, with the time of the last reported update.` : `Today the DGEG lists no motorway service-area station in the district: the ${h.num(p.total)} registered stations are street stations${p.hiper ? ` or hypermarket stations (${h.num(p.hiper)})` : ''}. On a trip through the district you therefore fill up at stations in the towns you pass through, at street-station prices.`; })() },
      { q: 'How many stations sell LPG in Bragança district?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Today there are ${h.num(p.gpl)}, out of the ${h.num(p.total)} stations in the district, with an average price of ${h.l(gpl.media)}${gplPt ? ` (${h.c(gpl.media - gplPt.media, true)} against the mainland)` : ''}. With so few stations, it is worth knowing where they are before setting off: pick LPG in the calculator to see which municipalities have one and the time of each price.` : 'Today no station in the district reports an LPG price to the DGEG. Drivers of LPG cars should plan to fill up in nearby districts; the calculator shows the LPG stations in each district.'; })() },
      { q: 'Which brand has the most fuel stations in Bragança district?', a: (() => { const { marcas, gs } = dados(h); const m0 = marcas[0], m1 = marcas[1]; return m0 ? `Today it is ${m0.marca}, with ${h.num(m0.n)} stations selling diesel, ${h.pct(m0.n / Math.max(gs.n, 1))} of the district total, averaging ${h.l(m0.media)}.${m1 ? ` Next comes ${m1.marca}, with ${h.num(m1.n)} stations and an average of ${h.l(m1.media)}.` : ''} The count covers stations that report a standard diesel price to the DGEG.` : 'Today there are not enough stations with a reported price to count by brand. The calculator shows the district’s stations as they update their prices.'; })() },
    ],
    body: (h) => {
      const { gs, tabela, marcas, conc, viz, gpl, p } = dados(h);
      const lo = conc[0], hi = conc[conc.length - 1];
      return `<h2>Bragança in the district table</h2>
<p>A district's position is not the same for every fuel. The table compares Bragança's average with the mainland one for each fuel and gives the district's place, from lowest price to highest.${gpl ? ` For LPG, the average rests on just ${h.num(p.gpl)} stations, which makes it less stable.` : ''} Petrol and diesel do not always move together, so a district can be cheap for one and dear for the other on the same day.</p>
${h.table(['Fuel', 'Bragança', 'Mainland', 'Rank'], tabela.map((x) => [h.fn(x.f), h.l(x.s!.media), h.l(x.pt!.media), `${h.ord(x.r.pos)} of ${x.r.de}`]), 'Posted average today by fuel', ['l', 'r', 'r', 'r'])}
<h2>Municipality by municipality</h2>
<p>${lo && hi && conc.length > 1 ? `Diesel has the lowest average today in ${lo.concelho} (${h.l(lo.media)}) and the highest in ${hi.concelho} (${h.l(hi.media)}). That gap of ${h.c(hi.media - lo.media)} a litre is wider than the one separating most districts from each other.` : 'Today few municipalities have data to compare.'} Where a municipality has one or two stations, the average is simply their price and moves with it.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], conc.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality', ['l', 'r', 'r', 'r'])}
<h2>The brands in the network</h2>
<p>${marcas.map((m) => `${m.marca}: ${h.num(m.n)} stations, averaging ${h.l(m.media)}`).join('; ')}. The make-up of the network weighs on the district average as much as each station's prices do. The national comparison is on the ${h.a('precos-por-marca', 'prices by brand')} page.</p>
<h2>Neighbours and the border</h2>
<p>The district borders Spain; this site shows Portuguese stations only. Among the neighbouring districts, ${viz.map((x) => `${h.a(h.D.slug(x.n), x.n)} has diesel at ${h.l(x.s!.media)} (${h.c(x.s!.media - gs.media, true)} against Bragança)`).join(', ')}.</p>`;
    },
  },
});
