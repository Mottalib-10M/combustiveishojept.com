import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Porto';
const VIZ = [['braga', 'Braga'], ['aveiro', 'Aveiro'], ['vila-real', 'Vila Real'], ['viseu', 'Viseu']] as const;

/** Position du district parmi les 18 selon un compte (1 = le plus grand). */
const posPor = (h: Helpers, k: 'total' | 'gpl') => {
  const o = h.D.DISTRITOS.map((d) => ({ d, n: h.D.postosDistrito(d)[k] })).sort((a, b) => b.n - a.n);
  return { pos: o.findIndex((x) => x.d === D) + 1, de: o.length, primeiro: o[0]?.d ?? D };
};
const base = (h: Helpers) => {
  const p = h.D.postosDistrito(D), t = h.D.tipoDistrito('gs', D);
  return {
    p, gs: h.D.statsDe('gs', D), g95: h.D.statsDe('g95', D), g95e: h.D.statsDe('g95e', D), gpl: h.D.statsDe('gpl', D), gplC: h.D.statsDe('gpl'),
    ae: t['Auto-estrada'], hip: t['Área comercial (Hipermercados)'], rua: t['Outro'],
    rede: posPor(h, 'total'), rgpl: posPor(h, 'gpl'), quota: p.total / h.D.POSTOS.postos.length, rg: h.D.rankDistrito('gs', D),
  };
};

