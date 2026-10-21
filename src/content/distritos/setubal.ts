import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Setúbal';
const VIZ = [['lisboa', 'Lisboa', 'Lisbon'], ['santarem', 'Santarém', 'Santarém'], ['evora', 'Évora', 'Évora'], ['beja', 'Beja', 'Beja']] as const;

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), gpl = h.D.statsDe('gpl', D);
  const t = h.D.tipoDistrito('gs', D), t95 = h.D.tipoDistrito('g95', D);
  return {
    gs, g95, gpl, p: h.D.postosDistrito(D), c: h.D.concelhosOrdenados('gs', D), cg: h.D.concelhosOrdenados('gpl', D, 1),
    ae: t['Auto-estrada'], rua: t['Outro'], hip: t['Área comercial (Hipermercados)'], ae95: t95['Auto-estrada'], rua95: t95['Outro'],
    rg: h.D.rankDistrito('gs', D),
  };
};

export default defineGuide({
  id: 'setubal', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['lisboa', 'evora', 'beja', 'postos-mais-baratos'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'setubal', nav: 'Setúbal', card: 'Quanto pesa a autoestrada no preço do gasóleo em Setúbal, os concelhos face à média do distrito e onde há GPL Auto.',
    title: 'Gasóleo em Setúbal hoje: concelhos, autoestrada e GPL',
    description: 'Gasóleo e gasolina em Setúbal hoje: diferença entre postos de autoestrada e de rua, concelhos acima e abaixo da média, GPL Auto e vizinhos. Dados DGEG.',
    h1: 'Preço do gasóleo e da gasolina em Setúbal hoje',
    intro: (h) => `O distrito de Setúbal tem ${h.num(h.D.postosDistrito(D).autoestrada)} postos de autoestrada entre ${h.num(h.D.postosDistrito(D).total)}: veja quanto custa abastecer em cada tipo de posto e em cada concelho.`,
    resume: (h) => {
      const { gs, g95, ae, rua, p, rg } = base(h);
      if (!gs || !g95) return `Os postos do distrito de Setúbal ainda não comunicaram hoje à DGEG preços suficientes para uma média do gasóleo e da gasolina. A lista acima mostra o último preço de cada posto e a hora do envio. A comparação entre autoestrada e rua, a posição de cada concelho face à média e os preços do GPL Auto são recalculados logo que a DGEG publique dados novos, o que acontece várias vezes por dia.`;
      return `O gasóleo simples custa hoje ${h.l(gs.media)} em média no distrito de Setúbal e a gasolina simples 95 ${h.l(g95.media)}, segundo os ${h.num(gs.n)} postos que comunicam preço de gasóleo à DGEG. ${ae && rua ? `Onde se abastece faz diferença: nos ${h.num(ae.n)} postos de autoestrada do distrito o gasóleo está em média a ${h.l(ae.media)}, e nos de rua a ${h.l(rua.media)}, uma diferença de ${h.c(ae.media - rua.media, true)} por litro que, num depósito de 50 litros, representa ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}. ` : `O distrito tem ${h.num(p.autoestrada)} postos de autoestrada e ${h.num(p.rua)} de rua. `}Comparado com o continente, o gasóleo de Setúbal está ${h.c(h.D.desvioDistrito('gs', D), true)}, o que dá ao distrito o ${h.ord(rg.pos)} lugar entre ${h.num(rg.de)}, contando do mais barato. O preço mais baixo do distrito é hoje ${h.l(gs.min)} e o mais alto ${h.l(gs.max)}. Todos os valores mudam ao longo do dia, à medida que os postos atualizam os preços na DGEG.`;
    },
    faqs: (h) => {
      const { ae, rua, ae95, rua95, cg, gs, rg } = base(h);
      return [
        { q: 'Quanto se poupa no distrito de Setúbal ao abastecer fora da autoestrada?', a: ae && rua ? `Hoje o gasóleo custa ${h.l(ae.media)} em média nas autoestradas do distrito de Setúbal e ${h.l(rua.media)} nos postos de rua. Num depósito de 50 litros, a diferença é de ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}${ae95 && rua95 ? `; na gasolina 95 é de ${h.eur(Math.abs(ae95.media - rua95.media) * 50, 2)}` : ''}. O cálculo compara médias: um posto de rua caro pode custar tanto como uma área de serviço.` : `Hoje não há preços suficientes de postos de autoestrada e de rua no distrito de Setúbal para os comparar. A lista acima mostra os preços disponíveis, posto a posto, com a hora da última atualização.` },
        { q: 'Em que concelho do distrito de Setúbal o GPL Auto está mais barato?', a: cg.length ? `Hoje a média mais baixa de GPL Auto no distrito de Setúbal é a de ${cg[0].concelho}, com ${h.l(cg[0].media)} em ${h.num(cg[0].n)} ${cg[0].n === 1 ? 'posto' : 'postos'}${cg.length > 1 ? `, e a mais alta a de ${cg[cg.length - 1].concelho}, com ${h.l(cg[cg.length - 1].media)}` : ''}. Escolha GPL Auto e o concelho na calculadora acima para ver os postos mais baratos e a hora a que cada um comunicou o preço.` : `Hoje nenhum posto do distrito de Setúbal comunicou preço de GPL Auto à DGEG. Escolha GPL Auto na calculadora acima para ver os postos assim que voltarem a enviar preços.` },
        { q: 'O gasóleo em Setúbal está acima ou abaixo da média do continente?', a: gs ? `Hoje está ${h.c(Math.abs(h.D.desvioDistrito('gs', D)))} ${h.D.desvioDistrito('gs', D) < 0 ? 'abaixo' : 'acima'} da média do continente, com ${h.l(gs.media)} no distrito de Setúbal. Isso põe o distrito em ${h.ord(rg.pos)} lugar entre ${h.num(rg.de)}. O sinal pode mudar de um dia para o outro, porque as diferenças entre distritos são de poucos cêntimos.` : `Hoje não há preços suficientes no distrito de Setúbal para o comparar com a média do continente. A comparação volta a ser feita quando os postos enviarem novos preços à DGEG.` },
      ];
    },
    body: (h) => {
      const { gs, ae, rua, hip, p, c, cg } = base(h);
      const tipos = ([['Rua', rua], ['Área comercial', hip], ['Autoestrada', ae]] as const).filter(([, s]) => s);
      const abaixo = gs ? c.filter((x) => x.media < gs.media).length : 0;
      return `<h2>Autoestrada ou fora dela</h2>
<p>O distrito tem ${h.num(p.autoestrada)} postos de autoestrada, ${h.num(p.rua)} de rua e ${h.num(p.hiper)} em área comercial. A tabela mostra a média e o preço mais baixo de cada tipo para o gasóleo simples.</p>
${h.table(['Tipo de posto', 'Postos', 'Média', 'Mais barato'], tipos.map(([n, s]) => [n, s!.n, h.l(s!.media), h.l(s!.min)]), 'Gasóleo simples no distrito de Setúbal por tipo de posto', ['l', 'r', 'r', 'r'])}
<p>Numa viagem por autoestrada, a saída para um posto de rua só compensa se o desvio for curto: alguns cêntimos por litro em 50 litros ficam a poucos euros, que um desvio longo consome.</p>
<h2>Concelhos acima e abaixo da média do distrito</h2>
<p>${gs ? `Dos ${h.num(c.length)} concelhos com dois postos ou mais, ${h.num(abaixo)} têm hoje o gasóleo abaixo da média do distrito e ${h.num(c.length - abaixo)} acima ou ao nível dela.` : ''} A última coluna dá a diferença de cada concelho face à média, em cêntimos por litro.</p>
${gs ? h.table(['Concelho', 'Postos', 'Média', 'Face ao distrito'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.c(x.media - gs.media, true)]), 'Gasóleo simples, média por concelho', ['l', 'r', 'r', 'r']) : ''}
<h2>GPL Auto no distrito</h2>
<p>${p.gpl ? `O GPL Auto é vendido em ${h.num(p.gpl)} postos, espalhados por ${h.num(cg.length)} concelhos.` : 'Nenhum posto vende hoje GPL Auto no distrito.'} ${cg.length > 1 ? `A média por concelho vai de ${h.l(cg[0].media)} em ${cg[0].concelho} a ${h.l(cg[cg.length - 1].media)} em ${cg[cg.length - 1].concelho}.` : ''}</p>
<h2>Os quatro distritos vizinhos</h2>
<p>${VIZ.map(([id, n]) => { const s = h.D.statsDe('gs', n); return s ? `${h.a(id, n)}: ${h.l(s.media)}` : ''; }).filter(Boolean).join(' · ')}. São as médias do gasóleo simples hoje nos distritos que confinam com Setúbal. Para comparar posto a posto em todo o continente, use a página dos ${h.a('postos-mais-baratos', 'postos mais baratos')}.</p>
<p>${(() => { const t = h.D.tipoDistrito('g95', D), a = t['Auto-estrada'], r = t['Outro'], g98 = h.D.statsDe('g98', D); return `${a && r ? `Na gasolina simples 95, a média é de ${h.l(a.media)} na autoestrada e de ${h.l(r.media)} nos postos de rua, ${h.c(a.media - r.media, true)} por litro entre as duas. ` : ''}${g98 ? `A gasolina 98 só aparece em ${h.num(g98.n)} postos do distrito, a ${h.l(g98.media)} em média, por isso quem a usa tem menos por onde escolher.` : ''}`; })()}</p>`;
    },
  },
  en: {
    slug: 'setubal', nav: 'Setúbal', card: 'How much the motorway adds to diesel in Setúbal, each municipality against the district average and where to find LPG.',
    title: 'Diesel in Setúbal today: municipalities, motorway and LPG',
    description: 'Diesel and petrol in Setúbal today: the gap between motorway and street stations, municipalities above and below the average, LPG and neighbouring districts.',
    h1: 'Diesel and petrol prices in Setúbal today',
    intro: (h) => `Setúbal district has ${h.num(h.D.postosDistrito(D).autoestrada)} motorway stations out of ${h.num(h.D.postosDistrito(D).total)}: see what it costs to fill up at each type of station and in each municipality.`,
    resume: (h) => {
      const { gs, g95, ae, rua, p, rg } = base(h);
      if (!gs || !g95) return `Stations in Setúbal district have not yet reported enough prices to the DGEG today for a diesel and petrol average. The list above shows each station’s last price and the time it was sent. The motorway versus street comparison, each municipality’s position against the average and LPG prices are recomputed as soon as the DGEG publishes new data, which happens several times a day.`;
      return `Standard diesel costs ${h.l(gs.media)} on average today in Setúbal district and standard petrol 95 costs ${h.l(g95.media)}, according to the ${h.num(gs.n)} stations that report a diesel price to the DGEG. ${ae && rua ? `Where you stop makes a difference: at the district’s ${h.num(ae.n)} motorway stations diesel averages ${h.l(ae.media)}, and at street stations ${h.l(rua.media)}, a gap of ${h.c(ae.media - rua.media, true)} a litre which, on a 50-litre tank, comes to ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}. ` : `The district has ${h.num(p.autoestrada)} motorway stations and ${h.num(p.rua)} street stations. `}Compared with the mainland, diesel in Setúbal is ${h.c(h.D.desvioDistrito('gs', D), true)}, which gives the district ${h.ord(rg.pos)} place out of ${h.num(rg.de)}, counting from the cheapest. The lowest price in the district today is ${h.l(gs.min)} and the highest ${h.l(gs.max)}. All of these figures move during the day, as stations update their prices with the DGEG, and this page is rebuilt from the latest file, so the gap between motorway and street can widen or narrow from one hour to the next.`;
    },
    faqs: (h) => {
      const { ae, rua, ae95, rua95, cg, gs, rg } = base(h);
      return [
        { q: 'How much do you save in Setúbal district by filling up off the motorway?', a: ae && rua ? `Today diesel averages ${h.l(ae.media)} on motorways in Setúbal district and ${h.l(rua.media)} at street stations. On a 50-litre tank the gap is ${h.eur(Math.abs(ae.media - rua.media) * 50, 2)}${ae95 && rua95 ? `; for petrol 95 it is ${h.eur(Math.abs(ae95.media - rua95.media) * 50, 2)}` : ''}. The sum compares averages: an expensive street station can cost as much as a service area.` : `There are not enough motorway and street station prices in Setúbal district today to compare them. The list above shows the prices available, station by station, with the latest update time.` },
        { q: 'Which municipality in Setúbal district has the cheapest LPG?', a: cg.length ? `Today the lowest LPG average in Setúbal district is in ${cg[0].concelho}, at ${h.l(cg[0].media)} across ${h.num(cg[0].n)} ${cg[0].n === 1 ? 'station' : 'stations'}${cg.length > 1 ? `, and the highest in ${cg[cg.length - 1].concelho}, at ${h.l(cg[cg.length - 1].media)}` : ''}. Pick LPG and the municipality in the calculator above to see the cheapest stations and the time each one reported its price.` : `No station in Setúbal district has reported an LPG price to the DGEG today. Pick LPG in the calculator above to see the stations as soon as they send prices again.` },
        { q: 'Is diesel in Setúbal above or below the mainland average?', a: gs ? `Today it is ${h.c(Math.abs(h.D.desvioDistrito('gs', D)))} ${h.D.desvioDistrito('gs', D) < 0 ? 'below' : 'above'} the mainland average, at ${h.l(gs.media)} in Setúbal district. That puts the district ${h.ord(rg.pos)} out of ${h.num(rg.de)}. The sign can flip from one day to the next, because the gaps between districts are only a few cents.` : `There are not enough prices in Setúbal district today to compare it with the mainland average. The comparison is made again once stations send new prices to the DGEG.` },
      ];
    },
    body: (h) => {
      const { gs, ae, rua, hip, p, c, cg } = base(h);
      const tipos = ([['Street', rua], ['Shopping area', hip], ['Motorway', ae]] as const).filter(([, s]) => s);
      const abaixo = gs ? c.filter((x) => x.media < gs.media).length : 0;
      return `<h2>On the motorway or off it</h2>
<p>The district has ${h.num(p.autoestrada)} motorway stations, ${h.num(p.rua)} street stations and ${h.num(p.hiper)} at shopping areas. The table shows the average and the lowest price of each type for standard diesel.</p>
${h.table(['Station type', 'Stations', 'Average', 'Cheapest'], tipos.map(([n, s]) => [n, s!.n, h.l(s!.media), h.l(s!.min)]), 'Standard diesel in Setúbal district by station type', ['l', 'r', 'r', 'r'])}
<p>On a motorway journey, leaving for a street station only pays if the detour is short: a few cents a litre on 50 litres amounts to a few euros, which a long detour soon eats up.</p>
<h2>Municipalities above and below the district average</h2>
<p>${gs ? `Of the ${h.num(c.length)} municipalities with two stations or more, ${h.num(abaixo)} have diesel below the district average today and ${h.num(c.length - abaixo)} at or above it.` : ''} The last column gives each municipality’s gap to the average, in cents a litre.</p>
${gs ? h.table(['Municipality', 'Stations', 'Average', 'Against district'], c.map((x) => [x.concelho, x.n, h.l(x.media), h.c(x.media - gs.media, true)]), 'Standard diesel, average by municipality', ['l', 'r', 'r', 'r']) : ''}
<h2>LPG in the district</h2>
<p>${p.gpl ? `LPG is sold at ${h.num(p.gpl)} stations, in ${h.num(cg.length)} municipalities.` : 'No station sells LPG in the district today.'} ${cg.length > 1 ? `The average by municipality runs from ${h.l(cg[0].media)} in ${cg[0].concelho} to ${h.l(cg[cg.length - 1].media)} in ${cg[cg.length - 1].concelho}.` : ''}</p>
<h2>The four neighbouring districts</h2>
<p>${VIZ.map(([id, n, en]) => { const s = h.D.statsDe('gs', n); return s ? `${h.a(id, en)}: ${h.l(s.media)}` : ''; }).filter(Boolean).join(' · ')}. These are today’s standard diesel averages in the districts bordering Setúbal. To compare station by station across the mainland, use the ${h.a('postos-mais-baratos', 'cheapest stations')} page.</p>
<p>${(() => { const t = h.D.tipoDistrito('g95', D), a = t['Auto-estrada'], r = t['Outro'], g98 = h.D.statsDe('g98', D); return `${a && r ? `For standard petrol 95, the average is ${h.l(a.media)} on the motorway and ${h.l(r.media)} at street stations, ${h.c(a.media - r.media, true)} a litre between them. ` : ''}${g98 ? `Petrol 98 is found at only ${h.num(g98.n)} stations in the district, at ${h.l(g98.media)} on average, so those who use it have less to choose from.` : ''}`; })()}</p>`;
    },
  },
});
