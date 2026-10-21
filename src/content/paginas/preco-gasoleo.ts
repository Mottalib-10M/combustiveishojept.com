import { defineGuide } from '../../lib/guide-types';

const distritos = (h: any, f: 'gs') => Object.entries(h.D.porDistrito(f) as Record<string, { media: number; min: number; n: number }>).sort((a, b) => a[1].media - b[1].media);

export default defineGuide({
  id: 'preco-gasoleo', group: 'precos', order: 2, tool: 'precos', toolProps: { fuel: 'gs' },
  related: ['proxima-semana', 'simples-ou-aditivado', 'postos-mais-baratos', 'impostos-combustiveis'],
  sources: ['dgegPortal', 'dgegPmd', 'dl243'],
  pt: {
    slug: 'preco-gasoleo', nav: 'Preço do gasóleo', card: 'Gasóleo simples hoje: média afixada, posto mais barato e diferença entre distritos.',
    title: 'Preço do gasóleo hoje: média, mínimo e postos mais baratos',
    description: 'Preço do gasóleo simples hoje em Portugal continental: média afixada, posto mais barato, preço médio diário da DGEG e a diferença entre os 18 distritos.',
    h1: 'Preço do gasóleo hoje',
    intro: (h) => `Gasóleo simples em ${h.num(h.D.statsDe('gs')!.n)} postos do continente, com a hora de atualização de cada preço.`,
    resume: (h) => {
      const s = h.D.statsDe('gs')!, p = h.D.pmd('gs')!, sem = h.D.pmdAntes('gs', 7), ano = h.D.pmdAntes('gs', 364), e = h.D.est('gs');
      return `O gasóleo simples está hoje afixado em média a ${h.l(s.media)} por litro nos ${h.num(s.n)} postos do continente que o vendem, com o mais barato a ${h.l(s.min)} e o mais caro a ${h.l(s.max)}. O preço médio diário publicado pela DGEG, que pondera as vendas e já desconta promoções, foi de ${h.l(p.media)} a ${h.date(p.dia)}${sem ? `, ${h.c(p.media - sem.media, true)} face à semana anterior` : ''}${ano ? ` e ${h.c(p.media - ano.media, true)} face ao mesmo dia de há um ano` : ''}. Encher um depósito de 50 litros à média afixada custa ${h.eur(s.media * 50, 2)}; no posto mais barato, ${h.eur(s.min * 50, 2)}. ${e && e.qualidade.publica ? `A estimativa para segunda-feira, ${h.date(e.segunda)}, é de ${h.c(e.variacao, true)} por litro.` : ''} Escolha o distrito e o concelho na calculadora para ver a média da sua zona e os cinco postos mais baratos.`;
    },
    faqs: (h) => [
      { q: 'Qual é a diferença entre gasóleo simples e gasóleo especial?', a: `O gasóleo especial, também chamado aditivado, leva aditivos de limpeza e desempenho que cada marca formula à sua maneira. Custa hoje em média ${h.c(h.D.statsDe('ge')!.media - h.D.statsDe('gs')!.media)} a mais por litro nos preços afixados. A página ${h.a('simples-ou-aditivado', 'simples ou aditivado')} calcula quanto isso representa num ano de condução.` },
      { q: 'Porque é que o mesmo gasóleo tem preços tão diferentes entre postos?', a: 'Cada posto fixa o seu preço livremente. Pesam a marca, o tipo de posto (autoestrada, rua ou hipermercado), a concorrência à volta e a política comercial do dono. O combustível de base é o mesmo produto refinado; as diferenças de aditivos só existem nos produtos especiais.' },
      { q: 'Quanto do preço do gasóleo é imposto?', a: (() => { const s = h.D.statsDe('gs')!, d = h.E.decompor(s.media, h.D.ispLitro('gs')); return `Ao preço médio afixado de hoje, ${h.l(d.iva)} são IVA e ${h.l(d.isp)} são ISP com as contribuições associadas, ou seja ${h.pct(d.partImpostos)} do litro. O ISP é um valor fixo por litro; o IVA é uma percentagem e sobe com o preço. Veja o detalhe em ${h.a('impostos-combustiveis', 'impostos nos combustíveis')}.`; })() },
    ],
    body: (h) => {
      const ds = distritos(h, 'gs'), t = h.D.porTipo('gs');
      return `<h2>O gasóleo distrito a distrito</h2>
<p>A diferença entre o distrito mais barato e o mais caro é hoje de ${h.c(ds[ds.length - 1][1].media - ds[0][1].media)} por litro na média afixada. É pouco ao lado da diferença entre postos do mesmo distrito, que chega facilmente a duas ou três dezenas de cêntimos. Cada distrito tem a sua página com a tabela dos concelhos.</p>
${h.table(['Distrito', 'Postos', 'Média', 'Mínimo'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Gasóleo simples, preço afixado comunicado à DGEG', ['l', 'r', 'r', 'r'])}
<h2>O que mais pesa: o tipo de posto</h2>
<p>Nos postos de autoestrada o gasóleo está em média a ${h.l(t['Auto-estrada'].media)}, nos postos de rua a ${h.l(t['Outro'].media)} e nos de áreas comerciais a ${h.l(t['Área comercial (Hipermercados)'].media)}. Quem abastece sempre na autoestrada paga, num ano de 1 000 litros, ${h.eur((t['Auto-estrada'].media - t['Área comercial (Hipermercados)'].media) * 1000)} a mais do que quem abastece num hipermercado. A comparação por marca está em ${h.a('precos-por-marca', 'preços por marca')}.</p>
<h2>Média afixada e preço médio diário</h2>
<p>Os dois números aparecem lado a lado na calculadora e não são iguais. A média afixada é nossa: todos os postos contam o mesmo. O preço médio diário é da DGEG: cada litro vendido conta o mesmo, e os descontos gerais são abatidos. Como os postos de maior volume, muitas vezes de hipermercado, são também os mais baratos, o número oficial fica abaixo do nosso. Para acompanhar a evolução semana a semana, o ${h.a('historico-precos', 'histórico')} usa sempre o preço médio diário oficial.</p>`;
    },
  },
  en: {
    slug: 'diesel-price', nav: 'Diesel price', card: 'Standard diesel today: posted average, cheapest station and the gap between districts.',
    title: 'Diesel price in Portugal today: average, lowest, cheapest',
    description: 'Standard diesel price today in mainland Portugal: posted average, cheapest station, the DGEG daily average and how the 18 districts compare, updated daily.',
    h1: 'Diesel price in Portugal today',
    intro: (h) => `Standard diesel at ${h.num(h.D.statsDe('gs')!.n)} mainland stations, with each price’s update time.`,
    resume: (h) => {
      const s = h.D.statsDe('gs')!, p = h.D.pmd('gs')!, sem = h.D.pmdAntes('gs', 7), ano = h.D.pmdAntes('gs', 364), e = h.D.est('gs');
      return `Standard diesel is posted today at ${h.l(s.media)} a litre on average across the ${h.num(s.n)} mainland stations that sell it, with the cheapest at ${h.l(s.min)} and the dearest at ${h.l(s.max)}. The daily average the DGEG publishes, which weights sales and already nets out promotions, was ${h.l(p.media)} on ${h.date(p.dia)}${sem ? `, ${h.c(p.media - sem.media, true)} on the week before` : ''}${ano ? ` and ${h.c(p.media - ano.media, true)} on the same day a year ago` : ''}. Filling a 50-litre tank at the posted average costs ${h.eur(s.media * 50, 2)}; at the cheapest station, ${h.eur(s.min * 50, 2)}. ${e && e.qualidade.publica ? `The estimate for Monday ${h.date(e.segunda)} is ${h.c(e.variacao, true)} a litre.` : ''} Pick a district and municipality in the calculator to see your area’s average and its five cheapest stations. The district table further down ranks all 18 districts by their posted average, and each one links to its own page with every municipality.`;
    },
    faqs: (h) => [
      { q: 'What is the difference between standard and premium diesel?', a: `Premium diesel, sold as “gasóleo especial” or “aditivado”, carries cleaning and performance additives each brand formulates its own way. Today it costs ${h.c(h.D.statsDe('ge')!.media - h.D.statsDe('gs')!.media)} more a litre on average in posted prices. The ${h.a('simples-ou-aditivado', 'standard or premium')} page works out what that means over a year of driving.` },
      { q: 'Why does the same diesel cost so differently between stations?', a: 'Each station sets its own price freely. The brand, the type of station (motorway, street or hypermarket), nearby competition and the owner’s commercial policy all weigh in. The base fuel is the same refined product; additive differences only exist in premium products.' },
      { q: 'How much of the diesel price is tax?', a: (() => { const s = h.D.statsDe('gs')!, d = h.E.decompor(s.media, h.D.ispLitro('gs')); return `At today’s posted average, ${h.l(d.iva)} is VAT and ${h.l(d.isp)} is ISP with its related levies, or ${h.pct(d.partImpostos)} of the litre. ISP is a fixed amount per litre; VAT is a percentage and rises with the price. See the detail in ${h.a('impostos-combustiveis', 'fuel taxes')}.`; })() },
    ],
    body: (h) => {
      const ds = distritos(h, 'gs'), t = h.D.porTipo('gs');
      return `<h2>Diesel district by district</h2>
<p>The gap between the cheapest and the dearest district is ${h.c(ds[ds.length - 1][1].media - ds[0][1].media)} a litre on the posted average today. That is small next to the gap between stations within one district, which easily reaches twenty or thirty cents. Each district has its own page with a table of its municipalities.</p>
${h.table(['District', 'Stations', 'Average', 'Lowest'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Standard diesel, posted price reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>What matters most: the type of station</h2>
<p>At motorway stations diesel averages ${h.l(t['Auto-estrada'].media)}, at street stations ${h.l(t['Outro'].media)} and at shopping-area stations ${h.l(t['Área comercial (Hipermercados)'].media)}. A driver who always fills up on the motorway pays, over a 1,000-litre year, ${h.eur((t['Auto-estrada'].media - t['Área comercial (Hipermercados)'].media) * 1000)} more than one who uses a hypermarket. The brand comparison is in ${h.a('precos-por-marca', 'prices by brand')}.</p>
<h2>Posted average and daily average</h2>
<p>Both figures sit side by side in the calculator and they are not the same. The posted average is ours: every station counts equally. The daily average is the DGEG’s: every litre sold counts equally, and general discounts are deducted. Because the highest-volume stations, often at hypermarkets, are also the cheapest, the official figure sits below ours. To follow the trend week by week, the ${h.a('historico-precos', 'price history')} always uses the official daily average.</p>`;
    },
  },
});