export default defineGuide({
  id: 'porto', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['braga', 'aveiro', 'vila-real', 'preco-gpl-auto', 'precos-por-marca'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'porto', nav: 'Porto', card: 'A maior rede de postos do distrito do Porto, com GPL Auto, gasolina especial, marcas e tipos de posto comparados.',
    title: 'Combustíveis no Porto hoje: gasóleo, gasolina e GPL Auto',
    description: 'Combustíveis no Porto hoje: preço médio do gasóleo e da gasolina, postos com GPL Auto, as marcas mais presentes e a diferença entre tipos de posto. Dados DGEG.',
    h1: 'Preços dos combustíveis no distrito do Porto hoje',
    intro: (h) => `${h.num(h.D.postosDistrito(D).total)} postos do distrito do Porto, os seus preços afixados hoje e os mais baratos de cada concelho, do gasóleo ao GPL Auto.`,
    resume: (h) => {
      const { p, gs, g95, gpl, rede, rgpl, quota, rg } = base(h);
      if (!gs || !g95) return `Os postos do distrito do Porto ainda não comunicaram hoje à DGEG preços suficientes para uma média de gasóleo e de gasolina. A lista acima mostra o último preço de cada posto e a hora de atualização. Logo que haja dados novos, esta página recalcula a média do distrito, a sua posição entre os distritos do continente, a rede de GPL Auto e a comparação entre marcas e tipos de posto.`;
      return `No distrito do Porto, a média afixada hoje é de ${h.l(gs.media)} para o gasóleo simples e de ${h.l(g95.media)} para a gasolina simples 95. É uma média com muito peso: o distrito conta ${h.num(p.total)} postos, ${h.pct(quota)} de todos os postos do continente, o que o põe em ${h.ord(rede.pos)} lugar entre ${h.num(rede.de)} distritos pelo tamanho da rede. Entre o posto mais barato e o mais caro, o gasóleo vai de ${h.l(gs.min)} a ${h.l(gs.max)}, e num depósito de 45 litros essa diferença soma ${h.eur((gs.max - gs.min) * 45, 2)}. ${gpl ? `O GPL Auto é outro traço do distrito: ${h.num(gpl.n)} postos vendem-no, a ${h.l(gpl.media)} em média, e ${rgpl.pos === 1 ? 'nenhum outro distrito tem tantos' : rgpl.pos === 2 ? 'só um distrito tem mais' : `só ${h.num(rgpl.pos - 1)} distritos têm mais`}. ` : ''}Face à média do continente, o gasóleo do Porto está ${h.c(h.D.desvioDistrito('gs', D), true)}, ${h.ord(rg.pos)} lugar a contar do distrito mais barato. Todos os valores são recalculados a cada atualização da DGEG, e a lista acima indica a hora de cada preço.`;
    },
    faqs: (h) => {
      const { gpl, gplC, g95, g95e, ae, rua, hip } = base(h);
      const cg = Object.keys(h.D.porConcelho('gpl', D)).length, nc = h.D.postosDistrito(D).concelhos;
      return [
        { q: 'Quantos postos vendem GPL Auto no distrito do Porto?', a: gpl ? `Hoje ${h.num(gpl.n)} postos do distrito do Porto comunicam preço de GPL Auto à DGEG, em ${h.num(cg)} dos ${h.num(nc)} concelhos. A média é de ${h.l(gpl.media)}${gplC ? `, contra ${h.l(gplC.media)} no continente` : ''}, e o mais barato pede ${h.l(gpl.min)}. Escolha GPL Auto na calculadora acima para ver os cinco mais baratos com a hora da última atualização.` : `Hoje nenhum posto do distrito do Porto comunicou preço de GPL Auto à DGEG. A contagem e a média reaparecem aqui logo que os postos voltem a enviar preços; entretanto, a página do GPL Auto mostra a evolução nacional.` },
        { q: 'No Porto, quanto custa a gasolina especial 95 face à simples?', a: g95 && g95e ? `A gasolina especial 95 está hoje a ${h.l(g95e.media)} em média no distrito do Porto, em ${h.num(g95e.n)} postos, e a simples a ${h.l(g95.media)}. A diferença é de ${h.c(g95e.media - g95.media)} por litro, ou ${h.eur((g95e.media - g95.media) * 40, 2)} num depósito de 40 litros. Nem todos os postos vendem a versão especial, por isso a média assenta em menos postos.` : `Hoje não há preços suficientes de gasolina especial 95 no distrito do Porto para a comparar com a simples. A comparação volta quando os postos comunicarem novos preços à DGEG.` },
        { q: 'Os postos de autoestrada do distrito do Porto são mais caros?', a: ae && rua ? `Hoje o gasóleo custa em média ${h.l(ae.media)} nas áreas de serviço de autoestrada do distrito do Porto e ${h.l(rua.media)} nos postos de rua${hip ? `, contra ${h.l(hip.media)} nos de hipermercado` : ''}. A autoestrada fica assim ${h.c(Math.abs(ae.media - rua.media))} por litro ${ae.media >= rua.media ? 'acima' : 'abaixo'} da rua. A média de cada tipo esconde diferenças grandes entre postos, que a lista acima mostra.` : `Hoje não há preços suficientes para comparar os postos de autoestrada com os de rua no distrito do Porto. A lista acima mostra os preços disponíveis, posto a posto, com a hora de atualização.` },
      ];
    },
    body: (h) => {
      const { p, gs, gpl, ae, hip, rua } = base(h);
      const m = h.D.marcasDistrito('gs', D, 8), cg = h.D.concelhosOrdenados('gpl', D);
      const tipos = ([['Rua', rua], ['Hipermercado', hip], ['Autoestrada', ae]] as const).filter(([, s]) => s);
      return `<h2>Uma rede grande e os seus tipos de posto</h2>
<p>Com ${h.num(p.rua)} postos de rua, ${h.num(p.hiper)} em áreas comerciais e ${h.num(p.autoestrada)} em autoestradas, o distrito tem postos de todos os tipos, e a média de cada tipo conta uma história diferente. ${gs ? `Em todo o distrito, o gasóleo mais barato fica ${h.c(gs.media - gs.min)} abaixo da média.` : ''}</p>
${h.table(['Tipo de posto', 'Postos', 'Média', 'Mais barato'], tipos.map(([n, s]) => [n, s!.n, h.l(s!.media), h.l(s!.min)]), 'Gasóleo simples no distrito do Porto por tipo de posto', ['l', 'r', 'r', 'r'])}
<h2>Onde está o GPL Auto</h2>
<p>${gpl ? `Dos ${h.num(p.total)} postos do distrito, ${h.num(gpl.n)} vendem GPL Auto, entre ${h.l(gpl.min)} e ${h.l(gpl.max)}.` : 'Hoje não há preços de GPL Auto no distrito.'} A tabela ordena os concelhos com pelo menos dois postos com GPL pela média do dia. A ${h.a('preco-gpl-auto', 'página do GPL Auto')} acompanha o preço deste combustível ao longo do ano.</p>
${cg.length ? h.table(['Concelho', 'Postos com GPL', 'Média', 'Mínimo'], cg.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'GPL Auto por concelho, do mais barato ao mais caro', ['l', 'r', 'r', 'r']) : ''}
<h2>As marcas que dominam o distrito</h2>
<p>Num mercado deste tamanho, a marca diz pouco sobre o preço de um posto concreto, mas a média de cada uma mostra tendências. ${m.slice(0, 3).map((x) => `${x.marca} soma ${h.num(x.n)} postos`).join(', ')}. A tabela completa está em ${h.a('precos-por-marca', 'preços por marca')}.</p>
${h.table(['Marca', 'Postos', 'Média do gasóleo'], m.map((x) => [x.marca, x.n, h.l(x.media)]), 'As oito marcas com mais postos de gasóleo no distrito do Porto', ['l', 'r', 'r'])}
<h2>Os quatro distritos vizinhos</h2>
<p>${VIZ.map(([id, n]) => { const s = h.D.statsDe('gs', n); return s ? `${h.a(id, n)} com ${h.l(s.media)}` : ''; }).filter(Boolean).join(', ')}: estas são as médias do gasóleo à volta do Porto, que hoje tem ${gs ? h.l(gs.media) : 'poucos preços'}. A comparação interessa sobretudo a quem trabalha de um lado da fronteira distrital e vive do outro.</p>
<p>${(() => { const c = h.D.concelhosOrdenados('gs', D), s = h.D.statsDe('gs', D, 'Porto'); return c.length > 1 ? `Por concelho, a média do gasóleo vai hoje de ${h.l(c[0].media)} em ${c[0].concelho} a ${h.l(c[c.length - 1].media)} em ${c[c.length - 1].concelho}.${s ? ` No concelho do Porto propriamente dito, ${h.num(s.n)} postos têm média de ${h.l(s.media)}.` : ''} Com ${h.num(c.length)} concelhos e ${h.num(p.total)} postos, a calculadora acima é a forma mais rápida de encontrar o mais barato perto de casa.` : ''; })()}</p>`;
    },
  },
  en: {
    slug: 'porto', nav: 'Porto', card: 'The largest station network in Porto district, with LPG, premium petrol, brands and station types compared.',
    title: 'Fuel prices in Porto today: diesel, petrol and LPG stations',
    description: 'Fuel prices in Porto today: average diesel and petrol prices, the stations that sell LPG, the most common brands and the gap between station types. DGEG data.',
    h1: 'Fuel prices in Porto district today',
    intro: (h) => `${h.num(h.D.postosDistrito(D).total)} stations in Porto district, their posted prices today and the cheapest in each municipality, from diesel to LPG.`,
    resume: (h) => {
      const { p, gs, g95, gpl, rede, rgpl, quota, rg } = base(h);
      if (!gs || !g95) return `Stations in Porto district have not yet reported enough prices to the DGEG today for a diesel and petrol average. The list above shows each station’s last price and update time. As soon as new data arrive, this page recomputes the district average, its position among the mainland districts, the LPG network and the comparison between brands and station types.`;
      return `In Porto district, today’s posted average is ${h.l(gs.media)} for standard diesel and ${h.l(g95.media)} for standard petrol 95. It is an average that carries a lot of weight: the district counts ${h.num(p.total)} stations, ${h.pct(quota)} of all mainland stations, which places it ${h.ord(rede.pos)} of ${h.num(rede.de)} districts by network size. Between the cheapest station and the dearest, diesel runs from ${h.l(gs.min)} to ${h.l(gs.max)}, and on a 45-litre tank that gap adds up to ${h.eur((gs.max - gs.min) * 45, 2)}. ${gpl ? `LPG is another feature of the district: ${h.num(gpl.n)} stations sell it, at ${h.l(gpl.media)} on average, and ${rgpl.pos === 1 ? 'no other district has as many' : rgpl.pos === 2 ? 'only one district has more' : `only ${h.num(rgpl.pos - 1)} districts have more`}. ` : ''}Against the mainland average, diesel in Porto is ${h.c(h.D.desvioDistrito('gs', D), true)}, ${h.ord(rg.pos)} counting from the cheapest district. Every figure here is recomputed from DGEG data at each update, and the list above gives the time each station last changed its price, so you can tell a fresh price from one that may be days old.`;
    },
    faqs: (h) => {
      const { gpl, gplC, g95, g95e, ae, rua, hip } = base(h);
      const cg = Object.keys(h.D.porConcelho('gpl', D)).length, nc = h.D.postosDistrito(D).concelhos;
      return [
        { q: 'How many stations sell LPG in Porto district?', a: gpl ? `Today ${h.num(gpl.n)} stations in Porto district report an LPG price to the DGEG, in ${h.num(cg)} of its ${h.num(nc)} municipalities. The average is ${h.l(gpl.media)}${gplC ? `, against ${h.l(gplC.media)} on the mainland` : ''}, and the cheapest asks ${h.l(gpl.min)}. Pick LPG in the calculator above to see the five cheapest with their last update time.` : `No station in Porto district has reported an LPG price to the DGEG today. The count and average come back here once stations send prices again; meanwhile the LPG page shows the national trend.` },
        { q: 'In Porto, how much more is premium petrol 95 than standard?', a: g95 && g95e ? `Premium petrol 95 averages ${h.l(g95e.media)} today in Porto district, at ${h.num(g95e.n)} stations, and standard ${h.l(g95.media)}. The gap is ${h.c(g95e.media - g95.media)} a litre, or ${h.eur((g95e.media - g95.media) * 40, 2)} on a 40-litre tank. Not every station sells the premium grade, so its average rests on fewer stations.` : `There are not enough premium petrol 95 prices in Porto district today to compare it with standard. The comparison returns once stations report new prices to the DGEG.` },
        { q: 'Are motorway stations in Porto district more expensive?', a: ae && rua ? `Today diesel averages ${h.l(ae.media)} at motorway service areas in Porto district and ${h.l(rua.media)} at street stations${hip ? `, against ${h.l(hip.media)} at hypermarket stations` : ''}. The motorway is therefore ${h.c(Math.abs(ae.media - rua.media))} a litre ${ae.media >= rua.media ? 'above' : 'below'} the street. Each type’s average hides wide gaps between individual stations, which the list above shows.` : `There are not enough prices today to compare motorway and street stations in Porto district. The list above shows the prices available, station by station, with their update time.` },
      ];
    },
    body: (h) => {
      const { p, gs, gpl, ae, hip, rua } = base(h);
      const m = h.D.marcasDistrito('gs', D, 8), cg = h.D.concelhosOrdenados('gpl', D);
      const tipos = ([['Street', rua], ['Hypermarket', hip], ['Motorway', ae]] as const).filter(([, s]) => s);
      return `<h2>A large network and its station types</h2>
<p>With ${h.num(p.rua)} street stations, ${h.num(p.hiper)} at shopping areas and ${h.num(p.autoestrada)} on motorways, the district has every kind of station, and each type’s average tells a different story. ${gs ? `Across the district, the cheapest diesel is ${h.c(gs.media - gs.min)} below the average.` : ''}</p>
${h.table(['Station type', 'Stations', 'Average', 'Cheapest'], tipos.map(([n, s]) => [n, s!.n, h.l(s!.media), h.l(s!.min)]), 'Standard diesel in Porto district by station type', ['l', 'r', 'r', 'r'])}
<h2>Where to find LPG</h2>
<p>${gpl ? `Of the district’s ${h.num(p.total)} stations, ${h.num(gpl.n)} sell LPG, between ${h.l(gpl.min)} and ${h.l(gpl.max)}.` : 'There are no LPG prices in the district today.'} The table ranks municipalities with at least two LPG stations by today’s average. The ${h.a('preco-gpl-auto', 'LPG price page')} follows this fuel over the year.</p>
${cg.length ? h.table(['Municipality', 'LPG stations', 'Average', 'Lowest'], cg.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'LPG by municipality, cheapest to dearest', ['l', 'r', 'r', 'r']) : ''}
<h2>The brands that dominate the district</h2>
<p>In a market this size, the brand says little about the price at any one station, but each brand’s average shows a tendency. ${m.slice(0, 3).map((x) => `${x.marca} has ${h.num(x.n)} stations`).join(', ')}. The full comparison is under ${h.a('precos-por-marca', 'prices by brand')}.</p>
${h.table(['Brand', 'Stations', 'Diesel average'], m.map((x) => [x.marca, x.n, h.l(x.media)]), 'The eight brands with most diesel stations in Porto district', ['l', 'r', 'r'])}
<h2>The four neighbouring districts</h2>
<p>${VIZ.map(([id, n]) => { const s = h.D.statsDe('gs', n); return s ? `${h.a(id, n)} at ${h.l(s.media)}` : ''; }).filter(Boolean).join(', ')}: these are the diesel averages around Porto, which stands at ${gs ? h.l(gs.media) : 'too few prices to say'} today. The comparison matters mostly to people who work on one side of a district line and live on the other.</p>
<p>${(() => { const c = h.D.concelhosOrdenados('gs', D), s = h.D.statsDe('gs', D, 'Porto'); return c.length > 1 ? `By municipality, the diesel average runs today from ${h.l(c[0].media)} in ${c[0].concelho} to ${h.l(c[c.length - 1].media)} in ${c[c.length - 1].concelho}.${s ? ` In Porto municipality itself, ${h.num(s.n)} stations average ${h.l(s.media)}.` : ''} With ${h.num(c.length)} municipalities and ${h.num(p.total)} stations, the calculator above is the quickest way to find the cheapest one near home.` : ''; })()}</p>`;
    },
  },
});
