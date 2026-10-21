import { defineGuide, type Helpers } from '../../lib/guide-types';

const M = (h: Helpers) => { const d = h.D.MADEIRA.despachos, a = d[d.length - 1], b = d[d.length - 2], c = h.D.pmd('gs')!, g = h.D.pmd('g95')!; return { d, a, b, cont: { gs: c.media, g95: g.media, dia: c.dia }, primeiro: d[0] }; };

export default defineGuide({
  id: 'madeira', group: 'ilhas', order: 1, tool: 'madeira',
  related: ['acores', 'preco-gasoleo', 'preco-gasolina-95', 'impostos-combustiveis'],
  sources: ['joramPrecos', 'dgegPmd'],
  pt: {
    slug: 'madeira', nav: 'Madeira', card: 'Preços máximos da gasolina e do gasóleo na Madeira esta semana, publicados no JORAM.',
    title: 'Combustíveis na Madeira: preços máximos desta semana (JORAM)',
    description: 'Preço máximo da gasolina 95, do gasóleo rodoviário e do gasóleo colorido na Madeira esta semana, segundo o despacho do JORAM, e a diferença para o continente.',
    h1: 'Preços dos combustíveis na Madeira esta semana',
    intro: (h) => `Preços máximos em vigor desde ${h.dia(M(h).a.vigor, true)}, fixados por despacho conjunto e publicados no Jornal Oficial.`,
    resume: (h) => {
      const x = M(h), a = x.a, b = x.b;
      return `Na Região Autónoma da Madeira, a gasolina sem chumbo 95 pode ser vendida no máximo a ${h.l(a.g95)} por litro e o gasóleo rodoviário a ${h.l(a.gs)}, desde as 0 horas de ${h.date(a.vigor)}, segundo o despacho conjunto n.º ${a.despacho} publicado no Jornal Oficial da Região (JORAM).${a.colorido ? ` O gasóleo colorido e marcado tem o máximo de ${h.l(a.colorido)}.` : ''} ${b ? `Face ao despacho anterior, em vigor desde ${h.date(b.vigor)}, a gasolina variou ${h.c(a.g95 - b.g95, true)} e o gasóleo ${h.c(a.gs - b.gs, true)}.` : ''} No continente, onde os preços são livres, o preço médio diário da DGEG foi de ${h.l(x.cont.g95)} na gasolina 95 e ${h.l(x.cont.gs)} no gasóleo a ${h.date(x.cont.dia)}: a Madeira fica ${h.c(a.g95 - x.cont.g95, true)} e ${h.c(a.gs - x.cont.gs, true)} por litro face a esses valores. Os preços madeirenses são máximos: um posto pode vender abaixo, mas não acima. A DGEG não recolhe preços das regiões autónomas, por isso não há média por posto para a Madeira.`;
    },
    faqs: (h) => [
      { q: 'Com que frequência mudam os preços na Madeira?', a: 'Os preços máximos são revistos semanalmente por despacho conjunto dos membros do Governo Regional responsáveis, publicado na II série do Jornal Oficial e em vigor a partir das 0 horas do dia indicado, normalmente uma segunda-feira. A tabela abaixo mostra os despachos que conseguimos ler, com a ligação para cada um.' },
      { q: 'Porque é que a gasolina na Madeira é diferente da do continente?', a: 'Porque o regime é outro: no continente os preços são livres e cada posto fixa o seu, enquanto na Madeira o Governo Regional homologa preços máximos. Os impostos aplicados na região também não são os do continente. Este site não decompõe os preços madeirenses.' },
      { q: 'Os preços valem também para o Porto Santo?', a: (() => { const a = M(h).a; return `O despacho conjunto n.º ${a.despacho} fixa os preços máximos de venda ao público na Região Autónoma da Madeira. Consulte o texto do despacho, ligado na tabela, para as condições exatas de cada ilha e de cada produto. Para os Açores, veja a página própria.`; })() },
    ],
    body: (h) => {
      const x = M(h);
      return `<h2>A evolução nas últimas semanas</h2>
<p>Lemos os despachos conjuntos de preços máximos publicados no JORAM desde ${h.date(x.primeiro.vigor)}: são ${h.num(x.d.length)}. Algumas semanas podem faltar quando o despacho não foi encontrado na lista de publicações; nesse caso a semana fica de fora, nunca é estimada. Entre o primeiro e o último despacho lidos, a gasolina 95 variou ${h.c(x.a.g95 - x.primeiro.g95, true)} e o gasóleo ${h.c(x.a.gs - x.primeiro.gs, true)} por litro.</p>
<h2>Madeira e continente lado a lado</h2>
${h.table(['', 'Madeira (máximo)', 'Continente (média DGEG)', 'Diferença'], [[h.fn('g95'), h.l(x.a.g95), h.l(x.cont.g95), h.c(x.a.g95 - x.cont.g95, true)], [h.fn('gs'), h.l(x.a.gs), h.l(x.cont.gs), h.c(x.a.gs - x.cont.gs, true)]], `Despacho n.º ${x.a.despacho}; preço médio diário DGEG de ${h.date(x.cont.dia)}`, ['l', 'r', 'r', 'r'])}
<p>A comparação é entre um preço máximo e um preço médio, por isso é indicativa: um posto madeirense pode vender abaixo do máximo. Num depósito de 50 litros de gasóleo, a diferença de hoje vale ${h.eur(Math.abs(x.a.gs - x.cont.gs) * 50, 2)}.</p>
<h2>De onde vêm os números</h2>
<p>Cada despacho é um PDF da II série do ${h.src('joramPrecos', 'Jornal Oficial da Região Autónoma da Madeira')}. Um programa percorre a lista de publicações dos últimos meses todos os dias, abre os suplementos com o título «Homologação dos preços máximos» e lê a gasolina, o gasóleo e o gasóleo colorido. Se um despacho não puder ser lido, a página continua a mostrar o último lido, com a sua data.</p>`;
    },
  },
  en: {
    slug: 'madeira', nav: 'Madeira', card: 'This week’s maximum petrol and diesel prices in Madeira, as published in the JORAM.',
    title: 'Fuel prices in Madeira: this week’s maximum prices (JORAM)',
    description: 'Maximum price of petrol 95, road diesel and coloured diesel in Madeira this week, from the order in the JORAM, and how it compares with mainland Portugal.',
    h1: 'Fuel prices in Madeira this week',
    intro: (h) => `Maximum prices in force since ${h.dia(M(h).a.vigor, true)}, set by joint order and published in the Official Journal.`,
    resume: (h) => {
      const x = M(h), a = x.a, b = x.b;
      return `In the Autonomous Region of Madeira, unleaded petrol 95 may be sold at no more than ${h.l(a.g95)} a litre and road diesel at ${h.l(a.gs)}, from midnight on ${h.date(a.vigor)}, under joint order ${a.despacho} published in the Region’s Official Journal (JORAM).${a.colorido ? ` Coloured (marked) diesel is capped at ${h.l(a.colorido)}.` : ''} ${b ? `Against the previous order, in force from ${h.date(b.vigor)}, petrol moved ${h.c(a.g95 - b.g95, true)} and diesel ${h.c(a.gs - b.gs, true)}.` : ''} On the mainland, where prices are free, the DGEG daily average was ${h.l(x.cont.g95)} for petrol 95 and ${h.l(x.cont.gs)} for diesel on ${h.date(x.cont.dia)}: Madeira is ${h.c(a.g95 - x.cont.g95, true)} and ${h.c(a.gs - x.cont.gs, true)} a litre against those figures. Madeira’s prices are caps: a station may sell below them, never above. The DGEG does not collect prices from the autonomous regions, so there is no station average for Madeira.`;
    },
    faqs: (h) => [
      { q: 'How often do fuel prices change in Madeira?', a: 'Maximum prices are reviewed weekly by a joint order of the relevant Regional Government members, published in series II of the Official Journal and in force from midnight on the date given, usually a Monday. The table below shows the orders we were able to read, with a link to each.' },
      { q: 'Why does petrol in Madeira cost differently from the mainland?', a: 'Because the regime is different: on the mainland prices are free and each station sets its own, while in Madeira the Regional Government approves maximum prices. The taxes applied in the region are not the mainland’s either. This site does not break Madeira’s prices down.' },
      { q: 'Do Madeira’s maximum prices also apply on Porto Santo?', a: (() => { const a = M(h).a; return `Joint order ${a.despacho} sets maximum retail prices in the Autonomous Region of Madeira. Check the order’s text, linked in the table, for the exact conditions for each island and product. For the Azores, which follow a separate monthly regime, see their own page.`; })() },
    ],
    body: (h) => {
      const x = M(h);
      return `<h2>The trend over recent weeks</h2>
<p>We have read the maximum-price joint orders published in the JORAM since ${h.date(x.primeiro.vigor)}: ${h.num(x.d.length)} of them. Some weeks may be missing when the order was not found in the list of publications; such a week is left out, never estimated. Between the first and last orders read, petrol 95 moved ${h.c(x.a.g95 - x.primeiro.g95, true)} and diesel ${h.c(x.a.gs - x.primeiro.gs, true)} a litre.</p>
<h2>Madeira and the mainland side by side</h2>
${h.table(['', 'Madeira (cap)', 'Mainland (DGEG average)', 'Gap'], [[h.fn('g95'), h.l(x.a.g95), h.l(x.cont.g95), h.c(x.a.g95 - x.cont.g95, true)], [h.fn('gs'), h.l(x.a.gs), h.l(x.cont.gs), h.c(x.a.gs - x.cont.gs, true)]], `Order ${x.a.despacho}; DGEG daily average of ${h.date(x.cont.dia)}`, ['l', 'r', 'r', 'r'])}
<p>The comparison sets a cap against an average, so it is indicative: a station in Madeira may sell below the cap. On a 50-litre tank of diesel, today’s gap is worth ${h.eur(Math.abs(x.a.gs - x.cont.gs) * 50, 2)}.</p>
<h2>Where the figures come from</h2>
<p>Each order is a PDF in series II of the ${h.src('joramPrecos', 'Official Journal of the Autonomous Region of Madeira')}. Every day a script goes through the list of recent publications, opens the supplements titled “Homologação dos preços máximos” and reads petrol, diesel and coloured diesel. If an order cannot be read, the page keeps showing the last one read, with its date.</p>`;
    },
  },
});
