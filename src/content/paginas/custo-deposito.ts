import { defineGuide, type Helpers } from '../../lib/guide-types';

const ano = (h: Helpers) => { const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!; return { gs: h.E.anual(15000, 5.5, gs.media), g95: h.E.anual(15000, 6.5, g95.media), gsMin: h.E.anual(15000, 5.5, gs.min) }; };

export default defineGuide({
  id: 'custo-deposito', group: 'contas', order: 4, tool: 'custo',
  related: ['preco-gasoleo', 'preco-gpl-auto', 'quando-abastecer', 'simples-ou-aditivado'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'custo-deposito', nav: 'Custo do depósito e por ano', card: 'Quanto custa encher o depósito hoje e quanto gasta num ano com os seus quilómetros.',
    title: 'Custo do depósito hoje: encher o carro e gastar num ano',
    description: 'Quanto custa encher o depósito ao preço de hoje e quanto gasta em combustível por mês e por ano, com os seus quilómetros, o seu consumo e o preço do seu posto.',
    h1: 'Quanto custa encher o depósito e quanto gasta num ano',
    intro: () => 'Escreva os quilómetros, o consumo e o preço do seu posto: o resto é feito à média de hoje.',
    resume: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, a = ano(h);
      return `Encher um depósito de 50 litros de gasóleo simples custa hoje ${h.eur(gs.media * 50, 2)} à média afixada no continente, ${h.l(gs.media)}, e ${h.eur(gs.min * 50, 2)} no posto mais barato. Com gasolina simples 95, a ${h.l(g95.media)}, o mesmo depósito custa ${h.eur(g95.media * 50, 2)}. Num ano de 15 000 km, um carro a gasóleo que gaste 5,5 litros aos 100 km consome ${h.num(a.gs.litros)} litros e paga ${h.eur(a.gs.custo)}, cerca de ${h.eur(a.gs.mes)} por mês; um carro a gasolina com 6,5 litros aos 100 km paga ${h.eur(a.g95.custo)}. Cada cêntimo a menos por litro vale ${h.eur(a.gs.litros * 0.01, 2)} por ano nesse carro a gasóleo. Estes consumos são exemplos: a calculadora aceita os seus quilómetros, o consumo do seu carro e o preço do seu posto, e mostra o custo de um abastecimento, de um mês e de um ano.`;
    },
    faqs: (h) => [
      { q: 'Como sei o consumo real do meu carro?', a: 'A forma mais fiável é encher o depósito, pôr o conta-quilómetros parcial a zero e, no abastecimento seguinte, dividir os litros metidos pelos quilómetros feitos e multiplicar por 100. O valor do computador de bordo costuma ser um pouco otimista. O consumo homologado do catálogo raramente se atinge em condução real.' },
      { q: 'Quanto poupo por ano a abastecer sempre no posto mais barato?', a: (() => { const a = ano(h); return `Depende da distância até ele. Com 15 000 km e 5,5 litros aos 100 km, pagar o preço do posto mais barato do país em vez da média afixada pouparia ${h.eur(a.gs.custo - a.gsMin.custo)} por ano. Na prática, o posto mais barato do seu concelho, que a calculadora mostra, dá uma poupança menor mas sem desvios.`; })() },
      { q: 'Quanto custa um quilómetro de carro em combustível?', a: (() => { const a = ano(h); return `Com os consumos de exemplo e os preços médios de hoje, cerca de ${h.eur(a.gs.porKm, 3)} por quilómetro a gasóleo e ${h.eur(a.g95.porKm, 3)} a gasolina 95. Não inclui portagens, desgaste dos pneus, seguro nem manutenção, que no custo total de um carro também pesam.`; })() },
    ],
    body: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, gpl = h.D.statsDe('gpl')!;
      const tam = [35, 45, 55, 65];
      return `<h2>O depósito, pelo tamanho</h2>
${h.table(['Depósito', 'Gasóleo simples', 'Gasolina 95', 'GPL Auto'], tam.map((t) => [`${t} l`, h.eur(gs.media * t, 2), h.eur(g95.media * t, 2), h.eur(gpl.media * t, 2)]), 'À média afixada de hoje no continente', ['l', 'r', 'r', 'r'])}
<p>Um depósito raramente se enche desde zero: entre a luz da reserva e o cheio cabem, em geral, menos litros do que a capacidade do catálogo. Para saber o que paga de facto, escreva na calculadora os litros que costuma meter.</p>
<h2>Por ano e por mês</h2>
<p>O custo anual é simples: quilómetros × consumo ÷ 100 × preço. O que muda muito o resultado é o consumo, mais do que o preço: entre 5 e 7 litros aos 100 km, a fatura anual de 15 000 km muda em ${h.eur(15000 * 2 / 100 * gs.media)} ao preço médio do gasóleo. Uma variação de 5 cêntimos no preço, num ano de 900 litros, vale ${h.eur(900 * 0.05)}.</p>
<h2>Que preço escrever</h2>
<p>Por omissão, a calculadora usa a média afixada do continente, arredondada ao cêntimo. Para uma conta mais justa, escreva o preço do posto onde abastece, que encontra na página do seu distrito, ou o mínimo do seu concelho. Para saber se vale a pena esperar pela segunda-feira, veja a ${h.a('proxima-semana', 'estimativa semanal')}; para o dia da semana, ${h.a('quando-abastecer', 'quando abastecer')}.</p>`;
    },
  },
  en: {
    slug: 'tank-cost', nav: 'Tank and yearly cost', card: 'What a full tank costs today and what you spend in a year for your mileage.',
    title: 'Full tank cost in Portugal today and your yearly fuel bill',
    description: 'What a full tank costs at today’s prices in Portugal and what you spend on fuel per month and per year, with your own mileage, consumption and pump price.',
    h1: 'What a full tank costs, and your yearly fuel bill',
    intro: () => 'Type your mileage, consumption and your station’s price: the rest is done at today’s average.',
    resume: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, a = ano(h);
      return `Filling a 50-litre tank with standard diesel costs ${h.eur(gs.media * 50, 2)} today at the mainland posted average of ${h.l(gs.media)}, and ${h.eur(gs.min * 50, 2)} at the cheapest station. With standard petrol 95, at ${h.l(g95.media)}, the same tank costs ${h.eur(g95.media * 50, 2)}. Over 15,000 km a year, a diesel car burning 5.5 litres per 100 km uses ${h.num(a.gs.litros)} litres and pays ${h.eur(a.gs.custo)}, about ${h.eur(a.gs.mes)} a month; a petrol car at 6.5 litres per 100 km pays ${h.eur(a.g95.custo)}. Each cent less per litre is worth ${h.eur(a.gs.litros * 0.01, 2)} a year in that diesel car. These consumptions are examples: the calculator takes your mileage, your car’s consumption and your station’s price, and shows the cost of one fill, a month and a year. A table further down gives the cost of a 35, 45, 55 and 65-litre tank for diesel, petrol 95 and LPG at today’s averages.`;
    },
    faqs: (h) => [
      { q: 'How do I find my car’s real fuel consumption?', a: 'The most reliable way is to fill the tank, reset the trip meter and, at the next fill, divide the litres added by the kilometres driven and multiply by 100. The trip computer’s figure tends to be slightly optimistic. The type-approval figure in the brochure is rarely reached in real driving.' },
      { q: 'How much would I save a year always using the cheapest station?', a: (() => { const a = ano(h); return `It depends how far away it is. At 15,000 km and 5.5 litres per 100 km, paying the cheapest station in the country instead of the posted average would save ${h.eur(a.gs.custo - a.gsMin.custo)} a year. In practice, the cheapest station in your own municipality, which the calculator shows, saves less but without detours.`; })() },
      { q: 'What does one kilometre of driving cost in fuel?', a: (() => { const a = ano(h); return `With the example consumptions and today’s average prices, about ${h.eur(a.gs.porKm, 3)} per kilometre on diesel and ${h.eur(a.g95.porKm, 3)} on petrol 95. That leaves out tolls, tyre wear, insurance and servicing, which also weigh on the total cost of running a car and change from one driver to the next.`; })() },
    ],
    body: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, gpl = h.D.statsDe('gpl')!;
      const tam = [35, 45, 55, 65];
      return `<h2>The tank, by size</h2>
${h.table(['Tank', 'Standard diesel', 'Petrol 95', 'LPG'], tam.map((t) => [`${t} l`, h.eur(gs.media * t, 2), h.eur(g95.media * t, 2), h.eur(gpl.media * t, 2)]), 'At today’s mainland posted average', ['l', 'r', 'r', 'r'])}
<p>A tank is rarely filled from empty: between the reserve light and full there are usually fewer litres than the brochure capacity. To know what you actually pay, type the litres you usually put in.</p>
<h2>Per year and per month</h2>
<p>The yearly cost is simple: kilometres × consumption ÷ 100 × price. What moves the result most is consumption, more than price: between 5 and 7 litres per 100 km, the yearly bill for 15,000 km changes by ${h.eur(15000 * 2 / 100 * gs.media)} at the average diesel price. A 5-cent price move over a 900-litre year is worth ${h.eur(900 * 0.05)}.</p>
<h2>Which price to type</h2>
<p>By default, the calculator uses the mainland posted average, rounded to the cent. For a fairer sum, type the price at the station you use, which you will find on your district’s page, or your municipality’s lowest. To see whether waiting for Monday pays, check the ${h.a('proxima-semana', 'weekly estimate')}; for the day of the week, ${h.a('quando-abastecer', 'when to fill up')}.</p>`;
    },
  },
});
