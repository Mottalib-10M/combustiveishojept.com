import { defineGuide } from '../../lib/guide-types';
const D = 'Lisboa';

export default defineGuide({
  id: 'lisboa', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['setubal', 'santarem', 'leiria', 'postos-mais-baratos', 'precos-por-marca'],
  sources: ['dgegPortal', 'dgegPmd', 'dl243'],
  pt: {
    slug: 'lisboa', nav: 'Lisboa', card: 'Gasóleo e gasolina nos 16 concelhos do distrito de Lisboa, do mais barato ao mais caro.',
    title: 'Preço do gasóleo em Lisboa hoje: média por concelho e postos',
    description: 'Preço do gasóleo e da gasolina hoje nos concelhos do distrito de Lisboa, com os postos mais baratos, a hora de atualização e o custo do depósito. Dados DGEG.',
    h1: 'Combustíveis no distrito de Lisboa hoje',
    intro: (h) => `Média afixada em cada concelho do distrito e os postos mais baratos, com os dados que ${h.num(h.D.postosDistrito(D).total)} postos comunicam à DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('gs', D)!, g = h.D.statsDe('g95', D)!, r = h.D.rankDistrito('gs', D), c = h.D.concelhosOrdenados('gs', D);
      return `No distrito de Lisboa, o gasóleo simples está hoje afixado em média a ${h.l(s.media)} e a gasolina simples 95 a ${h.l(g.media)}, em ${h.num(s.n)} postos. Face à média do continente, o gasóleo fica ${h.c(h.D.desvioDistrito('gs', D), true)} por litro, o que põe Lisboa em ${h.ord(r.pos)} lugar entre os 18 distritos, do mais barato para o mais caro. O posto mais barato do distrito pede ${h.l(s.min)}. Entre concelhos, a média do gasóleo vai de ${h.l(c[0].media)} em ${c[0].concelho} a ${h.l(c[c.length - 1].media)} em ${c[c.length - 1].concelho}. Num depósito de 50 litros, abastecer no posto mais barato em vez de um posto à média do distrito poupa ${h.eur((s.media - s.min) * 50, 2)}. Os preços são os comunicados pelos postos à DGEG, com a hora da última atualização de cada um na lista.`;
    },
    faqs: (h) => [
      { q: 'Em que concelho do distrito de Lisboa o gasóleo está mais barato hoje?', a: (() => { const c = h.D.concelhosOrdenados('gs', D), l = h.D.statsDe('gs', D, 'Lisboa'); return `Hoje é em ${c[0].concelho}, com média afixada de ${h.l(c[0].media)} em ${h.num(c[0].n)} postos, seguido de ${c[1].concelho} (${h.l(c[1].media)}). No concelho de Lisboa a média é de ${h.l(l!.media)}. A ordem muda de dia para dia, porque cada posto altera o preço quando quer; a tabela abaixo é recalculada todos os dias com os dados da DGEG.`; })() },
      { q: 'Quantos postos de autoestrada há no distrito de Lisboa?', a: `Hoje a DGEG lista ${h.num(h.D.postosDistrito(D).autoestrada)} postos em áreas de serviço de autoestrada no distrito. São em geral os mais caros, porque a concessão impõe custos próprios. Se a viagem o permitir, sair da autoestrada para abastecer num posto de rua ou de hipermercado próximo costuma compensar num depósito cheio.` },
      { q: 'Onde há GPL Auto no distrito de Lisboa?', a: `${h.num(h.D.postosDistrito(D).gpl)} postos do distrito comunicam preço de GPL Auto à DGEG. Escolha GPL Auto na calculadora e o concelho, e a lista mostra os cinco mais baratos com a hora da última atualização. Se um concelho não aparecer, é porque nenhum posto lá vende GPL.` },
    ],
    body: (h) => {
      const c = h.D.concelhosOrdenados('gs', D), t = h.D.tipoDistrito('gs', D), m = h.D.marcasDistrito('gs', D, 6), p = h.D.postosDistrito(D);
      const ae = t['Auto-estrada'], hip = t['Área comercial (Hipermercados)'], rua = t['Outro'];
      return `<h2>Os concelhos, do mais barato ao mais caro</h2>
<p>A tabela ordena os concelhos pela média afixada do gasóleo simples. O mínimo é o preço do posto mais barato de cada concelho, e o número de postos ajuda a perceber se a média assenta em muitos postos ou em dois ou três.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples, preço afixado comunicado à DGEG', ['l', 'r', 'r', 'r'])}
<h2>Rua, hipermercado ou autoestrada</h2>
<p>O distrito tem ${h.num(p.total)} postos no registo: ${h.num(p.rua)} de rua, ${h.num(p.hiper)} em áreas comerciais e ${h.num(p.autoestrada)} em autoestradas. ${hip ? `Nos postos de hipermercado o gasóleo está em média a ${h.l(hip.media)},` : ''} nos de rua a ${h.l(rua.media)}${ae ? ` e nas autoestradas a ${h.l(ae.media)}` : ''}. ${ae && hip ? `Entre a área de serviço e o hipermercado, um depósito de 50 litros custa ${h.eur((ae.media - hip.media) * 50, 2)} a mais.` : ''}</p>
<h2>As marcas mais presentes</h2>
<p>A rede do distrito é dominada pelas marcas de bandeira, mas as de preço baixo fazem a diferença nos mínimos. ${m.map((x) => `${x.marca} tem ${h.num(x.n)} postos com média de ${h.l(x.media)}`).join('; ')}. A página ${h.a('precos-por-marca', 'preços por marca')} faz a mesma comparação para todo o continente.</p>
<h2>Distritos vizinhos</h2>
<p>A sul do Tejo, o distrito de ${h.a('setubal', 'Setúbal')} tem hoje o gasóleo a ${h.l(h.D.statsDe('gs', 'Setúbal')!.media)} em média; a norte, ${h.a('leiria', 'Leiria')} está a ${h.l(h.D.statsDe('gs', 'Leiria')!.media)} e ${h.a('santarem', 'Santarém')} a ${h.l(h.D.statsDe('gs', 'Santarém')!.media)}. Para quem atravessa a ponte ou faz a A1 todos os dias, a escolha do lado onde abastece pode valer alguns cêntimos por litro.</p>`;
    },
  },
  en: {
    slug: 'lisbon', nav: 'Lisbon', card: 'Diesel and petrol in the 16 municipalities of Lisbon district, cheapest to dearest.',
    title: 'Diesel price in Lisbon today: average by area and stations',
    description: 'Diesel and petrol prices today in every municipality of Lisbon district, with the cheapest stations, their update time and the cost of a full tank. DGEG data.',
    h1: 'Fuel prices in Lisbon district today',
    intro: (h) => `Posted average in each municipality of the district and the cheapest stations, from the data ${h.num(h.D.postosDistrito(D).total)} stations report to the DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('gs', D)!, g = h.D.statsDe('g95', D)!, r = h.D.rankDistrito('gs', D), c = h.D.concelhosOrdenados('gs', D);
      return `In Lisbon district, standard diesel is posted today at ${h.l(s.media)} on average and standard petrol 95 at ${h.l(g.media)}, across ${h.num(s.n)} stations. Compared with the mainland average, diesel is ${h.c(h.D.desvioDistrito('gs', D), true)} a litre, which puts Lisbon ${h.ord(r.pos)} of the 18 districts from cheapest to dearest. The cheapest station in the district asks ${h.l(s.min)}. Between municipalities, the diesel average runs from ${h.l(c[0].media)} in ${c[0].concelho} to ${h.l(c[c.length - 1].media)} in ${c[c.length - 1].concelho}. On a 50-litre tank, filling up at the cheapest station rather than one at the district average saves ${h.eur((s.media - s.min) * 50, 2)}. Prices are those stations report to the DGEG, with each one’s last update time in the list. The calculator below starts on the whole district; choose a municipality to narrow the list, or switch fuel to see petrol, LPG or premium diesel in the same area.`;
    },
    faqs: (h) => [
      { q: 'Which municipality in Lisbon district has the cheapest diesel today?', a: (() => { const c = h.D.concelhosOrdenados('gs', D), l = h.D.statsDe('gs', D, 'Lisboa'); return `Today it is ${c[0].concelho}, with a posted average of ${h.l(c[0].media)} across ${h.num(c[0].n)} stations, followed by ${c[1].concelho} (${h.l(c[1].media)}). In Lisbon municipality itself the average is ${h.l(l!.media)}. The order changes from day to day, because each station changes its price when it likes; the table below is recomputed daily from DGEG data.`; })() },
      { q: 'How many motorway stations are there in Lisbon district?', a: `Today the DGEG lists ${h.num(h.D.postosDistrito(D).autoestrada)} motorway service-area stations in the district. They are usually the dearest, because the concession carries its own costs. If your trip allows, leaving the motorway to fill up at a nearby street or hypermarket station usually pays on a full tank.` },
      { q: 'Where can I find LPG in Lisbon district?', a: `${h.num(h.D.postosDistrito(D).gpl)} stations in the district report an LPG price to the DGEG. Pick LPG in the calculator and a municipality, and the list shows the five cheapest with their last update time. If a municipality does not appear, no station there sells LPG.` },
    ],
    body: (h) => {
      const c = h.D.concelhosOrdenados('gs', D), t = h.D.tipoDistrito('gs', D), m = h.D.marcasDistrito('gs', D, 6), p = h.D.postosDistrito(D);
      const ae = t['Auto-estrada'], hip = t['Área comercial (Hipermercados)'], rua = t['Outro'];
      return `<h2>Municipalities, cheapest to dearest</h2>
<p>The table ranks municipalities by the posted average for standard diesel. The lowest figure is the price at each municipality’s cheapest station, and the station count shows whether an average rests on many stations or on two or three.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel, posted price reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>Street, hypermarket or motorway</h2>
<p>The district has ${h.num(p.total)} stations in the register: ${h.num(p.rua)} street stations, ${h.num(p.hiper)} at shopping areas and ${h.num(p.autoestrada)} on motorways. ${hip ? `At hypermarket stations diesel averages ${h.l(hip.media)},` : ''} at street stations ${h.l(rua.media)}${ae ? ` and on motorways ${h.l(ae.media)}` : ''}. ${ae && hip ? `Between a service area and a hypermarket, a 50-litre tank costs ${h.eur((ae.media - hip.media) * 50, 2)} more.` : ''}</p>
<h2>The most common brands</h2>
<p>The district’s network is dominated by the major brands, but low-price ones make the difference at the bottom of the range. ${m.map((x) => `${x.marca} has ${h.num(x.n)} stations averaging ${h.l(x.media)}`).join('; ')}. The ${h.a('precos-por-marca', 'prices by brand')} page runs the same comparison for the whole mainland.</p>
<h2>Neighbouring districts</h2>
<p>South of the Tagus, ${h.a('setubal', 'Setúbal')} district has diesel at ${h.l(h.D.statsDe('gs', 'Setúbal')!.media)} on average today; to the north, ${h.a('leiria', 'Leiria')} is at ${h.l(h.D.statsDe('gs', 'Leiria')!.media)} and ${h.a('santarem', 'Santarém')} at ${h.l(h.D.statsDe('gs', 'Santarém')!.media)}. For anyone crossing the bridge or driving the A1 every day, choosing which side to fill up on can be worth a few cents a litre.</p>`;
    },
  },
});
