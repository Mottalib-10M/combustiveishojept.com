import { defineGuide, type Helpers } from '../../lib/guide-types';
const D = 'Guarda';
const VIZ = [['braganca', 'Bragança'], ['viseu', 'Viseu'], ['coimbra', 'Coimbra'], ['castelo-branco', 'Castelo Branco']] as const;

/** Les chiffres communs aux deux langues, recalculés au build. */
const base = (h: Helpers) => {
  const gs = h.D.statsDe('gs', D), ge = h.D.statsDe('ge', D), g95 = h.D.statsDe('g95', D), g98 = h.D.statsDe('g98', D);
  const p = h.D.postosDistrito(D), t = h.D.tipoDistrito('gs', D);
  return { gs, ge, g95, g98, p, ae: t['Auto-estrada'], fora: t['Outro'], rg: h.D.rankDistrito('gs', D), rp: h.D.rankDistrito('g95', D) };
};

export default defineGuide({
  id: 'guarda', group: 'distritos', order: 10, tool: 'precos', toolProps: { distrito: D },
  related: ['viseu', 'castelo-branco', 'braganca', 'simples-ou-aditivado', 'custo-deposito'],
  sources: ['dgegPortal', 'dgegPmd'],
  pt: {
    slug: 'guarda', nav: 'Guarda', card: 'Gasóleo simples e especial, gasolina e GPL nos concelhos do distrito da Guarda, com o posto mais barato de cada um.',
    title: 'Gasóleo na Guarda hoje: preço médio, concelhos e postos',
    description: 'Gasóleo e gasolina na Guarda hoje: média de cada concelho, diferença entre simples e especial, postos de autoestrada e posto mais barato. Dados da DGEG.',
    h1: 'Preço dos combustíveis na Guarda hoje',
    intro: (h) => `O que pedem hoje os ${h.num(h.D.postosDistrito(D).total)} postos do distrito da Guarda, concelho a concelho, do gasóleo simples ao GPL Auto.`,
    resume: (h) => {
      const { gs, ge, g95, rg, rp } = base(h);
      if (!gs || !g95) return `Os postos do distrito da Guarda ainda não comunicaram hoje preços suficientes à DGEG para calcular uma média fiável de gasóleo e de gasolina. A lista acima mostra, posto a posto, o último preço afixado e a hora a que foi comunicado; volte mais tarde para ver a média do distrito, a posição face aos outros distritos e a diferença entre o posto mais barato e o mais caro, que são recalculadas sempre que a DGEG publica novos dados.`;
      return `Hoje, no distrito da Guarda, o litro de gasóleo simples custa em média ${h.l(gs.media)} e o de gasolina simples 95 ${h.l(g95.media)}. ${ge ? `Quem prefere o gasóleo especial paga em média ${h.l(ge.media)}, ou seja ${h.c(ge.media - gs.media, true)} por litro face ao simples. ` : ''}Contando do distrito mais barato para o mais caro, a Guarda aparece em ${h.ord(rg.pos)} lugar entre ${h.num(rg.de)} no gasóleo e em ${h.ord(rp.pos)} na gasolina 95, porque cada combustível tem a sua própria ordem. Em relação à média do continente, a diferença é de ${h.c(h.D.desvioDistrito('gs', D), true)} no gasóleo e de ${h.c(h.D.desvioDistrito('g95', D), true)} na gasolina. O gasóleo mais barato afixado hoje no distrito custa ${h.l(gs.min)} e o mais caro ${h.l(gs.max)}: num depósito de 60 litros, a distância entre os dois extremos chega a ${h.eur((gs.max - gs.min) * 60, 2)}. Estes valores resultam dos ${h.num(gs.n)} postos que comunicam o preço do gasóleo simples à DGEG, cada um com a hora da sua última atualização.`;
    },
    faqs: (h) => {
      const { gs, ge, g98, p } = base(h);
      const top = h.D.baratos('gs', 1, D)[0], c98 = Object.keys(h.D.porConcelho('g98', D)).length;
      return [
        { q: 'Na Guarda, quanto custa a mais o gasóleo especial do que o simples?', a: gs && ge ? `Hoje a média do gasóleo especial no distrito da Guarda é ${h.l(ge.media)}, contra ${h.l(gs.media)} do simples, uma diferença de ${h.c(ge.media - gs.media)} por litro. Num depósito de 50 litros isso representa ${h.eur((ge.media - gs.media) * 50, 2)}. A página sobre gasóleo simples ou aditivado explica o que muda no motor e quando a diferença pode compensar.` : `Hoje não há preços suficientes de gasóleo especial no distrito da Guarda para calcular a diferença face ao simples. Quando os postos voltarem a comunicar, a média de cada um aparece aqui e na lista, com a hora de atualização.` },
        { q: 'Em quantos concelhos do distrito da Guarda se encontra gasolina 98?', a: `A DGEG regista hoje gasolina 98 à venda em ${h.num(c98)} dos ${h.num(p.concelhos)} concelhos do distrito da Guarda${g98 ? `, em ${h.num(g98.n)} postos, com média de ${h.l(g98.media)}` : ''}. Nos restantes concelhos só há gasolina 95, simples ou especial. Para encontrar o posto mais próximo, escolha Gasolina 98 na calculadora acima: a lista mostra os mais baratos com morada e hora.` },
        { q: 'Qual é hoje o posto com o gasóleo mais barato no distrito da Guarda?', a: top ? `Neste momento é ${top.nome}, em ${top.concelho}, com o gasóleo simples a ${h.l(top.preco)}, preço comunicado à DGEG às ${top.atualizado.slice(11)} de ${top.atualizado.slice(8, 10)}/${top.atualizado.slice(5, 7)}. A posição muda sempre que um posto altera o preço, por isso a lista acima é a referência mais recente: confirme o valor na bomba antes de abastecer.` : `Hoje nenhum posto do distrito da Guarda comunicou preço de gasóleo simples à DGEG. A lista acima volta a ordenar os postos do mais barato para o mais caro assim que houver novos preços, com a hora de cada atualização.` },
      ];
    },
    body: (h) => {
      const { gs, ge, ae, fora, p } = base(h);
      const c = h.D.concelhosOrdenados('gs', D), cge = h.D.porConcelho('ge', D);
      const viz = VIZ.map(([id, n]) => ({ id, n, s: h.D.statsDe('gs', n) })).filter((v) => v.s);
      return `<h2>Simples ou especial: o que separa os dois gasóleos na Guarda</h2>
<p>${ge && gs ? `Dos ${h.num(p.total)} postos do distrito, ${h.num(gs.n)} vendem gasóleo simples e ${h.num(ge.n)} gasóleo especial, e a tabela mostra a média de cada um por concelho.` : 'A tabela mostra a média de cada gasóleo por concelho.'} ${gs && ge ? `No conjunto do distrito, o especial custa ${h.c(ge.media - gs.media)} a mais por litro.` : ''} Onde a diferença é pequena, o aditivado sai quase ao preço do simples; onde é grande, convém saber se o motor tira proveito dele, tema tratado na página ${h.a('simples-ou-aditivado', 'gasóleo simples ou aditivado')}.</p>
${h.table(['Concelho', 'Postos', 'Simples', 'Especial'], c.map((x) => [x.concelho, x.n, h.l(x.media), cge[x.concelho] ? h.l(cge[x.concelho].media) : '—']), 'Média do gasóleo afixado por concelho (concelhos com dois postos ou mais)', ['l', 'r', 'r', 'r'])}
<h2>Os postos de autoestrada do distrito</h2>
<p>${p.autoestrada ? `A DGEG conta ${h.num(p.autoestrada)} postos em áreas de serviço de autoestrada no distrito da Guarda, para ${h.num(p.rua)} postos de rua. ` : 'O registo da DGEG não tem hoje postos de autoestrada no distrito. '}${ae && fora ? `O gasóleo está a ${h.l(ae.media)} em média nas áreas de serviço e a ${h.l(fora.media)} nos postos de rua: atestar 50 litros fora da autoestrada fica ${h.eur(Math.abs(ae.media - fora.media) * 50, 2)} ${ae.media > fora.media ? 'mais barato' : 'mais caro'}.` : ''} Para quem atravessa o distrito numa viagem longa, a diferença justifica planear a paragem num posto à saída.</p>
<h2>A Guarda ao lado dos distritos vizinhos</h2>
<p>O distrito faz fronteira com Espanha e com quatro distritos portugueses. Hoje o gasóleo simples está em média a ${viz.map((v) => `${h.l(v.s!.media)} em ${h.a(v.id, v.n)}`).join(', ')}${gs ? `, contra ${h.l(gs.media)} na Guarda` : ''}. São diferenças de poucos cêntimos, que só pesam para quem passa todos os dias de um distrito para outro.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Guarda'), d = h.D.statsDe('gs', D); return s && d ? `No concelho da Guarda, onde fica a capital do distrito, ${h.num(s.n)} postos vendem gasóleo simples a ${h.l(s.media)} em média, ${h.c(s.media - d.media, true)} face ao conjunto do distrito. Quem vive num concelho próximo e trabalha na cidade pode usar a tabela acima para decidir de que lado do percurso abastecer.` : ''; })()}</p>`;
    },
  },
  en: {
    slug: 'guarda', nav: 'Guarda', card: 'Standard and premium diesel, petrol and LPG in every municipality of Guarda district, with the cheapest station in each.',
    title: 'Diesel in Guarda today: average price by municipality',
    description: 'Diesel and petrol in Guarda today: the average in each municipality, the gap between standard and premium diesel, motorway stations and the cheapest pump.',
    h1: 'Fuel prices in Guarda today',
    intro: (h) => `What the ${h.num(h.D.postosDistrito(D).total)} stations of Guarda district are asking today, municipality by municipality, from standard diesel to LPG.`,
    resume: (h) => {
      const { gs, ge, g95, rg, rp } = base(h);
      if (!gs || !g95) return `Stations in Guarda district have not yet reported enough prices to the DGEG today to compute a reliable diesel and petrol average. The list above shows, station by station, the last posted price and the time it was reported; check back later for the district average, its position against the other districts and the gap between the cheapest and the dearest station, all of which are recomputed whenever the DGEG publishes new data.`;
      return `Today in Guarda district, a litre of standard diesel costs ${h.l(gs.media)} on average and a litre of standard petrol 95 costs ${h.l(g95.media)}. ${ge ? `Drivers who choose premium diesel pay ${h.l(ge.media)} on average, which is ${h.c(ge.media - gs.media, true)} a litre over standard. ` : ''}Counting from the cheapest district to the dearest, Guarda sits ${h.ord(rg.pos)} out of ${h.num(rg.de)} for diesel and ${h.ord(rp.pos)} for petrol 95, since each fuel has its own order. Against the mainland average, the gap is ${h.c(h.D.desvioDistrito('gs', D), true)} on diesel and ${h.c(h.D.desvioDistrito('g95', D), true)} on petrol. The cheapest diesel posted in the district today is ${h.l(gs.min)} and the dearest ${h.l(gs.max)}: on a 60-litre tank, the distance between those two extremes comes to ${h.eur((gs.max - gs.min) * 60, 2)}. These figures come from the ${h.num(gs.n)} stations that report a standard diesel price to the DGEG, each with the time of its latest update.`;
    },
    faqs: (h) => {
      const { gs, ge, g98, p } = base(h);
      const top = h.D.baratos('gs', 1, D)[0], c98 = Object.keys(h.D.porConcelho('g98', D)).length;
      return [
        { q: 'How much more does premium diesel cost than standard in Guarda?', a: gs && ge ? `Today premium diesel averages ${h.l(ge.media)} in Guarda district, against ${h.l(gs.media)} for standard, a gap of ${h.c(ge.media - gs.media)} a litre. On a 50-litre tank that is ${h.eur((ge.media - gs.media) * 50, 2)}. Our page on standard versus premium diesel explains what changes for the engine and when the extra cost might pay off.` : `There are not enough premium diesel prices in Guarda district today to work out the gap over standard. Once stations report again, each average appears here and in the list, with its update time.` },
        { q: 'In how many municipalities of Guarda district can you buy petrol 98?', a: `The DGEG lists petrol 98 on sale today in ${h.num(c98)} of the ${h.num(p.concelhos)} municipalities in Guarda district${g98 ? `, at ${h.num(g98.n)} stations averaging ${h.l(g98.media)}` : ''}. Elsewhere only petrol 95, standard or premium, is available. To find the nearest pump, pick Petrol 98 in the calculator above: the list shows the cheapest ones with address and time.` },
        { q: 'Which station has the cheapest diesel in Guarda district today?', a: top ? `Right now it is ${top.nome}, in ${top.concelho}, with standard diesel at ${h.l(top.preco)}, a price reported to the DGEG at ${top.atualizado.slice(11)} on ${top.atualizado.slice(8, 10)}/${top.atualizado.slice(5, 7)}. The order changes whenever a station moves its price, so the list above is the most recent reference: check the pump before you fill up.` : `No station in Guarda district has reported a standard diesel price to the DGEG today. The list above will rank stations from cheapest to dearest again as soon as new prices come in, with each update time.` },
      ];
    },
    body: (h) => {
      const { gs, ge, ae, fora, p } = base(h);
      const c = h.D.concelhosOrdenados('gs', D), cge = h.D.porConcelho('ge', D);
      const viz = VIZ.map(([id, n]) => ({ id, n, s: h.D.statsDe('gs', n) })).filter((v) => v.s);
      return `<h2>Standard or premium: what separates the two diesels in Guarda</h2>
<p>${ge && gs ? `Of the district’s ${h.num(p.total)} stations, ${h.num(gs.n)} sell standard diesel and ${h.num(ge.n)} premium, and the table gives the average of each by municipality.` : 'The table gives the average of each diesel by municipality.'} ${gs && ge ? `Across the district, premium costs ${h.c(ge.media - gs.media)} more per litre.` : ''} Where the gap is small, the additive version comes at almost the standard price; where it is wide, it is worth knowing whether your engine benefits, a question covered on the ${h.a('simples-ou-aditivado', 'standard or premium diesel')} page.</p>
${h.table(['Municipality', 'Stations', 'Standard', 'Premium'], c.map((x) => [x.concelho, x.n, h.l(x.media), cge[x.concelho] ? h.l(cge[x.concelho].media) : '—']), 'Average posted diesel price by municipality (municipalities with two stations or more)', ['l', 'r', 'r', 'r'])}
<h2>Motorway stations in the district</h2>
<p>${p.autoestrada ? `The DGEG counts ${h.num(p.autoestrada)} motorway service-area stations in Guarda district, against ${h.num(p.rua)} street stations. ` : 'The DGEG register has no motorway stations in the district today. '}${ae && fora ? `Diesel averages ${h.l(ae.media)} at the service areas and ${h.l(fora.media)} at street stations: filling 50 litres off the motorway comes out ${h.eur(Math.abs(ae.media - fora.media) * 50, 2)} ${ae.media > fora.media ? 'cheaper' : 'dearer'}.` : ''} If you are crossing the district on a long journey, that gap is a reason to plan your stop at a station just off a junction.</p>
<h2>Guarda next to its neighbouring districts</h2>
<p>The district borders Spain and four Portuguese districts. Today standard diesel averages ${viz.map((v) => `${h.l(v.s!.media)} in ${h.a(v.id, v.n)}`).join(', ')}${gs ? `, against ${h.l(gs.media)} in Guarda` : ''}. These are gaps of a few cents, which only matter if you drive from one district to another every day.</p>
<p>${(() => { const s = h.D.statsDe('gs', D, 'Guarda'), d = h.D.statsDe('gs', D); return s && d ? `In Guarda municipality, home to the district capital, ${h.num(s.n)} stations sell standard diesel at ${h.l(s.media)} on average, ${h.c(s.media - d.media, true)} against the district as a whole. If you live in a nearby municipality and work in the city, the table above shows which end of the commute to fill up at.` : ''; })()}</p>`;
    },
  },
});
