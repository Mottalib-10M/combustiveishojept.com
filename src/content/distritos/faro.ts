import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Faro';
const Z = { media: 0, min: 0, max: 0, n: 0 };

function dados(h: Helpers) {
  const g95 = h.D.statsDe('g95', D) ?? Z, gs = h.D.statsDe('gs', D) ?? Z, g98 = h.D.statsDe('g98', D), gpl = h.D.statsDe('gpl', D), gplPt = h.D.statsDe('gpl');
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('g95', D), rd = h.D.rankDistrito('gs', D);
  const top = h.D.baratos('g95', 5, D);
  const c = h.D.concelhosOrdenados('g95', D), gsc = h.D.porConcelho('gs', D);
  const poucos = Object.entries(h.D.porConcelho('g95', D)).filter(([, s]) => s.n < 2).map(([k]) => k).sort((a, b) => a.localeCompare(b, 'pt'));
  const t = h.D.tipoDistrito('g95', D);
  const beja = { g95: h.D.statsDe('g95', 'Beja'), gs: h.D.statsDe('gs', 'Beja') };
  return { g95, gs, g98, gpl, gplPt, p, r, rd, top, c, gsc, poucos, ae: t['Auto-estrada'], rua: t['Outro'], hip: t['Área comercial (Hipermercados)'], beja };
}
const hora = (h: Helpers, iso: string) => `${h.dia(iso.slice(0, 10))}, ${iso.slice(11, 16)}`;
const e = (h: Helpers, xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${h.lang === 'pt' ? 'e' : 'and'} ${xs[xs.length - 1]}`);

export default defineGuide({
  id: 'faro', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D, fuel: 'g95' },
  related: ['beja', 'preco-gasolina-95', 'postos-mais-baratos', 'preco-gpl-auto'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'faro', nav: 'Faro', card: 'Os postos de gasolina mais baratos do Algarve hoje, concelho a concelho, com o gasóleo e o GPL Auto ao lado.',
    title: 'Preço da gasolina no Algarve hoje: distrito de Faro',
    description: 'Gasolina e gasóleo hoje no Algarve: os cinco postos mais baratos do distrito de Faro, a média de cada concelho, o preço na autoestrada e o GPL Auto, dados DGEG.',
    h1: 'Gasolina e gasóleo no Algarve hoje',
    intro: (h) => `Os ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Faro, que cobre todo o Algarve, começando pela gasolina e com o gasóleo ao lado.`,
    resume: (h) => {
      const { g95, gs, r, rd, top, ae, rua } = dados(h);
      const t0 = top[0];
      return `Na gasolina simples 95, o distrito de Faro tem hoje uma média afixada de ${h.l(g95.media)}; no gasóleo simples, de ${h.l(gs.media)}. Isto coloca o Algarve em ${h.ord(r.pos)} lugar entre os ${h.num(r.de)} distritos do continente na gasolina e em ${h.ord(rd.pos)} no gasóleo, ordenados do preço médio mais baixo para o mais alto. Face à média do continente, a gasolina do distrito fica ${h.c(h.D.desvioDistrito('g95', D), true)} por litro. ${t0 ? `O posto com a gasolina 95 mais barata é hoje ${t0.nome}, em ${t0.concelho}, a ${h.l(t0.preco)}, ${h.c(g95.media - t0.preco)} abaixo da média do distrito.` : ''} ${ae && rua ? `Nas áreas de serviço de autoestrada, o mesmo litro custa em média ${h.l(ae.media)}, contra ${h.l(rua.media)} nos postos de rua.` : ''} A média assenta em ${h.num(g95.n)} postos com preço de gasolina 95, e cada um aparece na calculadora com a hora da última atualização comunicada à DGEG, para saber se o preço é de hoje.`;
    },
    faqs: (h) => [
      { q: 'Onde está hoje a gasolina mais barata no distrito de Faro?', a: (() => { const { top, c } = dados(h); const t0 = top[0], c0 = c[0]; return t0 ? `O preço mais baixo de gasolina simples 95 é o de ${t0.nome}, em ${t0.localidade} (${t0.concelho}), a ${h.l(t0.preco)}.${c0 ? ` Por concelho, a média mais baixa é a de ${c0.concelho}, ${h.l(c0.media)}, em ${h.num(c0.n)} postos.` : ''} A tabela desta página mostra os cinco postos mais baratos e quando cada preço foi comunicado; a ordem muda ao longo do dia.` : 'Hoje nenhum posto do distrito comunicou preço de gasolina 95 à DGEG. A calculadora mostra os dados assim que os postos os atualizarem, com a hora de cada comunicação.'; })() },
      { q: 'Quanto custa encher um depósito de 40 litros de gasolina no distrito de Faro?', a: (() => { const { g95, top } = dados(h); const t0 = top[0]; return `À média de hoje, ${h.l(g95.media)}, 40 litros de gasolina simples 95 custam ${h.eur(g95.media * 40, 2)} no distrito.${t0 ? ` No posto mais barato, a ${h.l(t0.preco)}, ficam em ${h.eur(t0.preco * 40, 2)}.` : ''} No mais caro, a ${h.l(g95.max)}, chegam a ${h.eur(g95.max * 40, 2)}. Para outro tamanho de depósito ou outro combustível, a página do custo do depósito faz a conta.`; })() },
      { q: 'Quantos postos vendem GPL Auto no distrito de Faro?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Hoje ${h.num(p.gpl)} dos ${h.num(p.total)} postos do distrito afixam GPL Auto, a uma média de ${h.l(gpl.media)} e com o mais barato a ${h.l(gpl.min)}${gplPt ? `; face à média do continente, são ${h.c(gpl.media - gplPt.media, true)} por litro` : ''}. Escolha GPL Auto na calculadora para ver em que concelhos há posto e a hora de cada preço.` : 'Hoje nenhum posto do distrito comunica preço de GPL Auto à DGEG. A calculadora mostra os postos com GPL no distrito vizinho de Beja, com a hora de cada preço.'; })() },
    ],
    body: (h) => {
      const { g95, gs, g98, top, c, gsc, poucos, ae, rua, hip, beja } = dados(h);
      const lo = c[0], hi = c[c.length - 1];
      return `<h2>Os cinco postos de gasolina mais baratos</h2>
<p>A lista é a de agora: um posto pode baixar ou subir o preço a qualquer hora e entrar ou sair destes cinco. Antes de fazer quilómetros para abastecer, confirme a hora da atualização na última coluna. Para o gasóleo ou o GPL Auto, mude o combustível na calculadora: a lista dos mais baratos é refeita para esse combustível.</p>
${h.table(['Posto', 'Concelho', 'Gasolina 95', 'Atualizado'], top.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(h, x.atualizado)]), 'Gasolina simples 95, preço afixado comunicado à DGEG', ['l', 'l', 'r', 'r'])}
<h2>Gasolina e gasóleo em cada concelho</h2>
<p>${lo && hi && c.length > 1 ? `Na gasolina, a média vai de ${h.l(lo.media)} em ${lo.concelho} a ${h.l(hi.media)} em ${hi.concelho}, ${h.c(hi.media - lo.media)} por litro de diferença dentro do mesmo distrito.` : ''} ${poucos.length ? `${e(h, poucos)} ${poucos.length > 1 ? 'têm' : 'tem'} um só posto com gasolina, e a média de um posto não chega para os comparar, por isso ${poucos.length > 1 ? 'ficam' : 'fica'} fora da tabela.` : ''} A coluna do gasóleo permite ver se o concelho barato num combustível é também barato no outro.</p>
${h.table(['Concelho', 'Postos', 'Gasolina 95', 'Gasóleo'], c.map((x) => [x.concelho, x.n, h.l(x.media), gsc[x.concelho] ? h.l(gsc[x.concelho].media) : '—']), 'Média afixada por concelho, ordenada pela gasolina 95', ['l', 'r', 'r', 'r'])}
<h2>Autoestrada, rua e hipermercado</h2>
<p>${ae && rua ? `Na gasolina 95, as ${h.num(ae.n)} áreas de serviço estão ${h.c(ae.media - rua.media, true)} por litro face aos postos de rua, ou ${h.eur(Math.abs(ae.media - rua.media) * 40, 2)} num depósito de 40 litros.` : 'Hoje não há preços suficientes para comparar autoestrada e rua.'} ${hip ? `Os ${h.num(hip.n)} postos de hipermercado afixam ${h.l(hip.media)} em média.` : ''}${g98 ? ` A gasolina 98 está à venda em ${h.num(g98.n)} postos, a ${h.l(g98.media)}.` : ''}</p>
<h2>Faro, Beja e a fronteira do Guadiana</h2>
<p>O Algarve faz fronteira com Espanha ao longo do Guadiana, e este site só inclui os postos portugueses. O único distrito português vizinho é ${h.a('beja', 'Beja')}${beja.g95 && beja.gs ? `, que tem hoje a gasolina a ${h.l(beja.g95.media)} (${h.c(beja.g95.media - g95.media, true)} face a Faro) e o gasóleo a ${h.l(beja.gs.media)} (${h.c(beja.gs.media - gs.media, true)})` : ''}. A comparação entre todos os distritos está na página do ${h.a('preco-gasolina-95', 'preço da gasolina 95')}.</p>`;
    },
  },
  en: {
    slug: 'faro', nav: 'Faro', card: 'The cheapest petrol stations in the Algarve today, municipality by municipality, with diesel and LPG alongside.',
    title: 'Petrol prices in the Algarve today: Faro district list',
    description: 'Petrol and diesel in the Algarve today: the five cheapest stations in Faro district, the average in each municipality, motorway prices and LPG, from DGEG data.',
    h1: 'Petrol and diesel in the Algarve today',
    intro: (h) => `The ${h.num(h.D.postosDistrito(D).total)} stations in Faro district, which covers the whole Algarve, starting with petrol and with diesel alongside.`,
    resume: (h) => {
      const { g95, gs, r, rd, top, ae, rua } = dados(h);
      const t0 = top[0];
      return `For standard petrol 95, Faro district has a posted average of ${h.l(g95.media)} today; for standard diesel, ${h.l(gs.media)}. That puts the Algarve ${h.ord(r.pos)} of the ${h.num(r.de)} mainland districts for petrol and ${h.ord(rd.pos)} for diesel, ranked from the lowest average price to the highest. Against the mainland average, the district's petrol is ${h.c(h.D.desvioDistrito('g95', D), true)} a litre. ${t0 ? `The station with the cheapest petrol 95 today is ${t0.nome}, in ${t0.concelho}, at ${h.l(t0.preco)}, ${h.c(g95.media - t0.preco)} below the district average.` : ''} ${ae && rua ? `At motorway service areas, the same litre averages ${h.l(ae.media)}, against ${h.l(rua.media)} at street stations.` : ''} The average rests on ${h.num(g95.n)} stations with a petrol 95 price, and each one appears in the calculator with the time of its last update reported to the DGEG, so you know whether the price is from today.`;
    },
    faqs: (h) => [
      { q: 'Where is the cheapest petrol in Faro district today?', a: (() => { const { top, c } = dados(h); const t0 = top[0], c0 = c[0]; return t0 ? `The lowest standard petrol 95 price is at ${t0.nome}, in ${t0.localidade} (${t0.concelho}), at ${h.l(t0.preco)}.${c0 ? ` By municipality, the lowest average is in ${c0.concelho}, ${h.l(c0.media)}, across ${h.num(c0.n)} stations.` : ''} The table on this page shows the five cheapest stations and when each price was reported; the order changes during the day.` : 'Today no station in the district has reported a petrol 95 price to the DGEG. The calculator shows the data as soon as stations update it, with the time of each report.'; })() },
      { q: 'How much does a 40-litre tank of petrol cost in Faro district?', a: (() => { const { g95, top } = dados(h); const t0 = top[0]; return `At today's average of ${h.l(g95.media)}, 40 litres of standard petrol 95 cost ${h.eur(g95.media * 40, 2)} in the district.${t0 ? ` At the cheapest station, at ${h.l(t0.preco)}, they come to ${h.eur(t0.preco * 40, 2)}.` : ''} At the dearest, at ${h.l(g95.max)}, they reach ${h.eur(g95.max * 40, 2)}. For another tank size or another fuel, the tank cost page does the sum.`; })() },
      { q: 'How many stations sell LPG in Faro district?', a: (() => { const { gpl, gplPt, p } = dados(h); return gpl ? `Today ${h.num(p.gpl)} of the ${h.num(p.total)} stations in the district post an LPG price, averaging ${h.l(gpl.media)}, with the cheapest at ${h.l(gpl.min)}${gplPt ? `; against the mainland average, that is ${h.c(gpl.media - gplPt.media, true)} a litre` : ''}. Pick LPG in the calculator to see which municipalities have a station and the time of each price.` : 'Today no station in the district reports an LPG price to the DGEG. The calculator shows LPG stations in neighbouring Beja district, with the time of each price.'; })() },
    ],
    body: (h) => {
      const { g95, gs, g98, top, c, gsc, poucos, ae, rua, hip, beja } = dados(h);
      const lo = c[0], hi = c[c.length - 1];
      return `<h2>The five cheapest petrol stations</h2>
<p>This is the list as it stands now: a station can lower or raise its price at any time and move in or out of these five. Before driving far to fill up, check the update time in the last column. For diesel or LPG, switch the fuel in the calculator: the list of the cheapest is rebuilt for that fuel.</p>
${h.table(['Station', 'Municipality', 'Petrol 95', 'Updated'], top.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(h, x.atualizado)]), 'Standard petrol 95, posted price reported to the DGEG', ['l', 'l', 'r', 'r'])}
<h2>Petrol and diesel in each municipality</h2>
<p>${lo && hi && c.length > 1 ? `For petrol, the average runs from ${h.l(lo.media)} in ${lo.concelho} to ${h.l(hi.media)} in ${hi.concelho}, a gap of ${h.c(hi.media - lo.media)} a litre within the same district.` : ''} ${poucos.length ? `${e(h, poucos)} ${poucos.length > 1 ? 'have' : 'has'} a single petrol station, and one station is not enough for a fair comparison, so ${poucos.length > 1 ? 'they are' : 'it is'} left out of the table.` : ''} The diesel column shows whether a municipality that is cheap for one fuel is also cheap for the other.</p>
${h.table(['Municipality', 'Stations', 'Petrol 95', 'Diesel'], c.map((x) => [x.concelho, x.n, h.l(x.media), gsc[x.concelho] ? h.l(gsc[x.concelho].media) : '—']), 'Posted average by municipality, ordered by petrol 95', ['l', 'r', 'r', 'r'])}
<h2>Motorway, street and hypermarket</h2>
<p>${ae && rua ? `For petrol 95, the ${h.num(ae.n)} service areas are ${h.c(ae.media - rua.media, true)} a litre against street stations, or ${h.eur(Math.abs(ae.media - rua.media) * 40, 2)} on a 40-litre tank.` : 'Today there are not enough prices to compare motorway and street stations.'} ${hip ? `The ${h.num(hip.n)} hypermarket stations post ${h.l(hip.media)} on average.` : ''}${g98 ? ` Petrol 98 is on sale at ${h.num(g98.n)} stations, at ${h.l(g98.media)}.` : ''}</p>
<h2>Faro, Beja and the Guadiana border</h2>
<p>The Algarve borders Spain along the Guadiana, and this site includes Portuguese stations only. The only neighbouring Portuguese district is ${h.a('beja', 'Beja')}${beja.g95 && beja.gs ? `, which today has petrol at ${h.l(beja.g95.media)} (${h.c(beja.g95.media - g95.media, true)} against Faro) and diesel at ${h.l(beja.gs.media)} (${h.c(beja.gs.media - gs.media, true)})` : ''}. The comparison across all districts is on the ${h.a('preco-gasolina-95', 'petrol 95 price')} page.</p>`;
    },
  },
});
