import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Évora';
const Z = { media: 0, min: 0, max: 0, n: 0 };
const dias = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

function dados(h: Helpers) {
  const gs = h.D.statsDe('gs', D) ?? Z, g95 = h.D.statsDe('g95', D) ?? Z, g95e = h.D.statsDe('g95e', D), gpl = h.D.statsDe('gpl', D);
  const pt = h.D.statsDe('gs') ?? Z;
  const p = h.D.postosDistrito(D), r = h.D.rankDistrito('gs', D), rg = h.D.rankDistrito('g95', D);
  const l = h.D.lista('gs', D);
  const abaixo = l.filter((x) => x.preco < pt.media);
  const hoje = l.filter((x) => x.atualizado.slice(0, 10) === h.D.HOJE).length;
  const semana = l.filter((x) => dias(x.atualizado.slice(0, 10), h.D.HOJE) > 7).length;
  const antigo = [...l].sort((a, b) => a.atualizado.localeCompare(b.atualizado))[0];
  const conc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s, abaixo: l.filter((x) => x.concelho === concelho && x.preco < pt.media).length })).sort((a, b) => a.concelho.localeCompare(b.concelho, 'pt'));
  const g95c = h.D.concelhosOrdenados('g95', D);
  const viz = (['Portalegre', 'Santarém', 'Setúbal', 'Beja'] as const).map((n) => ({ n, gs: h.D.statsDe('gs', n), g95: h.D.statsDe('g95', n) })).filter((x) => x.gs && x.g95);
  return { gs, g95, g95e, gpl, pt, p, r, rg, l, abaixo, hoje, semana, antigo, conc, g95c, viz };
}

