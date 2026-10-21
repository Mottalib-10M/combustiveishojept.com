/** Coût d'un plein et budget annuel : km × consommation × prix ; effet d'un cêntimo de moins par litre. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, nr, type L } from './kit';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { anual, deposito } from '../../lib/engine/custos';

interface Props { lang: L; precos: Partial<Record<Fuel, number>>; minimos: Partial<Record<Fuel, number>>; consumos: Record<Fuel, number>; km?: number; fuel?: Fuel; litros?: number; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];

export default function CustoCalc({ lang, precos: p0, minimos, consumos, km: k0 = 15000, fuel: f0 = 'gs', litros: l0 = 50, methodHref }: Props) {
  const precos = Object.fromEntries(Object.entries(p0).map(([k, v]) => [k, Math.round((v as number) * 100) / 100])) as Partial<Record<Fuel, number>>;
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [km, setKm] = useState(k0);
  const [cons, setCons] = useState(consumos[f0]);
  const [preco, setPreco] = useState(precos[f0] ?? 2);
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; const ff = FS.includes(f) ? f : f0; setFuel(ff); setKm(num(u, 'km', k0)); setCons(num(u, 'cons', consumos[ff])); setPreco(num(u, 'p', precos[ff] ?? 2)); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, km, cons, p: preco, l: litros }); }, [fuel, km, cons, preco, litros]);
  const a = anual(km, cons, preco);
  const min = minimos[fuel];
  const form = (
    <>
      <SelectField id="cu-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => { const f = v as Fuel; setFuel(f); setCons(consumos[f]); setPreco(precos[f] ?? preco); }} options={fuelOpts(lang, FS)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberField id="cu-km" label={T(lang, 'Quilómetros por ano', 'Kilometres per year')} value={km} onChange={setKm} unit="km" min={0} max={200000} lang={lang} />
        <NumberField id="cu-cons" label={T(lang, 'Consumo', 'Consumption')} value={cons} onChange={setCons} unit="l/100 km" min={1} max={30} decimals={1} lang={lang} />
        <NumberField id="cu-preco" label={T(lang, 'Preço por litro', 'Price per litre')} value={preco} onChange={setPreco} unit="€/l" min={0.3} max={5} decimals={2} lang={lang} help={T(lang, 'Por omissão: média afixada no continente, ao cêntimo', 'Default: mainland posted average, to the cent')} />
        <NumberField id="cu-litros" label={T(lang, 'Litros por abastecimento', 'Litres per fill')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      </div>
    </>
  );
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: custo por ano`, `${FUEL_NOME.en[fuel]}: cost per year`)} value={eur(a.custo, lang, 0)}
      sub={T(lang, `${eur(a.mes, lang, 0)} por mês · ${nr(a.litros, lang)} litros`, `${eur(a.mes, lang, 0)} a month · ${nr(a.litros, lang)} litres`)}
      rows={[
        { label: T(lang, `Um abastecimento de ${nr(litros, lang)} litros`, `One ${nr(litros, lang)}-litre fill`), value: eur(deposito(litros, preco), lang), strong: true },
        { label: T(lang, 'Custo por 100 km', 'Cost per 100 km'), value: eur(a.porKm * 100, lang) },
        { label: T(lang, 'Preço usado', 'Price used'), value: litro(preco, lang), note: true },
        { label: T(lang, 'Cada cêntimo a menos por litro poupa', 'Each cent less per litre saves'), value: T(lang, `${eur(a.litros * 0.01, lang)} por ano`, `${eur(a.litros * 0.01, lang)} a year`) },
        ...(min != null && min < preco ? [{ label: T(lang, `Ao preço mais baixo do continente (${litro(min, lang)})`, `At the lowest mainland price (${litro(min, lang)})`), value: T(lang, `${eur(a.litros * min, lang, 0)} por ano`, `${eur(a.litros * min, lang, 0)} a year`), note: true }] : []),
      ]}
      hyp={T(lang, 'Custo anual = quilómetros × consumo ÷ 100 × preço. O consumo por omissão é um exemplo: use o do seu computador de bordo ou o das suas faturas.', 'Annual cost = kilometres × consumption ÷ 100 × price. The default consumption is only an example: use your trip computer’s figure or your receipts.')}
      methodHref={methodHref} copyText={`${FUEL_NOME[lang][fuel]}: ${eur(a.custo, lang, 0)}/${T(lang, 'ano', 'year')}`} />} />;
}
