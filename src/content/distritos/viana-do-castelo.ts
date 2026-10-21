import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Viana do Castelo';

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), ge = h.D.statsDe('ge', D), g95 = h.D.statsDe('g95', D), br = h.D.statsDe('gs', 'Braga'), br95 = h.D.statsDe('g95', 'Braga');
  const t = h.D.tipoDistrito('gs', D);
  const soEsp = h.D.POSTOS.postos.filter((x) => x.d === D && x.p.ge && !x.p.gs).length;
  return { soEsp, gs, ge, g95, br, br95, p: h.D.postosDistrito(D), top: h.D.baratos('gs', 5, D), c: h.D.concelhosOrdenados('gs', D), hip: t['Área comercial (Hipermercados)'], rua: t['Outro'], ae: t['Auto-estrada'], rg: h.D.rankDistrito('gs', D), rp: h.D.rankDistrito('g95', D) };
};
const hora = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)} ${s.slice(11)}`;

export default defineGuide({
  id: 'viana-do-castelo', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['braga', 'porto', 'simples-ou-aditivado', 'quando-abastecer'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'viana-do-castelo', nav: 'Viana do Castelo', card: 'Os cinco postos mais baratos de Viana do Castelo hoje, o gasóleo especial e a comparação com o distrito de Braga.',
    title: 'Combustíveis em Viana do Castelo hoje: postos mais baratos',
    description: 'Combustíveis em Viana do Castelo hoje: os cinco postos mais baratos, a média de cada concelho, o gasóleo especial e a comparação com Braga. Preços da DGEG.',
    h1: 'Gasóleo e gasolina em Viana do Castelo hoje',
    intro: (h) => `Os postos mais baratos dos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Viana do Castelo, com o preço e a hora que cada um comunicou à DGEG.`,
    resume: (h) => {
      const { gs, g95, br, top, rg, rp, p } = base(h);
      if (!gs || !g95) return `Os postos do distrito de Viana do Castelo ainda não enviaram hoje à DGEG preços suficientes para uma média de gasóleo e de gasolina. A lista acima mostra o último preço conhecido de cada posto e a hora de envio. Os cinco postos mais baratos, a média de cada concelho e a comparação com o distrito de Braga voltam a ser calculados logo que existam dados novos.`;
      const t = top[0];
      return `A média do gasóleo simples em Viana do Castelo está hoje em ${h.l(gs.media)}, e a da gasolina simples 95 em ${h.l(g95.media)}, nos preços afixados que os postos do distrito comunicam à DGEG. ${t ? `Quem procura o preço mais baixo encontra-o em ${t.nome}, no concelho de ${t.concelho}, a ${h.l(t.preco)}, ou seja ${h.c(gs.media - t.preco)} abaixo da média; num depósito de 50 litros são ${h.eur((gs.media - t.preco) * 50, 2)} de poupança. ` : ''}O distrito tem ${h.num(p.total)} postos, dos quais ${h.num(p.gpl)} com GPL Auto. ${br ? `Em Braga, o único distrito português vizinho, o gasóleo está hoje a ${h.l(br.media)}, ${h.c(Math.abs(br.media - gs.media))} ${br.media < gs.media ? 'abaixo' : 'acima'} de Viana do Castelo. ` : ''}Entre os ${h.num(rg.de)} distritos do continente, ordenados do mais barato para o mais caro, Viana do Castelo ocupa o ${h.ord(rg.pos)} lugar no gasóleo e o ${h.ord(rp.pos)} na gasolina 95. A lista dos postos mais baratos muda ao longo do dia, à medida que cada um atualiza os preços.`;
    },
    faqs: (h) => {
      const { gs, ge, g95, br, br95 } = base(h);
      return [
        { q: 'Quantos postos vendem gasóleo especial em Viana do Castelo?', a: ge && gs ? `Hoje ${h.num(ge.n)} postos do distrito de Viana do Castelo comunicam preço de gasóleo especial à DGEG, contra ${h.num(gs.n)} com gasóleo simples. A média do especial é de ${h.l(ge.media)}, ${h.c(ge.media - gs.media, true)} por litro face ao simples. A página sobre gasóleo simples ou aditivado ajuda a decidir se a diferença vale a pena.` : `Hoje não há preços suficientes de gasóleo especial no distrito de Viana do Castelo para os contar. Escolha Gasóleo especial na calculadora acima para ver os postos que o vendem logo que haja novos preços.` },
        { q: 'Abastecer em Viana do Castelo é mais barato do que em Braga?', a: gs && br ? `Hoje o gasóleo simples custa em média ${h.l(gs.media)} em Viana do Castelo e ${h.l(br.media)} em Braga${g95 && br95 ? `; na gasolina 95, ${h.l(g95.media)} contra ${h.l(br95.media)}` : ''}. ${gs.media < br.media ? 'Viana do Castelo está mais barato no gasóleo' : gs.media > br.media ? 'Braga está mais barato no gasóleo' : 'Os dois estão iguais no gasóleo'}, mas a diferença é de poucos cêntimos: o posto escolhido pesa mais do que o distrito.` : `Hoje não há preços suficientes para comparar Viana do Castelo com Braga. A comparação volta a ser feita quando os postos dos dois distritos enviarem novos preços à DGEG.` },
        { q: 'Quanto custa hoje encher 40 litros de gasolina 95 em Viana do Castelo?', a: g95 ? `À média do distrito de Viana do Castelo, ${h.l(g95.media)}, 40 litros de gasolina simples 95 custam hoje ${h.eur(g95.media * 40, 2)}. No posto mais barato, a ${h.l(g95.min)}, ficam por ${h.eur(g95.min * 40, 2)}, e no mais caro, a ${h.l(g95.max)}, por ${h.eur(g95.max * 40, 2)}. Escolha Gasolina 95 na calculadora para ver o posto mais barato do seu concelho.` : `Hoje não há preços suficientes de gasolina 95 no distrito de Viana do Castelo para fazer a conta. Volte mais tarde: o custo aparece assim que os postos comunicarem novos preços.` },
      ];
    },
    body: (h) => {
      const { gs, ge, top, c, hip, rua, ae, br, soEsp, p } = base(h);
      return `<h2>Os cinco postos mais baratos hoje</h2>
