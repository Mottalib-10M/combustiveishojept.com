import { defineGuide, type Helpers } from '../../lib/guide-types';

const marcas = (h: Helpers, f: 'gs' | 'g95') => Object.entries(h.D.porMarca(f)).filter(([, s]) => s.n >= 20).sort((a, b) => a[1].media - b[1].media);
const TIPO = { pt: { 'Outro': 'Posto de rua', 'Área comercial (Hipermercados)': 'Hipermercado', 'Auto-estrada': 'Autoestrada' }, en: { 'Outro': 'Street station', 'Área comercial (Hipermercados)': 'Hypermarket', 'Auto-estrada': 'Motorway' } } as const;

export default defineGuide({
  id: 'precos-por-marca', group: 'contas', order: 3, tool: 'marcas',
  related: ['postos-mais-baratos', 'preco-gasoleo', 'simples-ou-aditivado'],
  sources: ['dgegPortal'],
  pt: {
    slug: 'precos-por-marca', nav: 'Preços por marca', card: 'Galp, Repsol, BP, Prio e as marcas de hipermercado: quem afixa mais barato hoje.',
    title: 'Preço dos combustíveis por marca: Galp, Repsol, BP e outras',
    description: 'Preço médio afixado do gasóleo e da gasolina por marca e por tipo de posto (rua, hipermercado, autoestrada), com o número de postos de cada uma. Dados DGEG.',
    h1: 'Preço dos combustíveis por marca e tipo de posto',
    intro: () => 'A média afixada de cada marca com pelo menos 20 postos, e a diferença num depósito.',
    resume: (h) => {
      const m = marcas(h, 'gs'), t = h.D.porTipo('gs'), maior = [...m].sort((a, b) => b[1].n - a[1].n)[0];
      return `No gasóleo simples, a marca com a média afixada mais baixa hoje, entre as que têm pelo menos 20 postos, é ${m[0][0]}, a ${h.l(m[0][1].media)}, e a mais alta ${m[m.length - 1][0]}, a ${h.l(m[m.length - 1][1].media)}: ${h.c(m[m.length - 1][1].media - m[0][1].media)} por litro de diferença, ou ${h.eur((m[m.length - 1][1].media - m[0][1].media) * 50, 2)} num depósito de 50 litros. A maior rede é a ${maior[0]}, com ${h.num(maior[1].n)} postos a ${h.l(maior[1].media)} em média. O tipo de posto pesa tanto como a marca: nas autoestradas o gasóleo está a ${h.l(t['Auto-estrada'].media)}, nos hipermercados a ${h.l(t['Área comercial (Hipermercados)'].media)}. As médias são simples, cada posto conta uma vez, a partir dos preços que cada um comunica à DGEG. Não incluem descontos de cartões, que mudam muito de marca para marca. Na calculadora, escolha o combustível e a marca para ver a sua média e o posto mais barato dessa rede.`;
    },
    faqs: (h) => [
      { q: 'Porque é que as marcas de hipermercado são mais baratas?', a: 'Os postos junto a hipermercados costumam vender grandes volumes e servem também para atrair clientes para a loja. Em geral, isso permite-lhes margens mais baixas por litro. O combustível tem de cumprir as mesmas especificações legais em qualquer posto, seja de marca ou de hipermercado.' },
      { q: 'O que quer dizer a marca «Genérico» na lista?', a: 'É a designação que aparece no registo da DGEG para postos sem marca de uma companhia associada, em geral independentes. Contam na média como qualquer outro posto; a sua média depende muito da região onde estão e de quantos há em cada concelho.' },
      { q: 'A mesma marca tem o mesmo preço em todo o país?', a: (() => { const m = marcas(h, 'gs').sort((a, b) => b[1].n - a[1].n)[0]; return `Não. Cada posto, mesmo de bandeira, pode ter um preço próprio, sobretudo quando é explorado por um revendedor. Na ${m[0]}, por exemplo, os postos vão hoje de ${h.l(m[1].min)} a ${h.l(m[1].max)} no gasóleo simples. A média por marca é uma referência, não o preço do posto da sua rua.`; })() },
    ],
    body: (h) => {
      const m = marcas(h, 'gs'), b = Object.fromEntries(marcas(h, 'g95')), t = h.D.porTipo('gs'), t95 = h.D.porTipo('g95');
      return `<h2>Marcas com pelo menos 20 postos</h2>
${h.table(['Marca', 'Postos', 'Gasóleo simples', 'Gasolina 95'], m.map(([k, s]) => [k, s.n, h.l(s.media), b[k] ? h.l(b[k].media) : '—']), 'Média afixada simples, preços comunicados à DGEG', ['l', 'r', 'r', 'r'])}
<h2>Rua, hipermercado e autoestrada</h2>
${h.table(['Tipo de posto', 'Postos', 'Gasóleo simples', 'Gasolina 95'], Object.entries(t).map(([k, s]) => [TIPO.pt[k as keyof typeof TIPO.pt] ?? k, s.n, h.l(s.media), t95[k] ? h.l(t95[k].media) : '—']), 'Média afixada simples por tipo de posto', ['l', 'r', 'r', 'r'])}
<p>Os postos de autoestrada são poucos mas caros; os de rua são a grande maioria e ficam perto da média nacional. Para um condutor que faz 1 000 litros por ano, trocar a autoestrada pelo hipermercado vale ${h.eur((t['Auto-estrada'].media - t['Área comercial (Hipermercados)'].media) * 1000)} no gasóleo.</p>
<h2>O que esta comparação não mede</h2>
<p>Não compara a qualidade dos combustíveis, que têm de cumprir as mesmas especificações legais, nem os programas de fidelização, que podem mudar a ordem para quem os usa sempre. Também não pondera pelas vendas: uma marca com muitos postos caros em zonas isoladas pode ter uma média alta e vender barato onde há concorrência. Para comparar postos concretos, use a lista do seu concelho ou a dos ${h.a('postos-mais-baratos', 'postos mais baratos do país')}.</p>`;
    },
  },
  en: {
    slug: 'prices-by-brand', nav: 'Prices by brand', card: 'Galp, Repsol, BP, Prio and the supermarket brands: who posts the lowest prices today.',
    title: 'Fuel prices by brand in Portugal: Galp, Repsol, BP and more',
    description: 'Average posted diesel and petrol price in Portugal by brand and by station type (street, hypermarket, motorway), with each brand’s station count. DGEG data.',
    h1: 'Fuel prices by brand and station type',
    intro: () => 'The posted average of every brand with at least 20 stations, and what the gap means on a full tank.',
    resume: (h) => {
      const m = marcas(h, 'gs'), t = h.D.porTipo('gs'), maior = [...m].sort((a, b) => b[1].n - a[1].n)[0];
      return `For standard diesel, the brand with the lowest posted average today, among those with at least 20 stations, is ${m[0][0]}, at ${h.l(m[0][1].media)}, and the highest is ${m[m.length - 1][0]}, at ${h.l(m[m.length - 1][1].media)}: a gap of ${h.c(m[m.length - 1][1].media - m[0][1].media)} a litre, or ${h.eur((m[m.length - 1][1].media - m[0][1].media) * 50, 2)} on a 50-litre tank. The largest network is ${maior[0]}, with ${h.num(maior[1].n)} stations averaging ${h.l(maior[1].media)}. The type of station matters as much as the brand: on motorways diesel is at ${h.l(t['Auto-estrada'].media)}, at hypermarkets ${h.l(t['Área comercial (Hipermercados)'].media)}. Averages are simple, each station counting once, from the prices each one reports to the DGEG. They exclude loyalty-card discounts, which vary widely from brand to brand. In the calculator, pick a fuel and a brand to see its average and that network’s cheapest station. The tables below list every brand with at least 20 stations and the three station types, for diesel and petrol 95.`;
    },
    faqs: (h) => [
      { q: 'Why are supermarket fuel brands cheaper?', a: 'Stations next to hypermarkets tend to sell large volumes and also help draw customers into the store. That generally lets them work on lower margins per litre. The fuel has to meet the same legal specifications at any station, branded or supermarket-run.' },
      { q: 'What does the brand “Genérico” mean in the list?', a: 'It is the label in the DGEG register for stations with no oil-company brand attached, usually independents. They count in the average like any other station; their average depends heavily on the region they are in and on how many there are in each municipality.' },
      { q: 'Does the same brand charge the same price across Portugal?', a: (() => { const m = marcas(h, 'gs').sort((a, b) => b[1].n - a[1].n)[0]; return `No. Each station, even a branded one, can set its own price, especially when a dealer runs it. At ${m[0]}, for example, stations range today from ${h.l(m[1].min)} to ${h.l(m[1].max)} for standard diesel. The brand average is a reference, not the price at the station on your street.`; })() },
    ],
    body: (h) => {
      const m = marcas(h, 'gs'), b = Object.fromEntries(marcas(h, 'g95')), t = h.D.porTipo('gs'), t95 = h.D.porTipo('g95');
      return `<h2>Brands with at least 20 stations</h2>
${h.table(['Brand', 'Stations', 'Standard diesel', 'Petrol 95'], m.map(([k, s]) => [k, s.n, h.l(s.media), b[k] ? h.l(b[k].media) : '—']), 'Simple posted average, prices reported to the DGEG', ['l', 'r', 'r', 'r'])}
<h2>Street, hypermarket and motorway</h2>
${h.table(['Station type', 'Stations', 'Standard diesel', 'Petrol 95'], Object.entries(t).map(([k, s]) => [TIPO.en[k as keyof typeof TIPO.en] ?? k, s.n, h.l(s.media), t95[k] ? h.l(t95[k].media) : '—']), 'Simple posted average by station type', ['l', 'r', 'r', 'r'])}
<p>Motorway stations are few but dear; street stations are the vast majority and sit close to the national average. For a driver using 1,000 litres a year, swapping the motorway for a hypermarket is worth ${h.eur((t['Auto-estrada'].media - t['Área comercial (Hipermercados)'].media) * 1000)} on diesel.</p>
<h2>What this comparison does not measure</h2>
<p>It does not compare fuel quality, since all fuels must meet the same legal specifications, nor loyalty schemes, which can change the order for regular users. Nor does it weight by sales: a brand with many dear stations in isolated areas can have a high average and still sell cheaply where there is competition. To compare actual stations, use your municipality’s list or that of the ${h.a('postos-mais-baratos', 'cheapest stations in the country')}.</p>`;
    },
  },
});