export default defineGuide({
  id: 'evora', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['portalegre', 'beja', 'setubal', 'santarem', 'preco-gasolina-95'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'evora', nav: 'Évora', card: 'Quantos postos do distrito de Évora vendem abaixo da média do continente, e há quanto tempo cada preço foi atualizado.',
    title: 'Gasóleo e gasolina em Évora hoje: postos abaixo da média',
    description: 'Gasóleo e gasolina hoje no distrito de Évora: os postos abaixo da média do continente, há quanto tempo foi atualizado cada preço e a comparação com Beja.',
    h1: 'Combustíveis no distrito de Évora hoje',
    intro: (h) => `Quantos dos ${h.num(h.D.postosDistrito(D).total)} postos do distrito de Évora vendem abaixo da média do continente, e quão recentes são os preços que afixam.`,
    resume: (h) => {
      const { gs, g95, pt, r, rg, l, abaixo, hoje } = dados(h);
      return `Os postos do distrito de Évora afixam hoje o gasóleo simples a ${h.l(gs.media)} em média e a gasolina simples 95 a ${h.l(g95.media)}. A média do continente para o gasóleo é de ${h.l(pt.media)}, e ${h.num(abaixo.length)} dos ${h.num(l.length)} postos do distrito com gasóleo, ou ${h.pct(abaixo.length / Math.max(l.length, 1))}, vendem abaixo dela. É um retrato mais útil do que a média sozinha, porque mostra se o preço baixo está espalhado pela rede ou concentrado em poucos postos. Entre os ${h.num(r.de)} distritos, Évora está em ${h.ord(r.pos)} lugar no gasóleo e em ${h.ord(rg.pos)} na gasolina, do mais barato para o mais caro. Os preços chegam à DGEG em datas diferentes: ${h.num(hoje)} postos atualizaram o gasóleo hoje${l.length > hoje ? `, e os restantes ${h.num(l.length - hoje)} fizeram-no em dias anteriores` : ''}. Na calculadora, cada posto aparece com a data e a hora do seu último preço, para distinguir um valor de hoje de um valor que já pode ter mudado na bomba. O mais barato do distrito afixa ${h.l(gs.min)}.`;
    },
    faqs: (h) => [
      { q: 'Quantos postos do distrito de Évora vendem gasóleo abaixo da média do continente?', a: (() => { const { abaixo, l, pt } = dados(h); return `Hoje são ${h.num(abaixo.length)} dos ${h.num(l.length)} postos do distrito com preço de gasóleo simples, ${h.pct(abaixo.length / Math.max(l.length, 1))} do total, com preço abaixo da média do continente, que está em ${h.l(pt.media)}. A tabela desta página mostra quantos há em cada concelho. A contagem muda sempre que um posto comunica um preço novo à DGEG.`; })() },
      { q: 'Os preços dos postos do distrito de Évora estão atualizados?', a: (() => { const { hoje, semana, l, antigo } = dados(h); return `Cada posto comunica o preço à DGEG quando o altera. Hoje, ${h.num(hoje)} dos ${h.num(l.length)} postos com gasóleo atualizaram o preço no próprio dia${semana ? ` e ${h.num(semana)} não o mudam há mais de uma semana` : ''}.${antigo ? ` O preço mais antigo na lista é de ${h.dia(antigo.atualizado.slice(0, 10))}.` : ''} Um preço que não muda há dias não é necessariamente errado: pode simplesmente não ter havido alteração.`; })() },
      { q: 'Qual é a diferença entre gasolina e gasóleo no distrito de Évora?', a: (() => { const { gs, g95 } = dados(h); const d = g95.media - gs.media; return `Hoje a gasolina simples 95 está a ${h.l(g95.media)} em média no distrito e o gasóleo simples a ${h.l(gs.media)}, o que deixa a gasolina ${h.c(Math.abs(d))} por litro ${d < 0 ? 'abaixo' : 'acima'} do gasóleo. Num depósito de 50 litros, são ${h.eur(Math.abs(d) * 50, 2)}. O consumo de cada motor conta mais do que esta diferença ao comparar dois carros.`; })() },
    ],
    body: (h) => {
      const { gs, g95, g95e, gpl, pt, p, conc, g95c, viz, semana } = dados(h);
      const lo = g95c[0], hi = g95c[g95c.length - 1];
      return `<h2>Postos abaixo da média do continente</h2>
<p>A tabela conta, em cada concelho, os postos com o gasóleo abaixo da média do continente (${h.l(pt.media)}). Num concelho com poucos postos, um único posto barato pode fazer a diferença; nos que têm mais postos, a contagem mostra se o preço baixo é regra ou exceção.</p>
${h.table(['Concelho', 'Postos', 'Abaixo da média', 'Mínimo'], conc.map((x) => [x.concelho, x.n, x.abaixo, h.l(x.min)]), 'Gasóleo simples, por ordem alfabética dos concelhos', ['l', 'r', 'r', 'r'])}
<h2>Gasolina contra gasóleo</h2>
<p>Na gasolina simples 95, a média do distrito é de ${h.l(g95.media)}, ${h.c(g95.media - gs.media, true)} por litro face ao gasóleo. ${lo && hi && g95c.length > 1 ? `Por concelho, vai de ${h.l(lo.media)} em ${lo.concelho} a ${h.l(hi.media)} em ${hi.concelho}.` : ''} ${g95e ? `A gasolina especial 95 custa ${h.l(g95e.media)} em ${h.num(g95e.n)} postos.` : ''}${gpl ? ` O GPL Auto existe em ${h.num(gpl.n)} postos, a ${h.l(gpl.media)}.` : ''} A página do ${h.a('preco-gasolina-95', 'preço da gasolina 95')} compara todos os distritos.</p>
<h2>Que tipo de posto existe no distrito</h2>
<p>O registo da DGEG tem ${h.num(p.total)} postos no distrito: ${h.num(p.rua)} de rua${p.autoestrada ? `, ${h.num(p.autoestrada)} em autoestrada` : ''}${p.hiper ? ` e ${h.num(p.hiper)} em área comercial` : ', sem nenhum em área comercial'}. ${p.hiper ? '' : 'Sem postos de hipermercado, as alternativas aos postos de rua são as áreas de serviço, normalmente mais caras.'} ${semana ? `Há ${h.num(semana)} postos cujo preço de gasóleo não muda há mais de sete dias; convém confirmar no local antes de fazer muitos quilómetros por eles.` : 'Todos os postos atualizaram o preço do gasóleo na última semana.'}</p>
<h2>Évora no Alentejo e na fronteira</h2>
<p>O distrito faz fronteira com Espanha, mas este site cobre só os postos portugueses. Junto aos distritos vizinhos, as médias de hoje ficam assim: ${viz.map((x) => `${h.a(h.D.slug(x.n), x.n)}, ${h.l(x.gs!.media)} no gasóleo e ${h.l(x.g95!.media)} na gasolina`).join('; ')}. Évora está a ${h.l(gs.media)} e ${h.l(g95.media)}.</p>`;
    },
  },
  en: {
    slug: 'evora', nav: 'Évora', card: 'How many stations in Évora district sell below the mainland average, and how recently each price was updated.',
    title: 'Fuel in Évora today: stations below the mainland average',
    description: 'Diesel and petrol today in Évora district: the stations below the mainland average, how long ago each price was updated and a comparison with Beja and Setúbal.',
    h1: 'Fuel prices in Évora district today',
    intro: (h) => `How many of the ${h.num(h.D.postosDistrito(D).total)} stations in Évora district sell below the mainland average, and how recent the prices they post are.`,
    resume: (h) => {
      const { gs, g95, pt, r, rg, l, abaixo, hoje } = dados(h);
      return `Stations in Évora district post standard diesel at ${h.l(gs.media)} on average today and standard petrol 95 at ${h.l(g95.media)}. The mainland diesel average is ${h.l(pt.media)}, and ${h.num(abaixo.length)} of the district's ${h.num(l.length)} diesel stations, or ${h.pct(abaixo.length / Math.max(l.length, 1))}, sell below it. That is a more useful picture than the average alone, because it shows whether low prices are spread across the network or concentrated in a few stations. Among the ${h.num(r.de)} districts, Évora ranks ${h.ord(r.pos)} for diesel and ${h.ord(rg.pos)} for petrol, from cheapest to dearest. Prices reach the DGEG on different dates: ${h.num(hoje)} stations updated their diesel price today${l.length > hoje ? `, and the other ${h.num(l.length - hoje)} did so on earlier days` : ''}. In the calculator each station appears with the date and time of its latest price, so you can tell a price from today from one that may already have changed at the pump. The cheapest in the district posts ${h.l(gs.min)}.`;
    },
    faqs: (h) => [
      { q: 'How many stations in Évora district sell diesel below the mainland average?', a: (() => { const { abaixo, l, pt } = dados(h); return `Today ${h.num(abaixo.length)} of the ${h.num(l.length)} stations in the district with a standard diesel price, ${h.pct(abaixo.length / Math.max(l.length, 1))} of the total, are priced below the mainland average of ${h.l(pt.media)}. The table on this page shows how many there are in each municipality. The count changes every time a station reports a new price to the DGEG.`; })() },
      { q: 'Are the station prices in Évora district up to date?', a: (() => { const { hoje, semana, l, antigo } = dados(h); return `Each station reports its price to the DGEG when it changes it. Today, ${h.num(hoje)} of the ${h.num(l.length)} diesel stations updated their price on the day${semana ? ` and ${h.num(semana)} have not changed it for more than a week` : ''}.${antigo ? ` The oldest price on the list dates from ${h.dia(antigo.atualizado.slice(0, 10))}.` : ''} A price that has not moved for days is not necessarily wrong: there may simply have been no change.`; })() },
      { q: 'What is the gap between petrol and diesel in Évora district?', a: (() => { const { gs, g95 } = dados(h); const d = g95.media - gs.media; return `Today standard petrol 95 averages ${h.l(g95.media)} in the district and standard diesel ${h.l(gs.media)}, which leaves petrol ${h.c(Math.abs(d))} a litre ${d < 0 ? 'below' : 'above'} diesel. On a 50-litre tank, that is ${h.eur(Math.abs(d) * 50, 2)}. When comparing two cars, each engine's consumption matters more than this gap.`; })() },
    ],
    body: (h) => {
      const { gs, g95, g95e, gpl, pt, p, conc, g95c, viz, semana } = dados(h);
      const lo = g95c[0], hi = g95c[g95c.length - 1];
      return `<h2>Stations below the mainland average</h2>
<p>The table counts, in each municipality, the stations with diesel below the mainland average (${h.l(pt.media)}). In a municipality with few stations, a single cheap one can make the difference; where there are more, the count shows whether a low price is the rule or the exception.</p>
${h.table(['Municipality', 'Stations', 'Below average', 'Lowest'], conc.map((x) => [x.concelho, x.n, x.abaixo, h.l(x.min)]), 'Standard diesel, municipalities in alphabetical order', ['l', 'r', 'r', 'r'])}
<h2>Petrol against diesel</h2>
<p>For standard petrol 95, the district average is ${h.l(g95.media)}, ${h.c(g95.media - gs.media, true)} a litre against diesel. ${lo && hi && g95c.length > 1 ? `By municipality, it runs from ${h.l(lo.media)} in ${lo.concelho} to ${h.l(hi.media)} in ${hi.concelho}.` : ''} ${g95e ? `Premium petrol 95 costs ${h.l(g95e.media)} at ${h.num(g95e.n)} stations.` : ''}${gpl ? ` LPG is available at ${h.num(gpl.n)} stations, at ${h.l(gpl.media)}.` : ''} The ${h.a('preco-gasolina-95', 'petrol 95 price')} page compares every district.</p>
<h2>What kind of stations the district has</h2>
<p>The DGEG register holds ${h.num(p.total)} stations in the district: ${h.num(p.rua)} street stations${p.autoestrada ? `, ${h.num(p.autoestrada)} on motorways` : ''}${p.hiper ? ` and ${h.num(p.hiper)} at shopping areas` : ', with none at a shopping area'}. ${p.hiper ? '' : 'With no hypermarket stations, the alternative to street stations is the service areas, which are usually dearer.'} ${semana ? `There are ${h.num(semana)} stations whose diesel price has not changed for more than seven days; it is worth checking on the spot before driving far for them.` : 'Every station has updated its diesel price within the last week.'}</p>
<h2>Évora, the Alentejo and the border</h2>
<p>The district borders Spain, but this site covers Portuguese stations only. Next to the neighbouring districts, today's averages look like this: ${viz.map((x) => `${h.a(h.D.slug(x.n), x.n)}, ${h.l(x.gs!.media)} for diesel and ${h.l(x.g95!.media)} for petrol`).join('; ')}. Évora is at ${h.l(gs.media)} and ${h.l(g95.media)}.</p>`;
    },
  },
});