<p>A tabela mostra os cinco postos do distrito com o gasóleo simples mais barato no último ficheiro da DGEG, com a data e a hora do preço. Um preço antigo pode já ter mudado: confirme na bomba.</p>
${top.length ? h.table(['Posto', 'Concelho', 'Preço', 'Atualizado'], top.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(x.atualizado)]), 'Gasóleo simples, os postos mais baratos do distrito de Viana do Castelo', ['l', 'l', 'r', 'r']) : ''}
<h2>Concelho a concelho</h2>
<p>${c.length > 1 ? `A média mais baixa é a de ${c[0].concelho} e a mais alta a de ${c[c.length - 1].concelho}, com ${h.c(c[c.length - 1].media - c[0].media)} por litro entre as duas.` : ''} ${hip && rua ? `Os postos de área comercial têm o gasóleo a ${h.l(hip.media)} em média e os de rua a ${h.l(rua.media)}${ae ? `; na autoestrada, ${h.l(ae.media)}` : ''}.` : ''}</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mínimo'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho', ['l', 'r', 'r', 'r'])}
<h2>Gasóleo especial: quantos postos o vendem</h2>
<p>${ge && gs ? `${h.num(ge.n)} postos vendem gasóleo especial, ${h.pct(ge.n / p.total)} dos postos do distrito, contra ${h.num(gs.n)} que vendem o simples; a média do especial é ${h.l(ge.media)}.` : ''} ${soEsp ? `Em ${h.num(soEsp)} postos só há gasóleo especial, e quem lá abastece paga o preço do aditivado.` : 'Hoje todos os postos com gasóleo especial vendem também o simples.'} A página ${h.a('simples-ou-aditivado', 'simples ou aditivado')} explica a diferença, e ${h.a('quando-abastecer', 'quando abastecer')} mostra os dias em que os preços costumam mudar.</p>
<h2>Viana do Castelo e Braga</h2>
<p>O distrito faz fronteira com Espanha e, do lado português, apenas com ${h.a('braga', 'Braga')}${br ? `, onde o gasóleo está hoje a ${h.l(br.media)}` : ''}. Mais a sul, o distrito do ${h.a('porto', 'Porto')} soma ${h.num(h.D.postosDistrito('Porto').total)} postos, contra ${h.num(p.total)} em Viana do Castelo.</p>
<p>${(() => { const g = h.D.baratos('gpl', 1, D)[0], n = h.D.postosDistrito(D).gpl, s = h.D.statsDe('gs', D, 'Viana do Castelo'); return `${s ? `No concelho de Viana do Castelo, sede do distrito, a média do gasóleo é de ${h.l(s.media)} em ${h.num(s.n)} postos. ` : ''}${g ? `O GPL Auto existe em ${h.num(n)} postos; o mais barato é ${g.nome}, em ${g.concelho}, a ${h.l(g.preco)}.` : 'Nenhum posto do distrito comunica hoje preço de GPL Auto.'}`; })()}</p>`;
    },
  },
  en: {
    slug: 'viana-do-castelo', nav: 'Viana do Castelo', card: 'The five cheapest stations in Viana do Castelo today, premium diesel and the comparison with Braga district.',
    title: 'Fuel prices in Viana do Castelo today: cheapest stations',
    description: 'Fuel prices in Viana do Castelo today: the five cheapest stations, the average in each municipality, premium diesel and the comparison with Braga. DGEG prices.',
    h1: 'Diesel and petrol in Viana do Castelo today',
    intro: (h) => `The cheapest stations in the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Viana do Castelo district, with the price and time each one reported to the DGEG.`,
    resume: (h) => {
      const { gs, g95, br, top, rg, rp, p } = base(h);
      if (!gs || !g95) return `Stations in Viana do Castelo district have not yet sent the DGEG enough prices today for a diesel and petrol average. The list above shows each station’s last known price and the time it was sent. The five cheapest stations, each municipality’s average and the comparison with Braga district are recomputed as soon as new data arrive.`;
      const t = top[0];
      return `The average for standard diesel in Viana do Castelo stands at ${h.l(gs.media)} today, and for standard petrol 95 at ${h.l(g95.media)}, based on the posted prices the district’s stations report to the DGEG. ${t ? `If you are after the lowest price, it is at ${t.nome}, in the municipality of ${t.concelho}, at ${h.l(t.preco)}, which is ${h.c(gs.media - t.preco)} below the average; on a 50-litre tank that is a saving of ${h.eur((gs.media - t.preco) * 50, 2)}. ` : ''}The district has ${h.num(p.total)} stations, ${h.num(p.gpl)} of them with LPG. ${br ? `In Braga, the only neighbouring Portuguese district, diesel is at ${h.l(br.media)} today, ${h.c(Math.abs(br.media - gs.media))} ${br.media < gs.media ? 'below' : 'above'} Viana do Castelo. ` : ''}Among the ${h.num(rg.de)} mainland districts, ordered from cheapest to dearest, Viana do Castelo is ${h.ord(rg.pos)} for diesel and ${h.ord(rp.pos)} for petrol 95. The list of the cheapest stations changes during the day, as each one updates its prices, so check the time shown next to every price before you drive there.`;
    },
    faqs: (h) => {
      const { gs, ge, g95, br, br95 } = base(h);
      return [
        { q: 'How many stations sell premium diesel in Viana do Castelo?', a: ge && gs ? `Today ${h.num(ge.n)} stations in Viana do Castelo district report a premium diesel price to the DGEG, against ${h.num(gs.n)} with standard diesel. Premium averages ${h.l(ge.media)}, ${h.c(ge.media - gs.media, true)} a litre over standard. Our page on standard versus premium diesel helps you decide whether the extra cost is worth it.` : `There are not enough premium diesel prices in Viana do Castelo district today to count them. Pick premium diesel in the calculator above to see the stations that sell it once new prices come in.` },
        { q: 'Is it cheaper to fill up in Viana do Castelo or in Braga?', a: gs && br ? `Today standard diesel averages ${h.l(gs.media)} in Viana do Castelo and ${h.l(br.media)} in Braga${g95 && br95 ? `; for petrol 95, ${h.l(g95.media)} against ${h.l(br95.media)}` : ''}. ${gs.media < br.media ? 'Viana do Castelo is cheaper for diesel' : gs.media > br.media ? 'Braga is cheaper for diesel' : 'The two are level on diesel'}, but the gap is only a few cents: the station you choose matters more than the district.` : `There are not enough prices today to compare Viana do Castelo with Braga. The comparison is made again once stations in both districts send new prices to the DGEG.` },
        { q: 'What does 40 litres of petrol 95 cost in Viana do Castelo today?', a: g95 ? `At the Viana do Castelo district average of ${h.l(g95.media)}, 40 litres of standard petrol 95 cost ${h.eur(g95.media * 40, 2)} today. At the cheapest station, at ${h.l(g95.min)}, they come to ${h.eur(g95.min * 40, 2)}, and at the dearest, at ${h.l(g95.max)}, to ${h.eur(g95.max * 40, 2)}. Pick Petrol 95 in the calculator to find the cheapest station in your municipality.` : `There are not enough petrol 95 prices in Viana do Castelo district today to do the sum. Check back later: the cost appears once stations report new prices.` },
      ];
    },
    body: (h) => {
      const { gs, ge, top, c, hip, rua, ae, br, soEsp, p } = base(h);
      return `<h2>The five cheapest stations today</h2>
