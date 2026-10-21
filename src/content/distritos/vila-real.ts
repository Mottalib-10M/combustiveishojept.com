import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Vila Real';
const VIZ = [['braga', 'Braga'], ['porto', 'Porto'], ['viseu', 'Viseu'], ['braganca', 'Bragança']] as const;

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), g95e = h.D.statsDe('g95e', D), gpl = h.D.statsDe('gpl', D);
  const c = h.D.concelhosOrdenados('gs', D);
  return { gs, g95, g95e, gpl, c, lo: c[0], hi: c.length > 1 ? c[c.length - 1] : undefined, listaGpl: h.D.baratos('gpl', 12, D), p: h.D.postosDistrito(D), rg: h.D.rankDistrito('gs', D), rp: h.D.rankDistrito('g95', D) };
};

export default defineGuide({
  id: 'vila-real', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['braga', 'braganca', 'viseu', 'preco-gpl-auto', 'preco-gasolina-95'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'vila-real', nav: 'Vila Real', card: 'Gasóleo e gasolina em Vila Real, os poucos postos com GPL Auto e quanto muda um depósito de um concelho para outro.',
    title: 'Gasolina e gasóleo em Vila Real hoje: preços por concelho',
    description: 'Gasolina e gasóleo em Vila Real hoje: média de cada concelho, a lista dos postos com GPL Auto, a gasolina especial e os distritos vizinhos. Dados da DGEG.',
    h1: 'Combustíveis em Vila Real hoje',
    intro: (h) => `Preços afixados hoje nos ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Vila Real, com destaque para a gasolina e para o GPL Auto, que poucos postos vendem.`,
    resume: (h) => {
      const { gs, g95, gpl, lo, hi, p, rg, rp } = base(h);
      if (!gs || !g95) return `Os postos do distrito de Vila Real ainda não comunicaram hoje à DGEG preços suficientes para uma média de gasolina e de gasóleo. A lista acima mostra o último preço de cada posto e a hora a que foi enviado. A média de cada concelho, os postos com GPL Auto e a comparação com os distritos vizinhos voltam logo que a DGEG publique dados novos.`;
      return `Em Vila Real, a gasolina simples 95 custa hoje em média ${h.l(g95.media)} e o gasóleo simples ${h.l(gs.media)}. Para quem conduz um carro a gasolina, o distrito está ${h.c(h.D.desvioDistrito('g95', D), true)} face à média do continente e ocupa o ${h.ord(rp.pos)} lugar entre ${h.num(rp.de)} distritos, contando do mais barato; para quem conduz a gasóleo, a diferença é de ${h.c(h.D.desvioDistrito('gs', D), true)} e o lugar é o ${h.ord(rg.pos)}. ${lo && hi ? `Dentro do distrito, um depósito de 50 litros de gasóleo custa em média ${h.eur(lo.media * 50, 2)} em ${lo.concelho} e ${h.eur(hi.media * 50, 2)} em ${hi.concelho}. ` : ''}${gpl ? `${gpl.n / p.total < 0.1 ? 'O GPL Auto é raro: só' : 'O GPL Auto existe em'} ${h.num(gpl.n)} dos ${h.num(p.total)} postos o vendem, a ${h.l(gpl.media)} em média, e a lista está mais abaixo. ` : `Nenhum dos ${h.num(p.total)} postos comunica hoje preço de GPL Auto. `}O distrito tem ${h.num(p.autoestrada)} postos de autoestrada e ${p.hiper ? `${h.num(p.hiper)} em áreas comerciais` : 'nenhum em áreas comerciais'}. Os preços vêm da DGEG e são atualizados pelos próprios postos.`;
    },
    faqs: (h) => {
      const { gpl, listaGpl, g95, hi, c } = base(h);
      return [
        { q: 'Onde se pode abastecer GPL Auto no distrito de Vila Real?', a: gpl && listaGpl.length ? `Hoje ${h.num(gpl.n)} postos do distrito de Vila Real comunicam preço de GPL Auto à DGEG, nos concelhos de ${[...new Set(listaGpl.map((x) => x.concelho))].join(', ')}. O mais barato é ${listaGpl[0].nome}, a ${h.l(listaGpl[0].preco)}. Antes de uma viagem, convém confirmar o percurso: a tabela desta página mostra todos, com o preço e a hora.` : `Hoje nenhum posto do distrito de Vila Real comunicou preço de GPL Auto à DGEG. Os distritos vizinhos podem ter mais oferta; escolha GPL Auto na calculadora e mude de distrito para ver os postos mais próximos.` },
        { q: 'Em Vila Real, a gasolina está mais cara do que no resto do continente?', a: g95 ? `Hoje a gasolina simples 95 está a ${h.l(g95.media)} em média no distrito de Vila Real, ${h.c(Math.abs(h.D.desvioDistrito('g95', D)))} ${h.D.desvioDistrito('g95', D) < 0 ? 'abaixo' : 'acima'} da média do continente. A diferença entre distritos é pequena e muda de dia para dia; o intervalo entre postos dentro do distrito, de ${h.l(g95.min)} a ${h.l(g95.max)}, é bem maior.` : `Hoje não há preços suficientes de gasolina 95 no distrito de Vila Real para o comparar com o continente. A comparação volta a ser calculada quando os postos comunicarem novos preços à DGEG.` },
        { q: 'Qual é o concelho do distrito de Vila Real com o gasóleo mais caro hoje?', a: hi ? `Hoje é ${hi.concelho}, com uma média de ${h.l(hi.media)} em ${h.num(hi.n)} postos. A comparação inclui apenas os ${h.num(c.length)} concelhos com dois postos ou mais, para que um único preço não decida a ordem. A tabela da página mostra todos, com o preço mais baixo de cada um, e é recalculada a cada atualização da DGEG.` : `Hoje há poucos concelhos do distrito de Vila Real com dois postos ou mais a comunicar preços, por isso não é possível apontar o mais caro. A lista acima mostra o preço de cada posto.` },
      ];
    },
    body: (h) => {
      const { gs, g95, g95e, lo, hi, c, listaGpl } = base(h);
      return `<h2>Os postos com GPL Auto</h2>
<p>A tabela mostra os postos do distrito que vendem GPL Auto, até doze, do mais barato para o mais caro, porque quem anda a GPL precisa de saber onde fica cada um. A página do ${h.a('preco-gpl-auto', 'preço do GPL Auto')} compara este combustível com a média nacional.</p>
${listaGpl.length ? h.table(['Posto', 'Concelho', 'Preço'], listaGpl.map((x) => [x.nome, x.concelho, h.l(x.preco)]), 'Postos com GPL Auto no distrito de Vila Real', ['l', 'l', 'r']) : ''}
<h2>O concelho muda a conta do depósito</h2>
<p>${lo && hi && gs ? `Entre ${lo.concelho} e ${hi.concelho}, a média do gasóleo afasta-se ${h.c(hi.media - lo.media)} por litro: ${h.eur((hi.media - lo.media) * 50, 2)} num depósito de 50 litros. A média do distrito, ${h.l(gs.media)}, fica entre as duas.` : ''} A tabela inclui os concelhos com dois postos ou mais.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho, do mais barato ao mais caro', ['l', 'r', 'r', 'r'])}
<h2>Gasolina simples ou especial</h2>
<p>${g95 && g95e ? `A gasolina especial 95 está à venda em ${h.num(g95e.n)} postos, a ${h.l(g95e.media)} em média, contra ${h.l(g95.media)} da simples em ${h.num(g95.n)} postos. São ${h.c(g95e.media - g95.media)} por litro de diferença.` : 'Hoje não há preços suficientes para comparar as duas gasolinas.'} A evolução da gasolina no continente está na página da ${h.a('preco-gasolina-95', 'gasolina 95')}.</p>
<h2>Braga, Porto, Viseu e Bragança</h2>
<p>Vila Real faz fronteira com Espanha e com estes quatro distritos. A gasolina simples 95 está hoje em média a ${VIZ.map(([id, n]) => { const s = h.D.statsDe('g95', n); return s ? `${h.l(s.media)} ${n === 'Porto' ? 'no' : 'em'} ${h.a(id, n)}` : ''; }).filter(Boolean).join(', ')}${(() => { const s = h.D.statsDe('g95', D); return s ? `, contra ${h.l(s.media)} em Vila Real` : ''; })()}.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Vila Real'), b = h.D.baratos('gs', 1, D)[0]; return `${b ? `O gasóleo simples mais barato do distrito está hoje em ${b.nome}, no concelho de ${b.concelho}, a ${h.l(b.preco)}. ` : ''}${s ? `No concelho de Vila Real, capital do distrito, a média é de ${h.l(s.media)} em ${h.num(s.n)} postos.` : ''} Quem atravessa o distrito pode comparar estes valores com os dos vizinhos antes de decidir onde parar.`; })()}</p>`;
    },
  },
  en: {
    slug: 'vila-real', nav: 'Vila Real', card: 'Petrol and diesel in Vila Real, the few stations that sell LPG and how much a tank changes from one municipality to another.',
    title: 'Petrol and diesel in Vila Real today: prices by area',
    description: 'Petrol and diesel in Vila Real today: the average in each municipality, the list of LPG stations, premium petrol and the neighbouring districts. DGEG data.',
    h1: 'Fuel prices in Vila Real today',
    intro: (h) => `Today’s posted prices at the ${h.num(h.D.postosDistrito(D).total)} stations of Vila Real district, with a closer look at petrol and at LPG, which few stations sell.`,
    resume: (h) => {
      const { gs, g95, gpl, lo, hi, p, rg, rp } = base(h);
      if (!gs || !g95) return `Stations in Vila Real district have not yet reported enough prices to the DGEG today for a petrol and diesel average. The list above shows each station’s last price and the time it was sent. Each municipality’s average, the LPG stations and the comparison with neighbouring districts come back as soon as the DGEG publishes new data.`;
      return `In Vila Real, standard petrol 95 costs ${h.l(g95.media)} on average today and standard diesel ${h.l(gs.media)}. For a petrol car, the district is ${h.c(h.D.desvioDistrito('g95', D), true)} against the mainland average and ranks ${h.ord(rp.pos)} of ${h.num(rp.de)} districts, counting from the cheapest; for a diesel car, the gap is ${h.c(h.D.desvioDistrito('gs', D), true)} and the rank ${h.ord(rg.pos)}. ${lo && hi ? `Within the district, a 50-litre tank of diesel costs ${h.eur(lo.media * 50, 2)} on average in ${lo.concelho} and ${h.eur(hi.media * 50, 2)} in ${hi.concelho}. ` : ''}${gpl ? `${gpl.n / p.total < 0.1 ? 'LPG is scarce: only' : 'LPG is available at'} ${h.num(gpl.n)} of the ${h.num(p.total)} stations sell it, at ${h.l(gpl.media)} on average, and they are listed further down. ` : `None of the ${h.num(p.total)} stations reports an LPG price today. `}The district has ${h.num(p.autoestrada)} motorway stations and ${p.hiper ? `${h.num(p.hiper)} at shopping areas` : 'none at shopping areas'}. Prices come from the DGEG and are updated by the stations themselves, so a figure may change several times before the end of the day; the list above shows when each station last updated.`;
    },
    faqs: (h) => {
      const { gpl, listaGpl, g95, hi, c } = base(h);
      return [
        { q: 'Where can you buy LPG in Vila Real district?', a: gpl && listaGpl.length ? `Today ${h.num(gpl.n)} stations in Vila Real district report an LPG price to the DGEG, in the municipalities of ${[...new Set(listaGpl.map((x) => x.concelho))].join(', ')}. The cheapest is ${listaGpl[0].nome}, at ${h.l(listaGpl[0].preco)}. Before a trip, it is worth planning your route: the table on this page lists them all, with price and time.` : `No station in Vila Real district has reported an LPG price to the DGEG today. Neighbouring districts may have more; pick LPG in the calculator and switch district to see the nearest stations.` },
        { q: 'Is petrol in Vila Real dearer than across the rest of the mainland?', a: g95 ? `Today standard petrol 95 averages ${h.l(g95.media)} in Vila Real district, ${h.c(Math.abs(h.D.desvioDistrito('g95', D)))} ${h.D.desvioDistrito('g95', D) < 0 ? 'below' : 'above'} the mainland average. Gaps between districts are small and change daily; the range between stations within the district, from ${h.l(g95.min)} to ${h.l(g95.max)}, is much wider, so where you fill up counts for more.` : `There are not enough petrol 95 prices in Vila Real district today to compare it with the mainland. The comparison is recomputed once stations report new prices to the DGEG.` },
        { q: 'Which municipality in Vila Real district has the dearest diesel today?', a: hi ? `Today it is ${hi.concelho}, with an average of ${h.l(hi.media)} across ${h.num(hi.n)} stations. The comparison covers only the ${h.num(c.length)} municipalities with two stations or more, so that a single price does not decide the order. The table on this page shows them all, with each one’s lowest price, and is recomputed at every DGEG update.` : `Few municipalities in Vila Real district have two or more stations reporting prices today, so the dearest cannot be named. The list above shows each station’s price.` },
      ];
    },
    body: (h) => {
      const { gs, g95, g95e, lo, hi, c, listaGpl } = base(h);
      return `<h2>The stations that sell LPG</h2>
<p>The table lists the district’s LPG stations, up to twelve, from cheapest to dearest, because anyone running on LPG needs to know where each one is. The ${h.a('preco-gpl-auto', 'LPG price')} page compares this fuel with the national average.</p>
${listaGpl.length ? h.table(['Station', 'Municipality', 'Price'], listaGpl.map((x) => [x.nome, x.concelho, h.l(x.preco)]), 'LPG stations in Vila Real district', ['l', 'l', 'r']) : ''}
<h2>The municipality changes the cost of a tank</h2>
<p>${lo && hi && gs ? `Between ${lo.concelho} and ${hi.concelho}, the diesel average is ${h.c(hi.media - lo.media)} a litre apart: ${h.eur((hi.media - lo.media) * 50, 2)} on a 50-litre tank. The district average, ${h.l(gs.media)}, sits between the two.` : ''} The table covers municipalities with two stations or more.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality, cheapest to dearest', ['l', 'r', 'r', 'r'])}
<h2>Standard or premium petrol</h2>
<p>${g95 && g95e ? `Premium petrol 95 is on sale at ${h.num(g95e.n)} stations, at ${h.l(g95e.media)} on average, against ${h.l(g95.media)} for standard at ${h.num(g95.n)} stations. That is ${h.c(g95e.media - g95.media)} a litre between them.` : 'There are not enough prices today to compare the two grades of petrol.'} How petrol has moved on the mainland is on the ${h.a('preco-gasolina-95', 'petrol 95')} page.</p>
<h2>Braga, Porto, Viseu and Bragança</h2>
<p>Vila Real borders Spain and these four districts. Standard petrol 95 averages ${VIZ.map(([id, n]) => { const s = h.D.statsDe('g95', n); return s ? `${h.l(s.media)} in ${h.a(id, n)}` : ''; }).filter(Boolean).join(', ')} today${(() => { const s = h.D.statsDe('g95', D); return s ? `, against ${h.l(s.media)} in Vila Real` : ''; })()}.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Vila Real'), b = h.D.baratos('gs', 1, D)[0]; return `${b ? `The cheapest standard diesel in the district today is at ${b.nome}, in the municipality of ${b.concelho}, at ${h.l(b.preco)}. ` : ''}${s ? `In Vila Real municipality, the district capital, the average is ${h.l(s.media)} across ${h.num(s.n)} stations.` : ''} If you are crossing the district, compare these figures with the neighbours before deciding where to stop.`; })()}</p>`;
    },
  },
});
