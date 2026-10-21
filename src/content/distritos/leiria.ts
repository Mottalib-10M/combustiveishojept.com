import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Leiria';
const LITROS = [40, 50, 60];

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), gpl = h.D.statsDe('gpl', D), gplC = h.D.statsDe('gpl');
  const c = h.D.concelhosOrdenados('gs', D);
  const lo = c[0], hi = c.length > 1 ? c[c.length - 1] : undefined;
  return { gs, g95, gpl, gplC, c, lo, hi, p: h.D.postosDistrito(D), rg: h.D.rankDistrito('gs', D) };
};

export default defineGuide({
  id: 'leiria', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['coimbra', 'santarem', 'lisboa', 'custo-deposito', 'preco-gpl-auto'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'leiria', nav: 'Leiria', card: 'O custo de um depósito em Leiria, a diferença entre concelhos, as marcas com mais postos e o GPL Auto no distrito.',
    title: 'Preço do gasóleo em Leiria hoje: concelhos e depósito',
    description: 'Preço do gasóleo e da gasolina hoje no distrito de Leiria: custo de um depósito cheio, concelho mais barato e mais caro, marcas e GPL Auto. Dados da DGEG.',
    h1: 'Gasóleo e gasolina no distrito de Leiria hoje',
    intro: (h) => `Quanto custa abastecer hoje nos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Leiria, com o preço afixado e a hora de atualização de cada posto.`,
    resume: (h) => {
      const { gs, g95, gpl, lo, hi, rg } = base(h);
      if (!gs || !g95) return `Hoje ainda não há preços suficientes comunicados à DGEG pelos postos do distrito de Leiria para calcular a média do gasóleo e da gasolina. A calculadora acima mostra o último preço de cada posto, com a hora a que foi enviado, e esta página volta a calcular a média, a diferença entre concelhos e o custo de um depósito cheio logo que a DGEG publique dados novos, o que acontece várias vezes por dia.`;
      return `O gasóleo simples está hoje a ${h.l(gs.media)} em média no distrito de Leiria, e a gasolina simples 95 a ${h.l(g95.media)}. Para um depósito de 50 litros de gasóleo, isso dá ${h.eur(gs.media * 50, 2)} a preço médio, ou ${h.eur(gs.min * 50, 2)} no posto mais barato do distrito, que pede ${h.l(gs.min)}. ${lo && hi ? `A diferença entre concelhos também conta: a média vai de ${h.l(lo.media)} em ${lo.concelho} até ${h.l(hi.media)} em ${hi.concelho}, ${h.c(hi.media - lo.media)} por litro de um extremo ao outro. ` : ''}Face à média do continente, o gasóleo do distrito está ${h.c(h.D.desvioDistrito('gs', D), true)}, o que o coloca em ${h.ord(rg.pos)} lugar entre ${h.num(rg.de)} distritos ordenados do mais barato para o mais caro. ${gpl ? `Quem anda a GPL Auto encontra-o em ${h.num(gpl.n)} postos, a ${h.l(gpl.media)} em média. ` : ''}Os preços são os que ${h.num(gs.n)} postos comunicam à DGEG; a hora de cada atualização está na lista.`;
    },
    faqs: (h) => {
      const { gs, gpl, gplC, lo, hi } = base(h);
      return [
        { q: 'Quanto custa hoje encher um depósito de 50 litros de gasóleo em Leiria?', a: gs ? `Ao preço médio do distrito de Leiria, ${h.l(gs.media)}, um depósito de 50 litros custa hoje ${h.eur(gs.media * 50, 2)}. No posto mais barato, a ${h.l(gs.min)}, fica por ${h.eur(gs.min * 50, 2)}; no mais caro, a ${h.l(gs.max)}, chega a ${h.eur(gs.max * 50, 2)}. A calculadora do custo do depósito faz a mesma conta para outros volumes e combustíveis.` : `Hoje não há preços de gasóleo suficientes no distrito de Leiria para fazer a conta. Quando os postos voltarem a comunicar à DGEG, o custo de um depósito de 50 litros ao preço médio e no posto mais barato aparece aqui.` },
        { q: 'Qual é a diferença de preço do gasóleo entre os concelhos do distrito de Leiria?', a: lo && hi ? `Hoje o concelho com a média mais baixa é ${lo.concelho}, a ${h.l(lo.media)}, e o da média mais alta é ${hi.concelho}, a ${h.l(hi.media)}. São ${h.c(hi.media - lo.media)} por litro, ou ${h.eur((hi.media - lo.media) * 50, 2)} num depósito de 50 litros. A comparação só inclui concelhos com dois postos ou mais, para que um único posto não distorça a média.` : `Hoje há poucos concelhos do distrito de Leiria com dois postos ou mais a comunicar preços, por isso não é possível comparar médias. A lista acima mostra, ainda assim, o preço de cada posto e a hora de atualização.` },
        { q: 'O GPL Auto em Leiria está mais barato do que no resto do continente?', a: gpl && gplC ? `A média do GPL Auto nos ${h.num(gpl.n)} postos do distrito de Leiria que o vendem é hoje ${h.l(gpl.media)}, contra ${h.l(gplC.media)} no continente, ou seja ${h.c(gpl.media - gplC.media, true)} por litro. O GPL varia muito de posto para posto, por isso compare a lista dos mais baratos, que a calculadora mostra ao escolher GPL Auto.` : `Hoje nenhum posto do distrito de Leiria comunicou preço de GPL Auto à DGEG, ou os dados não chegam para uma média. Escolha GPL Auto na calculadora para ver os postos que o vendem logo que haja preços novos.` },
      ];
    },
    body: (h) => {
      const { gs, gpl, c, lo, hi } = base(h);
      const m = h.D.marcasDistrito('gs', D, 5);
      return `<h2>Quanto custa encher o depósito em Leiria</h2>
<p>Um depósito cheio é a forma mais simples de ver o que valem alguns cêntimos por litro. A tabela compara três volumes comuns ao preço médio do distrito e no posto mais barato.</p>
${gs ? h.table(['Depósito', 'Preço médio', 'Posto mais barato', 'Poupança'], LITROS.map((v) => [`${v} litros`, h.eur(gs.media * v, 2), h.eur(gs.min * v, 2), h.eur((gs.media - gs.min) * v, 2)]), 'Gasóleo simples no distrito de Leiria, preços afixados de hoje', ['l', 'r', 'r', 'r']) : ''}
<h2>Do concelho mais barato ao mais caro</h2>
<p>${lo && hi ? `Entre ${lo.concelho} e ${hi.concelho}, a média do gasóleo separa-se ${h.c(hi.media - lo.media)} por litro. ` : ''}A ordem completa, com o preço mínimo de cada concelho, ajuda a escolher onde parar quando o trajeto passa por mais do que um. Contam apenas os concelhos com pelo menos dois postos a comunicar.</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho, do mais barato ao mais caro', ['l', 'r', 'r', 'r'])}
<h2>As marcas com mais postos no distrito</h2>
<p>${m.length ? `As cinco marcas mais presentes somam ${h.num(m.reduce((s, x) => s + x.n, 0))} postos com gasóleo. ${m.map((x) => `${x.marca}: ${h.num(x.n)} postos, ${h.l(x.media)} em média`).join('; ')}.` : ''} Para ver como as mesmas marcas se comportam no resto do país, consulte ${h.a('precos-por-marca', 'os preços por marca')}.</p>
<h2>GPL Auto e distritos próximos</h2>
<p>${gpl ? `O GPL Auto está à venda em ${h.num(gpl.n)} postos do distrito, entre ${h.l(gpl.min)} e ${h.l(gpl.max)}. ` : ''}Nos distritos vizinhos, o gasóleo simples está hoje em média a ${['Coimbra', 'Santarém', 'Lisboa'].map((n) => { const s = h.D.statsDe('gs', n); return s ? `${h.l(s.media)} em ${h.a(h.D.slug(n), n)}` : ''; }).filter(Boolean).join(', ')}. A evolução do GPL ao longo do ano está na página ${h.a('preco-gpl-auto', 'preço do GPL Auto')}.</p>
<p>${(() => { const s = h.D.statsDe('g95', D, 'Leiria'), d = h.D.statsDe('g95', D), b = h.D.baratos('g95', 1, D)[0]; return s && d ? `Na gasolina simples 95, o concelho de Leiria, sede do distrito, tem média de ${h.l(s.media)} em ${h.num(s.n)} postos, ${h.c(s.media - d.media, true)} face ao distrito.${b ? ` O litro de gasolina 95 mais barato está hoje em ${b.concelho}, a ${h.l(b.preco)}.` : ''} Para quem tem carro a gasolina, a ordem dos concelhos pode não coincidir com a do gasóleo.` : ''; })()}</p>`;
    },
  },
  en: {
    slug: 'leiria', nav: 'Leiria', card: 'The cost of a full tank in Leiria, the gap between municipalities, the brands with most stations and LPG in the district.',
    title: 'Diesel price in Leiria today: municipalities and full tank',
    description: 'Diesel and petrol prices today in Leiria district: the cost of a full tank, the cheapest and dearest municipality, the main brands and LPG. Official DGEG data.',
    h1: 'Diesel and petrol in Leiria district today',
    intro: (h) => `What it costs to fill up today across the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Leiria district, with each station’s posted price and update time.`,
    resume: (h) => {
      const { gs, g95, gpl, lo, hi, rg } = base(h);
      if (!gs || !g95) return `Stations in Leiria district have not yet reported enough prices to the DGEG today to compute an average for diesel and petrol. The calculator above shows each station’s last price with the time it was sent, and this page recomputes the average, the gap between municipalities and the cost of a full tank as soon as the DGEG publishes new data, which happens several times a day.`;
      return `Standard diesel averages ${h.l(gs.media)} today in Leiria district, and standard petrol 95 averages ${h.l(g95.media)}. For a 50-litre tank of diesel, that means ${h.eur(gs.media * 50, 2)} at the average price, or ${h.eur(gs.min * 50, 2)} at the district’s cheapest station, which asks ${h.l(gs.min)}. ${lo && hi ? `Where you fill up within the district matters too: the average runs from ${h.l(lo.media)} in ${lo.concelho} to ${h.l(hi.media)} in ${hi.concelho}, ${h.c(hi.media - lo.media)} a litre from one end to the other. ` : ''}Against the mainland average, diesel in the district is ${h.c(h.D.desvioDistrito('gs', D), true)}, which ranks it ${h.ord(rg.pos)} of ${h.num(rg.de)} districts ordered from cheapest to dearest. ${gpl ? `LPG drivers will find it at ${h.num(gpl.n)} stations, at ${h.l(gpl.media)} on average. ` : ''}Prices are those ${h.num(gs.n)} stations report to the DGEG, so they reflect what is posted at the pump rather than a national estimate; each station’s update time is shown in the list.`;
    },
    faqs: (h) => {
      const { gs, gpl, gplC, lo, hi } = base(h);
      return [
        { q: 'How much does a 50-litre tank of diesel cost in Leiria today?', a: gs ? `At the Leiria district average of ${h.l(gs.media)}, a 50-litre tank costs ${h.eur(gs.media * 50, 2)} today. At the cheapest station, at ${h.l(gs.min)}, it comes to ${h.eur(gs.min * 50, 2)}; at the dearest, at ${h.l(gs.max)}, it reaches ${h.eur(gs.max * 50, 2)}. Our full-tank cost calculator runs the same sum for other volumes and fuels.` : `There are not enough diesel prices in Leiria district today to do the sum. Once stations report to the DGEG again, the cost of a 50-litre tank at the average price and at the cheapest station appears here.` },
        { q: 'How much does diesel vary between municipalities in Leiria district?', a: lo && hi ? `Today the municipality with the lowest average is ${lo.concelho}, at ${h.l(lo.media)}, and the one with the highest is ${hi.concelho}, at ${h.l(hi.media)}. That is ${h.c(hi.media - lo.media)} a litre, or ${h.eur((hi.media - lo.media) * 50, 2)} on a 50-litre tank. Only municipalities with two or more stations are compared, so that a single station does not skew the average.` : `Few municipalities in Leiria district have two or more stations reporting prices today, so their averages cannot be compared. The list above still shows each station’s price and update time.` },
        { q: 'Is LPG in Leiria cheaper than across the rest of the mainland?', a: gpl && gplC ? `LPG averages ${h.l(gpl.media)} today at the ${h.num(gpl.n)} stations in Leiria district that sell it, against ${h.l(gplC.media)} on the mainland, a difference of ${h.c(gpl.media - gplC.media, true)} a litre. LPG prices vary a lot between stations, so compare the list of the cheapest, which the calculator shows when you pick LPG.` : `No station in Leiria district has reported an LPG price to the DGEG today, or there are too few for an average. Pick LPG in the calculator to see the stations that sell it as soon as new prices arrive.` },
      ];
    },
    body: (h) => {
      const { gs, gpl, c, lo, hi } = base(h);
      const m = h.D.marcasDistrito('gs', D, 5);
      return `<h2>What a full tank costs in Leiria</h2>
<p>A full tank is the simplest way to see what a few cents a litre are worth. The table compares three common volumes at the district average and at the cheapest station.</p>
${gs ? h.table(['Tank', 'Average price', 'Cheapest station', 'Saving'], LITROS.map((v) => [`${v} litres`, h.eur(gs.media * v, 2), h.eur(gs.min * v, 2), h.eur((gs.media - gs.min) * v, 2)]), 'Standard diesel in Leiria district, today’s posted prices', ['l', 'r', 'r', 'r']) : ''}
<h2>From the cheapest municipality to the dearest</h2>
<p>${lo && hi ? `Between ${lo.concelho} and ${hi.concelho}, the diesel average is ${h.c(hi.media - lo.media)} a litre apart. ` : ''}The full order, with each municipality’s lowest price, helps you choose where to stop when your route crosses more than one. Only municipalities with at least two reporting stations are included.</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality, cheapest to dearest', ['l', 'r', 'r', 'r'])}
<h2>The brands with most stations in the district</h2>
<p>${m.length ? `The five most common brands account for ${h.num(m.reduce((s, x) => s + x.n, 0))} diesel stations. ${m.map((x) => `${x.marca}: ${h.num(x.n)} stations, ${h.l(x.media)} on average`).join('; ')}.` : ''} To see how the same brands compare across the country, have a look at ${h.a('precos-por-marca', 'prices by brand')}.</p>
<h2>LPG and nearby districts</h2>
<p>${gpl ? `LPG is on sale at ${h.num(gpl.n)} stations in the district, between ${h.l(gpl.min)} and ${h.l(gpl.max)}. ` : ''}In neighbouring districts, standard diesel averages ${['Coimbra', 'Santarém', 'Lisboa'].map((n) => { const s = h.D.statsDe('gs', n); return s ? `${h.l(s.media)} in ${h.a(h.D.slug(n), n === 'Lisboa' ? 'Lisbon' : n)}` : ''; }).filter(Boolean).join(', ')} today. How LPG has moved over the year is on the ${h.a('preco-gpl-auto', 'LPG price')} page.</p>
<p>${(() => { const s = h.D.statsDe('g95', D, 'Leiria'), d = h.D.statsDe('g95', D), b = h.D.baratos('g95', 1, D)[0]; return s && d ? `For standard petrol 95, Leiria municipality, seat of the district, averages ${h.l(s.media)} across ${h.num(s.n)} stations, ${h.c(s.media - d.media, true)} against the district.${b ? ` The cheapest litre of petrol 95 is in ${b.concelho} today, at ${h.l(b.preco)}.` : ''} If you drive a petrol car, the order of municipalities may not match the diesel one.` : ''; })()}</p>`;
    },
  },
});
