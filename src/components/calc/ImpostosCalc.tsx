/** Part des impôts dans un litre : IVA = preço × 23/123 ; ISP (avec CSR et taxe carbone, comme l'ENSE le présente) lu dans la décomposition ENSE. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, pct, nr, type L } from './kit';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { decompor } from '../../lib/engine/custos';

interface Props { lang: L; isp: Record<Fuel, number>; precos: Partial<Record<Fuel, number>>; iva: number; fuel?: Fuel; litros?: number; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];

export default function ImpostosCalc({ lang, isp, precos: p0, iva, fuel: f0 = 'gs', litros: l0 = 50, methodHref }: Props) {
  const precos = Object.fromEntries(Object.entries(p0).map(([k, v]) => [k, Math.round((v as number) * 100) / 100])) as Partial<Record<Fuel, number>>;
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [preco, setPreco] = useState(precos[f0] ?? 2);
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f); setPreco(num(u, 'p', precos[f] ?? precos[f0] ?? 2)); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, p: preco, l: litros }); }, [fuel, preco, litros]);
  const d = decompor(preco, isp[fuel], iva);
  const form = (
    <>
      <SelectField id="im-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => { setFuel(v as Fuel); setPreco(precos[v as Fuel] ?? preco); }} options={fuelOpts(lang, FS)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberField id="im-preco" label={T(lang, 'Preço por litro', 'Price per litre')} value={preco} onChange={setPreco} unit="€/l" min={0.3} max={5} decimals={2} lang={lang} help={T(lang, 'Por omissão: média afixada no continente, ao cêntimo', 'Default: mainland posted average, to the cent')} />
        <NumberField id="im-litros" label={T(lang, 'Litros', 'Litres')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      </div>
    </>
  );
  const seg = [
    { label: 'IVA', value: d.iva, color: '#046A38' },
    { label: 'ISP', value: d.isp, color: '#DA291C' },
    { label: T(lang, 'Produto, logística e margem', 'Product, logistics and margin'), value: d.semImpostos, color: '#CBD5E1' },
  ];
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: impostos em cada litro`, `${FUEL_NOME.en[fuel]}: tax in each litre`)}
      value={litro(d.iva + d.isp, lang)} sub={T(lang, `${pct(d.partImpostos, lang)} do preço`, `${pct(d.partImpostos, lang)} of the price`)}
      bar={{ segments: seg, total: preco, aria: T(lang, 'Decomposição do litro', 'Breakdown of a litre') }}
      rows={[
        { label: T(lang, 'Preço usado', 'Price used'), value: litro(preco, lang), note: true },
        { label: `IVA (${pct(iva, lang, 0)})`, value: litro(d.iva, lang) },
        { label: T(lang, 'ISP, com contribuição rodoviária e taxa de carbono', 'ISP, incl. road contribution and carbon tax'), value: litro(d.isp, lang) },
        { label: T(lang, 'Produto, logística e margem', 'Product, logistics and margin'), value: litro(d.semImpostos, lang) },
        { label: T(lang, `Impostos em ${nr(litros, lang)} litros`, `Tax on ${nr(litros, lang)} litres`), value: eur((d.iva + d.isp) * litros, lang), strong: true },
        { label: T(lang, `Total de ${nr(litros, lang)} litros`, `Total for ${nr(litros, lang)} litres`), value: eur(preco * litros, lang) },
      ]}
      hyp={T(lang, 'O ISP por litro é o da última decomposição do preço de referência publicada pela ENSE para esta família de combustível; o IVA é a taxa normal do continente. Nos Açores e na Madeira as taxas são outras.', 'The ISP per litre is taken from the latest ENSE breakdown of the reference price for this fuel family; VAT is the mainland standard rate. The Azores and Madeira use other rates.')}
      methodHref={methodHref} copyText={`${FUEL_NOME[lang][fuel]}: ${litro(d.iva + d.isp, lang)} ${T(lang, 'de impostos', 'tax')}`} />} />;
}
