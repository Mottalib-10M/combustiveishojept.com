import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Castelo Branco';
const Z = { media: 0, min: 0, max: 0, n: 0 };

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, g98 = h.D.statsDe('g98', D), gpl = h.D.statsDe('gpl', D), gplPt = h.D.statsDe('gpl');
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D);
  const t = h.D.tipoDistrito('gs', D), tg = h.D.tipoDistrito('g95', D);
  const conc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s })).sort((a, b) => a.n - b.n || a.media - b.media);
  const unicos = conc.filter((x) => x.n === 1);
  const g95c = h.D.concelhosOrdenados('g95', D);
  const top95 = h.D.baratos('g95', 1, D)[0];
  const viz = (['Guarda', 'Coimbra', 'Leiria', 'Santarém', 'Portalegre'] as const).map((n) => ({ n, gs: h.D.statsDe('gs', n), gpl: h.D.statsDe('gpl', n) }));
  return { gs, g95, g98, gpl, gplPt, p, r, ae: t['Auto-estrada'], rua: t['Outro'], hip: t['Área comercial (Hipermercados)'], ae95: tg['Auto-estrada'], rua95: tg['Outro'], conc, unicos, g95c, top95, viz };
}

export default defineGuide({
  id: 'castelo-branco', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['guarda', 'portalegre', 'santarem', 'coimbra', 'quando-abastecer'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'castelo-branco', nav: 'Castelo Branco', card: 'Rua ou autoestrada, concelhos de um só posto e GPL Auto no distrito de Castelo Branco, com os preços de hoje.',
    title: 'Preço do gasóleo em Castelo Branco hoje: rua e autoestrada',
    description: 'Gasóleo, gasolina e GPL hoje no distrito de Castelo Branco: quanto custa a mais na autoestrada, os concelhos com um só posto e os cinco distritos à volta.',
    h1: 'Gasóleo e gasolina no distrito de Castelo Branco',
    intro: (h) => `Os ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Castelo Branco separados por tipo, de rua ou de autoestrada, com os preços comunicados hoje à DGEG.`,
    resume: (h) => {
      const { gs, g95, p, r, ae, rua, hip } = dados(h);
      return `A média do gasóleo simples no distrito de Castelo Branco é hoje de ${h.l(gs.media)}, e a da gasolina simples 95 de ${h.l(g95.media)}. Isto deixa o distrito em ${h.ord(r.pos)} lugar entre ${h.num(r.de)} no gasóleo, que fica ${h.c(h.D.desvioDistrito('gs', D), true)} por litro face à média do continente. A rede conta ${h.num(p.total)} postos, ${h.num(p.rua)} de rua e ${h.num(p.autoestrada)} em autoestrada${p.hiper ? `, além de ${h.num(p.hiper)} em área comercial` : ', sem nenhum posto de hipermercado no registo da DGEG'}. ${ae && rua ? `O tipo de posto pesa no preço: nas áreas de serviço o gasóleo está a ${h.l(ae.media)} em média e nos postos de rua a ${h.l(rua.media)}, ${h.c(Math.abs(ae.media - rua.media))} por litro de diferença.` : ''} ${hip ? `Nos postos de hipermercado, a média é de ${h.l(hip.media)}.` : ''} O posto mais barato do distrito pede ${h.l(gs.min)}; o mais caro, ${h.l(gs.max)}. Para um depósito de 50 litros, são ${h.eur((gs.max - gs.min) * 50, 2)} entre os dois, uma diferença que justifica olhar para a lista antes de parar.`;
    },
    faqs: (h) => [
      { q: 'Quanto custa a mais abastecer na autoestrada no distrito de Castelo Branco?', a: (() => { const { ae, rua } = dados(h); return ae && rua ? `Hoje o gasóleo simples está a ${h.l(ae.media)} em média nas áreas de serviço de autoestrada do distrito e a ${h.l(rua.media)} nos postos de rua, ${h.c(ae.media - rua.media, true)} por litro para a autoestrada. Num depósito de 50 litros, a diferença é de ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}. ${ae.media > rua.media ? 'Quando há uma saída perto, um posto de rua costuma ser a escolha mais barata.' : 'Hoje, invulgarmente, a autoestrada não sai mais cara em média do que a rua.'}` : `Hoje não há preços suficientes de autoestrada e de rua no distrito para os comparar. A calculadora mostra cada posto com o tipo e a hora da última atualização, para escolher antes de parar.`; })() },
      { q: 'Onde está a gasolina 95 mais barata no distrito de Castelo Branco?', a: (() => { const { top95, g95c, g95 } = dados(h); const c0 = g95c[0]; return top95 ? `O preço mais baixo de hoje é o de ${top95.nome}, em ${top95.concelho}, a ${h.l(top95.preco)}, contra uma média distrital de ${h.l(g95.media)}.${c0 ? ` Por concelho, a média mais baixa é a de ${c0.concelho}, ${h.l(c0.media)}.` : ''} Escolha Gasolina simples 95 na calculadora para ver os cinco postos mais baratos de cada concelho e a hora do preço.` : 'Hoje nenhum posto do distrito comunicou preço de gasolina 95 à DGEG. A calculadora mostra os dados assim que os postos os atualizarem, concelho a concelho.'; })() },
      { q: 'Qual é hoje o preço do GPL Auto no distrito de Castelo Branco?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `O GPL Auto está a ${h.l(gpl.media)} em média, em ${h.num(p.gpl)} postos do distrito, com o mais barato a ${h.l(gpl.min)}${gplPt ? `. Face à média do continente, são ${h.c(gpl.media - gplPt.media, true)} por litro` : ''}. Como um motor a GPL gasta mais litros por quilómetro do que a gasóleo ou a gasolina, a página do preço do GPL Auto ajuda a comparar o custo por quilómetro.` : 'Hoje nenhum posto do distrito comunica preço de GPL Auto à DGEG. A calculadora mostra os postos com GPL nos distritos próximos, com a hora de cada preço comunicado.'; })() },
    ],
    body: (h) => {
      const { gs, g95, g98, gpl, ae, rua, ae95, rua95, conc, unicos, viz } = dados(h);
      return `<h2>Posto de rua ou área de serviço</h2>
<p>${ae && rua ? `No gasóleo, a área de serviço fica ${h.c(ae.media - rua.media, true)} por litro face ao posto de rua, com ${h.num(ae.n)} postos de autoestrada contra ${h.num(rua.n)} de rua. Num depósito de 50 litros, isso dá ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}.` : 'Hoje não há dados de autoestrada e de rua suficientes para comparar no gasóleo.'} ${ae95 && rua95 ? `Na gasolina 95, a diferença é de ${h.c(ae95.media - rua95.media, true)} por litro.` : ''} A diferença existe sobretudo nas médias: um posto de autoestrada pode, num dado dia, ficar abaixo de um posto de rua mais caro, e a calculadora indica o tipo de cada um.</p>
<h2>Concelhos com poucos postos</h2>
<p>${unicos.length ? `Em ${unicos.map((x) => `${x.concelho} (${h.l(x.media)})`).join(', ')}, só um posto vende gasóleo, e a média do concelho é o preço desse posto.` : 'Hoje nenhum concelho do distrito depende de um único posto para o gasóleo.'} A tabela ordena os concelhos pelo número de postos, do menor para o maior, com a média e o mínimo de cada um.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], conc.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples, concelhos do distrito por número de postos', ['l', 'r', 'r', 'r'])}
<h2>Gasolina 95, gasolina 98 e GPL</h2>
<p>A gasolina simples 95 está a ${h.l(g95.media)} em média, ${h.c(g95.media - gs.media, true)} por litro face ao gasóleo.${g98 ? ` A 98 só aparece em ${h.num(g98.n)} postos, a ${h.l(g98.media)}.` : ''}${gpl ? ` O GPL Auto, a ${h.l(gpl.media)}, é vendido em ${h.num(gpl.n)} postos.` : ''} Para saber em que dia da semana o preço costuma estar mais baixo, veja ${h.a('quando-abastecer', 'quando abastecer')}.</p>
<h2>Cinco distritos à volta</h2>
<p>Castelo Branco faz fronteira com Espanha e com cinco distritos portugueses. A tabela mostra a média do gasóleo e do GPL Auto em cada um, ao lado da do distrito.${(() => { const v = viz.filter((x) => x.gs).sort((a, b) => a.gs!.media - b.gs!.media)[0]; return v ? ` Dos cinco, o gasóleo mais barato em média está hoje em ${v.n}, ${h.c(v.gs!.media - gs.media, true)} por litro face a Castelo Branco.` : ''; })()}</p>
${h.table(['Distrito', 'Gasóleo', 'GPL Auto'], [[`<strong>${D}</strong>`, h.l(gs.media), gpl ? h.l(gpl.media) : '—'], ...viz.map((x) => [h.a(h.D.slug(x.n), x.n), x.gs ? h.l(x.gs.media) : '—', x.gpl ? h.l(x.gpl.media) : '—'])], 'Média afixada hoje', ['l', 'r', 'r'])}`;
    },
  },
  en: {
    slug: 'castelo-branco', nav: 'Castelo Branco', card: 'Street or motorway, single-station municipalities and LPG in Castelo Branco district, at today’s prices.',
    title: 'Diesel price in Castelo Branco today: street vs motorway',
    description: 'Diesel, petrol and LPG today in Castelo Branco district: how much more the motorway costs, the municipalities with one station and the five districts around.',
    h1: 'Diesel and petrol in Castelo Branco district',
    intro: (h) => `The ${h.num(h.D.postosDistrito(D).total)} stations in Castelo Branco district split by type, street or motorway, with the prices reported to the DGEG today.`,
    resume: (h) => {
      const { gs, g95, p, r, ae, rua, hip } = dados(h);
      return `The standard diesel average in Castelo Branco district is ${h.l(gs.media)} today, and standard petrol 95 averages ${h.l(g95.media)}. That puts the district ${h.ord(r.pos)} of ${h.num(r.de)} for diesel, with a gap of ${h.c(h.D.desvioDistrito('gs', D), true)} a litre against the mainland average. The network counts ${h.num(p.total)} stations, ${h.num(p.rua)} street stations and ${h.num(p.autoestrada)} on motorways${p.hiper ? `, plus ${h.num(p.hiper)} at shopping areas` : ', with no hypermarket station in the DGEG register'}. ${ae && rua ? `The type of station shows in the price: at service areas diesel averages ${h.l(ae.media)} and at street stations ${h.l(rua.media)}, a gap of ${h.c(Math.abs(ae.media - rua.media))} a litre.` : ''} ${hip ? `At hypermarket stations the average is ${h.l(hip.media)}.` : ''} The cheapest station in the district asks ${h.l(gs.min)}; the dearest, ${h.l(gs.max)}. On a 50-litre tank that is ${h.eur((gs.max - gs.min) * 50, 2)} between the two, a gap that makes it worth checking the list of stations, their type and their update time before you stop.`;
    },
    faqs: (h) => [
      { q: 'How much more does it cost to fill up on the motorway in Castelo Branco district?', a: (() => { const { ae, rua } = dados(h); return ae && rua ? `Today standard diesel averages ${h.l(ae.media)} at the district's motorway service areas and ${h.l(rua.media)} at street stations, ${h.c(ae.media - rua.media, true)} a litre for the motorway. On a 50-litre tank, the difference is ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}. ${ae.media > rua.media ? 'When there is an exit nearby, a street station is usually the cheaper choice.' : 'Today, unusually, the motorway is not dearer on average than the street.'}` : 'Today there are not enough motorway and street prices in the district to compare. The calculator shows each station with its type and last update time, so you can choose before you stop.'; })() },
      { q: 'Where is the cheapest petrol 95 in Castelo Branco district?', a: (() => { const { top95, g95c, g95 } = dados(h); const c0 = g95c[0]; return top95 ? `Today's lowest price is at ${top95.nome}, in ${top95.concelho}, at ${h.l(top95.preco)}, against a district average of ${h.l(g95.media)}.${c0 ? ` By municipality, the lowest average is in ${c0.concelho}, ${h.l(c0.media)}.` : ''} Pick standard Petrol 95 in the calculator to see the five cheapest stations in each municipality and the time of each price.` : 'Today no station in the district has reported a petrol 95 price to the DGEG. The calculator shows the data as soon as stations update it, municipality by municipality.'; })() },
      { q: 'What is the price of LPG in Castelo Branco district today?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `LPG averages ${h.l(gpl.media)} at ${h.num(p.gpl)} stations in the district, with the cheapest at ${h.l(gpl.min)}${gplPt ? `. Against the mainland average, that is ${h.c(gpl.media - gplPt.media, true)} a litre` : ''}. Because an LPG engine burns more litres per kilometre than a diesel or petrol one, the LPG price page helps you compare the cost per kilometre.` : 'Today no station in the district reports an LPG price to the DGEG. The calculator shows LPG stations in nearby districts, with the time of each reported price.'; })() },
    ],
    body: (h) => {
      const { gs, g95, g98, gpl, ae, rua, ae95, rua95, conc, unicos, viz } = dados(h);
      return `<h2>Street station or service area</h2>
<p>${ae && rua ? `For diesel, the service area is ${h.c(ae.media - rua.media, true)} a litre against the street station, with ${h.num(ae.n)} motorway stations against ${h.num(rua.n)} street ones. On a 50-litre tank, that comes to ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}.` : 'Today there is not enough motorway and street data to compare for diesel.'} ${ae95 && rua95 ? `For petrol 95, the gap is ${h.c(ae95.media - rua95.media, true)} a litre.` : ''} The difference lives mostly in the averages: on a given day a motorway station can come in below a dearer street station, and the calculator shows the type of each one.</p>
<h2>Municipalities with few stations</h2>
<p>${unicos.length ? `In ${unicos.map((x) => `${x.concelho} (${h.l(x.media)})`).join(', ')}, only one station sells diesel, and the municipal average is simply that station's price.` : 'Today no municipality in the district relies on a single station for diesel.'} The table orders municipalities by number of stations, fewest first, with the average and lowest price in each.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], conc.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel, municipalities of the district by number of stations', ['l', 'r', 'r', 'r'])}
<h2>Petrol 95, petrol 98 and LPG</h2>
<p>Standard petrol 95 averages ${h.l(g95.media)}, ${h.c(g95.media - gs.media, true)} a litre against diesel.${g98 ? ` Petrol 98 appears at only ${h.num(g98.n)} stations, at ${h.l(g98.media)}.` : ''}${gpl ? ` LPG, at ${h.l(gpl.media)}, is sold at ${h.num(gpl.n)} stations.` : ''} To find out which day of the week prices tend to be lowest, see ${h.a('quando-abastecer', 'when to fill up')}.</p>
<h2>Five districts around</h2>
<p>Castelo Branco borders Spain and five Portuguese districts. The table shows the diesel and LPG average in each, next to the district's own.${(() => { const v = viz.filter((x) => x.gs).sort((a, b) => a.gs!.media - b.gs!.media)[0]; return v ? ` Of the five, the cheapest diesel on average is in ${v.n} today, ${h.c(v.gs!.media - gs.media, true)} a litre against Castelo Branco.` : ''; })()}</p>
${h.table(['District', 'Diesel', 'LPG'], [[`<strong>${D}</strong>`, h.l(gs.media), gpl ? h.l(gpl.media) : '—'], ...viz.map((x) => [h.a(h.D.slug(x.n), x.n), x.gs ? h.l(x.gs.media) : '—', x.gpl ? h.l(x.gpl.media) : '—'])], 'Posted average today', ['l', 'r', 'r'])}`;
    },
  },
});
