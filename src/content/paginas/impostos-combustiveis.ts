import { defineGuide, type Helpers } from '../../lib/guide-types';

const linhas = (h: Helpers) => (['gs', 'g95', 'g98', 'gpl'] as const).map((f) => { const s = h.D.statsDe(f)!; return { f, ...h.E.decompor(s.media, h.D.ispLitro(f)) }; });

export default defineGuide({
  id: 'impostos-combustiveis', group: 'contas', order: 1, tool: 'impostos',
  related: ['preco-gasoleo', 'preco-gasolina-95', 'custo-deposito', 'historico-precos'],
  sources: ['enseDecomp', 'civa18', 'enseIspAfixacao', 'dgegPortal'],
  pt: {
    slug: 'impostos-combustiveis', nav: 'Impostos nos combustíveis', card: 'Quanto de cada litro é ISP e IVA, para o preço que escrever.',
    title: 'Impostos nos combustíveis: ISP e IVA em cada litro, hoje',
    description: 'Quanto de cada litro de gasóleo, gasolina ou GPL é imposto: ISP com contribuição rodoviária e taxa de carbono, mais IVA a 23 %, para o preço que escrever.',
    h1: 'Impostos nos combustíveis: quanto é ISP e IVA',
    intro: () => 'Escreva o preço da bomba e veja a parte dos impostos em cada litro de combustível e no abastecimento.',
    resume: (h) => {
      const [gs, g95] = linhas(h);
      return `Num litro de gasóleo simples à média afixada de hoje, ${h.l(gs.preco)}, os impostos somam ${h.l(gs.iva + gs.isp)}: ${h.l(gs.isp)} de imposto sobre os produtos petrolíferos (ISP), com a contribuição de serviço rodoviário e a taxa de carbono, e ${h.l(gs.iva)} de IVA a 23 %. São ${h.pct(gs.partImpostos)} do preço. Na gasolina simples 95, a ${h.l(g95.preco)}, os impostos chegam a ${h.l(g95.iva + g95.isp)}, ou ${h.pct(g95.partImpostos)}, porque o ISP da gasolina é mais alto. O ISP é um valor fixo por litro, revisto pelo Governo; o IVA é uma percentagem do preço com ISP incluído, por isso também incide sobre o próprio ISP. Os valores de ISP por litro são os da última decomposição do preço de referência publicada pela ENSE. A calculadora refaz a conta para o preço que escrever e para os litros do seu abastecimento.`;
    },
    faqs: (h) => [
      { q: 'O IVA dos combustíveis incide sobre o ISP?', a: 'Sim. O IVA é aplicado ao preço de venda, que já inclui o ISP e as contribuições associadas. Por isso, quando o ISP sobe um cêntimo por litro, o preço final sobe 1,23 cêntimos com o IVA. Na calculadora, o IVA é calculado como 23/123 do preço que escrever.' },
      { q: 'O que é a «Redução ISP+IVA» afixada nos postos?', a: 'É uma menção que os postos têm de afixar junto às bombas, para cada combustível, desde 17 de outubro de 2026, por força do Decreto-Lei n.º 199/2026, de 7 de outubro. Segundo a ENSE, o valor indicado é a diferença por litro entre dois montantes de ISP, ambos com IVA. A falta ou a desatualização da informação dá coima. O nosso cálculo usa o ISP efetivamente cobrado, tal como a ENSE o decompõe.' },
      { q: 'Porque é que o GPL Auto paga tão menos imposto?', a: (() => { const g = linhas(h)[3]; return `O ISP do GPL Auto é de ${h.l(g.isp)} por litro na última decomposição da ENSE, muito abaixo do do gasóleo e da gasolina. Com o IVA, os impostos são ${h.pct(g.partImpostos)} do preço do GPL. Como o GPL tem menos energia por litro, a comparação justa é por quilómetro.`; })() },
      { q: 'Que impostos terão a gasolina e o gasóleo em 2027?', a: 'O IVA continua a 23 % enquanto o Código do IVA não mudar. As taxas do ISP e a taxa de carbono de 2027 serão as fixadas por portaria do Governo e publicadas no Diário da República; até lá, esta calculadora aplica a decomposição mais recente da ENSE. As contas passam às taxas de 2027 logo após a publicação de cada portaria.' },
    ],
    body: (h) => {
      const L = linhas(h), d = h.D.decompEnse('gs');
      return `<h2>Combustível a combustível, à média de hoje</h2>
${h.table(['Combustível', 'Preço médio', 'ISP', 'IVA', 'Resto', 'Impostos'], L.map((x) => [h.fn(x.f), h.l(x.preco), h.l(x.isp), h.l(x.iva), h.l(x.semImpostos), h.pct(x.partImpostos)]), 'Média afixada DGEG; ISP da decomposição ENSE; IVA a 23 %', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>O que está no resto</h2>
<p>A ENSE decompõe o seu preço de referência em cinco partes. Para o gasóleo, na última decomposição: ${d.partes.map((p) => `${p.label.toLowerCase()} ${h.l(p.valor)}`).join(', ')}, num total de ${h.l(d.preco)}. O preço de referência não inclui a margem de retalho, por isso o preço da bomba é mais alto: a diferença é o que o posto e a marca ganham para cobrir a rede, o pessoal e o lucro.</p>
<h2>Impostos nos combustíveis em 2027</h2>
<p>O IVA de 23 % é fixado pelo ${h.src('civa18', 'artigo 18.º do Código do IVA')} e continua em vigor em 2027 enquanto a lei não mudar. As taxas do ISP são revistas por portaria ao longo do ano, como a ${h.src('portaria451A', 'Portaria n.º 451-A/2026/1')} de 9 de outubro; as de 2027 serão as que o Governo fixar por portaria, e a taxa de carbono de 2027 será fixada pela portaria anual dos ministérios das Finanças e do Ambiente. A ${h.src('oe2027', 'proposta de Orçamento do Estado para 2027')} tem votação final global marcada para 24 de novembro de 2026 na Assembleia da República. Os preços desta página continuam a ser os afixados em cada dia, e os cálculos de imposto passam às taxas de 2027 logo após a publicação de cada portaria no Diário da República.</p>
<h2>Quando mudam os impostos nos combustíveis</h2>
<p>O ISP é fixado por portaria e pode mudar a qualquer momento, normalmente com efeito a uma segunda-feira, como as revisões de preço das marcas. Uma mudança anunciada não está nos preços de referência da semana, por isso a ${h.a('proxima-semana', 'estimativa semanal')} não a antecipa. O IVA a 23 % é a taxa normal do continente, fixada no ${h.src('civa18', 'artigo 18.º do Código do IVA')}; na Madeira e nos Açores as taxas são diferentes e esta calculadora não as aplica.</p>`;
    },
  },
  en: {
    slug: 'fuel-tax', nav: 'Fuel tax', card: 'How much of each litre is ISP and VAT, for the price you type.',
    title: 'Fuel tax in Portugal: ISP and VAT in every litre, today',
    description: 'How much of each litre of diesel, petrol or LPG in Portugal is tax: ISP with the road contribution and carbon levy, plus 23% VAT, for the price you type.',
    h1: 'Fuel tax in Portugal: how much is ISP and VAT',
    intro: () => 'Type the pump price and see the fuel tax, the state’s share, in each litre and in your fill.',
    resume: (h) => {
      const [gs, g95] = linhas(h);
      return `In a litre of standard diesel at today’s posted average, ${h.l(gs.preco)}, taxes add up to ${h.l(gs.iva + gs.isp)}: ${h.l(gs.isp)} of tax on petroleum products (ISP), including the road service contribution and the carbon levy, and ${h.l(gs.iva)} of VAT at 23%. That is ${h.pct(gs.partImpostos)} of the price. For standard petrol 95, at ${h.l(g95.preco)}, taxes reach ${h.l(g95.iva + g95.isp)}, or ${h.pct(g95.partImpostos)}, because petrol’s ISP is higher. ISP is a fixed amount per litre, set by the government; VAT is a percentage of the price including ISP, so it is also charged on the ISP itself. The ISP amounts per litre come from the ENSE’s latest breakdown of the reference price. The calculator redoes the sum for the price you type and the litres in your fill.`;
    },
    faqs: (h) => [
      { q: 'Is VAT on fuel charged on top of ISP?', a: 'Yes. VAT applies to the selling price, which already includes ISP and its related levies. So when ISP rises by one cent a litre, the final price rises by 1.23 cents with VAT. In the calculator, VAT is worked out as 23/123 of the price you type.' },
      { q: 'What is the “Redução ISP+IVA” shown at stations?', a: 'It is a notice stations must display near the pumps, for each fuel, since 17 October 2026, under Decree-Law 199/2026 of 7 October. According to the ENSE, the figure shown is the per-litre difference between two ISP amounts, both including VAT. Missing or out-of-date information can be fined. Our sum uses the ISP actually charged, as the ENSE breaks it down.' },
      { q: 'Why does LPG pay so much less tax?', a: (() => { const g = linhas(h)[3]; return `LPG’s ISP is ${h.l(g.isp)} a litre in the ENSE’s latest breakdown, far below diesel’s and petrol’s. With VAT, taxes are ${h.pct(g.partImpostos)} of the LPG price. Because LPG holds less energy per litre and the car burns more of it, the fair comparison is per kilometre driven.`; })() },
      { q: 'How will petrol and diesel be taxed in 2027?', a: 'VAT stays at 23% unless the VAT Code changes. The 2027 ISP rates and carbon tax will be set by government order and published in the Diário da República; until then this calculator uses the ENSE’s latest breakdown. The figures switch to the 2027 rates as soon as each order is published.' },
    ],
    body: (h) => {
      const L = linhas(h), d = h.D.decompEnse('gs');
      return `<h2>Fuel by fuel, at today’s average</h2>
${h.table(['Fuel', 'Average price', 'ISP', 'VAT', 'Rest', 'Tax share'], L.map((x) => [h.fn(x.f), h.l(x.preco), h.l(x.isp), h.l(x.iva), h.l(x.semImpostos), h.pct(x.partImpostos)]), 'DGEG posted average; ISP from the ENSE breakdown; VAT at 23%', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>What the rest is made of</h2>
<p>The ENSE splits its reference price into five parts. For diesel, in the latest breakdown: ${d.partes.map((p) => `${p.label.toLowerCase()} ${h.l(p.valor)}`).join(', ')}, for a total of ${h.l(d.preco)}. The reference price leaves out the retail margin, so the pump price is higher: the gap is what the station and the brand earn to cover the network, staff and profit.</p>
<h2>Fuel tax in 2027</h2>
<p>VAT at 23% is set by ${h.src('civa18', 'article 18 of the VAT Code')} and still applies in 2027 unless the law changes. ISP rates are revised by ministerial order during the year, such as ${h.src('portaria451A', 'Order 451-A/2026/1')} of 9 October; the 2027 rates will be those the Government sets by ministerial order, and the 2027 carbon tax will be set by the yearly order of the Finance and Environment ministries. The ${h.src('oe2027', '2027 State Budget proposal')} has its final vote scheduled for 24 November 2026 in the Assembleia da República. Prices on this page remain the ones posted each day, and the tax calculations switch to the 2027 rates as soon as each order is published in the Diário da República.</p>
<h2>When fuel tax changes</h2>
<p>ISP is set by ministerial order and can change at any time, usually effective on a Monday, like the brands’ price reviews. An announced change is not in the week’s reference prices, so the ${h.a('proxima-semana', 'weekly estimate')} does not anticipate it. VAT at 23% is the mainland standard rate, set in ${h.src('civa18', 'article 18 of the VAT Code')}; Madeira and the Azores have different rates, which this calculator does not apply.</p>`;
    },
  },
});
