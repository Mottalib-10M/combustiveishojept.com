import { defineGuide, type Helpers } from '../../lib/guide-types';

const top = (h: Helpers, n = 6) => Object.entries(h.D.porDistrito('g95')).sort((a, b) => a[1].media - b[1].media);

export default defineGuide({
  id: 'preco-gasolina-95', group: 'precos', order: 3, tool: 'precos', toolProps: { fuel: 'g95', distrito: 'Porto' },
  related: ['preco-gasolina-98', 'preco-gasoleo', 'proxima-semana', 'custo-deposito'],
  sources: ['dgegPortal', 'dgegPmd', 'enseRef'],
  pt: {
    slug: 'preco-gasolina-95', nav: 'Preço da gasolina 95', card: 'Gasolina simples 95 hoje: média afixada, mínimo e comparação com o gasóleo.',
    title: 'Preço da gasolina 95 hoje: média afixada e postos baratos',
    description: 'Preço da gasolina simples 95 hoje no continente: média afixada, posto mais barato, preço médio diário da DGEG e a diferença para o gasóleo, por distrito.',
    h1: 'Preço da gasolina 95 hoje',
    intro: (h) => `Gasolina simples 95 em ${h.num(h.D.statsDe('g95')!.n)} postos, por distrito e concelho, com os dados da DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('g95')!, gs = h.D.statsDe('gs')!, p = h.D.pmd('g95')!, e = h.D.est('g95');
      const dif = s.media - gs.media;
      return `A gasolina simples 95 está hoje afixada em média a ${h.l(s.media)} por litro em ${h.num(s.n)} postos do continente; o posto mais barato pede ${h.l(s.min)}. Isto é ${h.c(Math.abs(dif))} ${dif < 0 ? 'abaixo' : 'acima'} do gasóleo simples, que está a ${h.l(gs.media)}. O preço médio diário da DGEG, ponderado pelas vendas e com descontos, foi de ${h.l(p.media)} a ${h.date(p.dia)}. Com um consumo de 6,5 litros aos 100 km, cada 100 km custam ${h.eur(s.media * 6.5, 2)} à média afixada. ${e && e.qualidade.publica ? `Para segunda-feira, ${h.date(e.segunda)}, a estimativa aponta para ${h.c(e.variacao, true)} por litro, a partir dos preços de referência diários da ENSE para a gasolina.` : ''} A calculadora abre no distrito do Porto, o de maior rede de postos; mude de distrito e de concelho para ver a sua zona.`;
    },
    faqs: (h) => [
      { q: 'A gasolina 95 está mais barata do que o gasóleo?', a: (() => { const d = h.D.statsDe('g95')!.media - h.D.statsDe('gs')!.media; return `Hoje ${d < 0 ? 'sim' : 'não'}: a diferença na média afixada é de ${h.c(d, true)} por litro da gasolina 95 face ao gasóleo simples. A ordem entre os dois muda com as cotações internacionais de cada produto. Mas um carro a gasóleo consome normalmente menos litros aos 100 km, por isso o custo por quilómetro é o que conta.`; })() },
      { q: 'Que diferença há entre gasolina simples 95 e especial 95?', a: `Ambas têm índice de octano 95. A especial leva aditivos de cada marca e custa hoje em média ${h.c(h.D.statsDe('g95e')!.media - h.D.statsDe('g95')!.media)} a mais por litro nos preços afixados. Se o manual do carro pede 95, qualquer das duas serve; a especial é uma escolha comercial, não uma exigência técnica.` },
      { q: 'Em que distrito a gasolina 95 está mais barata hoje?', a: (() => { const t = top(h); return `Hoje é no distrito de ${t[0][0]}, com média afixada de ${h.l(t[0][1].media)}, e a mais cara no de ${t[t.length - 1][0]}, a ${h.l(t[t.length - 1][1].media)}. A distância entre os dois extremos, ${h.c(t[t.length - 1][1].media - t[0][1].media)}, é menor do que a que separa postos do mesmo concelho.`; })() },
    ],
    body: (h) => {
      const t = top(h), g = h.D.statsDe('g95')!, ge = h.D.statsDe('g95e')!, g98 = h.D.statsDe('g98')!;
      return `<h2>Gasolina 95 por distrito</h2>
${h.table(['Distrito', 'Postos', 'Média', 'Mínimo'], t.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Gasolina simples 95, preço afixado comunicado à DGEG', ['l', 'r', 'r', 'r'])}
<h2>Simples, especial ou 98</h2>
<p>Nas bombas há três gasolinas sem chumbo: a simples 95, hoje a ${h.l(g.media)} em média, a especial 95, a ${h.l(ge.media)}, e a 98, a ${h.l(g98.media)}. A 98 tem um índice de octano mais alto e só faz sentido nos motores que o pedem; a ${h.a('preco-gasolina-98', 'página da gasolina 98')} mostra onde se vende e a que preço. Num depósito de 45 litros, a especial custa ${h.eur((ge.media - g.media) * 45, 2)} a mais e a 98 ${h.eur((g98.media - g.media) * 45, 2)} a mais do que a simples.</p>
<h2>Como se forma o preço da gasolina</h2>
<p>A ENSE decompõe o seu preço de referência da gasolina em cotação e frete, biocombustíveis, armazenagem, ISP e IVA. Na última decomposição, o ISP pesa ${h.l(h.D.ispLitro('g95'))} por litro, mais do que no gasóleo, o que explica parte da diferença habitual entre os dois. A variação semanal da cotação passa para a bomba à segunda-feira, e é essa variação que a ${h.a('proxima-semana', 'estimativa semanal')} tenta antecipar.</p>`;
    },
  },
  en: {
    slug: 'petrol-95-price', nav: 'Petrol 95 price', card: 'Standard petrol 95 today: posted average, lowest price and how it compares with diesel.',
    title: 'Petrol 95 price in Portugal today: posted average and lowest',
    description: 'Standard unleaded 95 price today in mainland Portugal: posted average, cheapest station, the DGEG daily average and the gap with diesel, district by district.',
    h1: 'Petrol 95 price today',
    intro: (h) => `Standard petrol 95 at ${h.num(h.D.statsDe('g95')!.n)} stations, by district and municipality, from DGEG data.`,
    resume: (h) => {
      const s = h.D.statsDe('g95')!, gs = h.D.statsDe('gs')!, p = h.D.pmd('g95')!, e = h.D.est('g95');
      const dif = s.media - gs.media;
      return `Standard petrol 95 is posted today at ${h.l(s.media)} a litre on average across ${h.num(s.n)} mainland stations; the cheapest asks ${h.l(s.min)}. That is ${h.c(Math.abs(dif))} ${dif < 0 ? 'below' : 'above'} standard diesel, at ${h.l(gs.media)}. The DGEG daily average, weighted by sales and net of discounts, was ${h.l(p.media)} on ${h.date(p.dia)}. At 6.5 litres per 100 km, every 100 km costs ${h.eur(s.media * 6.5, 2)} at the posted average. ${e && e.qualidade.publica ? `For Monday ${h.date(e.segunda)}, the estimate points to ${h.c(e.variacao, true)} a litre, based on the ENSE daily reference prices for petrol.` : ''} The calculator opens on Porto district, the largest station network; switch district and municipality to see your own area. Further down, a table ranks the 18 districts by their petrol 95 average and compares standard, premium and 98 on a typical tank.`;
    },
    faqs: (h) => [
      { q: 'Is petrol 95 cheaper than diesel in Portugal?', a: (() => { const d = h.D.statsDe('g95')!.media - h.D.statsDe('gs')!.media; return `Today ${d < 0 ? 'yes' : 'no'}: the gap in posted averages is ${h.c(d, true)} a litre for petrol 95 against standard diesel. Which of the two is cheaper shifts with each product’s international quotes. But a diesel car usually burns fewer litres per 100 km, so the cost per kilometre is what counts.`; })() },
      { q: 'What is the difference between standard and premium petrol 95?', a: `Both have a 95 octane rating. Premium carries each brand’s additives and costs ${h.c(h.D.statsDe('g95e')!.media - h.D.statsDe('g95')!.media)} more a litre on average in posted prices today. If your car’s manual asks for 95, either will do; premium is a commercial choice, not a technical requirement.` },
      { q: 'Which district has the cheapest petrol 95 today?', a: (() => { const t = top(h); return `Today it is ${t[0][0]} district, with a posted average of ${h.l(t[0][1].media)}, and the dearest is ${t[t.length - 1][0]}, at ${h.l(t[t.length - 1][1].media)}. The gap between the two, ${h.c(t[t.length - 1][1].media - t[0][1].media)}, is smaller than the one separating stations within a single municipality, so the station you choose matters more than the district.`; })() },
    ],
    body: (h) => {
      const t = top(h), g = h.D.statsDe('g95')!, ge = h.D.statsDe('g95e')!, g98 = h.D.statsDe('g98')!;
      return `<h2>Petrol 95 by district</h2>
${h.table(['District', 'Stations', 'Average', 'Lowest'], t.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'Standard petrol 95, posted price reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>Standard, premium or 98</h2>
<p>Pumps carry three unleaded petrols: standard 95, today at ${h.l(g.media)} on average, premium 95 at ${h.l(ge.media)}, and 98 at ${h.l(g98.media)}. 98 has a higher octane rating and only makes sense in engines that call for it; the ${h.a('preco-gasolina-98', 'petrol 98 page')} shows where it is sold and at what price. On a 45-litre tank, premium costs ${h.eur((ge.media - g.media) * 45, 2)} more and 98 ${h.eur((g98.media - g.media) * 45, 2)} more than standard.</p>
<h2>How the petrol price is built</h2>
<p>The ENSE breaks its petrol reference price down into quote and freight, biofuels, storage, ISP and VAT. In the latest breakdown, ISP weighs ${h.l(h.D.ispLitro('g95'))} a litre, more than on diesel, which explains part of the usual gap between the two. The weekly change in quotes reaches the pump on Monday, and that is the change the ${h.a('proxima-semana', 'weekly estimate')} tries to anticipate.</p>`;
    },
  },
});
