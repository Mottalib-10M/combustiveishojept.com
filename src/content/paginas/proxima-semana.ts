import { defineGuide } from '../../lib/guide-types';

export default defineGuide({
  id: 'proxima-semana', group: 'precos', order: 1, tool: 'previsao',
  related: ['preco-gasoleo', 'preco-gasolina-95', 'quando-abastecer', 'historico-precos'],
  sources: ['enseRef', 'dgegPmd', 'enseDecomp'],
  pt: {
    slug: 'proxima-semana', nav: 'Estimativa para segunda-feira', card: 'Quanto deve subir ou descer o gasóleo e a gasolina na próxima segunda-feira, com o erro passado à vista.',
    title: 'Combustíveis na próxima semana: sobe ou desce na segunda?',
    description: 'Estimativa da variação do gasóleo e da gasolina para a próxima segunda-feira, calculada com os preços de referência da ENSE e com o erro das semanas passadas.',
    h1: 'Combustíveis na próxima semana: estimativa para segunda-feira',
    intro: (h) => `Quanto devem mudar os preços em ${h.dia(h.D.est('gs')!.segunda, true)}, a partir dos preços de referência da ENSE desta semana.`,
    resume: (h) => {
      const e = h.D.est('gs')!, g = h.D.est('g95')!;
      return `Para segunda-feira, ${h.date(e.segunda)}, a estimativa é de ${h.c(e.variacao, true)} por litro no gasóleo simples e de ${h.c(g.variacao, true)} na gasolina simples 95, o que levaria o preço médio diário da DGEG para ${h.l(e.preco)} e ${h.l(g.preco)}. A conta usa ${e.dias} dos 5 dias úteis desta semana já publicados pela ENSE, até ${h.date(e.ultimoEnse)}, e compara-os com a média da semana anterior. Quando a semana fecha, na sexta-feira, a estimativa fica completa. Nas ${h.num(e.qualidade.semanas)} semanas testadas, o erro médio foi de ${h.c(e.qualidade.mae)} no gasóleo e de ${h.c(g.qualidade.mae)} na gasolina, contra ${h.c(e.qualidade.maeIgual)} e ${h.c(g.qualidade.maeIgual)} para quem dissesse que o preço não muda. O sentido da variação foi certo em ${h.pct(e.qualidade.sentido, 0)} das semanas no gasóleo. É uma estimativa estatística, não um preço oficial: cada marca decide o seu preço.`;
    },
    faqs: (h) => [
      { q: 'Porque é que os preços mudam à segunda-feira?', a: 'As grandes marcas atualizam os preços uma vez por semana, com efeito à segunda-feira, com base nas cotações dos produtos refinados e no câmbio do euro face ao dólar da semana anterior. Por isso a variação de segunda pode ser estimada antes: os custos que a determinam já são conhecidos durante a semana, através do preço de referência diário que a ENSE publica.' },
      { q: 'O que é o preço de referência da ENSE?', a: 'É um preço calculado todos os dias úteis pela Entidade Nacional para o Setor Energético a partir das cotações internacionais, do frete, da armazenagem, dos biocombustíveis e dos impostos. Não é o preço de nenhum posto, mas acompanha os custos que os postos repercutem. Usamos a variação da sua média semanal, não o seu nível.' },
      { q: 'Quando é que a estimativa fica completa?', a: `Depois de a ENSE publicar o preço de sexta-feira. Até lá, a conta usa os dias úteis já publicados e diz quantos são: hoje são ${h.D.est('gs')!.dias} de 5. Uma estimativa feita à segunda ou à terça depende de poucos dias e muda mais até ao fim da semana do que uma feita à quinta.` },
      { q: 'Vale a pena esperar por segunda-feira para abastecer?', a: `Só se a variação estimada for clara e o depósito o permitir. Num abastecimento de 50 litros, uma descida de 2 cêntimos poupa 1 euro. Se a estimativa for de subida, abastecer no fim de semana compensa; se for de poucas décimas de cêntimo, o dia escolhido pesa mais, como mostra a página ${h.a('quando-abastecer', 'quando abastecer')}.` },
    ],
    body: (h) => {
      const e = h.D.est('gs')!;
      const linhas = h.D.FUELS.map((f) => [f, h.D.est(f)] as const).filter(([, x]) => x);
      return `<h2>Como se faz a conta</h2>
<p>Primeiro, a média dos preços de referência diários da ENSE desta semana, só com os dias já publicados. Depois, a média da semana anterior. A diferença entre as duas, multiplicada por um coeficiente β, é a variação estimada do preço médio diário da DGEG de segunda-feira para segunda-feira. O coeficiente mede quanto da variação da referência costuma chegar à bomba: no gasóleo é hoje ${h.num(e.beta, 2)}. Não chega a 1 porque parte da variação é absorvida por margens e descontos, e porque as marcas não seguem a referência ao cêntimo.</p>
<p>O coeficiente é recalculado em cada semana só com o passado: a semana que se estima nunca entra na sua própria conta. É assim que se mede o erro honestamente, como se a estimativa tivesse sido publicada nessa altura.</p>
<h2>O erro, combustível a combustível</h2>
${h.table(['Combustível', 'Erro médio', 'Erro de «fica igual»', 'Estimativa'], linhas.map(([f, x]) => [h.fn(f), h.c(x!.qualidade.mae), h.c(x!.qualidade.maeIgual), x!.qualidade.publica ? `${h.c(x!.variacao, true)}` : 'não publicada']), `Retroteste em ${h.num(e.qualidade.semanas)} semanas, erro médio absoluto por litro`, ['l', 'r', 'r', 'r'])}
<p>O GPL Auto é a exceção: o seu preço muda pouco e segue mal a referência diária, e a estimativa errava mais do que dizer que nada mudava. Por isso a página ${h.a('preco-gpl-auto', 'do GPL Auto')} mostra os preços sem estimativa.</p>
<h2>O que a estimativa não sabe</h2>
<p>Uma mudança de impostos anunciada para a semana seguinte, uma campanha de uma marca ou um movimento brusco do petróleo na sexta-feira à tarde não estão no preço de referência da semana. O preço de cada posto também pode afastar-se da média: a estimativa diz respeito ao preço médio diário publicado pela DGEG, não ao posto da sua rua. Para esse, veja o preço afixado nas páginas do ${h.a('preco-gasoleo', 'gasóleo')} ou da ${h.a('preco-gasolina-95', 'gasolina 95')}.</p>`;
    },
  },
  en: {
    slug: 'next-week', nav: 'Monday estimate', card: 'How much diesel and petrol should rise or fall next Monday, with the past error in plain view.',
    title: 'Fuel prices next week in Portugal: up or down on Monday?',
    description: 'Estimated change in diesel and petrol prices for next Monday in Portugal, worked out from ENSE reference prices and shown with the error of past weeks.',
    h1: 'Fuel prices next week: the Monday estimate',
    intro: (h) => `How much prices should move on ${h.dia(h.D.est('gs')!.segunda, true)}, from this week’s ENSE reference prices.`,
    resume: (h) => {
      const e = h.D.est('gs')!, g = h.D.est('g95')!;
      return `For Monday ${h.date(e.segunda)}, the estimate is ${h.c(e.variacao, true)} a litre on standard diesel and ${h.c(g.variacao, true)} on standard petrol 95, which would take the DGEG daily average to ${h.l(e.preco)} and ${h.l(g.preco)}. The sum uses ${e.dias} of this week’s 5 working days already published by the ENSE, up to ${h.date(e.ultimoEnse)}, and compares them with last week’s average. Once the week closes on Friday, the estimate is complete. Over ${h.num(e.qualidade.semanas)} tested weeks, the average error was ${h.c(e.qualidade.mae)} on diesel and ${h.c(g.qualidade.mae)} on petrol, against ${h.c(e.qualidade.maeIgual)} and ${h.c(g.qualidade.maeIgual)} for anyone saying the price would not change. The direction was right in ${h.pct(e.qualidade.sentido, 0)} of weeks for diesel. It is a statistical estimate, not an official price: each brand sets its own.`;
    },
    faqs: (h) => [
      { q: 'Why do Portuguese fuel prices change on Mondays?', a: 'The big brands update prices once a week, effective on Monday, based on the previous week’s quotes for refined products and the euro–dollar exchange rate. That is why Monday’s move can be estimated in advance: the costs behind it are already known during the week, through the daily reference price the ENSE publishes.' },
      { q: 'What is the ENSE reference price?', a: 'It is a price the National Entity for the Energy Sector works out every working day from international quotes, freight, storage, biofuels and taxes. It is no station’s price, but it tracks the costs stations pass on. We use the change in its weekly average, not its level.' },
      { q: 'When is the estimate complete?', a: `Once the ENSE has published Friday’s price. Until then, the sum uses the working days already published and says how many: today it is ${h.D.est('gs')!.dias} of 5. An estimate made on Monday or Tuesday rests on few days and shifts more by the end of the week than one made on Thursday.` },
      { q: 'Is it worth waiting for Monday to fill up?', a: `Only if the estimated move is clear and your tank allows it. On a 50-litre fill, a 2-cent fall saves €1. If the estimate is a rise, filling up at the weekend pays; if it is a few tenths of a cent, the day you choose matters more, as the ${h.a('quando-abastecer', 'when to fill up')} page shows.` },
    ],
    body: (h) => {
      const e = h.D.est('gs')!;
      const linhas = h.D.FUELS.map((f) => [f, h.D.est(f)] as const).filter(([, x]) => x);
      return `<h2>How the sum works</h2>
<p>First, the average of this week’s ENSE daily reference prices, using only the days already published. Then last week’s average. The gap between the two, multiplied by a coefficient β, is the estimated change in the DGEG daily average from one Monday to the next. The coefficient measures how much of the reference move usually reaches the pump: for diesel it is currently ${h.num(e.beta, 2)}. It is below 1 because part of the move is absorbed by margins and discounts, and brands do not follow the reference to the cent.</p>
<p>The coefficient is refitted each week using only the past: the week being estimated never enters its own sum. That is how the error is measured honestly, as if the estimate had been published at the time.</p>
<h2>The error, fuel by fuel</h2>
${h.table(['Fuel', 'Average error', '“No change” error', 'Estimate'], linhas.map(([f, x]) => [h.fn(f), h.c(x!.qualidade.mae), h.c(x!.qualidade.maeIgual), x!.qualidade.publica ? `${h.c(x!.variacao, true)}` : 'not published']), `Back-test over ${h.num(e.qualidade.semanas)} weeks, mean absolute error per litre`, ['l', 'r', 'r', 'r'])}
<p>LPG is the exception: its price moves little and tracks the daily reference poorly, and the estimate missed by more than saying nothing would change. So the ${h.a('preco-gpl-auto', 'LPG page')} shows prices with no estimate.</p>
<h2>What the estimate cannot know</h2>
<p>A tax change announced for the following week, a brand’s promotion or a sharp oil move late on Friday are not in the week’s reference price. Each station’s price can also stray from the average: the estimate is about the DGEG daily average, not the station on your street. For that one, see the posted price on the ${h.a('preco-gasoleo', 'diesel')} or ${h.a('preco-gasolina-95', 'petrol 95')} pages.</p>`;
    },
  },
});
