import { defineGuide, type Helpers } from '../../lib/guide-types';

const DESDE = '2025-01-06';
const DIAS = { pt: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'], en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] };
const aDia = (i: number) => `${i >= 5 ? 'ao' : 'à'} ${DIAS.pt[i]}`;
const ef = (h: Helpers, f: 'gs' | 'g95') => { const e = h.D.efeitoDiaSemana(f, DESDE); const lo = e.indexOf(Math.min(...e)), hi = e.indexOf(Math.max(...e)); return { e, lo, hi, dif: e[hi] - e[lo] }; };

export default defineGuide({
  id: 'quando-abastecer', group: 'contas', order: 5, tool: 'quando',
  related: ['proxima-semana', 'custo-deposito', 'postos-mais-baratos'],
  sources: ['dgegPmd', 'enseRef'],
  pt: {
    slug: 'quando-abastecer', nav: 'Quando abastecer', card: 'O dia da semana em que o combustível costuma estar mais barato, e quanto isso vale.',
    title: 'Melhor dia para abastecer: o peso do dia da semana no preço',
    description: 'Em que dia da semana o gasóleo e a gasolina costumam estar mais baratos, quanto vale abastecer nesse dia num ano e quando compensa esperar pela segunda-feira.',
    h1: 'Melhor dia da semana para abastecer',
    intro: (h) => `O que dizem ${h.num(h.D.semanasCompletas(DESDE))} semanas de preço médio diário da DGEG sobre o dia da semana.`,
    resume: (h) => {
      const g = ef(h, 'gs'), b = ef(h, 'g95'), n = h.D.semanasCompletas(DESDE), e = h.D.est('gs');
      return `Nas ${h.num(n)} semanas completas desde ${h.date(DESDE)}, o gasóleo simples foi em média mais barato ${aDia(g.lo)}, ${h.c(g.e[g.lo], true)} face à média da sua semana, e mais caro ${aDia(g.hi)}, ${h.c(g.e[g.hi], true)}. Na gasolina 95, o dia mais barato foi ${DIAS.pt[b.lo]} e o mais caro ${DIAS.pt[b.hi]}. A diferença entre o melhor e o pior dia é de ${h.c(g.dif)} por litro no gasóleo: num depósito de 50 litros, ${h.eur(g.dif * 50, 2)}; em três abastecimentos por mês durante um ano, ${h.eur(g.dif * 50 * 36, 2)}. É pouco ao lado da variação de uma semana para a outra: ${e && e.qualidade.publica ? `para ${h.date(e.segunda)} a estimativa é de ${h.c(e.variacao, true)} por litro` : 'a variação de segunda-feira pesa normalmente mais'}. Na prática, conta mais saber se o preço vai subir ou descer na segunda do que escolher o dia certo dentro da semana.`;
    },
    faqs: (h) => [
      { q: 'Porque é que o preço muda sobretudo à segunda-feira?', a: 'Porque as grandes marcas revêm os preços de referência uma vez por semana, com efeito à segunda. Durante a semana, os preços dos postos mexem pouco, com ajustes pontuais e promoções. Por isso o efeito do dia da semana é pequeno, e a grande mudança é a da passagem de domingo para segunda.' },
      { q: 'O fim de semana é sempre mais barato?', a: (() => { const g = ef(h, 'gs'); const fds = (g.e[5] + g.e[6]) / 2; return `Não sempre, mas em média o sábado e o domingo ficaram ${h.c(fds, true)} face à média da semana no gasóleo, nas semanas analisadas. Se na segunda-feira seguinte o preço subir, abastecer ao fim de semana junta as duas vantagens; se descer, é melhor esperar.`; })() },
      { q: 'A hora do dia conta?', a: 'Não temos dados para o medir: a DGEG publica um preço médio por dia, e cada posto comunica apenas o preço em vigor e a hora a que o mudou. A ideia de que o combustível rende mais de manhã, por estar mais frio, tem um efeito tão pequeno que não se vê na fatura.' },
    ],
    body: (h) => {
      const g = ef(h, 'gs'), b = ef(h, 'g95');
      return `<h2>O efeito de cada dia</h2>
${h.table(['Dia', 'Gasóleo simples', 'Gasolina 95'], DIAS.pt.map((d, i) => [d, h.c(g.e[i], true), h.c(b.e[i], true)]), `Diferença média para a média da semana, preço médio diário DGEG, ${h.num(h.D.semanasCompletas(DESDE))} semanas`, ['l', 'r', 'r'])}
<h2>Como se mede</h2>
<p>Para cada semana completa, de segunda a domingo, calculamos a média dos sete preços médios diários da DGEG e a diferença de cada dia para essa média. Depois fazemos a média dessas diferenças por dia da semana. Assim, uma semana de subida forte não faz parecer caro um dia que só o é por acaso. As semanas com algum dia em falta ficam de fora.</p>
<h2>A regra prática</h2>
<p>Primeiro, veja a ${h.a('proxima-semana', 'estimativa para segunda-feira')}: se for de subida de mais de um ou dois cêntimos, abasteça antes; se for de descida, espere. Depois, escolha o posto: a diferença entre postos do mesmo concelho é muitas vezes dez vezes maior do que a do dia da semana, como mostram os ${h.a('postos-mais-baratos', 'postos mais baratos')}.</p>`;
    },
  },
  en: {
    slug: 'when-to-fill-up', nav: 'When to fill up', card: 'The weekday when fuel tends to be cheapest, and what that is worth.',
    title: 'Best day to fill up in Portugal: the weekday effect on price',
    description: 'Which day of the week diesel and petrol tend to be cheapest in Portugal, what filling up on that day is worth in a year, and when waiting for Monday pays.',
    h1: 'Best day of the week to fill up',
    intro: (h) => `What ${h.num(h.D.semanasCompletas(DESDE))} weeks of DGEG daily averages say about the day of the week.`,
    resume: (h) => {
      const g = ef(h, 'gs'), b = ef(h, 'g95'), n = h.D.semanasCompletas(DESDE), e = h.D.est('gs');
      return `Over the ${h.num(n)} full weeks since ${h.date(DESDE)}, standard diesel was cheapest on average on ${DIAS.en[g.lo]}, ${h.c(g.e[g.lo], true)} against its week’s mean, and dearest on ${DIAS.en[g.hi]}, ${h.c(g.e[g.hi], true)}. For petrol 95, the cheapest day was ${DIAS.en[b.lo]} and the dearest ${DIAS.en[b.hi]}. The gap between the best and worst day is ${h.c(g.dif)} a litre on diesel: on a 50-litre tank, ${h.eur(g.dif * 50, 2)}; over three fills a month for a year, ${h.eur(g.dif * 50 * 36, 2)}. That is small next to the move from one week to the next: ${e && e.qualidade.publica ? `for ${h.date(e.segunda)} the estimate is ${h.c(e.variacao, true)} a litre` : 'Monday’s change usually weighs more'}. In practice, knowing whether the price will rise or fall on Monday matters more than picking the right day within the week. The table below gives the average gap for each day of the week, for diesel and for petrol 95, so you can see how small it is.`;
    },
    faqs: (h) => [
      { q: 'Why do Portuguese pump prices change mainly on Mondays?', a: 'Because the big brands review their reference prices once a week, effective on Monday. During the week, station prices move little, with occasional adjustments and promotions. So the weekday effect is small, and the big change comes between Sunday and Monday.' },
      { q: 'Is the weekend always cheaper?', a: (() => { const g = ef(h, 'gs'); const fds = (g.e[5] + g.e[6]) / 2; return `Not always, but on average Saturday and Sunday came out ${h.c(fds, true)} against the week’s mean for diesel over the weeks studied. If the price rises the following Monday, filling up at the weekend combines both advantages; if it falls, waiting is better.`; })() },
      { q: 'Does the time of day matter?', a: 'We have no data to measure it: the DGEG publishes one average price per day, and each station reports only its current price and the time it changed it. The idea that fuel goes further in the cool of the morning has an effect too small to show on the bill.' },
    ],
    body: (h) => {
      const g = ef(h, 'gs'), b = ef(h, 'g95');
      return `<h2>The effect of each day</h2>
${h.table(['Day', 'Standard diesel', 'Petrol 95'], DIAS.en.map((d, i) => [d, h.c(g.e[i], true), h.c(b.e[i], true)]), `Average gap to the week’s mean, DGEG daily average, ${h.num(h.D.semanasCompletas(DESDE))} weeks`, ['l', 'r', 'r'])}
<h2>How it is measured</h2>
<p>For each full week, Monday to Sunday, we take the mean of the seven DGEG daily averages and each day’s gap from that mean. Then we average those gaps by weekday. That way a week of sharp rises does not make a day look dear when it only happens to be. Weeks with a missing day are left out.</p>
<h2>The rule of thumb</h2>
<p>First, check the ${h.a('proxima-semana', 'Monday estimate')}: if it is a rise of more than a cent or two, fill up before; if it is a fall, wait. Then pick the station: the gap between stations in the same municipality is often ten times the weekday gap, as the ${h.a('postos-mais-baratos', 'cheapest stations')} show.</p>`;
    },
  },
});
