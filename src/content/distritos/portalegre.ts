import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Portalegre';
const VIZ = [['castelo-branco', 'Castelo Branco'], ['santarem', 'Santarém'], ['evora', 'Évora']] as const;

const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), g95 = h.D.statsDe('g95', D), p = h.D.postosDistrito(D);
  const pc = Object.entries(h.D.porConcelho('gs', D)).map(([concelho, s]) => ({ concelho, ...s }));
  const poucos = pc.filter((x) => x.n <= 2), um = pc.filter((x) => x.n === 1);
  const semGs = Math.max(0, p.concelhos - pc.length);
  const total = h.D.POSTOS.postos.length;
  return { gs, g95, p, pc, poucos, um, semGs, total, rg: h.D.rankDistrito('gs', D), rp: h.D.rankDistrito('g95', D) };
};

export default defineGuide({
  id: 'portalegre', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['evora', 'castelo-branco', 'santarem', 'postos-mais-baratos'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'portalegre', nav: 'Portalegre', card: 'Os postos do distrito de Portalegre concelho a concelho, onde há poucos e quanto custa o gasóleo e a gasolina em cada um.',
    title: 'Combustíveis em Portalegre hoje: postos de cada concelho',
    description: 'Combustíveis em Portalegre hoje: gasóleo e gasolina em cada concelho, quantos postos há em cada um, onde só existe um e o mais barato do distrito. Dados DGEG.',
    h1: 'Gasóleo e gasolina em Portalegre hoje',
    intro: (h) => `Num distrito com ${h.num(h.D.postosDistrito(D).total)} postos registados na DGEG, saber onde fica o próximo conta tanto como o preço: aqui estão os dois, concelho a concelho.`,
    resume: (h) => {
      const { gs, g95, p, poucos, total, rg, rp } = base(h);
      if (!gs || !g95) return `Os postos do distrito de Portalegre ainda não enviaram hoje à DGEG preços suficientes para uma média do gasóleo e da gasolina. A lista acima mostra o último preço conhecido de cada posto e a hora em que foi comunicado. A média do distrito, a contagem de postos por concelho e a comparação com os distritos vizinhos voltam a ser calculadas logo que existam dados novos, o que acontece várias vezes por dia útil.`;
      return `Em Portalegre, o gasóleo simples custa hoje em média ${h.l(gs.media)} e a gasolina simples 95 ${h.l(g95.media)}, segundo os preços que os postos do distrito comunicam à DGEG. A particularidade do distrito é a dimensão da rede: são ${h.num(p.total)} postos no total, ${h.pct(p.total / total)} dos postos do continente, repartidos por ${h.num(p.concelhos)} concelhos, e em ${h.num(poucos.length)} deles há no máximo dois postos com gasóleo. Isso faz com que a média de um concelho dependa muitas vezes de um único preço. No registo há ${h.num(p.autoestrada)} postos de autoestrada e ${p.hiper ? `${h.num(p.hiper)} em áreas comerciais` : 'nenhum em áreas comerciais de hipermercado'}. Na ordem dos ${h.num(rg.de)} distritos, do mais barato para o mais caro, Portalegre surge em ${h.ord(rg.pos)} lugar no gasóleo e em ${h.ord(rp.pos)} na gasolina. O posto mais barato pede ${h.l(gs.min)} pelo gasóleo, ${h.c(gs.media - gs.min)} abaixo da média do distrito.`;
    },
    faqs: (h) => {
      const { gs, g95, p, um } = base(h);
      return [
        { q: 'Quantos postos de combustível existem no distrito de Portalegre?', a: `A DGEG regista hoje ${h.num(p.total)} postos no distrito de Portalegre: ${h.num(p.rua)} postos de rua, ${h.num(p.autoestrada)} em autoestrada e ${h.num(p.hiper)} em áreas comerciais. ${um.length ? `Em ${h.num(um.length)} concelhos há um único posto com gasóleo, o que obriga a planear o abastecimento antes de partir.` : 'Todos os concelhos com postos têm pelo menos dois a vender gasóleo.'} O GPL Auto existe em ${h.num(p.gpl)} deles.` },
        { q: 'Há postos de hipermercado no distrito de Portalegre?', a: p.hiper ? `Sim, a DGEG lista hoje ${h.num(p.hiper)} postos em áreas comerciais de hipermercado no distrito de Portalegre. Os restantes ${h.num(p.total - p.hiper)} são postos de rua ou de autoestrada. Para os encontrar, abra a lista da calculadora acima: cada posto aparece com a marca, a localidade e a hora da última atualização do preço.` : `Hoje não. Nenhum dos ${h.num(p.total)} postos do distrito de Portalegre registados na DGEG está classificado como área comercial de hipermercado: são postos de rua ou de autoestrada. Os preços mais baixos vêm por isso de postos de rua, que a lista acima ordena do mais barato para o mais caro.` },
        { q: 'Em Portalegre, a gasolina 95 está mais cara ou mais barata do que o gasóleo?', a: gs && g95 ? `Hoje a gasolina simples 95 está a ${h.l(g95.media)} em média no distrito de Portalegre e o gasóleo simples a ${h.l(gs.media)}: a gasolina fica ${h.c(Math.abs(g95.media - gs.media))} por litro ${g95.media < gs.media ? 'abaixo' : 'acima'} do gasóleo. Num depósito de 50 litros, a diferença é de ${h.eur(Math.abs(g95.media - gs.media) * 50, 2)}, sem contar com o consumo, que costuma ser diferente entre os dois motores.` : `Hoje não há preços suficientes no distrito de Portalegre para comparar a gasolina 95 com o gasóleo. A comparação reaparece logo que os postos voltem a comunicar à DGEG.` },
      ];
    },
    body: (h) => {
      const { gs, pc, poucos, semGs, p } = base(h);
      const ord = [...pc].sort((a, b) => b.n - a.n || a.media - b.media);
      const viz = VIZ.map(([id, n]) => ({ id, n, s: h.D.statsDe('gs', n), q: h.D.postosDistrito(n).total }));
      return `<h2>Uma rede pequena, espalhada por muitos concelhos</h2>
<p>A tabela mostra quantos postos vendem gasóleo em cada concelho, o preço médio e o mais baixo. Ordená-la pelo número de postos, e não pelo preço, tem uma razão prática: num concelho com um só posto, a média é o preço desse posto, e não há alternativa por perto dentro do mesmo concelho.${semGs ? ` Em ${h.num(semGs)} concelhos do distrito nenhum posto comunica hoje preço de gasóleo.` : ''}</p>
${h.table(['Concelho', 'Postos', 'Média', 'Mais baixo'], ord.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Gasóleo simples por concelho, do maior número de postos para o menor', ['l', 'r', 'r', 'r'])}
<h2>Onde há um ou dois postos</h2>
<p>${poucos.length ? `${poucos.map((x) => x.concelho).join(', ')}: são ${h.num(poucos.length)} concelhos com dois postos ou menos.` : 'Nenhum concelho tem hoje menos de três postos com gasóleo.'} Antes de uma viagem pelo interior do distrito, vale a pena ver na lista qual é o posto mais barato no percurso e a hora da última atualização, porque um preço comunicado há dias pode já ter mudado.${gs ? ` O mais baixo do distrito está hoje a ${h.l(gs.min)} e o mais alto a ${h.l(gs.max)}.` : ''}</p>
<h2>Portalegre entre Castelo Branco, Santarém e Évora</h2>
<p>O distrito faz fronteira com Espanha e com três distritos portugueses. ${viz.filter((v) => v.s).map((v) => `${h.a(v.id, v.n)} tem ${h.num(v.q)} postos e gasóleo a ${h.l(v.s!.media)}`).join('; ')}, contra ${h.num(p.total)} postos${gs ? ` e ${h.l(gs.media)}` : ''} em Portalegre. A página dos ${h.a('postos-mais-baratos', 'postos mais baratos')} mostra o ranking de todo o continente.</p>
<p>${(() => { const g = h.D.statsDe('g95', D), b = h.D.baratos('g95', 1, D)[0], gl = h.D.baratos('gpl', 50, D); return g ? `Na gasolina simples 95, o intervalo no distrito vai de ${h.l(g.min)} a ${h.l(g.max)}${b ? `, e o posto mais barato fica em ${b.concelho}` : ''}. ${gl.length ? `Quem anda a GPL Auto encontra ${h.num(gl.length)} ${gl.length === 1 ? 'posto' : 'postos'} no distrito, em ${[...new Set(gl.map((x) => x.concelho))].join(' e ')}.` : 'Nenhum posto do distrito comunica hoje preço de GPL Auto.'}` : ''; })()}</p>`;
    },
  },
  en: {
    slug: 'portalegre', nav: 'Portalegre', card: 'Stations in Portalegre district municipality by municipality, where they are scarce and what diesel and petrol cost in each.',
    title: 'Fuel prices in Portalegre today: stations in each area',
    description: 'Fuel prices in Portalegre today: diesel and petrol in each municipality, how many stations each has, where there is only one, and the cheapest in the district.',
    h1: 'Diesel and petrol in Portalegre today',
    intro: (h) => `In a district with ${h.num(h.D.postosDistrito(D).total)} stations on the DGEG register, knowing where the next one is matters as much as the price: here are both, municipality by municipality.`,
    resume: (h) => {
      const { gs, g95, p, poucos, total, rg, rp } = base(h);
      if (!gs || !g95) return `Stations in Portalegre district have not yet sent the DGEG enough prices today for a diesel and petrol average. The list above shows each station’s last known price and the time it was reported. The district average, the station count by municipality and the comparison with neighbouring districts are recomputed as soon as new data arrive, which happens several times each working day.`;
      return `In Portalegre, standard diesel costs ${h.l(gs.media)} on average today and standard petrol 95 costs ${h.l(g95.media)}, based on the prices the district’s stations report to the DGEG. What sets the district apart is the size of its network: ${h.num(p.total)} stations in all, ${h.pct(p.total / total)} of the mainland’s stations, spread over ${h.num(p.concelhos)} municipalities, and ${h.num(poucos.length)} of those have no more than two stations selling diesel. That means a municipality’s average often rests on a single price. The register holds ${h.num(p.autoestrada)} motorway stations and ${p.hiper ? `${h.num(p.hiper)} at shopping areas` : 'no hypermarket stations at all'}. In the order of ${h.num(rg.de)} districts, cheapest to dearest, Portalegre comes ${h.ord(rg.pos)} for diesel and ${h.ord(rp.pos)} for petrol. The cheapest station asks ${h.l(gs.min)} for diesel, ${h.c(gs.media - gs.min)} below the district average, a saving worth knowing about when the next station may be some distance away.`;
    },
    faqs: (h) => {
      const { gs, g95, p, um } = base(h);
      return [
        { q: 'How many fuel stations are there in Portalegre district?', a: `The DGEG lists ${h.num(p.total)} stations in Portalegre district today: ${h.num(p.rua)} street stations, ${h.num(p.autoestrada)} on motorways and ${h.num(p.hiper)} at shopping areas. ${um.length ? `In ${h.num(um.length)} municipalities there is only one station selling diesel, so it pays to plan where to fill up before setting off.` : 'Every municipality with stations has at least two selling diesel.'} LPG is sold at ${h.num(p.gpl)} of them.` },
        { q: 'Are there any hypermarket fuel stations in Portalegre district?', a: p.hiper ? `Yes, the DGEG lists ${h.num(p.hiper)} hypermarket stations in Portalegre district today. The other ${h.num(p.total - p.hiper)} are street or motorway stations. To find them, open the calculator list above: each station appears with its brand, its locality and the time of its latest price update.` : `Not today. None of the ${h.num(p.total)} stations in Portalegre district on the DGEG register is classed as a hypermarket station: they are all street or motorway stations. The lowest prices therefore come from street stations, which the list above ranks from cheapest to dearest.` },
        { q: 'In Portalegre, is petrol 95 dearer or cheaper than diesel?', a: gs && g95 ? `Today standard petrol 95 averages ${h.l(g95.media)} in Portalegre district and standard diesel ${h.l(gs.media)}, so petrol is ${h.c(Math.abs(g95.media - gs.media))} a litre ${g95.media < gs.media ? 'below' : 'above'} diesel. On a 50-litre tank the difference is ${h.eur(Math.abs(g95.media - gs.media) * 50, 2)}, before allowing for fuel consumption, which usually differs between the two kinds of engine.` : `There are not enough prices in Portalegre district today to compare petrol 95 with diesel. The comparison comes back once stations report to the DGEG again.` },
      ];
    },
    body: (h) => {
      const { gs, pc, poucos, semGs, p } = base(h);
      const ord = [...pc].sort((a, b) => b.n - a.n || a.media - b.media);
      const viz = VIZ.map(([id, n]) => ({ id, n, s: h.D.statsDe('gs', n), q: h.D.postosDistrito(n).total }));
      return `<h2>A small network spread over many municipalities</h2>
<p>The table shows how many stations sell diesel in each municipality, the average price and the lowest. It is sorted by station count rather than price for a practical reason: where a municipality has a single station, the average is simply that station’s price, and there is no alternative nearby within the same municipality.${semGs ? ` In ${h.num(semGs)} of the district’s municipalities no station reports a diesel price today.` : ''}</p>
${h.table(['Municipality', 'Stations', 'Average', 'Lowest'], ord.map((x) => [x.concelho, x.n, h.l(x.media), h.l(x.min)]), 'Standard diesel by municipality, from most stations to fewest', ['l', 'r', 'r', 'r'])}
<h2>Where there are only one or two stations</h2>
<p>${poucos.length ? `${poucos.map((x) => x.concelho).join(', ')}: ${h.num(poucos.length)} municipalities with two stations or fewer.` : 'No municipality has fewer than three diesel stations today.'} Before a drive through the interior of the district, check the list for the cheapest station on your route and its last update time, since a price reported days ago may already have changed.${gs ? ` The district’s lowest is ${h.l(gs.min)} today and its highest ${h.l(gs.max)}.` : ''}</p>
<h2>Portalegre between Castelo Branco, Santarém and Évora</h2>
<p>The district borders Spain and three Portuguese districts. ${viz.filter((v) => v.s).map((v) => `${h.a(v.id, v.n)} has ${h.num(v.q)} stations and diesel at ${h.l(v.s!.media)}`).join('; ')}, against ${h.num(p.total)} stations${gs ? ` and ${h.l(gs.media)}` : ''} in Portalegre. The ${h.a('postos-mais-baratos', 'cheapest stations')} page shows the ranking for the whole mainland.</p>
<p>${(() => { const g = h.D.statsDe('g95', D), b = h.D.baratos('g95', 1, D)[0], gl = h.D.baratos('gpl', 50, D); return g ? `For standard petrol 95, the range across the district runs from ${h.l(g.min)} to ${h.l(g.max)}${b ? `, and the cheapest station is in ${b.concelho}` : ''}. ${gl.length ? `LPG drivers will find ${h.num(gl.length)} ${gl.length === 1 ? 'station' : 'stations'} in the district, in ${[...new Set(gl.map((x) => x.concelho))].join(' and ')}.` : 'No station in the district reports an LPG price today.'}` : ''; })()}</p>`;
    },
  },
});
