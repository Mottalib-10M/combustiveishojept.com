import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Santarém';
const VIZ = [['leiria', 'Leiria'], ['castelo-branco', 'Castelo Branco'], ['portalegre', 'Portalegre'], ['evora', 'Évora'], ['setubal', 'Setúbal'], ['lisboa', 'Lisboa']] as const;

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), g98 = h.D.statsDe('g98', D);
  const rg = h.D.rankDistrito('gs', D), rp = h.D.rankDistrito('g95', D);
  const c = h.D.concelhosOrdenados('gs', D), pc = h.D.porConcelho('gs', D);
  const poucos = Object.entries(pc).filter(([, s]) => s.n <= 2).map(([n, s]) => ({ concelho: n, ...s })).sort((a, b) => a.n - b.n || a.concelho.localeCompare(b.concelho, 'pt'));
  return { gs, g95, g98, rg, rp, c, poucos, p: h.D.postosDistrito(D) };
};

export default defineGuide({
  id: 'santarem', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['lisboa', 'leiria', 'setubal', 'evora', 'preco-gasolina-95'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'santarem', nav: 'Santarém', card: 'Gasóleo e gasolina em Santarém comparados com os seis distritos à volta, e os concelhos mais baratos e mais caros do distrito.',
    title: 'Preço dos combustíveis em Santarém hoje, por concelho',
    description: 'Preço dos combustíveis em Santarém hoje: gasóleo e gasolina face aos seis distritos vizinhos, os cinco concelhos mais baratos e mais caros e a gasolina 98.',
    h1: 'Combustíveis no distrito de Santarém hoje',
    intro: (h) => `Os preços afixados nos ${h.num(h.D.postosDistrito(D).concelhos)} concelhos do distrito de Santarém, postos ao lado dos distritos que o rodeiam.`,
    resume: (h) => {
      const { gs, g95, rg, rp, c, p } = base(h);
      if (!gs || !g95) return `Os postos do distrito de Santarém ainda não comunicaram hoje à DGEG preços suficientes para calcular as médias do gasóleo e da gasolina. A lista acima mostra o último preço de cada posto, com a hora de envio. A comparação com os seis distritos vizinhos e a ordem dos concelhos do mais barato ao mais caro são recalculadas logo que existam dados novos, o que acontece várias vezes ao dia.`;
      const dif = g95.media - gs.media;
      return `Hoje, um litro de gasóleo simples custa em média ${h.l(gs.media)} no distrito de Santarém, e um litro de gasolina simples 95 ${h.l(g95.media)}; a gasolina está ${h.c(Math.abs(dif))} ${dif < 0 ? 'abaixo' : 'acima'} do gasóleo. As duas posições no conjunto do continente nem sempre coincidem: no gasóleo, o distrito é o ${h.ord(rg.pos)} de ${h.num(rg.de)} a contar do mais barato, e na gasolina 95 é o ${h.ord(rp.pos)}. ${rg.pos === rp.pos ? 'Hoje coincidem, o que não é regra.' : 'Quem conduz um carro a gasolina e quem conduz um a gasóleo não vê por isso o mesmo distrito.'} A rede tem ${h.num(p.total)} postos em ${h.num(p.concelhos)} concelhos${c.length > 1 ? `, e a média do gasóleo por concelho varia entre ${h.l(c[0].media)} em ${c[0].concelho} e ${h.l(c[c.length - 1].media)} em ${c[c.length - 1].concelho}` : ''}. No posto mais barato do distrito, o gasóleo custa ${h.l(gs.min)}: atestar 55 litros aí em vez de num posto à média poupa ${h.eur((gs.media - gs.min) * 55, 2)}. A fonte é a DGEG, com a hora de cada preço.`;
    },
    faqs: (h) => {
      const { gs, g95, g98, rg, poucos } = base(h);
      return [
        { q: 'Santarém está entre os distritos mais baratos para abastecer gasóleo?', a: gs ? `Hoje o distrito de Santarém é o ${h.ord(rg.pos)} mais barato em ${h.num(rg.de)} no gasóleo simples, com média de ${h.l(gs.media)}, ${h.c(h.D.desvioDistrito('gs', D), true)} face à média do continente. O distrito mais barato do dia é ${rg.maisBarato} e o mais caro ${rg.maisCaro}. Como as diferenças entre distritos são de poucos cêntimos, a escolha do posto pesa mais do que a do distrito.` : `Hoje não há preços suficientes no distrito de Santarém para o situar entre os distritos do continente. A posição volta a ser calculada assim que os postos comunicarem novos preços à DGEG.` },
        { q: 'Quanto custa a mais a gasolina 98 do que a 95 em Santarém?', a: g95 && g98 ? `No distrito de Santarém, a gasolina 98 custa hoje em média ${h.l(g98.media)}, contra ${h.l(g95.media)} da gasolina simples 95: são ${h.c(g98.media - g95.media)} a mais por litro, ou ${h.eur((g98.media - g95.media) * 45, 2)} num depósito de 45 litros. Só ${h.num(g98.n)} postos do distrito vendem gasolina 98, por isso a escolha é mais limitada.` : `Hoje não há preços suficientes de gasolina 98 no distrito de Santarém para a comparar com a 95. A comparação volta a aparecer quando os postos enviarem novos preços à DGEG.` },
        { q: 'Que concelhos do distrito de Santarém têm poucos postos de gasóleo?', a: poucos.length ? `Hoje ${h.num(poucos.length)} concelhos do distrito de Santarém têm dois postos ou menos a vender gasóleo: ${poucos.map((x) => `${x.concelho} (${h.num(x.n)})`).join(', ')}. Nesses concelhos a média é a de um ou dois preços, e o posto mais próximo noutro concelho pode estar mais barato. A lista da calculadora mostra-os todos, com a hora de atualização.` : `Hoje todos os concelhos do distrito de Santarém com postos têm pelo menos três a vender gasóleo. A lista da calculadora acima mostra os mais baratos de cada concelho, com a hora a que cada preço foi comunicado à DGEG.` },
      ];
    },
    body: (h) => {
      const { gs, g95, c } = base(h);
      const viz = VIZ.map(([id, n]) => ({ id, n, gs: h.D.statsDe('gs', n), g95: h.D.statsDe('g95', n) }));
      const baixo = c.slice(0, 5), alto = c.slice(Math.max(5, c.length - 5)).reverse();
      return `<h2>Santarém no meio de seis distritos</h2>
<p>Poucos distritos têm tantos vizinhos. A tabela põe lado a lado a média do gasóleo e da gasolina 95 em Santarém e nos seis distritos com que confina, com hiperligações para a página de cada um.</p>
${h.table(['Distrito', 'Gasóleo simples', 'Gasolina 95'], [[D, gs ? h.l(gs.media) : '—', g95 ? h.l(g95.media) : '—'], ...viz.map((v) => [h.a(v.id, v.n), v.gs ? h.l(v.gs.media) : '—', v.g95 ? h.l(v.g95.media) : '—'])], 'Preço médio afixado hoje, dados da DGEG', ['l', 'r', 'r'])}
<p>${(() => { const ok = viz.filter((v) => v.gs && gs); const mais = ok.filter((v) => v.gs!.media < gs!.media).length; return gs ? `Hoje, ${h.num(mais)} dos ${h.num(ok.length)} vizinhos ${mais === 1 ? 'tem' : 'têm'} o gasóleo mais barato do que Santarém e ${h.num(ok.length - mais)} ${ok.length - mais === 1 ? 'tem-no' : 'têm-no'} igual ou mais caro.` : ''; })()} Para quem atravessa o distrito de passagem, compensa mais escolher bem o posto do que o distrito.</p>
<h2>Os concelhos nos dois extremos</h2>
<p>Com ${h.num(c.length)} concelhos com dois postos ou mais, a ordem completa é longa. Aqui ficam os cinco com o gasóleo mais barato e os cinco com o mais caro, a média e o posto mais barato de cada um.</p>
${h.table(['Mais baratos', 'Média', 'Mínimo'], baixo.map((x) => [x.concelho, h.l(x.media), h.l(x.min)]), 'Os cinco concelhos com o gasóleo mais barato', ['l', 'r', 'r'])}
${h.table(['Mais caros', 'Média', 'Mínimo'], alto.map((x) => [x.concelho, h.l(x.media), h.l(x.min)]), 'Os cinco concelhos com o gasóleo mais caro', ['l', 'r', 'r'])}
<h2>Gasóleo e gasolina no distrito</h2>
<p>${gs && g95 ? `A diferença de ${h.c(Math.abs(g95.media - gs.media))} por litro entre os dois combustíveis não diz qual sai mais barato por quilómetro, porque o consumo de um motor a gasóleo e de um a gasolina não é o mesmo.` : ''} A página do ${h.a('preco-gasolina-95', 'preço da gasolina 95')} mostra como esse preço evoluiu no continente nos últimos meses.</p>
<p>${(() => { const p = h.D.postosDistrito(D), g = h.D.statsDe('gpl', D), s = h.D.statsDe('gs', D, 'Santarém'); return `${s ? `No concelho de Santarém, capital do distrito, ${h.num(s.n)} postos têm o gasóleo a ${h.l(s.media)} em média. ` : ''}${g ? `O GPL Auto está à venda em ${h.num(g.n)} dos ${h.num(p.total)} postos do distrito, a ${h.l(g.media)} em média, e há ${h.num(p.autoestrada)} postos de autoestrada.` : 'Nenhum posto do distrito comunica hoje preço de GPL Auto.'}`; })()}</p>`;
    },
  },
  en: {
    slug: 'santarem', nav: 'Santarém', card: 'Diesel and petrol in Santarém compared with the six districts around it, plus the cheapest and dearest municipalities in the district.',
    title: 'Fuel prices in Santarém today, municipality by municipality',
    description: 'Fuel prices in Santarém today: diesel and petrol against the six neighbouring districts, the five cheapest and five dearest municipalities and petrol 98.',
    h1: 'Fuel prices in Santarém district today',
    intro: (h) => `Posted prices in the ${h.num(h.D.postosDistrito(D).concelhos)} municipalities of Santarém district, set beside the districts that surround it.`,
    resume: (h) => {
      const { gs, g95, rg, rp, c, p } = base(h);
      if (!gs || !g95) return `Stations in Santarém district have not yet reported enough prices to the DGEG today to work out diesel and petrol averages. The list above shows each station’s last price with the time it was sent. The comparison with the six neighbouring districts and the order of municipalities from cheapest to dearest are recomputed as soon as new data arrive, which happens several times a day.`;
      const dif = g95.media - gs.media;
      return `Today a litre of standard diesel costs ${h.l(gs.media)} on average in Santarém district, and a litre of standard petrol 95 costs ${h.l(g95.media)}; petrol is ${h.c(Math.abs(dif))} ${dif < 0 ? 'below' : 'above'} diesel. The district’s two positions within the mainland do not always match: for diesel it is ${h.ord(rg.pos)} of ${h.num(rg.de)} counting from the cheapest, and for petrol 95 it is ${h.ord(rp.pos)}. ${rg.pos === rp.pos ? 'Today they match, which is not the rule.' : 'A petrol driver and a diesel driver therefore do not see the same district.'} The network has ${h.num(p.total)} stations across ${h.num(p.concelhos)} municipalities${c.length > 1 ? `, and the diesel average by municipality ranges from ${h.l(c[0].media)} in ${c[0].concelho} to ${h.l(c[c.length - 1].media)} in ${c[c.length - 1].concelho}` : ''}. At the district’s cheapest station diesel costs ${h.l(gs.min)}: filling 55 litres there rather than at an average station saves ${h.eur((gs.media - gs.min) * 55, 2)}. The source is the DGEG, with the time of every price shown in the list above.`;
    },
    faqs: (h) => {
      const { gs, g95, g98, rg, poucos } = base(h);
      return [
        { q: 'Is Santarém one of the cheapest districts for diesel?', a: gs ? `Today Santarém district ranks ${h.ord(rg.pos)} cheapest of ${h.num(rg.de)} for standard diesel, with an average of ${h.l(gs.media)}, ${h.c(h.D.desvioDistrito('gs', D), true)} against the mainland average. The cheapest district of the day is ${rg.maisBarato} and the dearest ${rg.maisCaro}. Since gaps between districts are a few cents, choosing the station matters more than choosing the district.` : `There are not enough prices in Santarém district today to place it among the mainland districts. Its position is recomputed as soon as stations report new prices to the DGEG.` },
        { q: 'How much more does petrol 98 cost than petrol 95 in Santarém?', a: g95 && g98 ? `In Santarém district, petrol 98 averages ${h.l(g98.media)} today, against ${h.l(g95.media)} for standard petrol 95: ${h.c(g98.media - g95.media)} more per litre, or ${h.eur((g98.media - g95.media) * 45, 2)} on a 45-litre tank. Only ${h.num(g98.n)} stations in the district sell petrol 98, so the choice is narrower and the nearest one may be some way off.` : `There are not enough petrol 98 prices in Santarém district today to compare it with petrol 95. The comparison returns once stations send new prices to the DGEG.` },
        { q: 'Which municipalities in Santarém district have few diesel stations?', a: poucos.length ? `Today ${h.num(poucos.length)} municipalities in Santarém district have two diesel stations or fewer: ${poucos.map((x) => `${x.concelho} (${h.num(x.n)})`).join(', ')}. There the average is that of one or two prices, and the nearest station in another municipality may be cheaper. The calculator list shows them all, with update times.` : `Today every municipality in Santarém district with stations has at least three selling diesel. The calculator list above shows the cheapest in each, with the time each price was reported to the DGEG.` },
      ];
    },
    body: (h) => {
      const { gs, g95, c } = base(h);
      const viz = VIZ.map(([id, n]) => ({ id, n, gs: h.D.statsDe('gs', n), g95: h.D.statsDe('g95', n) }));
      const baixo = c.slice(0, 5), alto = c.slice(Math.max(5, c.length - 5)).reverse();
      return `<h2>Santarém surrounded by six districts</h2>
<p>Few districts have so many neighbours. The table sets the diesel and petrol 95 averages in Santarém beside those of the six districts it borders, with a link to each one’s page.</p>
${h.table(['District', 'Standard diesel', 'Petrol 95'], [[D, gs ? h.l(gs.media) : '—', g95 ? h.l(g95.media) : '—'], ...viz.map((v) => [h.a(v.id, v.n === 'Lisboa' ? 'Lisbon' : v.n), v.gs ? h.l(v.gs.media) : '—', v.g95 ? h.l(v.g95.media) : '—'])], 'Average posted price today, DGEG data', ['l', 'r', 'r'])}
<p>${(() => { const ok = viz.filter((v) => v.gs && gs); const mais = ok.filter((v) => v.gs!.media < gs!.media).length; return gs ? `Today ${h.num(mais)} of the ${h.num(ok.length)} neighbours ${mais === 1 ? 'has' : 'have'} cheaper diesel than Santarém and ${h.num(ok.length - mais)} ${ok.length - mais === 1 ? 'has' : 'have'} it at the same price or dearer.` : ''; })()} If you are only passing through, picking the right station pays more than picking the right district.</p>
<h2>Municipalities at both ends</h2>
<p>With ${h.num(c.length)} municipalities that have two stations or more, the full order is long. Here are the five with the cheapest diesel and the five with the dearest, with the average and the cheapest station in each.</p>
${h.table(['Cheapest', 'Average', 'Lowest'], baixo.map((x) => [x.concelho, h.l(x.media), h.l(x.min)]), 'The five municipalities with the cheapest diesel', ['l', 'r', 'r'])}
${h.table(['Dearest', 'Average', 'Lowest'], alto.map((x) => [x.concelho, h.l(x.media), h.l(x.min)]), 'The five municipalities with the dearest diesel', ['l', 'r', 'r'])}
<h2>Diesel and petrol in the district</h2>
<p>${gs && g95 ? `The ${h.c(Math.abs(g95.media - gs.media))} a litre between the two fuels does not tell you which is cheaper per kilometre, because a diesel engine and a petrol engine do not burn fuel at the same rate.` : ''} The ${h.a('preco-gasolina-95', 'petrol 95 price')} page shows how that price has moved on the mainland over recent months.</p>
<p>${(() => { const p = h.D.postosDistrito(D), g = h.D.statsDe('gpl', D), s = h.D.statsDe('gs', D, 'Santarém'); return `${s ? `In Santarém municipality, the district capital, ${h.num(s.n)} stations have diesel at ${h.l(s.media)} on average. ` : ''}${g ? `LPG is on sale at ${h.num(g.n)} of the district’s ${h.num(p.total)} stations, at ${h.l(g.media)} on average, and there are ${h.num(p.autoestrada)} motorway stations.` : 'No station in the district reports an LPG price today.'}`; })()}</p>`;
    },
  },
});
