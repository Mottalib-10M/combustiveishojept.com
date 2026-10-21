import { defineGuide, type Helpers } from '../../lib/guide-types';

const gap = (h: Helpers) => { const p = (f: 'gs' | 'ge' | 'g95' | 'g95e') => h.D.pmd(f)!.media, a = (f: 'gs' | 'ge' | 'g95' | 'g95e') => h.D.statsDe(f)!.media; return { gasoleo: p('ge') - p('gs'), gasolina: p('g95e') - p('g95'), afGasoleo: a('ge') - a('gs'), afGasolina: a('g95e') - a('g95'), dia: h.D.pmd('gs')!.dia }; };

export default defineGuide({
  id: 'simples-ou-aditivado', group: 'contas', order: 6, tool: 'aditivado',
  related: ['preco-gasoleo', 'preco-gasolina-95', 'custo-deposito', 'precos-por-marca'],
  sources: ['dgegPmd', 'dgegPortal'],
  pt: {
    slug: 'simples-ou-aditivado', nav: 'Simples ou aditivado', card: 'Quanto custa a mais por ano o gasóleo ou a gasolina especial, aditivada.',
    title: 'Gasóleo simples ou aditivado: quanto custa a mais por ano',
    description: 'Diferença de preço entre o gasóleo simples e o aditivado, e entre a gasolina 95 simples e a especial, e quanto custa a mais num ano com os seus quilómetros.',
    h1: 'Combustível simples ou aditivado: a diferença no preço',
    intro: () => 'O sobrecusto por litro e por ano dos combustíveis especiais, com o preço médio diário da DGEG.',
    resume: (h) => {
      const g = gap(h), l = 15000 * 5.5 / 100;
      return `O gasóleo especial, também vendido como aditivado, custou ${h.c(g.gasoleo)} a mais por litro do que o gasóleo simples no preço médio diário da DGEG de ${h.date(g.dia)}; nos preços afixados pelos postos a diferença é de ${h.c(g.afGasoleo)}. Na gasolina 95, a especial custou ${h.c(g.gasolina)} a mais do que a simples. Para um carro a gasóleo que faça 15 000 km por ano a 5,5 litros aos 100 km, ou seja ${h.num(l)} litros, escolher sempre o especial custa ${h.eur(g.gasoleo * l)} a mais por ano. Os combustíveis simples e especiais têm de cumprir as mesmas especificações legais; a diferença está nos aditivos que cada marca junta, de limpeza do sistema de injeção e de desempenho. Esta página não mede o efeito desses aditivos no consumo ou no motor, que as marcas anunciam mas que não há dados oficiais para verificar. Mede só o preço, com a calculadora a fazer a conta para os seus quilómetros.`;
    },
    faqs: (h) => [
      { q: 'O combustível aditivado reduz o consumo o suficiente para compensar?', a: (() => { const g = gap(h), p = h.D.pmd('gs')!.media; return `Para compensar a diferença de hoje no gasóleo, ${h.c(g.gasoleo)} por litro, o aditivado teria de baixar o consumo em cerca de ${h.pct(g.gasoleo / (p + g.gasoleo))}. Não há medição oficial independente que o confirme ou desminta para cada marca. Se quiser testar, meça o consumo real em vários depósitos de cada um.`; })() },
      { q: 'Posso misturar gasóleo simples e aditivado no depósito?', a: 'Sim. Ambos cumprem a mesma norma de gasóleo rodoviário e podem ser misturados sem problema. O mesmo vale para a gasolina 95 simples e a especial. O que não se deve misturar é gasóleo com gasolina, nem usar gasóleo colorido em veículos rodoviários, que é proibido.' },
      { q: 'A gasolina especial 95 é a mesma coisa que a 98?', a: 'Não. A especial 95 tem o índice de octano da simples, 95, com aditivos de marca. A 98 tem um índice de octano mais alto, que só alguns motores exigem. Para os carros feitos para 95, o manual é a referência; a página da gasolina 98 mostra a sua diferença de preço.' },
    ],
    body: (h) => {
      const g = gap(h), km = [10000, 15000, 20000, 30000];
      return `<h2>O sobrecusto num ano</h2>
${h.table(['Quilómetros por ano', 'Gasóleo (5,5 l/100 km)', 'Gasolina 95 (6,5 l/100 km)'], km.map((k) => [h.num(k), h.eur(g.gasoleo * k * 5.5 / 100), h.eur(g.gasolina * k * 6.5 / 100)]), 'Diferença do preço médio diário DGEG entre especial e simples', ['l', 'r', 'r'])}
<h2>Preço médio diário e preço afixado</h2>
<p>A diferença no preço médio diário da DGEG, ponderado pelas vendas, é a que mais se aproxima do que os condutores pagam em média. A diferença nos preços afixados, ${h.c(g.afGasoleo)} no gasóleo e ${h.c(g.afGasolina)} na gasolina, compara postos sem ponderação. Cada marca fixa o seu próprio prémio, por isso no seu posto a diferença pode ser outra: a ${h.a('precos-por-marca', 'comparação por marca')} mostra as médias de cada rede.</p>
<h2>O que a calculadora não sabe</h2>
<p>Não sabe se o seu motor beneficia dos aditivos nem quanto. Também não conta descontos de cartão de fidelização. O resultado é o custo extra a preço médio, para decidir com um número à frente.</p>`;
    },
  },
  en: {
    slug: 'standard-or-premium', nav: 'Standard or premium', card: 'How much more a year premium (additive) diesel or petrol costs.',
    title: 'Standard or premium diesel in Portugal: the cost per year',
    description: 'Price gap between standard and premium diesel, and between standard and premium petrol 95, in Portugal, and how much more that costs a year for your mileage.',
    h1: 'Standard or premium fuel: the price gap',
    intro: () => 'The extra cost per litre and per year of premium fuels, from the DGEG daily average.',
    resume: (h) => {
      const g = gap(h), l = 15000 * 5.5 / 100;
      return `Premium diesel, sold as “gasóleo especial” or “aditivado”, cost ${h.c(g.gasoleo)} more a litre than standard diesel in the DGEG daily average of ${h.date(g.dia)}; in the prices stations post, the gap is ${h.c(g.afGasoleo)}. For petrol 95, premium cost ${h.c(g.gasolina)} more than standard. For a diesel car doing 15,000 km a year at 5.5 litres per 100 km, that is ${h.num(l)} litres, always choosing premium costs ${h.eur(g.gasoleo * l)} more a year. Standard and premium fuels must meet the same legal specifications; the difference lies in the additives each brand adds, for injection-system cleaning and performance. This page does not measure those additives’ effect on consumption or on the engine, which brands advertise but which there are no official data to check. It measures only the price, with the calculator doing the sum for your mileage.`;
    },
    faqs: (h) => [
      { q: 'Does premium fuel cut consumption enough to pay for itself?', a: (() => { const g = gap(h), p = h.D.pmd('gs')!.media; return `To cover today’s diesel gap of ${h.c(g.gasoleo)} a litre, premium would need to cut consumption by about ${h.pct(g.gasoleo / (p + g.gasoleo))}. No independent official measurement confirms or rules that out for each brand. If you want to test it, measure real consumption over several tanks of each.` ; })() },
      { q: 'Can I mix standard and premium diesel in the tank?', a: 'Yes. Both meet the same road-diesel standard and can be mixed without trouble. The same goes for standard and premium petrol 95. What must not be mixed is diesel with petrol, and coloured (marked) diesel may not be used in road vehicles at all.' },
      { q: 'Is premium petrol 95 the same as petrol 98?', a: 'No. Premium 95 has the same 95 octane rating as standard, with brand additives. 98 has a higher octane rating, which only some engines require. For cars built for 95, the owner’s manual is the guide; the petrol 98 page shows its price gap.' },
    ],
    body: (h) => {
      const g = gap(h), km = [10000, 15000, 20000, 30000];
      return `<h2>The extra cost over a year</h2>
${h.table(['Kilometres a year', 'Diesel (5.5 l/100 km)', 'Petrol 95 (6.5 l/100 km)'], km.map((k) => [h.num(k), h.eur(g.gasoleo * k * 5.5 / 100), h.eur(g.gasolina * k * 6.5 / 100)]), 'Gap in the DGEG daily average between premium and standard', ['l', 'r', 'r'])}
<h2>Daily average and posted price</h2>
<p>The gap in the DGEG daily average, weighted by sales, is closest to what drivers pay on average. The gap in posted prices, ${h.c(g.afGasoleo)} for diesel and ${h.c(g.afGasolina)} for petrol, compares stations without weighting. Each brand sets its own premium, so at your station the gap may differ: the ${h.a('precos-por-marca', 'brand comparison')} shows each network’s averages.</p>
<h2>What the calculator does not know</h2>
<p>It does not know whether your engine benefits from the additives, or by how much. Nor does it count loyalty-card discounts. The result is the extra cost at the average price, so you decide with a number in front of you.</p>`;
    },
  },
});
