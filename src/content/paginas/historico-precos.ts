import { defineGuide, type Helpers } from '../../lib/guide-types';

const MES = { pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const nomeMes = (h: Helpers, m: string) => `${MES[h.lang][Number(m.slice(5, 7)) - 1]} ${h.lang === 'pt' ? 'de ' : ''}${m.slice(0, 4)}`;
const resumo = (h: Helpers, f: 'gs' | 'g95') => {
  const m = h.D.mensal(f), ult = m[m.length - 1], ant = m.find((x) => x.mes === `${Number(ult.mes.slice(0, 4)) - 1}${ult.mes.slice(4)}`);
  const hi = m.reduce((a, x) => (x.media > a.media ? x : a)), lo = m.reduce((a, x) => (x.media < a.media ? x : a));
  return { m, ult, ant, hi, lo, primeiro: m[0] };
};

export default defineGuide({
  id: 'historico-precos', group: 'contas', order: 2, tool: 'historico',
  related: ['proxima-semana', 'preco-gasoleo', 'preco-gasolina-95', 'impostos-combustiveis'],
  sources: ['dgegPmd', 'enseRef'],
  pt: {
    slug: 'historico-precos', nav: 'Histórico de preços', card: 'Evolução mensal do gasóleo e da gasolina desde 2023, com o preço médio diário oficial.',
    title: 'Histórico dos preços dos combustíveis desde 2023, mês a mês',
    description: 'Evolução do preço do gasóleo, da gasolina e do GPL mês a mês desde janeiro de 2023, com o preço médio diário da DGEG, o mês mais caro e o mais barato.',
    h1: 'Histórico dos preços dos combustíveis',
    intro: (h) => `Média mensal do preço médio diário da DGEG, de ${nomeMes(h, h.D.mensal('gs')[0].mes)} até hoje.`,
    resume: (h) => {
      const g = resumo(h, 'gs'), b = resumo(h, 'g95');
      return `Em ${nomeMes(h, g.ult.mes)}, o gasóleo simples custa em média ${h.l(g.ult.media)} por litro e a gasolina simples 95 ${h.l(b.ult.media)}, segundo o preço médio diário da DGEG, ponderado pelas vendas e com descontos. ${g.ant ? `Há um ano, em ${nomeMes(h, g.ant.mes)}, o gasóleo estava a ${h.l(g.ant.media)}, ou seja ${h.c(g.ult.media - g.ant.media, true)} por litro de diferença.` : ''} Desde ${nomeMes(h, g.primeiro.mes)}, o mês mais caro do gasóleo foi ${nomeMes(h, g.hi.mes)}, a ${h.l(g.hi.media)}, e o mais barato ${nomeMes(h, g.lo.mes)}, a ${h.l(g.lo.media)}: ${h.c(g.hi.media - g.lo.media)} entre os dois extremos, o que num depósito de 50 litros são ${h.eur((g.hi.media - g.lo.media) * 50, 2)}. Na gasolina 95, o extremo alto foi ${nomeMes(h, b.hi.mes)} e o baixo ${nomeMes(h, b.lo.mes)}. A calculadora desenha a curva do combustível escolhido em 12 ou 24 meses ou desde 2023 e compara o depósito de hoje com o do mês mais barato.`;
    },
    faqs: (h) => [
      { q: 'Porque usam o preço médio diário e não a média dos postos?', a: 'Porque é a única série oficial contínua desde 2023. A DGEG publica-a todos os dias com o mesmo método: média ponderada pelos litros vendidos, com descontos. A média dos preços afixados só existe para o dia em que lemos o registo dos postos, por isso não serve para comparar meses.' },
      { q: 'O mês em curso está completo?', a: (() => { const u = resumo(h, 'gs').ult; return `Não: o mês corrente conta só os dias já publicados pela DGEG, hoje ${h.num(u.dias)}. A média vai mudar até ao fim do mês. Para comparações exatas entre meses, use os meses já fechados da tabela, que têm todos os dias publicados.`; })() },
      { q: 'O que fez subir e descer os preços desde 2023?', a: 'Sobretudo as cotações internacionais do petróleo e dos produtos refinados e o câmbio do euro face ao dólar, que entram no preço de referência da ENSE. As mudanças do ISP decididas pelo Governo também se veem na série, porque mudam o preço de um dia para o outro em todos os postos.' },
    ],
    body: (h) => {
      const g = resumo(h, 'gs'), b = resumo(h, 'g95');
      const ult = g.m.slice(-13).reverse();
      return `<h2>Os últimos 13 meses</h2>
${h.table(['Mês', 'Gasóleo simples', 'Gasolina 95', 'Dias'], ult.map((x) => { const y = b.m.find((z) => z.mes === x.mes); return [nomeMes(h, x.mes), h.l(x.media), y ? h.l(y.media) : '—', x.dias]; }), 'Média mensal do preço médio diário DGEG, continente', ['l', 'r', 'r', 'r'])}
<h2>Gasóleo e gasolina não andam juntos</h2>
<p>Os dois combustíveis seguem cotações diferentes: o gasóleo depende do mercado dos destilados médios, a gasolina do das gasolinas, e cada um tem o seu ISP. Em ${nomeMes(h, g.ult.mes)}, a gasolina 95 está ${h.c(Math.abs(b.ult.media - g.ult.media))} ${b.ult.media < g.ult.media ? 'abaixo' : 'acima'} do gasóleo; em ${nomeMes(h, g.primeiro.mes)} estava ${h.c(Math.abs(b.primeiro.media - g.primeiro.media))} ${b.primeiro.media < g.primeiro.media ? 'abaixo' : 'acima'}. Quem compara um carro a gasóleo com um a gasolina deve olhar para vários meses, não para um dia.</p>
<h2>De onde vem a série</h2>
<p>A DGEG publica um preço médio diário por combustível para o continente, com mínimo, máximo e número de postos. Guardamos todos os dias desde janeiro de 2023 e calculamos a média simples dos dias de cada mês. Para a semana seguinte, a ${h.a('proxima-semana', 'estimativa de segunda-feira')} usa a mesma série como ponto de partida.</p>`;
    },
  },
  en: {
    slug: 'price-history', nav: 'Price history', card: 'Monthly diesel and petrol prices since 2023, from the official daily average.',
    title: 'Fuel price history in Portugal since 2023, month by month',
    description: 'How diesel, petrol and LPG prices in Portugal have moved month by month since January 2023, from the DGEG daily average, with the dearest and cheapest months.',
    h1: 'Fuel price history in Portugal',
    intro: (h) => `Monthly mean of the DGEG daily average, from ${nomeMes(h, h.D.mensal('gs')[0].mes)} to today.`,
    resume: (h) => {
      const g = resumo(h, 'gs'), b = resumo(h, 'g95');
      return `In ${nomeMes(h, g.ult.mes)}, standard diesel costs ${h.l(g.ult.media)} a litre on average and standard petrol 95 ${h.l(b.ult.media)}, according to the DGEG daily average, weighted by sales and net of discounts. ${g.ant ? `A year ago, in ${nomeMes(h, g.ant.mes)}, diesel was ${h.l(g.ant.media)}, a gap of ${h.c(g.ult.media - g.ant.media, true)} a litre.` : ''} Since ${nomeMes(h, g.primeiro.mes)}, diesel’s dearest month was ${nomeMes(h, g.hi.mes)}, at ${h.l(g.hi.media)}, and its cheapest ${nomeMes(h, g.lo.mes)}, at ${h.l(g.lo.media)}: ${h.c(g.hi.media - g.lo.media)} between the two, or ${h.eur((g.hi.media - g.lo.media) * 50, 2)} on a 50-litre tank. For petrol 95, the high was ${nomeMes(h, b.hi.mes)} and the low ${nomeMes(h, b.lo.mes)}. The calculator draws the chosen fuel’s curve over 12 or 24 months or since 2023, and compares today’s tank with the cheapest month’s. The table below lists the last 13 months for diesel and petrol 95 side by side, with the number of days behind each monthly figure.`;
    },
    faqs: (h) => [
      { q: 'Why use the daily average rather than the station average?', a: 'Because it is the only continuous official series since 2023. The DGEG publishes it every day with the same method: an average weighted by litres sold, net of discounts. The average of posted prices only exists for the day we read the station register, so it cannot be used to compare months.' },
      { q: 'Is the current month complete?', a: (() => { const u = resumo(h, 'gs').ult; return `No: the current month only counts the days the DGEG has published so far, ${h.num(u.dias)} today. Its average will move until the month ends. For exact comparisons between months, use the closed months in the table, which have every day published.`; })() },
      { q: 'What has driven fuel prices up and down since 2023?', a: 'Mainly international quotes for crude and refined products and the euro–dollar exchange rate, which feed into the ENSE reference price. ISP changes decided by the government also show in the series, because they shift the price from one day to the next at every station.' },
    ],
    body: (h) => {
      const g = resumo(h, 'gs'), b = resumo(h, 'g95');
      const ult = g.m.slice(-13).reverse();
      return `<h2>The last 13 months</h2>
${h.table(['Month', 'Standard diesel', 'Petrol 95', 'Days'], ult.map((x) => { const y = b.m.find((z) => z.mes === x.mes); return [nomeMes(h, x.mes), h.l(x.media), y ? h.l(y.media) : '—', x.dias]; }), 'Monthly mean of the DGEG daily average, mainland', ['l', 'r', 'r', 'r'])}
<h2>Diesel and petrol do not move together</h2>
<p>The two fuels follow different quotes: diesel depends on the middle-distillates market, petrol on the gasoline market, and each has its own ISP. In ${nomeMes(h, g.ult.mes)}, petrol 95 is ${h.c(Math.abs(b.ult.media - g.ult.media))} ${b.ult.media < g.ult.media ? 'below' : 'above'} diesel; in ${nomeMes(h, g.primeiro.mes)} it was ${h.c(Math.abs(b.primeiro.media - g.primeiro.media))} ${b.primeiro.media < g.primeiro.media ? 'below' : 'above'}. Anyone comparing a diesel car with a petrol one should look at several months, not one day.</p>
<h2>Where the series comes from</h2>
<p>The DGEG publishes a daily average per fuel for the mainland, with minimum, maximum and number of stations. We keep every day since January 2023 and take the simple mean of each month’s days. For the coming week, the ${h.a('proxima-semana', 'Monday estimate')} uses the same series as its starting point.</p>`;
    },
  },
});
