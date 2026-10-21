import { defineGuide, type Helpers } from '../../lib/guide-types';

const frescos = (h: Helpers, f: 'gs' | 'g95') => { const l = h.D.lista(f); const d7 = h.E.addDays(h.D.HOJE, -7); return { n: l.length, hoje: l.filter((p) => p.atualizado.startsWith(h.D.HOJE)).length, velhos: l.filter((p) => p.atualizado.slice(0, 10) < d7).length }; };
const linhas = (h: Helpers, f: 'gs' | 'g95', n = 15) => h.D.baratos(f, n).map((p) => [`${p.nome}<br><small>${p.marca}</small>`, `${p.localidade}, ${p.concelho}`, h.l(p.preco), p.atualizado]);

export default defineGuide({
  id: 'postos-mais-baratos', group: 'precos', order: 6, tool: 'precos', toolProps: { distrito: 'Porto' },
  related: ['precos-por-marca', 'preco-gasoleo', 'quando-abastecer', 'custo-deposito'],
  sources: ['dgegPortal', 'dl243'],
  pt: {
    slug: 'postos-mais-baratos', nav: 'Postos mais baratos', card: 'Os postos com o gasóleo e a gasolina mais baratos do continente hoje, com a hora de atualização.',
    title: 'Postos de combustível mais baratos hoje: gasóleo e gasolina',
    description: 'Os postos mais baratos do continente hoje, para o gasóleo e a gasolina 95, com a localidade, a marca e a hora da última atualização comunicada à DGEG.',
    h1: 'Postos de combustível mais baratos hoje',
    intro: () => 'Os preços mais baixos do país, posto a posto, e os de cada concelho na calculadora.',
    resume: (h) => {
      const g = h.D.baratos('gs', 1)[0], b = h.D.baratos('g95', 1)[0], s = h.D.statsDe('gs')!, fr = frescos(h, 'gs');
      return `O gasóleo simples mais barato do continente está hoje em ${g.nome}, em ${g.localidade} (${g.concelho}), a ${h.l(g.preco)} por litro, preço comunicado à DGEG a ${g.atualizado}. A gasolina simples 95 mais barata está em ${b.nome}, em ${b.localidade} (${b.concelho}), a ${h.l(b.preco)}. Face à média afixada do gasóleo, ${h.l(s.media)}, o posto mais barato poupa ${h.c(s.media - g.preco)} por litro, ou ${h.eur((s.media - g.preco) * 50, 2)} num depósito de 50 litros. Antes de fazer quilómetros para lá chegar, veja a hora da atualização: dos ${h.num(fr.n)} postos com preço de gasóleo, ${h.num(fr.hoje)} atualizaram-no hoje e ${h.num(fr.velhos)} não o mudam há mais de uma semana. Um preço antigo pode já não estar na bomba. Na calculadora, escolha o seu distrito e concelho para ver os cinco mais baratos perto de si.`;
    },
    faqs: (h) => [
      { q: 'Vale a pena fazer quilómetros para abastecer no posto mais barato?', a: (() => { const c = 5.5 * h.D.statsDe('gs')!.media / 100; return `Só se a poupança passar o custo da viagem. Um carro a gasóleo com 5,5 litros aos 100 km gasta hoje cerca de ${h.eur(c * 10, 2)} por cada 10 km. Num depósito de 50 litros, uma diferença de 4 cêntimos poupa 2 euros: chega para uns 10 km de ida e volta, não mais.`; })() },
      { q: 'Porque é que um posto barato pode ter um preço desatualizado?', a: 'Porque cada posto comunica os seus preços à DGEG e a lista mostra a última comunicação. Se o posto subiu o preço e ainda não a atualizou, o registo fica para trás. Por isso mostramos sempre a data e a hora: um preço de hoje é fiável, um de há dez dias é uma pista.' },
      { q: 'Os postos de hipermercado exigem cartão de cliente?', a: 'O preço comunicado à DGEG é o preço de venda ao público, para qualquer cliente. Os descontos de cartão de cliente ou de talões do supermercado vêm por cima e não estão na lista. Antes de abastecer, confirme na bomba o preço para quem não tem cartão: é esse que conta para comparar com a lista.' },
    ],
    body: (h) => {
      const fr = frescos(h, 'g95');
      return `<h2>Os 15 gasóleos mais baratos</h2>
${h.table(['Posto', 'Localidade', 'Preço', 'Atualizado'], linhas(h, 'gs'), 'Gasóleo simples, preço afixado comunicado à DGEG', ['l', 'l', 'r', 'r'])}
<h2>As 15 gasolinas 95 mais baratas</h2>
${h.table(['Posto', 'Localidade', 'Preço', 'Atualizado'], linhas(h, 'g95'), 'Gasolina simples 95, preço afixado comunicado à DGEG', ['l', 'l', 'r', 'r'])}
<h2>Como usar estas listas</h2>
<p>As duas tabelas reproduzem os dados da DGEG tal como os postos os comunicam, ordenados do mais barato para o mais caro e, a preço igual, do mais recente para o mais antigo. Na gasolina 95, ${h.num(fr.hoje)} dos ${h.num(fr.n)} postos atualizaram o preço hoje. Os mais baratos do país raramente estão no caminho de quem vive longe: o mais útil é a lista do seu concelho, na calculadora, e a comparação entre ${h.a('precos-por-marca', 'marcas e tipos de posto')}. Um posto que comunique preços errados pode ser assinalado à própria DGEG, que gere o registo ao abrigo do ${h.src('dl243', 'Decreto-Lei n.º 243/2008')}.</p>`;
    },
  },
  en: {
    slug: 'cheapest-stations', nav: 'Cheapest stations', card: 'The mainland stations with the cheapest diesel and petrol today, with their update time.',
    title: 'Cheapest fuel stations in Portugal today: diesel and petrol',
    description: 'The cheapest stations in mainland Portugal today for diesel and petrol 95, with the town, the brand and the time of the last price update sent to the DGEG.',
    h1: 'Cheapest fuel stations in Portugal today',
    intro: () => 'The lowest prices in the country, station by station, and those of each municipality in the calculator.',
    resume: (h) => {
      const g = h.D.baratos('gs', 1)[0], b = h.D.baratos('g95', 1)[0], s = h.D.statsDe('gs')!, fr = frescos(h, 'gs');
      return `The cheapest standard diesel in mainland Portugal today is at ${g.nome}, in ${g.localidade} (${g.concelho}), at ${h.l(g.preco)} a litre, a price reported to the DGEG at ${g.atualizado}. The cheapest standard petrol 95 is at ${b.nome}, in ${b.localidade} (${b.concelho}), at ${h.l(b.preco)}. Against the diesel posted average of ${h.l(s.media)}, the cheapest station saves ${h.c(s.media - g.preco)} a litre, or ${h.eur((s.media - g.preco) * 50, 2)} on a 50-litre tank. Before driving there, check the update time: of the ${h.num(fr.n)} stations with a diesel price, ${h.num(fr.hoje)} updated it today and ${h.num(fr.velhos)} have not changed it for over a week. An old price may no longer be on the pump. In the calculator, pick your district and municipality to see the five cheapest near you.`;
    },
    faqs: (h) => [
      { q: 'Is it worth driving further to fill up at the cheapest station?', a: (() => { const c = 5.5 * h.D.statsDe('gs')!.media / 100; return `Only if the saving beats the cost of the trip. A diesel car at 5.5 litres per 100 km spends about ${h.eur(c * 10, 2)} every 10 km today. On a 50-litre tank, a 4-cent gap saves €2: enough for a round trip of about 10 km, no more.`; })() },
      { q: 'Why might a cheap station show an out-of-date price?', a: 'Because each station reports its own prices to the DGEG and the list shows the latest report. If a station has raised its price and not yet updated the register, the record lags behind. That is why we always show the date and time: today’s price is reliable, one from ten days ago is a hint.' },
      { q: 'Do hypermarket stations require a loyalty card?', a: 'The price reported to the DGEG is the retail price for any customer. Loyalty-card or supermarket-voucher discounts come on top and are not in the list. Before filling up, check the no-card price on the pump: that is the one to compare with the list.' },
    ],
    body: (h) => {
      const fr = frescos(h, 'g95');
      return `<h2>The 15 cheapest diesel prices</h2>
${h.table(['Station', 'Town', 'Price', 'Updated'], linhas(h, 'gs'), 'Standard diesel, posted price reported to the DGEG', ['l', 'l', 'r', 'r'])}
<h2>The 15 cheapest petrol 95 prices</h2>
${h.table(['Station', 'Town', 'Price', 'Updated'], linhas(h, 'g95'), 'Standard petrol 95, posted price reported to the DGEG', ['l', 'l', 'r', 'r'])}
<h2>How to use these lists</h2>
<p>Both tables reproduce DGEG data exactly as stations report it, sorted from cheapest to dearest and, at equal price, from most to least recent. For petrol 95, ${h.num(fr.hoje)} of ${h.num(fr.n)} stations updated their price today. The cheapest in the country are rarely on the way for people who live far off: the most useful list is your own municipality’s, in the calculator, and the comparison between ${h.a('precos-por-marca', 'brands and station types')}. A station reporting wrong prices can be flagged to the DGEG itself, which runs the register under ${h.src('dl243', 'Decree-Law 243/2008')}.</p>`;
    },
  },
});
