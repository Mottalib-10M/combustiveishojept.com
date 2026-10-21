import { defineGuide, type Helpers } from '../../lib/guide-types';

const cont = (h: Helpers) => ({ gs: h.D.pmd('gs')!, g95: h.D.pmd('g95')! });

export default defineGuide({
  id: 'acores', group: 'ilhas', order: 2, tool: 'acores',
  related: ['madeira', 'custo-deposito', 'impostos-combustiveis'],
  sources: ['dgegPmd', 'dl243'],
  pt: {
    slug: 'acores', nav: 'Açores', card: 'Custo do abastecimento e do ano nos Açores, com o preço que vê na bomba.',
    title: 'Combustíveis nos Açores: custo do abastecimento e do ano',
    description: 'Calcule nos Açores quanto custa um abastecimento e um ano de gasóleo ou gasolina com o preço da sua bomba, e compare-o com o preço médio diário do continente.',
    h1: 'Combustíveis nos Açores: quanto custa abastecer',
    intro: () => 'Escreva o preço afixado no seu posto: a calculadora faz o abastecimento, o mês e o ano.',
    resume: (h) => {
      const c = cont(h);
      return `Nos Açores, os preços máximos dos combustíveis são fixados pelo Governo Regional e revistos uma vez por mês, ao contrário do continente, onde são livres, e da Madeira, onde mudam todas as semanas. A DGEG não recolhe os preços dos postos açorianos e o Jornal Oficial da Região não se deixa ler de forma automática, por isso este site não reproduz os preços máximos dos Açores: preferimos não mostrar um número do que mostrar um número que não conseguimos confirmar. A calculadora faz a conta com o preço que lê na bomba: quanto custa o abastecimento, quanto gasta por mês e por ano com os seus quilómetros, e a diferença por litro face ao preço médio diário do continente, que a DGEG fixou a ${h.date(c.gs.dia)} em ${h.l(c.gs.media)} no gasóleo e ${h.l(c.g95.media)} na gasolina 95. O preço que aparece no formulário ao abrir é só um exemplo para a calculadora funcionar.`;
    },
    faqs: () => [
      { q: 'Onde encontro o preço máximo oficial dos Açores?', a: 'No Jornal Oficial da Região Autónoma dos Açores, que publica os atos do Governo Regional, e na própria bomba, onde o preço tem de estar afixado. Como não o conseguimos ler de forma automática e verificável, não o copiamos para aqui. Escreva na calculadora o preço que vê no posto.' },
      { q: 'Porque é que os Açores não aparecem nos mapas de preços por posto?', a: 'Porque o registo da DGEG, criado pelo Decreto-Lei n.º 243/2008, abrange os postos do continente. As regiões autónomas têm regimes próprios de preços máximos. Por isso nenhum site que use os dados da DGEG mostra preços posto a posto nos Açores ou na Madeira.' },
      { q: 'Como comparo o custo nos Açores com o do continente?', a: 'Escreva o preço afixado no seu posto e os seus quilómetros. A calculadora mostra a diferença por litro e por ano face ao preço médio diário do continente publicado pela DGEG. É uma comparação entre um preço de uma bomba e uma média ponderada, por isso serve de ordem de grandeza.' },
    ],
    body: (h) => {
      const c = cont(h);
      return `<h2>Três regimes de preços no mesmo país</h2>
<p>No continente, cada posto fixa o seu preço e comunica-o à DGEG, que publica uma média diária: hoje ${h.l(c.gs.media)} no gasóleo. Na Madeira, um despacho conjunto semanal fixa os máximos, que reproduzimos na ${h.a('madeira', 'página da Madeira')}. Nos Açores, o Governo Regional fixa os máximos uma vez por mês. As regras dos impostos também mudam de região para região, por isso a página dos ${h.a('impostos-combustiveis', 'impostos')} só se aplica ao continente.</p>
<h2>O que a calculadora faz</h2>
<p>Multiplica os litros pelo preço que escrever, para o abastecimento; os quilómetros por ano pelo consumo de exemplo e pelo preço, para o ano. O consumo de exemplo é de 5,5 litros aos 100 km a gasóleo e 6,5 a gasolina; o seu carro pode gastar outro valor, que pode usar na página do ${h.a('custo-deposito', 'custo do depósito')}. Nenhum valor escrito sai do seu navegador.</p>
<h2>Porque não mostramos o preço açoriano</h2>
<p>A regra deste site é publicar só o que lemos numa fonte oficial e conseguimos verificar todos os dias. O Jornal Oficial dos Açores bloqueia a leitura automática, e copiar o preço de um jornal ou de outro site seria publicar um número sem fonte primária. Se a leitura se tornar possível, a página passará a mostrar o preço máximo em vigor, como faz para a Madeira.</p>`;
    },
  },
  en: {
    slug: 'azores', nav: 'Azores', card: 'The cost of a fill and of a year in the Azores, with the price on your pump.',
    title: 'Fuel in the Azores: cost of a full tank and of a whole year',
    description: 'Work out what a fill and a year of diesel or petrol cost in the Azores at your pump’s price, and compare it with the DGEG daily average for mainland Portugal.',
    h1: 'Fuel in the Azores: what filling up costs',
    intro: () => 'Type the price posted at your station: the calculator does the fill, the month and the year.',
    resume: (h) => {
      const c = cont(h);
      return `In the Azores, maximum fuel prices are set by the Regional Government and reviewed once a month, unlike the mainland, where prices are free, and Madeira, where they change every week. The DGEG does not collect prices from Azorean stations and the Region’s Official Journal cannot be read automatically, so this site does not reproduce the Azores maximum prices: we would rather show no figure than one we cannot confirm. The calculator works with the price you read on the pump: what the fill costs, what you spend per month and per year for your mileage, and the gap per litre against the mainland daily average, which the DGEG put on ${h.date(c.gs.dia)} at ${h.l(c.gs.media)} for diesel and ${h.l(c.g95.media)} for petrol 95. The price shown in the form when it opens is just an example so the calculator works.`;
    },
    faqs: () => [
      { q: 'Where can I find the official Azores maximum fuel price?', a: 'In the Official Journal of the Autonomous Region of the Azores, which publishes the Regional Government’s acts, and on the pump itself, where the price must be displayed. Because we cannot read it in an automated, verifiable way, we do not copy it here. Type the price you see at the station into the calculator.' },
      { q: 'Why are the Azores missing from station-by-station price maps?', a: 'Because the DGEG register, set up under Decree-Law 243/2008, covers mainland stations. The autonomous regions have their own maximum-price regimes. That is why no site using DGEG data can show station-by-station prices in the Azores or Madeira, however recent its data.' },
      { q: 'How do I compare Azores fuel costs with the mainland?', a: 'Type the price posted at your station and your mileage. The calculator shows the gap per litre and per year against the mainland daily average published by the DGEG. It compares one pump’s price with a weighted average, so treat it as an order of magnitude.' },
    ],
    body: (h) => {
      const c = cont(h);
      return `<h2>Three price regimes in one country</h2>
<p>On the mainland, each station sets its price and reports it to the DGEG, which publishes a daily average: ${h.l(c.gs.media)} for diesel today. In Madeira, a weekly joint order sets the caps, which we reproduce on the ${h.a('madeira', 'Madeira page')}. In the Azores, the Regional Government sets caps once a month. Tax rules also vary from region to region, so the ${h.a('impostos-combustiveis', 'fuel tax')} page applies to the mainland only.</p>
<h2>What the calculator does</h2>
<p>It multiplies the litres by the price you type, for the fill; and the yearly kilometres by the example consumption and the price, for the year. The example consumption is 5.5 litres per 100 km for diesel and 6.5 for petrol; your car may use a different amount, which you can enter on the ${h.a('custo-deposito', 'tank cost')} page. Nothing you type leaves your browser.</p>
<h2>Why we do not show the Azores price</h2>
<p>This site’s rule is to publish only what we read in an official source and can check every day. The Azores Official Journal blocks automated reading, and copying the price from a newspaper or another site would mean publishing a figure without a primary source. If reading becomes possible, the page will show the cap in force, as it does for Madeira.</p>`;
    },
  },
});
