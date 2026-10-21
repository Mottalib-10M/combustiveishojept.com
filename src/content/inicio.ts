/** Textes de l'accueil (page pilier de chaque langue). Tous les chiffres viennent de H.D / H.E. */
import type { Helpers, FAQ } from '../lib/guide-types';

interface HomeText { title: string; description: string; h1: string; intro: (h: Helpers) => string; resume: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[]; body: (h: Helpers) => string }

const extremos = (h: Helpers) => {
  const g = h.D.porDistrito('gs');
  const o = Object.entries(g).sort((a, b) => a[1].media - b[1].media);
  return { barato: o[0], caro: o[o.length - 1] };
};

export const HOME: Record<'pt' | 'en', HomeText> = {
  pt: {
    title: 'Preço dos combustíveis hoje: gasóleo e gasolina por concelho',
    description: 'Preço do gasóleo e da gasolina hoje em cada concelho, com os dados oficiais da DGEG, os postos mais baratos e a estimativa para segunda-feira, sem registo.',
    h1: 'Preço dos combustíveis hoje',
    intro: (h) => `Média afixada em cada concelho, postos mais baratos e estimativa para ${h.dia(h.D.est('gs')?.segunda ?? h.D.HOJE, true)}, a partir dos dados oficiais da DGEG.`,
    resume: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, e = h.D.est('gs'), e95 = h.D.est('g95');
      const pg = h.D.pmd('gs')!, p95 = h.D.pmd('g95')!;
      return `Hoje, o gasóleo simples está afixado em média a ${h.l(gs.media)} e a gasolina simples 95 a ${h.l(g95.media)} nos ${h.num(gs.n)} postos do continente que comunicam o gasóleo à Direção-Geral de Energia e Geologia (DGEG). O posto mais barato pede ${h.l(gs.min)} pelo gasóleo e ${h.l(g95.min)} pela gasolina. Estas médias contam cada posto uma vez; o preço médio diário que a DGEG publica pondera as vendas e desconta as promoções, e ficou em ${h.l(pg.media)} no gasóleo e ${h.l(p95.media)} na gasolina a ${h.date(pg.dia)}. ${e && e.qualidade.publica ? `Para segunda-feira, ${h.date(e.segunda)}, a nossa estimativa aponta para ${h.c(e.variacao, true)} no gasóleo` : 'Para segunda-feira não há estimativa publicada para o gasóleo'}${e95 && e95.qualidade.publica ? ` e ${h.c(e95.variacao, true)} na gasolina` : ''}, calculada com os preços de referência diários da ENSE desta semana. É uma estimativa, não um preço oficial: cada posto fixa o seu preço livremente.`;
    },
    faqs: (h) => [
      { q: 'De onde vêm os preços por posto?', a: `Desde o Decreto-Lei n.º 243/2008, todos os postos de abastecimento do continente têm de comunicar à DGEG os preços que praticam, sempre que os alteram. Lemos esse registo público todos os dias e mostramos o preço de cada posto com a data e a hora da sua última comunicação. Hoje são ${h.num(h.D.POSTOS.postos.length)} postos. Um preço desatualizado é responsabilidade do posto que não o comunicou.` },
      { q: 'Porque é que a vossa média é mais alta do que a da DGEG?', a: 'Medimos coisas diferentes. A nossa média é simples: cada posto conta uma vez, seja uma bomba de aldeia ou um hipermercado que vende dez vezes mais. A DGEG pondera pelos litros vendidos e desconta as promoções, e os postos com mais vendas são em geral os mais baratos. Por isso o preço médio diário oficial fica normalmente alguns cêntimos abaixo da média afixada.' },
      { q: 'A estimativa de segunda-feira é fiável?', a: `É uma estimativa estatística com o erro à vista. No gasóleo, nas ${h.num(h.D.est('gs')?.qualidade.semanas ?? 0)} semanas testadas, errou em média ${h.c(h.D.est('gs')?.qualidade.mae ?? 0)}, contra ${h.c(h.D.est('gs')?.qualidade.maeIgual ?? 0)} para quem dissesse que o preço não muda. Quando não bate essa referência, como no GPL Auto, não a publicamos.` },
      { q: 'Os preços incluem descontos de cartão?', a: 'Não. O preço por posto é o preço de venda afixado, igual para todos os clientes, tal como o posto o comunica à DGEG. Descontos de cartões de fidelização, de supermercado ou de frota não entram. O preço médio diário da DGEG já desconta as promoções gerais, mas também não conhece o seu cartão pessoal.' },
      { q: 'Que combustíveis aparecem na calculadora?', a: 'Os seis que a DGEG acompanha em todos os postos: gasóleo simples e especial, gasolina simples 95, gasolina especial 95, gasolina 98 e GPL Auto. O gasóleo colorido e marcado, reservado a usos como o agrícola, só aparece na página da Madeira, porque o despacho regional lhe fixa um preço máximo próprio.' },
      { q: 'Com que frequência são atualizados os preços deste site?', a: `O programa lê os dados oficiais três vezes por dia e reconstrói todas as páginas. A última leitura dos postos é de ${h.D.POSTOS.ultimaAtualizacao}. Cada posto, por sua vez, tem a hora da sua própria última comunicação à DGEG, que mostramos ao lado do preço.` },
      { q: 'Preciso de criar conta ou dar o meu e-mail?', a: 'Não. Não há registo, não há alertas por correio eletrónico e não pedimos telefone. A calculadora funciona no seu navegador e o que escreve não é enviado a nenhum servidor. Se quiser guardar uma pesquisa, use a ligação para partilhar, que leva as suas escolhas no endereço da página.' },
    ],
    body: (h) => {
      const x = extremos(h), gs = h.D.statsDe('gs')!, tipos = h.D.porTipo('gs');
      const ae = tipos['Auto-estrada'], hip = tipos['Área comercial (Hipermercados)'];
      const isp = h.D.ispLitro('gs'), d = h.E.decompor(gs.media, isp);
      const m = h.D.MADEIRA_ATUAL;
      return `<h2>Como ler os preços desta página</h2>
<p>A calculadora parte do registo oficial: cada posto comunica à DGEG o preço que afixa e a hora a que o mudou. Escolha o combustível, o distrito e o concelho, e vê a média dos postos dessa zona, o mais barato e quanto custa encher o depósito. A lista mostra os cinco postos mais baratos com a hora da última atualização, para saber se o preço é de hoje ou de há três dias. A média do continente e o preço médio diário da DGEG aparecem lado a lado, porque não medem o mesmo: o primeiro diz quanto pede um posto típico, o segundo quanto pagou, em média, cada litro vendido.</p>
<h2>Onde se paga mais e menos</h2>
<p>Entre distritos, a diferença é menor do que se pensa: hoje o gasóleo vai de ${h.l(x.barato[1].media)} em média no distrito de ${x.barato[0]} a ${h.l(x.caro[1].media)} no de ${x.caro[0]}, ou seja ${h.c(x.caro[1].media - x.barato[1].media)} por litro. Dentro do mesmo concelho a distância costuma ser maior do que entre distritos: o que pesa é o tipo de posto. Nas autoestradas o gasóleo está afixado em média a ${h.l(ae.media)}, nos postos junto a hipermercados a ${h.l(hip.media)}. Num depósito de 50 litros, são ${h.eur((ae.media - hip.media) * 50, 2)} de diferença. Há páginas para cada um dos 18 distritos, como ${h.a('lisboa', 'Lisboa')}, ${h.a('porto', 'Porto')} ou ${h.a('faro', 'Faro')}, e uma com ${h.a('postos-mais-baratos', 'os postos mais baratos do país')}.</p>
<h2>Porque é que os preços mudam à segunda-feira</h2>
<p>As grandes marcas revêm os preços uma vez por semana, com efeito à segunda-feira, seguindo as cotações internacionais dos produtos refinados e o câmbio da semana anterior. A ENSE, a entidade pública que fiscaliza o setor, publica todos os dias úteis um preço de referência que reflete esses custos. A nossa ${h.a('proxima-semana', 'estimativa para a próxima semana')} mede quanto a média da semana em curso se afastou da anterior e aplica a relação observada nas semanas passadas. O ${h.a('historico-precos', 'histórico de preços')} mostra a evolução mês a mês desde 2023.</p>
<h2>Quanto do litro são impostos</h2>
<p>Com o gasóleo à média afixada de hoje, ${h.l(d.iva)} por litro são IVA à taxa de 23 % e ${h.l(d.isp)} são imposto sobre os produtos petrolíferos (ISP), com a contribuição de serviço rodoviário e a taxa de carbono, segundo a última decomposição da ENSE. No total, ${h.pct(d.partImpostos)} do preço. A página dos ${h.a('impostos-combustiveis', 'impostos nos combustíveis')} faz a conta para o preço que escrever e para cada combustível.</p>
<h2>Madeira e Açores</h2>
<p>As regiões autónomas não estão no registo da DGEG: têm preços máximos fixados pelos governos regionais. Na Madeira, o despacho conjunto n.º ${m.despacho} fixou a gasolina 95 em ${h.l(m.g95)} e o gasóleo em ${h.l(m.gs)} a partir de ${h.date(m.vigor)}; a ${h.a('madeira', 'página da Madeira')} mostra as semanas anteriores. Para os ${h.a('acores', 'Açores')}, cujo jornal oficial não conseguimos ler de forma automática, a calculadora usa o preço que escrever.</p>
<h2>Que fontes usamos</h2>
<p>Preços por posto e preço médio diário: ${h.src('dgegPortal', 'portal Preços dos Combustíveis da DGEG')} e ${h.src('dgegPmd', 'estatística do preço médio diário')}. Preços de referência e decomposição: ${h.src('enseRef', 'ENSE')}. Obrigação de comunicação: ${h.src('dl243', 'Decreto-Lei n.º 243/2008')}. Taxa de IVA: ${h.src('civa18', 'Código do IVA, artigo 18.º')}. A informação da DGEG é de utilização livre, com identificação da fonte e da data e hora da última atualização dos preços, que mostramos em cada página. O detalhe está em ${h.a('method', 'método e fontes')}.</p>`;
    },
  },
  en: {
    title: 'Fuel prices in Portugal today: diesel and petrol by area',
    description: 'Diesel and petrol prices today in every Portuguese municipality, from official DGEG data, with the cheapest stations and next Monday’s estimate, no sign-up.',
    h1: 'Fuel prices in Portugal today',
    intro: (h) => `Average posted price in each municipality, cheapest stations and an estimate for ${h.dia(h.D.est('gs')?.segunda ?? h.D.HOJE, true)}, from official DGEG data.`,
    resume: (h) => {
      const gs = h.D.statsDe('gs')!, g95 = h.D.statsDe('g95')!, e = h.D.est('gs'), e95 = h.D.est('g95');
      const pg = h.D.pmd('gs')!, p95 = h.D.pmd('g95')!;
      return `Today standard diesel is posted at ${h.l(gs.media)} on average and standard petrol 95 at ${h.l(g95.media)} across the ${h.num(gs.n)} mainland stations that report diesel to the Directorate-General for Energy and Geology (DGEG). The cheapest station asks ${h.l(gs.min)} for diesel and ${h.l(g95.min)} for petrol. These averages count each station once; the daily average the DGEG publishes weights sales and nets out discounts, and stood at ${h.l(pg.media)} for diesel and ${h.l(p95.media)} for petrol on ${h.date(pg.dia)}. ${e && e.qualidade.publica ? `For Monday ${h.date(e.segunda)}, our estimate points to ${h.c(e.variacao, true)} on diesel` : 'No Monday estimate is published for diesel'}${e95 && e95.qualidade.publica ? ` and ${h.c(e95.variacao, true)} on petrol` : ''}, worked out from this week’s ENSE daily reference prices. It is an estimate, not an official price: every station sets its own price freely. Every page shows the date and time of the DGEG data it uses, and the calculator below starts with Lisbon district, which you can change in one tap.`;
    },
    faqs: (h) => [
      { q: 'Where do the station prices come from?', a: `Since Decree-Law 243/2008, every filling station in mainland Portugal must report its prices to the DGEG whenever it changes them. We read that public register every day and show each station’s price with the date and time of its last report. Today that is ${h.num(h.D.POSTOS.postos.length)} stations. An out-of-date price means the station has not reported its change.` },
      { q: 'Why is your average higher than the DGEG’s?', a: 'We measure different things. Ours is a simple average: each station counts once, whether it is a village pump or a hypermarket selling ten times as much. The DGEG weights by litres sold and nets out discounts, and the busiest stations tend to be the cheapest. So the official daily average usually sits a few cents below the posted average.' },
      { q: 'How reliable is the Monday estimate?', a: `It is a statistical estimate with its error on show. For diesel, over ${h.num(h.D.est('gs')?.qualidade.semanas ?? 0)} tested weeks it missed by ${h.c(h.D.est('gs')?.qualidade.mae ?? 0)} on average, against ${h.c(h.D.est('gs')?.qualidade.maeIgual ?? 0)} for anyone saying the price stays the same. Where it does not beat that benchmark, as with LPG, we do not publish it.` },
      { q: 'Do the prices include loyalty-card discounts?', a: 'No. A station’s price is its posted retail price, the same for every customer, as reported to the DGEG. Loyalty, supermarket or fleet-card discounts are not included. The DGEG daily average already nets out general promotions, but it does not know about your personal card either.' },
      { q: 'Which fuels does the calculator cover?', a: 'The six the DGEG tracks at every station: standard and premium diesel, standard petrol 95, premium petrol 95, petrol 98 and LPG autogas. Coloured (marked) diesel, reserved for uses such as farming, only appears on the Madeira page, because the regional order sets its own maximum price for it.' },
      { q: 'How often are this site’s prices updated?', a: `The script reads the official data three times a day and rebuilds every page. The latest read of the stations is from ${h.D.POSTOS.ultimaAtualizacao}. Each station, in turn, carries the time of its own last report to the DGEG, which we show next to its price.` },
      { q: 'Do I need an account or to give my e-mail?', a: 'No. There is no sign-up, no e-mail alert and no phone number asked for. The calculator runs in your browser and what you type is sent to no server. To keep a search, use the share link, which carries your choices in the page address.' },
    ],
    body: (h) => {
      const x = extremos(h), gs = h.D.statsDe('gs')!, tipos = h.D.porTipo('gs');
      const ae = tipos['Auto-estrada'], hip = tipos['Área comercial (Hipermercados)'];
      const isp = h.D.ispLitro('gs'), d = h.E.decompor(gs.media, isp);
      const m = h.D.MADEIRA_ATUAL;
      return `<h2>How to read the prices on this page</h2>
<p>The calculator starts from the official register: each station reports to the DGEG the price it posts and the time it changed it. Pick the fuel, the district and the municipality, and you get the average of the stations there, the cheapest one and what a full tank costs. The list shows the five cheapest stations with the time of their last update, so you can tell whether a price is from today or three days ago. The mainland average and the DGEG daily average sit side by side because they measure different things: the first is what a typical station asks, the second what each litre sold actually cost on average.</p>
<h2>Where you pay more and less</h2>
<p>Between districts the gap is smaller than people think: today diesel runs from ${h.l(x.barato[1].media)} on average in ${x.barato[0]} district to ${h.l(x.caro[1].media)} in ${x.caro[0]}, or ${h.c(x.caro[1].media - x.barato[1].media)} a litre. Within one municipality the spread is usually wider than between districts, because what matters is the kind of station. On motorways diesel is posted at ${h.l(ae.media)} on average, at stations next to hypermarkets at ${h.l(hip.media)}. On a 50-litre tank that is ${h.eur((ae.media - hip.media) * 50, 2)}. Each of the 18 districts has its own page, such as ${h.a('lisboa', 'Lisbon')}, ${h.a('porto', 'Porto')} or ${h.a('faro', 'Faro')}, and one lists ${h.a('postos-mais-baratos', 'the cheapest stations in the country')}.</p>
<h2>Why prices change on Mondays</h2>
<p>The big brands review prices once a week, effective on Monday, following the previous week’s international quotes for refined products and the exchange rate. The ENSE, the public body that supervises the sector, publishes a reference price every working day that tracks those costs. Our ${h.a('proxima-semana', 'estimate for next week')} measures how far the current week’s average has moved from the last one and applies the relationship seen in past weeks. The ${h.a('historico-precos', 'price history')} shows the month-by-month trend since 2023.</p>
<h2>How much of a litre is tax</h2>
<p>With diesel at today’s posted average, ${h.l(d.iva)} a litre is VAT at 23% and ${h.l(d.isp)} is the tax on petroleum products (ISP), including the road service contribution and the carbon levy, according to the ENSE’s latest breakdown. In all, ${h.pct(d.partImpostos)} of the price. The ${h.a('impostos-combustiveis', 'fuel tax')} page runs the numbers for any price you type and for each fuel.</p>
<h2>Madeira and the Azores</h2>
<p>The autonomous regions are not in the DGEG register: their regional governments set maximum prices. In Madeira, joint order ${m.despacho} set petrol 95 at ${h.l(m.g95)} and diesel at ${h.l(m.gs)} from ${h.date(m.vigor)}; the ${h.a('madeira', 'Madeira page')} shows earlier weeks. For the ${h.a('acores', 'Azores')}, whose official journal we cannot read automatically, the calculator uses the price you type.</p>
<h2>Sources we use</h2>
<p>Station prices and the daily average: the ${h.src('dgegPortal', 'DGEG Preços dos Combustíveis portal')} and its ${h.src('dgegPmd', 'daily average statistics')}. Reference prices and breakdown: ${h.src('enseRef', 'ENSE')}. Reporting duty: ${h.src('dl243', 'Decree-Law 243/2008')}. VAT rate: ${h.src('civa18', 'VAT Code, article 18')}. DGEG information is free to reuse, provided the source and the date and time of the last price update are shown, which we do on every page. Details in ${h.a('method', 'method and sources')}.</p>`;
    },
  },
};
