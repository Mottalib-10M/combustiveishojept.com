import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Beja';
const Z = { media: 0, min: 0, max: 0, n: 0 };

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, gpl = h.D.statsDe('gpl', D), gplPt = h.D.statsDe('gpl');
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D);
  const conc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s }));
  const porPreco = [...conc].sort((a, b) => a.media - b.media);
  const poucos = conc.filter((x) => x.n <= 2).map((x) => x.concelho).sort((a, b) => a.localeCompare(b, 'pt'));
  const menor = [...conc].sort((a, b) => a.n - b.n || a.concelho.localeCompare(b.concelho, 'pt'))[0];
  const top = h.D.baratos('gs', 1, D)[0];
  const viz = (['Évora', 'Setúbal', 'Faro'] as const).map((n) => ({ n, gs: h.D.statsDe('gs', n), g95: h.D.statsDe('g95', n) }));
  return { gs, g95, gpl, gplPt, p, r, porPreco, poucos, menor, top, viz };
}
const lista = (xs: string[], e: string) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${e} ${xs[xs.length - 1]}`);

export default defineGuide({
  id: 'beja', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['evora', 'faro', 'setubal', 'postos-mais-baratos', 'preco-gpl-auto'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'beja', nav: 'Beja', card: 'Gasóleo, gasolina e GPL no distrito de Beja, concelho a concelho, com o posto mais barato do dia.',
    title: 'Gasóleo em Beja hoje: preço médio e postos por concelho',
    description: 'Gasóleo e gasolina hoje no distrito de Beja: quantos postos tem cada concelho, onde está o mais barato do dia, o GPL Auto e a comparação com Évora e Faro.',
    h1: 'Preço dos combustíveis no distrito de Beja',
    intro: (h) => `Os ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Beja, concelho a concelho, com o preço que cada um comunicou hoje à DGEG.`,
    resume: (h) => {
      const { gs, g95, p, r, top } = dados(h);
      return `O litro de gasóleo simples custa hoje em média ${h.l(gs.media)} no distrito de Beja, e o de gasolina simples 95 custa ${h.l(g95.media)}. Comparado com a média do continente, o gasóleo do distrito fica ${h.c(h.D.desvioDistrito('gs', D), true)} por litro e a gasolina ${h.c(h.D.desvioDistrito('g95', D), true)}. Na ordenação dos ${h.num(r.de)} distritos pelo preço médio do gasóleo, Beja surge em ${h.ord(r.pos)} lugar. ${top ? `O preço mais baixo do dia está num posto de ${top.concelho}, ${top.nome}, a ${h.l(top.preco)}, enquanto o mais alto do distrito chega a ${h.l(gs.max)}.` : ''} A rede é curta para a área que cobre: ${h.num(p.total)} postos em ${h.num(p.concelhos)} concelhos, cerca de ${h.num(p.total / Math.max(p.concelhos, 1), 1)} por concelho, o que quer dizer que em várias vilas a escolha se faz entre um ou dois postos. Antes de uma viagem longa pelo distrito, vale a pena ver na calculadora qual dos postos do percurso afixa o preço mais baixo e quando o atualizou.`;
    },
    faqs: (h) => [
      { q: 'Quantos postos de combustível tem cada concelho do distrito de Beja?', a: (() => { const { p, poucos, menor } = dados(h); return `A DGEG lista hoje ${h.num(p.total)} postos nos ${h.num(p.concelhos)} concelhos do distrito. ${poucos.length ? `Com gasóleo à venda em dois postos ou menos aparecem ${lista(poucos, 'e')}.` : `Todos os concelhos têm pelo menos três postos com gasóleo.`} ${menor ? `O concelho com menos postos de gasóleo é ${menor.concelho}, com ${h.num(menor.n)}.` : ''} A tabela desta página dá a contagem completa, concelho a concelho.`; })() },
      { q: 'Qual é hoje o posto de gasóleo mais barato no distrito de Beja?', a: (() => { const { top, gs } = dados(h); return top ? `Neste momento é ${top.nome}, em ${top.localidade} (concelho de ${top.concelho}), que afixa ${h.l(top.preco)}, ${h.c(gs.media - top.preco)} abaixo da média do distrito. O posto mais barato muda com frequência, porque cada um altera o preço quando entende; a calculadora mostra os cinco primeiros e a hora da última atualização.` : `Hoje nenhum posto do distrito comunicou preço de gasóleo à DGEG. A calculadora mostra os dados assim que os postos os atualizarem, com a hora de cada comunicação.`; })() },
      { q: 'Onde se encontra GPL Auto no distrito de Beja?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Apenas ${h.num(p.gpl)} dos ${h.num(p.total)} postos do distrito vendem GPL Auto, com média de ${h.l(gpl.media)}${gplPt ? `, ${h.c(gpl.media - gplPt.media, true)} face à média do continente` : ''}. Quem tem carro a GPL deve planear o abastecimento: escolha GPL Auto na calculadora para ver em que concelhos há posto e a que preço.` : `Hoje nenhum posto do distrito comunica preço de GPL Auto à DGEG. Quem tem carro a GPL deve planear o abastecimento nos distritos próximos; a calculadora mostra os postos com GPL em cada um.`; })() },
    ],
    body: (h) => {
      const { gs, g95, gpl, p, porPreco, poucos, top, viz } = dados(h);
      const lo = porPreco[0], hi = porPreco[porPreco.length - 1];
      return `<h2>Uma rede de postos espalhada</h2>
<p>Com ${h.num(p.total)} postos registados, dos quais ${h.num(p.rua)} de rua${p.hiper ? `, ${h.num(p.hiper)} em área comercial` : ''}${p.autoestrada ? ` e ${h.num(p.autoestrada)} em autoestrada` : ''}, o distrito tem poucos postos por concelho. ${poucos.length ? `Em ${lista(poucos, 'e')}, o gasóleo só se encontra em dois postos ou menos, e a média desses concelhos é, na prática, o preço de um ou dois balcões.` : 'Mesmo assim, todos os concelhos têm pelo menos três postos com gasóleo.'} A tabela inclui todos os concelhos, mesmo os de um só posto.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], porPreco.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho, do mais barato ao mais caro', ['l', 'r', 'r', 'r'])}
<h2>Os extremos do distrito</h2>
<p>${lo && hi && porPreco.length > 1 ? `A média mais baixa é a de ${lo.concelho}, ${h.l(lo.media)}, e a mais alta a de ${hi.concelho}, ${h.l(hi.media)}, uma distância de ${h.c(hi.media - lo.media)} por litro.` : ''} ${top ? `Posto a posto, o mais barato é ${top.nome}, a ${h.l(top.preco)}; o mais caro afixa ${h.l(gs.max)}. Num depósito de 50 litros, ir de um ao outro custa ${h.eur((gs.max - top.preco) * 50, 2)}.` : ''} Nos concelhos de um ou dois postos, a média muda de um dia para o outro com a decisão de um único posto, por isso convém olhar também para o mínimo.</p>
<h2>Gasolina e GPL Auto</h2>
<p>A gasolina simples 95 está hoje a ${h.l(g95.media)} em média e a ${h.l(g95.min)} no posto mais barato, em ${h.num(g95.n)} postos, o que a deixa ${h.c(Math.abs(g95.media - gs.media))} por litro ${g95.media < gs.media ? 'abaixo' : 'acima'} do gasóleo. ${gpl ? `O GPL Auto é mais raro: ${h.num(p.gpl)} postos, a ${h.l(gpl.media)} em média.` : 'Nenhum posto afixa hoje GPL Auto.'} A página do ${h.a('preco-gpl-auto', 'preço do GPL Auto')} mostra os postos com GPL em todo o continente.</p>
<h2>Beja, Évora, Setúbal e Faro</h2>
<p>O distrito faz fronteira com Espanha, mas os preços deste site são apenas os dos postos portugueses comunicados à DGEG. Entre os distritos vizinhos, as médias de hoje são estas:</p>
${h.table(['Distrito', 'Gasóleo', 'Gasolina 95'], [[`<strong>${D}</strong>`, h.l(gs.media), h.l(g95.media)], ...viz.map((x) => [h.a(h.D.slug(x.n), x.n), x.gs ? h.l(x.gs.media) : '—', x.g95 ? h.l(x.g95.media) : '—'])], 'Média afixada hoje', ['l', 'r', 'r'])}`;
    },
  },
  en: {
    slug: 'beja', nav: 'Beja', card: 'Diesel, petrol and LPG in Beja district, municipality by municipality, with the cheapest station of the day.',
    title: 'Diesel in Beja today: average price and stations by area',
    description: 'Diesel and petrol in Beja district today: how many stations each municipality has, where the cheapest of the day is, LPG, and the gap with Évora and Faro.',
    h1: 'Fuel prices in Beja district',
    intro: (h) => `The ${h.num(h.D.postosDistrito(D).total)} stations in Beja district, municipality by municipality, with the price each one reported to the DGEG today.`,
    resume: (h) => {
      const { gs, g95, p, r, top } = dados(h);
      return `A litre of standard diesel costs ${h.l(gs.media)} on average in Beja district today, and a litre of standard petrol 95 costs ${h.l(g95.media)}. Against the mainland average, the district's diesel is ${h.c(h.D.desvioDistrito('gs', D), true)} a litre and its petrol ${h.c(h.D.desvioDistrito('g95', D), true)}. Ranking the ${h.num(r.de)} districts by average diesel price, Beja comes ${h.ord(r.pos)}. ${top ? `The lowest price of the day is at a station in ${top.concelho}, ${top.nome}, at ${h.l(top.preco)}, while the highest in the district reaches ${h.l(gs.max)}.` : ''} The network is thin for the area it covers: ${h.num(p.total)} stations across ${h.num(p.concelhos)} municipalities, about ${h.num(p.total / Math.max(p.concelhos, 1), 1)} per municipality, so in several towns the choice is between one or two stations. Before a long drive across the district, it is worth checking in the calculator which station on the way posts the lowest price and when it last updated it.`;
    },
    faqs: (h) => [
      { q: 'How many fuel stations does each municipality in Beja district have?', a: (() => { const { p, poucos, menor } = dados(h); return `The DGEG lists ${h.num(p.total)} stations across the ${h.num(p.concelhos)} municipalities of the district today. ${poucos.length ? `Those with diesel on sale at two stations or fewer are ${lista(poucos, 'and')}.` : 'Every municipality has at least three stations selling diesel.'} ${menor ? `The municipality with the fewest diesel stations is ${menor.concelho}, with ${h.num(menor.n)}.` : ''} The table on this page gives the full count, municipality by municipality.`; })() },
      { q: 'Which is the cheapest diesel station in Beja district today?', a: (() => { const { top, gs } = dados(h); return top ? `Right now it is ${top.nome}, in ${top.localidade} (${top.concelho} municipality), posting ${h.l(top.preco)}, ${h.c(gs.media - top.preco)} below the district average. The cheapest station changes often, because each one moves its price whenever it sees fit; the calculator shows the top five and the time of the last update.` : 'Today no station in the district has reported a diesel price to the DGEG. The calculator shows the data as soon as stations update it, with the time of each report.'; })() },
      { q: 'Where can I find LPG in Beja district?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Only ${h.num(p.gpl)} of the ${h.num(p.total)} stations in the district sell LPG, averaging ${h.l(gpl.media)}${gplPt ? `, ${h.c(gpl.media - gplPt.media, true)} against the mainland average` : ''}. Drivers of LPG cars should plan where to fill up: pick LPG in the calculator to see which municipalities have a station and at what price.` : 'Today no station in the district reports an LPG price to the DGEG. Drivers of LPG cars should plan to fill up in nearby districts; the calculator shows the LPG stations in each one.'; })() },
    ],
    body: (h) => {
      const { gs, g95, gpl, p, porPreco, poucos, top, viz } = dados(h);
      const lo = porPreco[0], hi = porPreco[porPreco.length - 1];
      return `<h2>A widely spread network</h2>
<p>With ${h.num(p.total)} registered stations, ${h.num(p.rua)} of them street stations${p.hiper ? `, ${h.num(p.hiper)} at shopping areas` : ''}${p.autoestrada ? ` and ${h.num(p.autoestrada)} on motorways` : ''}, the district has few stations per municipality. ${poucos.length ? `In ${lista(poucos, 'and')}, diesel is sold at two stations or fewer, so the average there is, in practice, the price at one or two forecourts.` : 'Even so, every municipality has at least three stations selling diesel.'} The table includes every municipality, even those with a single station.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], porPreco.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality, cheapest to dearest', ['l', 'r', 'r', 'r'])}
<h2>The district's extremes</h2>
<p>${lo && hi && porPreco.length > 1 ? `The lowest average is in ${lo.concelho}, ${h.l(lo.media)}, and the highest in ${hi.concelho}, ${h.l(hi.media)}, a distance of ${h.c(hi.media - lo.media)} a litre.` : ''} ${top ? `Station by station, the cheapest is ${top.nome}, at ${h.l(top.preco)}; the dearest posts ${h.l(gs.max)}. On a 50-litre tank, going from one to the other costs ${h.eur((gs.max - top.preco) * 50, 2)}.` : ''} In municipalities with one or two stations, the average can move overnight on the decision of a single forecourt, so it pays to look at the lowest price as well.</p>
<h2>Petrol and LPG</h2>
<p>Standard petrol 95 is at ${h.l(g95.media)} on average today and ${h.l(g95.min)} at the cheapest station, across ${h.num(g95.n)} stations, which leaves it ${h.c(Math.abs(g95.media - gs.media))} a litre ${g95.media < gs.media ? 'below' : 'above'} diesel. ${gpl ? `LPG is scarcer: ${h.num(p.gpl)} stations, at ${h.l(gpl.media)} on average.` : 'No station posts an LPG price today.'} The ${h.a('preco-gpl-auto', 'LPG price')} page lists LPG stations across the mainland.</p>
<h2>Beja, Évora, Setúbal and Faro</h2>
<p>The district borders Spain, but the prices on this site are only those of Portuguese stations reported to the DGEG. Among the neighbouring districts, today's averages are as follows:</p>
${h.table(['District', 'Diesel', 'Petrol 95'], [[`<strong>${D}</strong>`, h.l(gs.media), h.l(g95.media)], ...viz.map((x) => [h.a(h.D.slug(x.n), x.n), x.gs ? h.l(x.gs.media) : '—', x.g95 ? h.l(x.g95.media) : '—'])], 'Posted average today', ['l', 'r', 'r'])}`;
    },
  },
});
