import { defineGuide, type Helpers } from '../../lib/guide-types';

const cobertura = (h: Helpers) => { const n98 = h.D.statsDe('g98')!.n, n95 = h.D.statsDe('g95')!.n; return { n98, n95, parte: n98 / n95 }; };

export default defineGuide({
  id: 'preco-gasolina-98', group: 'precos', order: 4, tool: 'precos', toolProps: { fuel: 'g98' },
  related: ['preco-gasolina-95', 'simples-ou-aditivado', 'precos-por-marca'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'preco-gasolina-98', nav: 'Preço da gasolina 98', card: 'Gasolina 98 hoje: onde se vende, a que preço e quanto custa a mais do que a 95.',
    title: 'Preço da gasolina 98 hoje: média, mínimo e diferença da 95',
    description: 'Preço da gasolina 98 hoje no continente: média afixada, posto mais barato, quantos postos a vendem e quanto custa a mais do que a gasolina 95 num depósito.',
    h1: 'Preço da gasolina 98 hoje',
    intro: (h) => `Gasolina sem chumbo 98 em ${h.num(h.D.statsDe('g98')!.n)} postos que a comunicam à DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('g98')!, g = h.D.statsDe('g95')!, p = h.D.pmd('g98')!, c = cobertura(h);
      return `A gasolina 98 está hoje afixada em média a ${h.l(s.media)} por litro, entre ${h.l(s.min)} no posto mais barato e ${h.l(s.max)} no mais caro. Fica ${h.c(s.media - g.media)} acima da gasolina simples 95, o que num depósito de 45 litros dá ${h.eur((s.media - g.media) * 45, 2)} a mais. Nem todos os postos a vendem: ${h.num(c.n98)} comunicam preço de 98, contra ${h.num(c.n95)} para a 95, ou seja ${h.pct(c.parte, 0)}. O preço médio diário da DGEG, ponderado pelas vendas, foi de ${h.l(p.media)} a ${h.date(p.dia)}. Como a gasolina 98 segue a mesma cotação de referência da 95, a sua variação semanal costuma acompanhar a da 95; a estimativa para segunda-feira está na página da ${h.a('proxima-semana', 'próxima semana')}. Na calculadora, escolha o distrito e o concelho para ver onde há 98 perto de si.`;
    },
    faqs: (h) => [
      { q: 'Quem precisa de gasolina 98?', a: 'Os motores cujo fabricante pede um índice de octano mínimo de 98, em geral motores de alta compressão ou turbo de desempenho. Para esses, a 98 evita detonação e perda de potência. Num motor feito para 95, o manual é a referência: a 98 não traz ganho que justifique a diferença de preço.' },
      { q: 'Porque é que há tão poucos postos com gasolina 98 em alguns concelhos?', a: (() => { const c = cobertura(h); return `Porque a procura é pequena e cada combustível exige um tanque e uma bomba próprios. Hoje ${h.pct(c.parte, 0)} dos postos que vendem gasolina 95 também vendem 98. Se a calculadora não mostrar postos num concelho, nenhum lá comunica preço de 98; experimente o distrito inteiro.`; })() },
      { q: 'A gasolina 98 é o mesmo que a gasolina especial 95?', a: `Não. A especial 95 tem o mesmo índice de octano da simples, com aditivos da marca. A 98 tem um índice de octano mais alto. Hoje a especial 95 está a ${h.l(h.D.statsDe('g95e')!.media)} em média e a 98 a ${h.l(h.D.statsDe('g98')!.media)}, por isso a escolha também se vê no preço.` },
    ],
    body: (h) => {
      const ds = Object.entries(h.D.porDistrito('g98')).sort((a, b) => b[1].n - a[1].n);
      const ms = h.D.porMarca('g98'), top = Object.entries(ms).filter(([, s]) => s.n >= 20).sort((a, b) => a[1].media - b[1].media);
      return `<h2>Onde se vende gasolina 98</h2>
<p>A tabela mostra, por distrito, quantos postos comunicam preço de 98 e a que média. Nos distritos com poucos postos, um ou dois preços altos ou baixos mexem bastante a média.</p>
${h.table(['Distrito', 'Postos com 98', 'Média', 'Mínimo'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Gasolina 98, preço afixado comunicado à DGEG', ['l', 'r', 'r', 'r'])}
<h2>A diferença entre marcas</h2>
<p>Nas marcas com pelo menos 20 postos a vender 98, a média vai de ${h.l(top[0][1].media)} (${top[0][0]}) a ${h.l(top[top.length - 1][1].media)} (${top[top.length - 1][0]}). É uma diferença maior do que na gasolina 95, porque a 98 é um produto de nicho em que cada marca tem mais margem para fixar o preço. A comparação completa está em ${h.a('precos-por-marca', 'preços por marca')}.</p>
<h2>O preço médio diário oficial</h2>
<p>A DGEG publica também o preço médio diário da 98, com os mesmos critérios da 95: média ponderada pelas vendas, com descontos. É esse número que serve de base à ${h.a('historico-precos', 'evolução mensal')} e à estimativa semanal.</p>`;
    },
  },
  en: {
    slug: 'petrol-98-price', nav: 'Petrol 98 price', card: 'Petrol 98 today: where it is sold, at what price and how much more than 95.',
    title: 'Petrol 98 price in Portugal today: average, lowest, vs 95',
    description: 'Petrol 98 price today in mainland Portugal: posted average, cheapest station, how many stations sell it and how much more than petrol 95 it costs per tank.',
    h1: 'Petrol 98 price today',
    intro: (h) => `Unleaded petrol 98 at ${h.num(h.D.statsDe('g98')!.n)} stations that report it to the DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('g98')!, g = h.D.statsDe('g95')!, p = h.D.pmd('g98')!, c = cobertura(h);
      return `Petrol 98 is posted today at ${h.l(s.media)} a litre on average, from ${h.l(s.min)} at the cheapest station to ${h.l(s.max)} at the dearest. That is ${h.c(s.media - g.media)} above standard petrol 95, or ${h.eur((s.media - g.media) * 45, 2)} more on a 45-litre tank. Not every station sells it: ${h.num(c.n98)} report a 98 price, against ${h.num(c.n95)} for 95, or ${h.pct(c.parte, 0)}. The DGEG daily average, weighted by sales, was ${h.l(p.media)} on ${h.date(p.dia)}. Because petrol 98 follows the same reference quote as 95, its weekly move usually tracks 95’s; the Monday estimate is on the ${h.a('proxima-semana', 'next week')} page. In the calculator, choose a district and municipality to find 98 near you. Further down, a table lists how many stations sell 98 in each district, and another paragraph compares the brands with the widest 98 networks.`;
    },
    faqs: (h) => [
      { q: 'Who needs petrol 98?', a: 'Engines whose maker requires a minimum 98 octane rating, usually high-compression or performance turbo engines. For those, 98 prevents knocking and power loss. In an engine built for 95, the owner’s manual is the guide: 98 brings no gain worth the price gap.' },
      { q: 'Why do some municipalities have so few stations with petrol 98?', a: (() => { const c = cobertura(h); return `Because demand is small and each fuel needs its own tank and pump. Today ${h.pct(c.parte, 0)} of stations selling petrol 95 also sell 98. If the calculator shows no station in a municipality, none there reports a 98 price; try the whole district.`; })() },
      { q: 'Is petrol 98 the same as premium petrol 95?', a: `No. Premium 95 has the same octane rating as standard, with the brand’s additives. 98 has a higher octane rating. Today premium 95 averages ${h.l(h.D.statsDe('g95e')!.media)} and 98 ${h.l(h.D.statsDe('g98')!.media)}, so the choice shows in the price too, and it is worth knowing which one your engine actually needs.` },
    ],
    body: (h) => {
      const ds = Object.entries(h.D.porDistrito('g98')).sort((a, b) => b[1].n - a[1].n);
      const ms = h.D.porMarca('g98'), top = Object.entries(ms).filter(([, s]) => s.n >= 20).sort((a, b) => a[1].media - b[1].media);
      return `<h2>Where petrol 98 is sold</h2>
<p>The table shows, by district, how many stations report a 98 price and at what average. In districts with few stations, one or two high or low prices move the average a lot.</p>
${h.table(['District', 'Stations with 98', 'Average', 'Lowest'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Petrol 98, posted price reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>The gap between brands</h2>
<p>Among brands with at least 20 stations selling 98, the average runs from ${h.l(top[0][1].media)} (${top[0][0]}) to ${h.l(top[top.length - 1][1].media)} (${top[top.length - 1][0]}). That gap is wider than on petrol 95, because 98 is a niche product where each brand has more room to set its price. The full comparison is in ${h.a('precos-por-marca', 'prices by brand')}.</p>
<h2>The official daily average</h2>
<p>The DGEG also publishes a daily average for 98, on the same basis as 95: sales-weighted, net of discounts. That figure underpins the ${h.a('historico-precos', 'monthly history')} and the weekly estimate.</p>`;
    },
  },
});
