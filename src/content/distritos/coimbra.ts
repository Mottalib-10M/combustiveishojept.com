import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Coimbra';
const Z = { media: 0, min: 0, max: 0, n: 0 };

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, gpl = h.D.statsDe('gpl', D);
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D), rg = h.D.rankDistrito('g95', D);
  const marcas = h.D.marcasDistrito('gs', D, 6);
  const t = h.D.tipoDistrito('gs', D);
  const c = h.D.concelhosOrdenados('gs', D);
  const viz = (['Aveiro', 'Viseu', 'Guarda', 'Castelo Branco', 'Leiria'] as const).map((n) => ({ n, s: h.D.statsDe('gs', n) })).filter((x) => x.s).sort((a, b) => a.s!.media - b.s!.media);
  return { gs, g95, gpl, p, r, rg, marcas, hip: t['Área comercial (Hipermercados)'], rua: t['Outro'], ae: t['Auto-estrada'], c, viz };
}
const mk = (h: Helpers, m: string) => (m === 'Genérico' ? (h.lang === 'pt' ? 'postos sem marca' : 'unbranded stations') : m);

export default defineGuide({
  id: 'coimbra', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['aveiro', 'leiria', 'viseu', 'precos-por-marca', 'custo-deposito'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'coimbra', nav: 'Coimbra', card: 'Marcas acima e abaixo da média, hipermercados e a poupança possível em cada concelho do distrito de Coimbra.',
    title: 'Preço da gasolina e do gasóleo em Coimbra hoje, por marca',
    description: 'Gasolina e gasóleo hoje no distrito de Coimbra: as marcas acima e abaixo da média, rua contra hipermercado e quanto se poupa num depósito em cada concelho.',
    h1: 'Gasolina e gasóleo no distrito de Coimbra',
    intro: (h) => `Marca a marca e concelho a concelho, o que custa hoje abastecer num dos ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Coimbra.`,
    resume: (h) => {
      const { gs, g95, r, rg, marcas, c } = dados(h);
      const lo = c[0], hi = c[c.length - 1];
      const abaixo = marcas.filter((m) => m.media < gs.media);
      return `Abastecer no distrito de Coimbra custa hoje, em média, ${h.l(gs.media)} no gasóleo simples e ${h.l(g95.media)} na gasolina simples 95. No gasóleo, o distrito ocupa o ${h.ord(r.pos)} lugar dos ${h.num(r.de)} do continente; na gasolina, o ${h.ord(rg.pos)}, sempre do preço médio mais baixo para o mais alto. A diferença para a média do continente é de ${h.c(h.D.desvioDistrito('gs', D), true)} no gasóleo e de ${h.c(h.D.desvioDistrito('g95', D), true)} na gasolina. Das ${h.num(marcas.length)} marcas com mais postos no distrito, ${abaixo.length ? `${h.num(abaixo.length)} ficam abaixo da média distrital do gasóleo, com ${mk(h, abaixo.sort((a, b) => a.media - b.media)[0].marca)} à frente` : 'nenhuma fica hoje abaixo da média distrital do gasóleo'}. ${lo && hi && c.length > 1 ? `Por concelho, a média vai de ${h.l(lo.media)} em ${lo.concelho} a ${h.l(hi.media)} em ${hi.concelho}.` : ''} No fim, quem escolhe o posto mais barato do distrito, a ${h.l(gs.min)}, paga ${h.eur((gs.media - gs.min) * 50, 2)} menos num depósito de 50 litros do que quem para num posto à média.`;
    },
    faqs: (h) => [
      { q: 'Que marcas têm mais postos de combustível no distrito de Coimbra?', a: (() => { const { marcas, gs } = dados(h); const top = marcas.slice(0, 3); return top.length ? `Hoje, entre os ${h.num(gs.n)} postos com gasóleo, as marcas mais presentes são ${top.map((m) => `${mk(h, m.marca)} (${h.num(m.n)} postos, média de ${h.l(m.media)})`).join(', ')}. A média de uma marca mistura postos de localidades diferentes, cada um com o seu preço, por isso vale a pena ver os postos um a um na calculadora.` : 'Hoje não há postos suficientes com preço comunicado para fazer a contagem por marca. A calculadora mostra os postos do distrito à medida que atualizam os preços, com a hora de cada um.'; })() },
      { q: 'Compensa abastecer num hipermercado no distrito de Coimbra?', a: (() => { const { hip, rua } = dados(h); return hip && rua ? `Hoje os ${h.num(hip.n)} postos de hipermercado do distrito afixam o gasóleo a ${h.l(hip.media)} em média, contra ${h.l(rua.media)} nos postos de rua: ${h.c(hip.media - rua.media, true)} por litro. Num depósito de 50 litros, são ${h.eur(Math.abs(hip.media - rua.media) * 50, 2)} de diferença. Há poucos postos de hipermercado, por isso a média pode mudar bastante de um dia para o outro.` : 'Hoje não há postos de hipermercado com preço de gasóleo suficientes no distrito para comparar com os de rua. A calculadora mostra o tipo de cada posto e o preço afixado, com a hora da última atualização.'; })() },
      { q: 'Quanto se poupa num depósito escolhendo bem o posto no distrito de Coimbra?', a: (() => { const { gs } = dados(h); return `Hoje o gasóleo simples vai de ${h.l(gs.min)} no posto mais barato do distrito a ${h.l(gs.max)} no mais caro. Num depósito de 50 litros, isso dá ${h.eur((gs.max - gs.min) * 50, 2)} entre os dois extremos e ${h.eur((gs.media - gs.min) * 50, 2)} entre o mais barato e a média. Repetida todas as semanas, a escolha do posto pesa mais no orçamento do que a diferença entre distritos.`; })() },
    ],
    body: (h) => {
      const { gs, gpl, marcas, hip, rua, ae, c, viz, r } = dados(h);
      return `<h2>Marcas acima e abaixo da média</h2>
<p>No distrito convivem marcas de bandeira, marcas de preço baixo e postos sem marca. Comparar a média de cada uma com a do distrito, ${h.l(gs.media)}, mostra onde está hoje o preço mais baixo: ${marcas.map((m) => `${mk(h, m.marca)} ${h.c(m.media - gs.media, true)}`).join(', ')}. A diferença de uma marca é uma média; postos da mesma bandeira podem ter preços bem diferentes.</p>
${h.table(['Marca', 'Postos', 'Média', 'Face ao distrito'], marcas.map((m) => [mk(h, m.marca), m.n, h.l(m.media), h.c(m.media - gs.media, true)]), 'Gasóleo simples, as marcas com mais postos no distrito', ['l', 'r', 'r', 'r'])}
<h2>Rua, hipermercado e autoestrada</h2>
<p>${rua ? `Os ${h.num(rua.n)} postos de rua, ${h.pct(rua.n / Math.max(gs.n, 1))} dos que vendem gasóleo, afixam-no a ${h.l(rua.media)} em média.` : ''} ${hip ? `Os ${h.num(hip.n)} postos de hipermercado estão a ${h.l(hip.media)}.` : 'Hoje não há postos de hipermercado com preço de gasóleo.'} ${ae ? `Nas ${h.num(ae.n)} áreas de serviço de autoestrada, o preço médio é de ${h.l(ae.media)}.` : 'Nenhum posto de autoestrada comunica hoje preço de gasóleo.'}${gpl ? ` O GPL Auto, vendido em ${h.num(gpl.n)} postos, está a ${h.l(gpl.media)}.` : ''}</p>
<h2>Quanto se poupa em cada concelho</h2>
<p>A última coluna é a poupança num depósito de 50 litros quando se abastece no posto mais barato do concelho em vez de pagar a média do distrito. Um valor negativo quer dizer que até o posto mais barato do concelho está acima da média distrital.</p>
${h.table(['Concelho', 'Postos', 'Mínimo', 'Poupança em 50 l'], c.map((x) => [x.concelho, x.n, h.l(x.min), h.eur((gs.media - x.min) * 50, 2)]), 'Gasóleo simples, concelhos com dois postos ou mais', ['l', 'r', 'r', 'r'])}
<h2>Coimbra e os cinco distritos vizinhos</h2>
<p>${viz.length ? `Dos distritos à volta, ${h.a(h.D.slug(viz[0].n), viz[0].n)} tem hoje o gasóleo mais barato em média, ${h.l(viz[0].s!.media)}, e ${h.a(h.D.slug(viz[viz.length - 1].n), viz[viz.length - 1].n)} o mais caro, ${h.l(viz[viz.length - 1].s!.media)}.` : ''} Coimbra, em ${h.ord(r.pos)} lugar no continente, está a ${h.l(gs.media)}. As outras médias: ${viz.slice(1, -1).map((x) => `${h.a(h.D.slug(x.n), x.n)} ${h.l(x.s!.media)}`).join(', ')}.</p>`;
    },
  },
  en: {
    slug: 'coimbra', nav: 'Coimbra', card: 'Brands above and below the average, hypermarkets and the possible saving in each municipality of Coimbra district.',
    title: 'Petrol and diesel prices in Coimbra today, brand by brand',
    description: 'Petrol and diesel today in Coimbra district: the brands above and below the average, street versus hypermarket, and what a full tank saves in each municipality.',
    h1: 'Petrol and diesel in Coimbra district',
    intro: (h) => `Brand by brand and municipality by municipality, what it costs today to fill up at one of the ${h.num(h.D.postosDistrito(D).total)} stations in Coimbra district.`,
    resume: (h) => {
      const { gs, g95, r, rg, marcas, c } = dados(h);
      const lo = c[0], hi = c[c.length - 1];
      const below = marcas.filter((m) => m.media < gs.media);
      return `Filling up in Coimbra district costs ${h.l(gs.media)} on average today for standard diesel and ${h.l(g95.media)} for standard petrol 95. For diesel, the district is ${h.ord(r.pos)} of the ${h.num(r.de)} mainland districts; for petrol, ${h.ord(rg.pos)}, always from the lowest average price to the highest. The gap to the mainland average is ${h.c(h.D.desvioDistrito('gs', D), true)} for diesel and ${h.c(h.D.desvioDistrito('g95', D), true)} for petrol. Of the ${h.num(marcas.length)} brands with the most stations in the district, ${below.length ? `${h.num(below.length)} sit below the district diesel average, led by ${mk(h, below.sort((a, b) => a.media - b.media)[0].marca)}` : 'none sits below the district diesel average today'}. ${lo && hi && c.length > 1 ? `By municipality, the average runs from ${h.l(lo.media)} in ${lo.concelho} to ${h.l(hi.media)} in ${hi.concelho}.` : ''} In the end, anyone who picks the cheapest station in the district, at ${h.l(gs.min)}, pays ${h.eur((gs.media - gs.min) * 50, 2)} less on a 50-litre tank than someone who stops at a station priced at the average.`;
    },
    faqs: (h) => [
      { q: 'Which brands have the most fuel stations in Coimbra district?', a: (() => { const { marcas, gs } = dados(h); const top = marcas.slice(0, 3); return top.length ? `Today, among the ${h.num(gs.n)} stations selling diesel, the most common brands are ${top.map((m) => `${mk(h, m.marca)} (${h.num(m.n)} stations, averaging ${h.l(m.media)})`).join(', ')}. A brand average mixes stations in different towns, each with its own price, so it is worth looking at stations one by one in the calculator.` : 'Today there are not enough stations with a reported price to count by brand. The calculator shows the district’s stations as they update their prices, with the time of each one.'; })() },
      { q: 'Is it worth filling up at a hypermarket in Coimbra district?', a: (() => { const { hip, rua } = dados(h); return hip && rua ? `Today the district's ${h.num(hip.n)} hypermarket stations post diesel at ${h.l(hip.media)} on average, against ${h.l(rua.media)} at street stations: ${h.c(hip.media - rua.media, true)} a litre. On a 50-litre tank, that is a difference of ${h.eur(Math.abs(hip.media - rua.media) * 50, 2)}. There are few hypermarket stations, so their average can move a good deal from one day to the next.` : 'Today there are not enough hypermarket stations with a diesel price in the district to compare with street stations. The calculator shows each station’s type and posted price, with the time of the last update.'; })() },
      { q: 'How much can you save on a tank by choosing the right station in Coimbra district?', a: (() => { const { gs } = dados(h); return `Today standard diesel runs from ${h.l(gs.min)} at the cheapest station in the district to ${h.l(gs.max)} at the dearest. On a 50-litre tank, that is ${h.eur((gs.max - gs.min) * 50, 2)} between the two extremes and ${h.eur((gs.media - gs.min) * 50, 2)} between the cheapest and the average. Repeated every week, the choice of station weighs more on the budget than the gap between districts.`; })() },
    ],
    body: (h) => {
      const { gs, gpl, marcas, hip, rua, ae, c, viz, r } = dados(h);
      return `<h2>Brands above and below the average</h2>
<p>The district mixes major brands, low-price chains and unbranded stations. Comparing each brand's average with the district one, ${h.l(gs.media)}, shows where the lowest price is today: ${marcas.map((m) => `${mk(h, m.marca)} ${h.c(m.media - gs.media, true)}`).join(', ')}. A brand's gap is an average; stations under the same flag can have quite different prices.</p>
${h.table(['Brand', 'Stations', 'Average', 'Against district'], marcas.map((m) => [mk(h, m.marca), m.n, h.l(m.media), h.c(m.media - gs.media, true)]), 'Standard diesel, the brands with the most stations in the district', ['l', 'r', 'r', 'r'])}
<h2>Street, hypermarket and motorway</h2>
<p>${rua ? `The ${h.num(rua.n)} street stations, ${h.pct(rua.n / Math.max(gs.n, 1))} of those selling diesel, post it at ${h.l(rua.media)} on average.` : ''} ${hip ? `The ${h.num(hip.n)} hypermarket stations are at ${h.l(hip.media)}.` : 'Today there are no hypermarket stations with a diesel price.'} ${ae ? `At the ${h.num(ae.n)} motorway service areas, the average price is ${h.l(ae.media)}.` : 'No motorway station reports a diesel price today.'}${gpl ? ` LPG, sold at ${h.num(gpl.n)} stations, is at ${h.l(gpl.media)}.` : ''}</p>
<h2>What you save in each municipality</h2>
<p>The last column is the saving on a 50-litre tank when you fill up at the cheapest station in the municipality instead of paying the district average. A negative figure means that even the municipality's cheapest station is above the district average.</p>
${h.table(['Municipality', 'Stations', 'Lowest', 'Saving on 50 l'], c.map((x) => [x.concelho, x.n, h.l(x.min), h.eur((gs.media - x.min) * 50, 2)]), 'Standard diesel, municipalities with two stations or more', ['l', 'r', 'r', 'r'])}
<h2>Coimbra and its five neighbouring districts</h2>
<p>${viz.length ? `Of the surrounding districts, ${h.a(h.D.slug(viz[0].n), viz[0].n)} has the cheapest diesel on average today, ${h.l(viz[0].s!.media)}, and ${h.a(h.D.slug(viz[viz.length - 1].n), viz[viz.length - 1].n)} the dearest, ${h.l(viz[viz.length - 1].s!.media)}.` : ''} Coimbra, ${h.ord(r.pos)} on the mainland, is at ${h.l(gs.media)}. The other averages: ${viz.slice(1, -1).map((x) => `${h.a(h.D.slug(x.n), x.n)} ${h.l(x.s!.media)}`).join(', ')}.</p>`;
    },
  },
});
