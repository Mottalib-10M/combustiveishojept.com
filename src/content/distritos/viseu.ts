import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Viseu';
const VIZ = [['porto', 'Porto'], ['aveiro', 'Aveiro'], ['coimbra', 'Coimbra'], ['guarda', 'Guarda'], ['vila-real', 'Vila Real']] as const;

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), g98 = h.D.statsDe('g98', D), cont = h.D.statsDe('gs');
  const pc = h.D.porConcelho('gs', D);
  const todos = Object.entries(pc).map(([concelho, s]) => ({ concelho, ...s })).sort((a, b) => a.media - b.media);
  const abaixo = cont ? todos.filter((x) => x.media < cont.media).length : 0;
  const unico = todos.filter((x) => x.n === 1).map((x) => x.concelho).sort((a, b) => a.localeCompare(b, 'pt'));
  const grupo = [{ id: 'viseu', n: D, s: gs }, ...VIZ.map(([id, n]) => ({ id, n, s: h.D.statsDe('gs', n) }))].filter((x) => x.s).sort((a, b) => a.s!.media - b.s!.media);
  return { gs, g95, g98, cont, todos, abaixo, unico, grupo, posGrupo: grupo.findIndex((x) => x.n === D) + 1, c98: Object.keys(h.D.porConcelho('g98', D)).length, p: h.D.postosDistrito(D), rg: h.D.rankDistrito('gs', D) };
};

