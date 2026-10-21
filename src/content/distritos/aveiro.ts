import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Aveiro';
const Z = { media: 0, min: 0, max: 0, n: 0 };

/** Chiffres du jour communs aux deux langues (recalculés à chaque build). */
function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, ge = h.D.statsDe('ge', D), g98 = h.D.statsDe('g98', D);
  const p = h.D.postosDistrito(D), c = h.D.concelhosOrdenados('gs', D), t = h.D.tipoDistrito('gs', D);
  const r = h.D.rankDistrito('gs', D), rg = h.D.rankDistrito('g95', D);
  const g95c = h.D.porConcelho('g95', D);
  const viz = (['Porto', 'Viseu', 'Coimbra'] as const).map((n) => ({ n, s: h.D.statsDe('gs', n) })).filter((x) => x.s);
  return { gs, g95, ge, g98, p, c, t, r, rg, g95c, viz, ae: t['Auto-estrada'], lo: c[0], hi: c[c.length - 1] };
}

export default defineGuide({
  id: 'aveiro', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['porto', 'coimbra', 'viseu', 'custo-deposito', 'preco-gasolina-98'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'aveiro', nav: 'Aveiro', card: 'Quanto custa hoje encher o depósito nos concelhos do distrito de Aveiro, de gasóleo ou de gasolina.',
    title: 'Combustíveis em Aveiro hoje: gasóleo, gasolina e depósito',
    description: 'Gasóleo e gasolina hoje no distrito de Aveiro: média de cada concelho, o custo de um depósito de 40 a 60 litros e a comparação com Porto, Viseu e Coimbra.',
    h1: 'Gasóleo e gasolina no distrito de Aveiro',
    intro: (h) => `Preços afixados hoje nos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Aveiro e o que custa, em euros, um depósito cheio.`,
    resume: (h) => {
      const { gs, g95, p, r, rg } = dados(h);
      return `Hoje, o gasóleo simples está afixado em média a ${h.l(gs.media)} no distrito de Aveiro e a gasolina simples 95 a ${h.l(g95.media)}. Entre os dois combustíveis há ${h.c(Math.abs(g95.media - gs.media))} por litro, com a gasolina ${g95.media < gs.media ? 'mais barata' : 'mais cara'} do que o gasóleo. No conjunto dos ${h.num(r.de)} distritos do continente, Aveiro aparece em ${h.ord(r.pos)} lugar no gasóleo e em ${h.ord(rg.pos)} na gasolina, contando do preço médio mais baixo para o mais alto. A média do gasóleo assenta em ${h.num(gs.n)} postos e a da gasolina em ${h.num(g95.n)}, repartidos pelos ${h.num(p.concelhos)} concelhos. Num depósito de 50 litros de gasóleo, a conta fica em ${h.eur(gs.media * 50, 2)} ao preço médio e em ${h.eur(gs.min * 50, 2)} no posto mais barato do distrito, que afixa ${h.l(gs.min)}. Quem abastece todas as semanas sente esta diferença ao fim do mês; a calculadora lista os postos mais baratos de cada concelho com a hora a que o preço foi comunicado à DGEG.`;
    },
    faqs: (h) => [
      { q: 'Quanto custa hoje um depósito de 60 litros de gasóleo no distrito de Aveiro?', a: (() => { const { gs } = dados(h); return `Ao preço médio afixado hoje, ${h.l(gs.media)}, um depósito de 60 litros de gasóleo simples custa ${h.eur(gs.media * 60, 2)}. No posto mais barato do distrito, a ${h.l(gs.min)}, fica em ${h.eur(gs.min * 60, 2)}, e no mais caro, a ${h.l(gs.max)}, sobe a ${h.eur(gs.max * 60, 2)}. Os valores são recalculados todos os dias com os preços que os postos comunicam à DGEG.`; })() },
      { q: 'A gasolina 98 é fácil de encontrar no distrito de Aveiro?', a: (() => { const { g98, g95, p } = dados(h); return g98 ? `Hoje ${h.num(g98.n)} dos ${h.num(p.total)} postos do distrito afixam gasolina 98, a uma média de ${h.l(g98.media)}, ou seja ${h.c(g98.media - g95.media, true)} por litro face à gasolina simples 95. É vendida sobretudo nos postos das grandes marcas; escolha Gasolina 98 na calculadora para ver os mais baratos de cada concelho.` : `Hoje nenhum posto do distrito comunica preço de gasolina 98 à DGEG. A gasolina simples 95 está à venda em quase todos os postos e serve a maior parte dos motores a gasolina; confirme no manual do carro se o fabricante exige 98.`; })() },
      { q: 'O gasóleo no distrito de Aveiro está mais barato do que no distrito do Porto?', a: (() => { const { gs } = dados(h); const po = h.D.statsDe('gs', 'Porto'); if (!po) return `Hoje não há dados suficientes do distrito do Porto para comparar. A média do gasóleo simples no distrito de Aveiro é de ${h.l(gs.media)}, e a calculadora mostra os postos mais baratos de cada concelho, com a hora da última atualização comunicada à DGEG.`; const d = gs.media - po.media; return `Hoje a média do gasóleo simples é de ${h.l(gs.media)} no distrito de Aveiro e de ${h.l(po.media)} no do Porto, o que deixa Aveiro ${h.c(d, true)} por litro face ao vizinho. A diferença entre distritos é pequena e muda de dia para dia; dentro de cada distrito, a escolha do posto pesa mais do que o lado da fronteira distrital.`; })() },
    ],
    body: (h) => {
      const { gs, ge, g95, g98, c, g95c, viz, ae, lo, hi } = dados(h);
      const linhas = [40, 50, 60].map((L) => [`${L} litros`, h.eur(gs.min * L, 2), h.eur(gs.media * L, 2), ae ? h.eur(ae.media * L, 2) : '—']);
      return `<h2>O preço de um depósito cheio</h2>
<p>Quantos litros leva o depósito depende do carro. A tabela faz a conta para três tamanhos correntes, ao preço do posto mais barato do distrito, à média de todos os postos e${ae ? ' à média das áreas de serviço de autoestrada' : ', quando existam, às áreas de serviço de autoestrada'}. Num depósito de 60 litros, a distância entre o posto mais barato e a média é de ${h.eur((gs.media - gs.min) * 60, 2)}.</p>
${h.table(['Depósito', 'Posto mais barato', 'Média do distrito', 'Autoestrada'], linhas, 'Gasóleo simples, custo de um depósito ao preço de hoje', ['l', 'r', 'r', 'r'])}
<h2>Simples, aditivado ou gasolina</h2>
<p>${ge ? `O gasóleo especial, aditivado, custa em média ${h.l(ge.media)} no distrito, ${h.c(ge.media - gs.media, true)} por litro face ao simples.` : 'Nenhum posto comunica hoje preço de gasóleo especial.'} Do lado da gasolina, a simples 95 está a ${h.l(g95.media)}${g98 ? ` e a 98, afixada em ${h.num(g98.n)} postos, a ${h.l(g98.media)}` : ''}. Para saber se o aditivado compensa no seu carro, a página ${h.a('simples-ou-aditivado', 'simples ou aditivado')} faz as contas com o seu consumo.</p>
<h2>Do concelho mais barato ao mais caro</h2>
<p>${lo && hi && c.length > 1 ? `Hoje é em ${lo.concelho} que o gasóleo tem a média mais baixa, ${h.l(lo.media)}, e em ${hi.concelho} a mais alta, ${h.l(hi.media)}: ${h.c(hi.media - lo.media)} por litro de um extremo ao outro, ${h.eur((hi.media - lo.media) * 50, 2)} num depósito de 50 litros.` : 'Hoje há poucos concelhos com dados suficientes para os ordenar.'} A segunda coluna de preços mostra a gasolina simples 95 no mesmo concelho, que nem sempre segue a ordem do gasóleo.</p>
${h.table(['Concelho', 'Postos', 'Gasóleo', 'Gasolina 95'], c.map((x) => [x.concelho, x.n, h.l(x.media), g95c[x.concelho] ? h.l(g95c[x.concelho].media) : '—']), 'Média afixada por concelho, concelhos com dois postos ou mais', ['l', 'r', 'r', 'r'])}
<h2>Aveiro, Porto, Viseu e Coimbra</h2>
<p>${viz.map((x) => `No distrito ${x.n === 'Porto' ? 'do' : 'de'} ${h.a(h.D.slug(x.n), x.n)}, o gasóleo simples está hoje a ${h.l(x.s!.media)}, ${h.c(x.s!.media - gs.media, true)} face a Aveiro`).join('; ')}. Entre distritos vizinhos as médias ficam próximas, e é dentro do próprio concelho, de posto para posto, que se encontram as maiores diferenças.</p>`;
    },
  },
  en: {
    slug: 'aveiro', nav: 'Aveiro', card: 'What it costs today to fill up with diesel or petrol in each municipality of Aveiro district.',
    title: 'Fuel prices in Aveiro today: diesel, petrol and full tank',
    description: 'Diesel and petrol in Aveiro district today: the average in each municipality, the cost of a 40 to 60-litre tank and a comparison with Porto, Viseu and Coimbra.',
    h1: 'Diesel and petrol in Aveiro district',
    intro: (h) => `Prices posted today in the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Aveiro district, and what a full tank costs in euros.`,
    resume: (h) => {
      const { gs, g95, p, r, rg } = dados(h);
      return `Today, standard diesel is posted at ${h.l(gs.media)} on average in Aveiro district and standard petrol 95 at ${h.l(g95.media)}. The two fuels are ${h.c(Math.abs(g95.media - gs.media))} a litre apart, with petrol ${g95.media < gs.media ? 'cheaper' : 'dearer'} than diesel. Across the ${h.num(r.de)} mainland districts, Aveiro ranks ${h.ord(r.pos)} for diesel and ${h.ord(rg.pos)} for petrol, counting from the lowest average to the highest. The diesel average rests on ${h.num(gs.n)} stations and the petrol one on ${h.num(g95.n)}, spread over ${h.num(p.concelhos)} municipalities. For a 50-litre tank of diesel, the bill comes to ${h.eur(gs.media * 50, 2)} at the average price and ${h.eur(gs.min * 50, 2)} at the cheapest station in the district, which posts ${h.l(gs.min)}. Anyone who fills up every week feels that gap by the end of the month; the calculator lists the cheapest stations in each municipality with the time each price was reported to the DGEG.`;
    },
    faqs: (h) => [
      { q: 'How much does a 60-litre tank of diesel cost in Aveiro district today?', a: (() => { const { gs } = dados(h); return `At today's average posted price of ${h.l(gs.media)}, a 60-litre tank of standard diesel costs ${h.eur(gs.media * 60, 2)}. At the cheapest station in the district, at ${h.l(gs.min)}, it comes to ${h.eur(gs.min * 60, 2)}, and at the dearest, at ${h.l(gs.max)}, it rises to ${h.eur(gs.max * 60, 2)}. The figures are recomputed every day from the prices stations report to the DGEG.`; })() },
      { q: 'Is petrol 98 easy to find in Aveiro district?', a: (() => { const { g98, g95, p } = dados(h); return g98 ? `Today ${h.num(g98.n)} of the ${h.num(p.total)} stations in the district post a petrol 98 price, averaging ${h.l(g98.media)}, which is ${h.c(g98.media - g95.media, true)} a litre against standard petrol 95. It is sold mainly at the major brands' stations; pick Petrol 98 in the calculator to see the cheapest in each municipality.` : `Today no station in the district reports a petrol 98 price to the DGEG. Standard petrol 95 is on sale at almost every station and suits most petrol engines; check your car's handbook to see whether the maker requires 98.`; })() },
      { q: 'Is diesel cheaper in Aveiro district than in Porto district?', a: (() => { const { gs } = dados(h); const po = h.D.statsDe('gs', 'Porto'); if (!po) return `Today there is not enough data from Porto district to compare. The standard diesel average in Aveiro district is ${h.l(gs.media)}, and the calculator shows the cheapest stations in each municipality with the last update time reported to the DGEG.`; const d = gs.media - po.media; return `Today the standard diesel average is ${h.l(gs.media)} in Aveiro district and ${h.l(po.media)} in Porto district, which leaves Aveiro ${h.c(d, true)} a litre against its neighbour. The gap between districts is small and moves from day to day; within each district, the choice of station matters more than which side of the boundary you fill up on.`; })() },
    ],
    body: (h) => {
      const { gs, ge, g95, g98, c, g95c, viz, ae, lo, hi } = dados(h);
      const rows = [40, 50, 60].map((L) => [`${L} litres`, h.eur(gs.min * L, 2), h.eur(gs.media * L, 2), ae ? h.eur(ae.media * L, 2) : '—']);
      return `<h2>The price of a full tank</h2>
<p>How many litres a tank holds depends on the car. The table works it out for three common sizes, at the price of the cheapest station in the district, at the average of all stations and${ae ? ' at the average of motorway service areas' : ', where there are any, at motorway service areas'}. On a 60-litre tank, the distance between the cheapest station and the average is ${h.eur((gs.media - gs.min) * 60, 2)}.</p>
${h.table(['Tank', 'Cheapest station', 'District average', 'Motorway'], rows, 'Standard diesel, cost of a tank at today’s prices', ['l', 'r', 'r', 'r'])}
<h2>Standard, premium or petrol</h2>
<p>${ge ? `Premium diesel, with additives, averages ${h.l(ge.media)} in the district, ${h.c(ge.media - gs.media, true)} a litre against standard.` : 'No station reports a premium diesel price today.'} On the petrol side, standard 95 is at ${h.l(g95.media)}${g98 ? ` and 98, posted at ${h.num(g98.n)} stations, at ${h.l(g98.media)}` : ''}. To find out whether premium pays off in your car, the ${h.a('simples-ou-aditivado', 'standard or premium')} page runs the numbers with your own consumption.</p>
<h2>From the cheapest municipality to the dearest</h2>
<p>${lo && hi && c.length > 1 ? `Today ${lo.concelho} has the lowest diesel average, ${h.l(lo.media)}, and ${hi.concelho} the highest, ${h.l(hi.media)}: ${h.c(hi.media - lo.media)} a litre from one end to the other, or ${h.eur((hi.media - lo.media) * 50, 2)} on a 50-litre tank.` : 'Today few municipalities have enough data to be ranked.'} The second price column shows standard petrol 95 in the same municipality, which does not always follow the diesel order.</p>
${h.table(['Municipality', 'Stations', 'Diesel', 'Petrol 95'], c.map((x) => [x.concelho, x.n, h.l(x.media), g95c[x.concelho] ? h.l(g95c[x.concelho].media) : '—']), 'Posted average by municipality, municipalities with two stations or more', ['l', 'r', 'r', 'r'])}
<h2>Aveiro, Porto, Viseu and Coimbra</h2>
<p>${viz.map((x) => `In ${h.a(h.D.slug(x.n), x.n)} district, standard diesel is at ${h.l(x.s!.media)} today, ${h.c(x.s!.media - gs.media, true)} against Aveiro`).join('; ')}. Between neighbouring districts the averages stay close, and it is within the same municipality, from one station to the next, that the largest differences turn up.</p>`;
    },
  },
});
