import { defineGuide, type Helpers } from '../../lib/guide-types';

const custo100 = (h: Helpers) => { const gpl = h.D.statsDe('gpl')!.media, g95 = h.D.statsDe('g95')!.media; return { gpl: gpl * 8.5, g95: g95 * 6.5 }; };

export default defineGuide({
  id: 'preco-gpl-auto', group: 'precos', order: 5, tool: 'precos', toolProps: { fuel: 'gpl' },
  related: ['custo-deposito', 'preco-gasolina-95', 'proxima-semana'],
  sources: ['dgegPortal', 'dgegPmd', 'enseDecomp'],
  pt: {
    slug: 'preco-gpl-auto', nav: 'Preço do GPL Auto', card: 'GPL Auto hoje: média afixada, postos que o vendem e custo por 100 km face à gasolina.',
    title: 'Preço do GPL Auto hoje: média, postos e custo aos 100 km',
    description: 'Preço do GPL Auto hoje no continente: média afixada, posto mais barato, quantos postos o vendem por distrito e quanto custa cada 100 km face à gasolina 95.',
    h1: 'Preço do GPL Auto hoje',
    intro: (h) => `GPL Auto nos ${h.num(h.D.statsDe('gpl')!.n)} postos que comunicam o seu preço à DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('gpl')!, p = h.D.pmd('gpl')!, k = custo100(h), q = h.D.est('gpl')?.qualidade;
      return `O GPL Auto está hoje afixado em média a ${h.l(s.media)} por litro, com o posto mais barato a ${h.l(s.min)}, em ${h.num(s.n)} postos do continente. O preço médio diário da DGEG, ponderado pelas vendas, foi de ${h.l(p.media)} a ${h.date(p.dia)}. Um carro a GPL gasta mais litros do que a gasolina: com 8,5 litros aos 100 km, cada 100 km custam ${h.eur(k.gpl, 2)}, contra ${h.eur(k.g95, 2)} para um carro a gasolina 95 com 6,5 litros, aos preços médios de hoje. Ao contrário do gasóleo e da gasolina, não publicamos estimativa para segunda-feira: ${q ? `nas ${h.num(q.semanas)} semanas testadas errava em média ${h.c(q.mae)}, mais do que dizer que o preço não muda (${h.c(q.maeIgual)})` : 'faltam dados para a testar'}. A calculadora mostra os postos com GPL em cada concelho, com a hora da última atualização.`;
    },
    faqs: (h) => [
      { q: 'Porque é que não há estimativa semanal para o GPL Auto?', a: (() => { const q = h.D.est('gpl')?.qualidade; return `Porque não passa no teste. O preço do GPL muda pouco de semana para semana e segue mal o preço de referência diário da ENSE para o GPL. ${q ? `A estimativa errava em média ${h.c(q.mae)} por semana, contra ${h.c(q.maeIgual)} para a hipótese de preço igual.` : ''} Publicar uma estimativa pior do que essa hipótese seria enganar quem a lê.`; })() },
      { q: 'Quantos postos vendem GPL Auto em Portugal continental?', a: `Hoje ${h.num(h.D.statsDe('gpl')!.n)} postos comunicam preço de GPL Auto à DGEG, muito menos do que os que vendem gasóleo (${h.num(h.D.statsDe('gs')!.n)}). A rede concentra-se nos distritos com mais população; nos do interior pode haver concelhos sem nenhum posto com GPL, e convém planear o abastecimento.` },
      { q: 'Porque é que o GPL é tão mais barato por litro?', a: (() => { const d = h.D.decompEnse('gpl'); const isp = d.partes.find((x) => x.label === 'ISP')!.valor; return `Sobretudo pelo imposto: na última decomposição da ENSE, o ISP do GPL é de ${h.l(isp)} por litro, muito abaixo do da gasolina. O produto em si também custa menos por litro. Mas o GPL tem menos energia por litro, por isso o carro consome mais litros para a mesma distância.`; })() },
    ],
    body: (h) => {
      const ds = Object.entries(h.D.porDistrito('gpl')).sort((a, b) => b[1].n - a[1].n), k = custo100(h);
      return `<h2>Onde há GPL Auto</h2>
${h.table(['Distrito', 'Postos com GPL', 'Média', 'Mínimo'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'GPL Auto, preço afixado comunicado à DGEG', ['l', 'r', 'r', 'r'])}
<h2>Compensa um carro a GPL?</h2>
<p>A conta faz-se por quilómetro, não por litro. Com os consumos de exemplo, um carro a GPL gasta hoje ${h.eur(k.gpl, 2)} aos 100 km e um a gasolina 95 ${h.eur(k.g95, 2)}. Em 15 000 km por ano, a diferença é de ${h.eur((k.g95 - k.gpl) * 150)}. O consumo real depende do carro: use o seu na página do ${h.a('custo-deposito', 'custo do depósito')}, que aceita qualquer combustível e qualquer consumo.</p>
<h2>Média afixada e preço oficial</h2>
<p>${(() => { const gap = (f: 'gpl' | 'gs') => h.D.statsDe(f)!.media - h.D.pmd(f)!.media; return `Hoje a média afixada do GPL fica ${h.c(gap('gpl'))} acima do preço médio diário da DGEG; no gasóleo, a mesma diferença é de ${h.c(gap('gs'))}.`; })()} A média ponderada dá mais peso aos postos que vendem mais litros e desconta as promoções. Para comparar a sua bomba com o resto do país, use a média afixada; para seguir a tendência, o ${h.a('historico-precos', 'histórico')} do preço médio diário.</p>`;
    },
  },
  en: {
    slug: 'lpg-price', nav: 'LPG price', card: 'Autogas (LPG) today: posted average, stations that sell it and cost per 100 km against petrol.',
    title: 'LPG price in Portugal today: stations and cost per 100 km',
    description: 'LPG autogas price today in mainland Portugal: posted average, cheapest station, how many stations sell it per district and what 100 km costs against petrol 95.',
    h1: 'LPG (autogas) price today',
    intro: (h) => `Autogas at the ${h.num(h.D.statsDe('gpl')!.n)} stations that report its price to the DGEG.`,
    resume: (h) => {
      const s = h.D.statsDe('gpl')!, p = h.D.pmd('gpl')!, k = custo100(h), q = h.D.est('gpl')?.qualidade;
      return `LPG autogas is posted today at ${h.l(s.media)} a litre on average, with the cheapest station at ${h.l(s.min)}, across ${h.num(s.n)} mainland stations. The DGEG daily average, weighted by sales, was ${h.l(p.media)} on ${h.date(p.dia)}. An LPG car burns more litres than a petrol one: at 8.5 litres per 100 km, every 100 km costs ${h.eur(k.gpl, 2)}, against ${h.eur(k.g95, 2)} for a petrol 95 car at 6.5 litres, at today’s average prices. Unlike diesel and petrol, we publish no Monday estimate: ${q ? `over ${h.num(q.semanas)} tested weeks it missed by ${h.c(q.mae)} on average, more than saying the price would not change (${h.c(q.maeIgual)})` : 'there is not enough data to test it'}. The calculator lists the LPG stations in each municipality, with their last update time. The district table further down shows how many LPG stations each district has, which matters more for autogas drivers than a cent or two.`;
    },
    faqs: (h) => [
      { q: 'Why is there no weekly estimate for LPG?', a: (() => { const q = h.D.est('gpl')?.qualidade; return `Because it fails the test. LPG prices move little from week to week and track the ENSE daily LPG reference price poorly. ${q ? `The estimate missed by ${h.c(q.mae)} a week on average, against ${h.c(q.maeIgual)} for the unchanged-price assumption.` : ''} Publishing an estimate worse than that assumption would mislead readers.`; })() },
      { q: 'How many stations sell LPG in mainland Portugal?', a: `Today ${h.num(h.D.statsDe('gpl')!.n)} stations report an LPG price to the DGEG, far fewer than those selling diesel (${h.num(h.D.statsDe('gs')!.n)}). The network is concentrated in the most populous districts; inland there can be municipalities with no LPG station at all, so it pays to plan your fills.` },
      { q: 'Why is LPG so much cheaper per litre?', a: (() => { const d = h.D.decompEnse('gpl'); const isp = d.partes.find((x) => x.label === 'ISP')!.valor; return `Mostly because of tax: in the latest ENSE breakdown, LPG’s ISP is ${h.l(isp)} a litre, well below petrol’s. The product itself also costs less per litre. But LPG holds less energy per litre, so the car burns more litres for the same distance.`; })() },
    ],
    body: (h) => {
      const ds = Object.entries(h.D.porDistrito('gpl')).sort((a, b) => b[1].n - a[1].n), k = custo100(h);
      return `<h2>Where to find LPG</h2>
${h.table(['District', 'LPG stations', 'Average', 'Lowest'], ds.map(([d, s]) => [h.a(h.D.slug(d), d), s.n, h.l(s.media), h.l(s.min)]), 'LPG autogas, posted price reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>Does an LPG car pay off?</h2>
<p>The sum is per kilometre, not per litre. With the example consumptions, an LPG car costs ${h.eur(k.gpl, 2)} per 100 km today and a petrol 95 car ${h.eur(k.g95, 2)}. Over 15,000 km a year, the gap is ${h.eur((k.g95 - k.gpl) * 150)}. Real consumption depends on the car: use yours on the ${h.a('custo-deposito', 'tank cost')} page, which takes any fuel and any consumption.</p>
<h2>Posted average and official price</h2>
<p>${(() => { const gap = (f: 'gpl' | 'gs') => h.D.statsDe(f)!.media - h.D.pmd(f)!.media; return `Today the LPG posted average sits ${h.c(gap('gpl'))} above the DGEG daily average; for diesel, the same gap is ${h.c(gap('gs'))}.`; })()} The weighted average gives more weight to stations that sell more litres and nets out promotions. To compare your pump with the rest of the country, use the posted average; to follow the trend, the ${h.a('historico-precos', 'history')} of the daily average.</p>`;
    },
  },
});