export default defineGuide({
  id: 'viseu', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['coimbra', 'aveiro', 'guarda', 'preco-gasolina-98', 'historico-precos'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'viseu', nav: 'Viseu', card: 'Os concelhos de Viseu face à média do continente, a gasolina 98 no distrito e a comparação com os cinco distritos vizinhos.',
    title: 'Gasóleo em Viseu hoje: média do distrito e dos concelhos',
    description: 'Gasóleo e gasolina em Viseu hoje: cada concelho face à média do continente, onde há gasolina 98, concelhos com um só posto e os cinco distritos vizinhos.',
    h1: 'Preço do gasóleo e da gasolina em Viseu hoje',
    intro: (h) => `Cada um dos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Viseu comparado com a média do continente, a partir dos preços que ${h.num(h.D.postosDistrito(D).total)} postos comunicam à DGEG.`,
    resume: (h) => {
      const { gs, g95, cont, todos, abaixo, posGrupo, grupo, p, rg } = base(h);
      if (!gs || !g95) return `Hoje ainda não há preços suficientes dos postos do distrito de Viseu na DGEG para calcular as médias do gasóleo e da gasolina. A lista acima mostra o último preço de cada posto e a hora a que foi comunicado. A comparação de cada concelho com o continente e com os distritos vizinhos é refeita logo que a DGEG publique dados novos, várias vezes por dia.`;
      return `O preço médio do gasóleo simples no distrito de Viseu é hoje ${h.l(gs.media)}, e o da gasolina simples 95 ${h.l(g95.media)}. ${cont ? `Para uma referência nacional, a média do gasóleo no continente está em ${h.l(cont.media)}, ${h.c(Math.abs(gs.media - cont.media))} ${gs.media < cont.media ? 'acima' : 'abaixo'} da de Viseu. ` : ''}O distrito tem muitos concelhos: dos ${h.num(todos.length)} concelhos com postos a vender gasóleo, ${h.num(abaixo)} estão hoje abaixo da média do continente e ${h.num(todos.length - abaixo)} ao nível dela ou acima. Entre Viseu e os cinco distritos com que confina, Viseu é o ${h.ord(posGrupo)} mais barato dos ${h.num(grupo.length)}; no conjunto dos ${h.num(rg.de)} distritos é o ${h.ord(rg.pos)}. A rede soma ${h.num(p.total)} postos, ${h.num(p.gpl)} deles com GPL Auto. No posto mais barato do distrito, a ${h.l(gs.min)}, um depósito de 50 litros fica ${h.eur((gs.media - gs.min) * 50, 2)} abaixo do preço médio, uma diferença que, repetida todas as semanas, pesa no orçamento do ano.`;
    },
    faqs: (h) => {
      const { abaixo, todos, cont, g95, g98, c98, p, grupo, gs } = base(h);
      const porto = grupo.find((x) => x.n === 'Porto'), coimbra = grupo.find((x) => x.n === 'Coimbra');
      return [
        { q: 'Quantos concelhos do distrito de Viseu têm o gasóleo abaixo da média do continente?', a: cont ? `Hoje são ${h.num(abaixo)} dos ${h.num(todos.length)} concelhos do distrito de Viseu com postos a vender gasóleo simples, tendo como referência a média do continente de ${h.l(cont.media)}. ${todos[0] ? `A média mais baixa é a de ${todos[0].concelho}, com ${h.l(todos[0].media)}.` : ''} A tabela desta página mostra a diferença de cada concelho, em cêntimos por litro, e é recalculada a cada atualização.` : `Hoje não há dados suficientes para calcular a média do continente. Logo que a DGEG publique novos preços, a contagem dos concelhos do distrito de Viseu abaixo e acima da média reaparece aqui.` },
        { q: 'Onde se encontra gasolina 98 no distrito de Viseu?', a: g98 ? `Hoje ${h.num(g98.n)} postos do distrito de Viseu vendem gasolina 98, em ${h.num(c98)} dos ${h.num(p.concelhos)} concelhos, a ${h.l(g98.media)} em média${g95 ? `, ${h.c(g98.media - g95.media)} acima da gasolina simples 95` : ''}. Escolha Gasolina 98 na calculadora acima e o concelho para ver os postos mais baratos, com morada e hora de atualização.` : `Hoje nenhum posto do distrito de Viseu comunicou preço de gasolina 98 à DGEG. Escolha Gasolina 98 na calculadora acima para ver os postos que a vendem logo que haja novos preços.` },
        { q: 'Abastecer em Viseu sai mais barato do que no Porto ou em Coimbra?', a: gs && porto?.s && coimbra?.s ? `Hoje o gasóleo simples custa em média ${h.l(gs.media)} em Viseu, ${h.l(porto.s.media)} no Porto e ${h.l(coimbra.s.media)} em Coimbra. Face ao Porto, Viseu está ${h.c(gs.media - porto.s.media, true)} por litro; face a Coimbra, ${h.c(gs.media - coimbra.s.media, true)}. São diferenças pequenas, que mudam de sinal com frequência: o posto escolhido pesa mais.` : `Hoje não há preços suficientes para comparar Viseu com o Porto e Coimbra. A comparação reaparece quando os postos dos três distritos enviarem novos preços à DGEG.` },
      ];
    },
    body: (h) => {
      const { cont, todos, unico, grupo, g98, g95, c98 } = base(h);
      return `<h2>Cada concelho face ao continente</h2>
<p>Em vez de comparar os concelhos entre si, a tabela compara cada um com a média do gasóleo simples em todo o continente${cont ? `, hoje ${h.l(cont.media)}` : ''}. Um valor negativo indica um concelho mais barato do que a média nacional. Os concelhos com um só posto entram na tabela, mas a média deles é o preço desse posto.</p>
${cont ? h.table(['Concelho', 'Postos', 'Média', 'Face ao continente'], todos.map((x) => [x.concelho, x.n, h.l(x.media), h.c(x.media - cont.media, true)]), 'Gasóleo simples no distrito de Viseu, por concelho', ['l', 'r', 'r', 'r']) : ''}
<h2>Concelhos com um único posto</h2>
<p>${unico.length ? `Em ${unico.length > 1 ? `${unico.slice(0, -1).join(', ')} e ${unico[unico.length - 1]}` : unico[0]}, a DGEG só tem hoje um posto a comunicar preço de gasóleo. Nesses concelhos não há escolha local, e um posto do concelho ao lado pode valer o desvio.` : 'Hoje todos os concelhos do distrito com postos têm pelo menos dois a comunicar preço de gasóleo.'} A calculadora acima permite escolher o concelho e ver os cinco postos mais baratos.</p>
<h2>Gasolina 98 no distrito</h2>
<p>${g98 ? `${h.num(g98.n)} postos em ${h.num(c98)} concelhos vendem gasolina 98, a ${h.l(g98.media)} em média${g95 ? ` contra ${h.l(g95.media)} da 95 simples` : ''}.` : 'Hoje não há preços de gasolina 98 no distrito.'} A página da ${h.a('preco-gasolina-98', 'gasolina 98')} acompanha o preço deste combustível, e o ${h.a('historico-precos', 'histórico de preços')} mostra a evolução de todos os combustíveis.</p>
<h2>Viseu entre cinco distritos</h2>
<p>Ordenados pela média do gasóleo simples, do mais barato para o mais caro, Viseu e os distritos que o rodeiam ficam hoje assim: ${grupo.map((x) => `${x.id === 'viseu' ? x.n : h.a(x.id, x.n)} (${h.l(x.s!.media)})`).join(', ')}.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Viseu'), ge = h.D.statsDe('ge', D), gs = h.D.statsDe('gs', D); return `${s ? `O concelho de Viseu, onde fica a capital do distrito, reúne ${h.num(s.n)} postos com gasóleo, a ${h.l(s.media)} em média. ` : ''}${ge && gs ? `Quem prefere o gasóleo especial paga no distrito ${h.l(ge.media)} em média, ${h.c(ge.media - gs.media)} a mais por litro do que pelo simples.` : ''}`; })()}</p>`;
    },
  },
  en: {
    slug: 'viseu', nav: 'Viseu', card: 'The municipalities of Viseu against the mainland average, petrol 98 in the district and how it compares with its five neighbours.',
    title: 'Diesel in Viseu today: district and municipality averages',
    description: 'Diesel and petrol in Viseu today: each municipality against the mainland average, where to buy petrol 98, single-station areas and the five nearby districts.',
    h1: 'Diesel and petrol prices in Viseu today',
    intro: (h) => `Each of the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Viseu district set against the mainland average, from the prices ${h.num(h.D.postosDistrito(D).total)} stations report to the DGEG.`,
    resume: (h) => {
      const { gs, g95, cont, todos, abaixo, posGrupo, grupo, p, rg } = base(h);
      if (!gs || !g95) return `There are not yet enough prices from stations in Viseu district at the DGEG today to work out diesel and petrol averages. The list above shows each station’s last price and the time it was reported. The comparison of each municipality with the mainland and with neighbouring districts is redone as soon as the DGEG publishes new data, several times a day.`;
      return `The average price of standard diesel in Viseu district today is ${h.l(gs.media)}, and of standard petrol 95 ${h.l(g95.media)}. ${cont ? `As a national benchmark, the mainland diesel average stands at ${h.l(cont.media)}, ${h.c(Math.abs(gs.media - cont.media))} ${gs.media < cont.media ? 'above' : 'below'} Viseu’s. ` : ''}The district has many municipalities: of the ${h.num(todos.length)} municipalities with stations selling diesel, ${h.num(abaixo)} are below the mainland average today and ${h.num(todos.length - abaixo)} at or above it. Among Viseu and the five districts it borders, Viseu is ${h.ord(posGrupo)} cheapest of ${h.num(grupo.length)}; across all ${h.num(rg.de)} districts it is ${h.ord(rg.pos)}. The network counts ${h.num(p.total)} stations, ${h.num(p.gpl)} of them with LPG. At the district’s cheapest station, at ${h.l(gs.min)}, a 50-litre tank comes to ${h.eur((gs.media - gs.min) * 50, 2)} less than at the average price, which on a weekly fill-up adds up over a year. Every figure is recomputed from the DGEG file at each update.`;
    },
    faqs: (h) => {
      const { abaixo, todos, cont, g95, g98, c98, p, grupo, gs } = base(h);
      const porto = grupo.find((x) => x.n === 'Porto'), coimbra = grupo.find((x) => x.n === 'Coimbra');
      return [
        { q: 'How many municipalities in Viseu district have diesel below the mainland average?', a: cont ? `Today it is ${h.num(abaixo)} of the ${h.num(todos.length)} municipalities in Viseu district with stations selling standard diesel, measured against the mainland average of ${h.l(cont.media)}. ${todos[0] ? `The lowest average is in ${todos[0].concelho}, at ${h.l(todos[0].media)}.` : ''} The table on this page shows each municipality’s gap in cents a litre and is recomputed at every update.` : `There are not enough data today to compute the mainland average. Once the DGEG publishes new prices, the count of municipalities in Viseu district below and above the average comes back here.` },
        { q: 'Where can you find petrol 98 in Viseu district?', a: g98 ? `Today ${h.num(g98.n)} stations in Viseu district sell petrol 98, in ${h.num(c98)} of its ${h.num(p.concelhos)} municipalities, at ${h.l(g98.media)} on average${g95 ? `, ${h.c(g98.media - g95.media)} above standard petrol 95` : ''}. Pick Petrol 98 and a municipality in the calculator above to see the cheapest stations, with address and update time.` : `No station in Viseu district has reported a petrol 98 price to the DGEG today. Pick Petrol 98 in the calculator above to see the stations that sell it once new prices arrive.` },
        { q: 'Is it cheaper to fill up in Viseu than in Porto or Coimbra?', a: gs && porto?.s && coimbra?.s ? `Today standard diesel averages ${h.l(gs.media)} in Viseu, ${h.l(porto.s.media)} in Porto and ${h.l(coimbra.s.media)} in Coimbra. Against Porto, Viseu is ${h.c(gs.media - porto.s.media, true)} a litre; against Coimbra, ${h.c(gs.media - coimbra.s.media, true)}. These are small gaps that often change sign: the station you pick matters more.` : `There are not enough prices today to compare Viseu with Porto and Coimbra. The comparison returns once stations in the three districts send new prices to the DGEG.` },
      ];
    },
    body: (h) => {
      const { cont, todos, unico, grupo, g98, g95, c98 } = base(h);
      return `<h2>Each municipality against the mainland</h2>
<p>Rather than comparing municipalities with one another, the table compares each with the standard diesel average across the whole mainland${cont ? `, ${h.l(cont.media)} today` : ''}. A negative figure means a municipality cheaper than the national average. Municipalities with a single station are included, but their average is simply that station’s price.</p>
${cont ? h.table(['Municipality', 'Stations', 'Average', 'Against mainland'], todos.map((x) => [x.concelho, x.n, h.l(x.media), h.c(x.media - cont.media, true)]), 'Standard diesel in Viseu district, by municipality', ['l', 'r', 'r', 'r']) : ''}
<h2>Municipalities with a single station</h2>
<p>${unico.length ? `In ${unico.length > 1 ? `${unico.slice(0, -1).join(', ')} and ${unico[unico.length - 1]}` : unico[0]}, the DGEG has only one station reporting a diesel price today. There is no local choice there, and a station in the next municipality may be worth the detour.` : 'Today every municipality in the district with stations has at least two reporting a diesel price.'} The calculator above lets you pick a municipality and see its five cheapest stations.</p>
<h2>Petrol 98 in the district</h2>
<p>${g98 ? `${h.num(g98.n)} stations in ${h.num(c98)} municipalities sell petrol 98, at ${h.l(g98.media)} on average${g95 ? ` against ${h.l(g95.media)} for standard 95` : ''}.` : 'There are no petrol 98 prices in the district today.'} The ${h.a('preco-gasolina-98', 'petrol 98')} page follows the price of this fuel, and the ${h.a('historico-precos', 'price history')} shows how every fuel has moved.</p>
<h2>Viseu among five districts</h2>
<p>Ranked by standard diesel average, cheapest first, Viseu and the districts around it line up like this today: ${grupo.map((x) => `${x.id === 'viseu' ? x.n : h.a(x.id, x.n)} (${h.l(x.s!.media)})`).join(', ')}.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Viseu'), ge = h.D.statsDe('ge', D), gs = h.D.statsDe('gs', D); return `${s ? `Viseu municipality, home to the district capital, has ${h.num(s.n)} diesel stations averaging ${h.l(s.media)}. ` : ''}${ge && gs ? `Drivers who prefer premium diesel pay ${h.l(ge.media)} on average in the district, ${h.c(ge.media - gs.media)} a litre more than for standard.` : ''}`; })()}</p>`;
    },
  },
});