<p>The table lists the five stations in the district with the cheapest standard diesel in the latest DGEG file, with the date and time of each price. An older price may already have changed, so check at the pump.</p>
${top.length ? h.table(['Station', 'Municipality', 'Price', 'Updated'], top.map((x) => [x.nome, x.concelho, h.l(x.preco), hora(x.atualizado)]), 'Standard diesel, the cheapest stations in Viana do Castelo district', ['l', 'l', 'r', 'r']) : ''}
<h2>Municipality by municipality</h2>
<p>${c.length > 1 ? `The lowest average is in ${c[0].concelho} and the highest in ${c[c.length - 1].concelho}, ${h.c(c[c.length - 1].media - c[0].media)} a litre apart.` : ''} ${hip && rua ? `Shopping-area stations have diesel at ${h.l(hip.media)} on average and street stations at ${h.l(rua.media)}${ae ? `; on the motorway, ${h.l(ae.media)}` : ''}.` : ''}</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality', ['l', 'r', 'r', 'r'])}
<h2>Premium diesel: how many stations sell it</h2>
<p>${ge && gs ? `${h.num(ge.n)} stations sell premium diesel, ${h.pct(ge.n / p.total)} of the district’s stations, against ${h.num(gs.n)} selling standard; premium averages ${h.l(ge.media)}.` : ''} ${soEsp ? `At ${h.num(soEsp)} stations premium is the only diesel on offer, so anyone filling up there pays the additive price.` : 'Today every station with premium diesel also sells standard.'} The ${h.a('simples-ou-aditivado', 'standard or premium')} page explains the difference, and ${h.a('quando-abastecer', 'when to fill up')} shows the days on which prices tend to change.</p>
<h2>Viana do Castelo and Braga</h2>
<p>The district borders Spain and, on the Portuguese side, only ${h.a('braga', 'Braga')}${br ? `, where diesel stands at ${h.l(br.media)} today` : ''}. Further south, ${h.a('porto', 'Porto')} district counts ${h.num(h.D.postosDistrito('Porto').total)} stations, against ${h.num(p.total)} in Viana do Castelo.</p>
<p>${(() => { const g = h.D.baratos('gpl', 1, D)[0], n = h.D.postosDistrito(D).gpl, s = h.D.statsDe('gs', D, 'Viana do Castelo'); return `${s ? `In Viana do Castelo municipality, the district seat, diesel averages ${h.l(s.media)} across ${h.num(s.n)} stations. ` : ''}${g ? `LPG is sold at ${h.num(n)} stations; the cheapest is ${g.nome}, in ${g.concelho}, at ${h.l(g.preco)}.` : 'No station in the district reports an LPG price today.'}`; })()}</p>`;
    },
  },
});
