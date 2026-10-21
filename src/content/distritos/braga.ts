import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Braga';
const Z = { media: 0, min: 0, max: 0, n: 0 };

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, ge = h.D.statsDe('ge', D), g95e = h.D.statsDe('g95e', D);
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D);
  const marcas = h.D.marcasDistrito('gs', D, 8);
  const grandes = marcas.filter((m) => m.n >= 5).sort((a, b) => a.media - b.media);
  const top5 = h.D.baratos('gs', 5, D);
  const conc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s })).sort((a, b) => a.n - b.n || a.concelho.localeCompare(b.concelho, 'pt'));
  const viz = (['Viana do Castelo', 'Porto', 'Vila Real'] as const).map((n) => ({ n, s: h.D.statsDe('gs', n), r: h.D.rankDistrito('gs', n) }));
  return { gs, g95, ge, g95e, p, r, marcas, grandes, top5, menor: conc[0], maior: conc[conc.length - 1], viz };
}
const mk = (h: Helpers, m: string) => (m === 'Genérico' ? (h.lang === 'pt' ? 'postos sem marca (genéricos)' : 'unbranded stations') : m);
const hora = (h: Helpers, iso: string) => `${h.dia(iso.slice(0, 10))}, ${iso.slice(11, 16)}`;

export default defineGuide({
  id: 'braga', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['viana-do-castelo', 'porto', 'vila-real', 'precos-por-marca', 'simples-ou-aditivado'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'braga', nav: 'Braga', card: 'As marcas, os cinco postos mais baratos e o preço do aditivado no distrito de Braga, hoje.',
    title: 'Preço dos combustíveis em Braga hoje: marcas e postos',
    description: 'Preço do gasóleo e da gasolina hoje no distrito de Braga, marca a marca, com os cinco postos mais baratos do dia e quanto custa a mais o gasóleo aditivado.',
    h1: 'Combustíveis no distrito de Braga: marcas e preços de hoje',
    intro: (h) => `Que marcas vendem mais barato nos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Braga e onde estão hoje os postos com o preço mais baixo.`,
    resume: (h) => {
      const { gs, g95, ge, r, marcas, grandes } = dados(h);
      const m0 = marcas[0], b0 = grandes[0];
      return `Em Braga, hoje, a média afixada é de ${h.l(gs.media)} para o gasóleo simples e de ${h.l(g95.media)} para a gasolina simples 95. O distrito está em ${h.ord(r.pos)} lugar entre os ${h.num(r.de)} do continente no preço do gasóleo, que fica ${h.c(h.D.desvioDistrito('gs', D), true)} por litro face à média do continente. ${m0 ? `A marca com mais postos é ${mk(h, m0.marca)}, com ${h.num(m0.n)} pontos de venda de gasóleo e média de ${h.l(m0.media)}, ou seja ${h.pct(m0.n / Math.max(gs.n, 1))} da rede do distrito.` : ''} ${b0 ? `Entre as marcas com cinco postos ou mais, quem pede menos em média é ${mk(h, b0.marca)}, a ${h.l(b0.media)}.` : ''} ${ge ? `Quem prefere gasóleo aditivado paga em média ${h.l(ge.media)}, ${h.c(ge.media - gs.media, true)} por litro sobre o simples.` : ''} O posto mais barato do distrito afixa ${h.l(gs.min)} e o mais caro ${h.l(gs.max)}. Todos os valores vêm dos preços que os ${h.num(gs.n)} postos com gasóleo comunicam à DGEG e são refeitos diariamente.`;
    },
    faqs: (h) => [
      { q: 'Qual é a marca com o gasóleo mais barato no distrito de Braga?', a: (() => { const { grandes } = dados(h); const a = grandes[0], z = grandes[grandes.length - 1]; return a && z && grandes.length > 1 ? `Entre as marcas com pelo menos cinco postos no distrito, a média mais baixa de hoje é a de ${mk(h, a.marca)}, ${h.l(a.media)}, e a mais alta a de ${mk(h, z.marca)}, ${h.l(z.media)}. A média de uma marca esconde diferenças entre os seus postos, que fixam preços próprios; a calculadora mostra posto a posto.` : `Hoje nenhuma marca tem postos suficientes no distrito para uma comparação fiável. A calculadora mostra os postos mais baratos de cada concelho, qualquer que seja a marca, com a hora da última atualização.`; })() },
      { q: 'Quanto custa a mais o gasóleo aditivado no distrito de Braga?', a: (() => { const { ge, gs } = dados(h); return ge ? `Hoje o gasóleo especial, aditivado, está a ${h.l(ge.media)} em média no distrito, contra ${h.l(gs.media)} do simples: ${h.c(ge.media - gs.media, true)} por litro, ou ${h.eur((ge.media - gs.media) * 50, 2)} num depósito de 50 litros. A página sobre simples ou aditivado ajuda a decidir se essa diferença compensa no seu caso.` : `Hoje nenhum posto do distrito comunica preço de gasóleo especial à DGEG, por isso não há comparação possível. O gasóleo simples está a ${h.l(gs.media)} em média.`; })() },
      { q: 'Em que concelho do distrito de Braga há menos postos com gasóleo?', a: (() => { const { menor, maior } = dados(h); return menor && maior ? `Hoje é ${menor.concelho}, com ${h.num(menor.n)} ${menor.n === 1 ? 'posto' : 'postos'} a vender gasóleo, a uma média de ${h.l(menor.media)}. No outro extremo, ${maior.concelho} tem ${h.num(maior.n)}. Num concelho com poucos postos, a média depende de um ou dois preços e pode mudar muito de um dia para o outro; vale a pena comparar com os concelhos vizinhos.` : 'Hoje não há dados suficientes por concelho. A calculadora mostra os postos de cada concelho do distrito assim que comunicarem os preços.'; })() },
    ],
    body: (h) => {
      const { gs, g95, ge, g95e, marcas, grandes, top5, r, viz } = dados(h);
      const a = grandes[0], z = grandes[grandes.length - 1];
      return `<h2>As marcas que abastecem o distrito</h2>
<p>A rede de Braga mistura as marcas de bandeira com marcas de preço baixo e postos sem marca. A tabela mostra as que têm mais postos com gasóleo e a média de cada uma.${a && z && grandes.length > 1 ? ` Entre as que têm cinco postos ou mais, a distância entre a mais barata e a mais cara é de ${h.c(z.media - a.media)} por litro, ${h.eur((z.media - a.media) * 50, 2)} num depósito de 50 litros.` : ''} A coluna do mínimo mostra que mesmo uma marca cara pode ter um posto bem colocado, e o contrário também acontece.</p>
${h.table(['Marca', 'Postos', 'Média', 'Mínimo'], marcas.map((m) => [mk(h, m.marca), m.n, h.l(m.media), h.l(m.min)]), 'Gasóleo simples por marca, marcas com mais postos no distrito', ['l', 'r', 'r', 'r'])}
<h2>Os cinco postos mais baratos de hoje</h2>
<p>A lista muda ao longo do dia, à medida que os postos comunicam preços novos. A última coluna indica quando cada preço foi atualizado: um preço antigo pode já não corresponder ao que está na bomba.</p>
${h.table(['Posto', 'Concelho', 'Preço', 'Atualizado'], top5.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(h, x.atualizado)]), 'Gasóleo simples, preço afixado comunicado à DGEG', ['l', 'l', 'r', 'r'])}
<h2>Aditivado e gasolina especial</h2>
<p>${ge ? `O gasóleo aditivado custa hoje ${h.c(ge.media - gs.media, true)} por litro face ao simples.` : 'Hoje nenhum posto afixa gasóleo aditivado.'} ${g95e ? `Na gasolina, a especial 95 está a ${h.l(g95e.media)}, contra ${h.l(g95.media)} da simples, em ${h.num(g95e.n)} postos.` : `A gasolina simples 95 está a ${h.l(g95.media)}.`} O ganho das versões aditivadas não se mede no ecrã da bomba; a página ${h.a('simples-ou-aditivado', 'simples ou aditivado')} resume o que se sabe.</p>
<h2>Braga e os distritos vizinhos</h2>
<p>No gasóleo, Braga está hoje em ${h.ord(r.pos)} lugar. ${viz.filter((x) => x.s).map((x) => `${h.a(h.D.slug(x.n), x.n)} aparece em ${h.ord(x.r.pos)}, com média de ${h.l(x.s!.media)}`).join('; ')}. A posição de cada distrito pode trocar de um dia para o outro, porque as médias estão separadas por poucos cêntimos. Para quem passa a fronteira distrital todos os dias, o posto escolhido conta mais do que o distrito.</p>`;
    },
  },
  en: {
    slug: 'braga', nav: 'Braga', card: 'Brands, the five cheapest stations and the cost of premium diesel in Braga district today.',
    title: 'Diesel and petrol in Braga today: brands and cheap stations',
    description: 'Diesel and petrol prices today in Braga district, brand by brand, with the five cheapest stations of the day and the extra cost of premium diesel over standard.',
    h1: 'Fuel in Braga district: brands and today’s prices',
    intro: (h) => `Which brands sell cheapest across the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Braga district, and where today's lowest-priced stations are.`,
    resume: (h) => {
      const { gs, g95, ge, r, marcas, grandes } = dados(h);
      const m0 = marcas[0], b0 = grandes[0];
      return `In Braga today, the posted average is ${h.l(gs.media)} for standard diesel and ${h.l(g95.media)} for standard petrol 95. The district ranks ${h.ord(r.pos)} of the ${h.num(r.de)} mainland districts on diesel price, with diesel ${h.c(h.D.desvioDistrito('gs', D), true)} a litre against the mainland average. ${m0 ? `The brand with the most stations is ${mk(h, m0.marca)}, with ${h.num(m0.n)} diesel outlets averaging ${h.l(m0.media)}, or ${h.pct(m0.n / Math.max(gs.n, 1))} of the district's network.` : ''} ${b0 ? `Among brands with five stations or more, the lowest average belongs to ${mk(h, b0.marca)}, at ${h.l(b0.media)}.` : ''} ${ge ? `Drivers who prefer premium diesel pay ${h.l(ge.media)} on average, ${h.c(ge.media - gs.media, true)} a litre over standard.` : ''} The cheapest station in the district posts ${h.l(gs.min)} and the dearest ${h.l(gs.max)}. Every figure comes from the prices the ${h.num(gs.n)} diesel stations report to the DGEG and is rebuilt daily.`;
    },
    faqs: (h) => [
      { q: 'Which brand has the cheapest diesel in Braga district?', a: (() => { const { grandes } = dados(h); const a = grandes[0], z = grandes[grandes.length - 1]; return a && z && grandes.length > 1 ? `Among brands with at least five stations in the district, today's lowest average belongs to ${mk(h, a.marca)}, ${h.l(a.media)}, and the highest to ${mk(h, z.marca)}, ${h.l(z.media)}. A brand average hides differences between its stations, which set their own prices; the calculator shows them station by station.` : 'Today no brand has enough stations in the district for a reliable comparison. The calculator shows the cheapest stations in each municipality, whatever the brand, with the time of the last update.'; })() },
      { q: 'How much more does premium diesel cost in Braga district?', a: (() => { const { ge, gs } = dados(h); return ge ? `Today premium diesel, with additives, is at ${h.l(ge.media)} on average in the district, against ${h.l(gs.media)} for standard: ${h.c(ge.media - gs.media, true)} a litre, or ${h.eur((ge.media - gs.media) * 50, 2)} on a 50-litre tank. The standard or premium page helps you decide whether that gap is worth it in your case.` : `Today no station in the district reports a premium diesel price to the DGEG, so there is nothing to compare. Standard diesel averages ${h.l(gs.media)}.`; })() },
      { q: 'Which municipality in Braga district has the fewest diesel stations?', a: (() => { const { menor, maior } = dados(h); return menor && maior ? `Today it is ${menor.concelho}, with ${h.num(menor.n)} ${menor.n === 1 ? 'station' : 'stations'} selling diesel at an average of ${h.l(menor.media)}. At the other end, ${maior.concelho} has ${h.num(maior.n)}. Where there are few stations, the average hangs on one or two prices and can swing a lot from one day to the next; it is worth comparing with neighbouring municipalities.` : 'Today there is not enough data by municipality. The calculator shows the stations in each municipality of the district as soon as they report their prices.'; })() },
    ],
    body: (h) => {
      const { gs, g95, ge, g95e, marcas, grandes, top5, r, viz } = dados(h);
      const a = grandes[0], z = grandes[grandes.length - 1];
      return `<h2>The brands that supply the district</h2>
<p>Braga's network mixes the major brands with low-price chains and unbranded stations. The table shows those with the most diesel stations and the average for each.${a && z && grandes.length > 1 ? ` Among brands with five stations or more, the gap between the cheapest and the dearest is ${h.c(z.media - a.media)} a litre, ${h.eur((z.media - a.media) * 50, 2)} on a 50-litre tank.` : ''} The lowest-price column shows that even a dear brand can have one well-priced station, and the reverse happens too.</p>
${h.table(['Brand', 'Stations', 'Average', 'Lowest'], marcas.map((m) => [mk(h, m.marca), m.n, h.l(m.media), h.l(m.min)]), 'Standard diesel by brand, brands with the most stations in the district', ['l', 'r', 'r', 'r'])}
<h2>Today's five cheapest stations</h2>
<p>The list changes during the day as stations report new prices. The last column shows when each price was updated: an old price may no longer match what is on the pump.</p>
${h.table(['Station', 'Municipality', 'Price', 'Updated'], top5.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(h, x.atualizado)]), 'Standard diesel, posted price reported to the DGEG', ['l', 'l', 'r', 'r'])}
<h2>Premium diesel and premium petrol</h2>
<p>${ge ? `Premium diesel costs ${h.c(ge.media - gs.media, true)} a litre against standard today.` : 'No station posts premium diesel today.'} ${g95e ? `For petrol, premium 95 is at ${h.l(g95e.media)}, against ${h.l(g95.media)} for standard, at ${h.num(g95e.n)} stations.` : `Standard petrol 95 is at ${h.l(g95.media)}.`} The benefit of premium grades does not show on the pump display; the ${h.a('simples-ou-aditivado', 'standard or premium')} page sums up what is known.</p>
<h2>Braga and its neighbours</h2>
<p>On diesel, Braga ranks ${h.ord(r.pos)} today. ${viz.filter((x) => x.s).map((x) => `${h.a(h.D.slug(x.n), x.n)} ranks ${h.ord(x.r.pos)}, with an average of ${h.l(x.s!.media)}`).join('; ')}. A district's position can swap from one day to the next, because the averages are only a few cents apart. For anyone who crosses the district boundary every day, the station chosen matters more than the district.</p>`;
    },
  },
});
