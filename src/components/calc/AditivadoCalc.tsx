/** Simples ou aditivado : écart de prix au litre (moyenne DGEG et moyenne affichée) et surcoût annuel. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import { Frame, ResultPanel, Botoes, T, eur, litro, cent, nr, pct, type L } from './kit';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type Fam = 'gasoleo' | 'gasolina';
interface Precos { simples: number; especial: number; afixSimples: number; afixEspecial: number }
interface Props { lang: L; precos: Record<Fam, Precos>; consumos: Record<Fam, number>; dia: string; familia?: Fam; methodHref?: string }

export default function AditivadoCalc({ lang, precos, consumos, familia: f0 = 'gasoleo', methodHref }: Props) {
  const [fam, setFam] = useState<Fam>(f0);
  const [km, setKm] = useState(15000);
  const [cons, setCons] = useState(consumos[f0]);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'f', f0) as Fam; const ff = f === 'gasolina' ? 'gasolina' : 'gasoleo'; setFam(ff); setKm(num(u, 'km', 15000)); setCons(num(u, 'cons', consumos[ff])); }, []);
  useEffect(() => { updateURL({ f: fam, km, cons }); }, [fam, km, cons]);
  const p = precos[fam];
  const litros = (km * cons) / 100;
  const dif = p.especial - p.simples, difAf = p.afixEspecial - p.afixSimples;
  const form = (
    <>
      <Botoes id="ad-fam" label={T(lang, 'Família', 'Fuel family')} value={fam} onChange={(v) => { setFam(v); setCons(consumos[v]); }} options={[{ value: 'gasoleo' as Fam, label: T(lang, 'Gasóleo', 'Diesel') }, { value: 'gasolina' as Fam, label: T(lang, 'Gasolina 95', 'Petrol 95') }]} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberField id="ad-km" label={T(lang, 'Quilómetros por ano', 'Kilometres per year')} value={km} onChange={setKm} unit="km" min={0} max={200000} lang={lang} />
        <NumberField id="ad-cons" label={T(lang, 'Consumo', 'Consumption')} value={cons} onChange={setCons} unit="l/100 km" min={1} max={30} decimals={1} lang={lang} />
      </div>
    </>
  );
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `Custo extra do ${fam === 'gasoleo' ? 'gasóleo especial' : 'gasolina especial 95'} num ano`, `Extra cost of premium ${fam === 'gasoleo' ? 'diesel' : 'petrol 95'} over a year`)} value={eur(dif * litros, lang, 0)}
      sub={T(lang, `${cent(dif, lang)} por litro (${pct(dif / p.simples, lang)})`, `${cent(dif, lang)} per litre (${pct(dif / p.simples, lang)})`)}
      rows={[
        { label: T(lang, 'Simples, preço médio diário DGEG', 'Standard, DGEG daily average'), value: litro(p.simples, lang) },
        { label: T(lang, 'Especial (aditivado), preço médio diário DGEG', 'Premium, DGEG daily average'), value: litro(p.especial, lang) },
        { label: T(lang, 'Diferença nos preços afixados', 'Gap in posted prices'), value: cent(difAf, lang) },
        { label: T(lang, `Litros num ano (${nr(km, lang)} km)`, `Litres a year (${nr(km, lang)} km)`), value: nr(litros, lang) },
        { label: T(lang, 'Custo extra por mês', 'Extra cost per month'), value: eur((dif * litros) / 12, lang), strong: true },
      ]}
      hyp={T(lang, 'Diferença entre o preço médio diário da DGEG do combustível especial e o do simples, multiplicada pelos litros de um ano. Não mede qualquer efeito no consumo ou no motor.', 'Gap between the DGEG daily average of the premium and the standard fuel, times a year’s litres. It does not measure any effect on consumption or on the engine.')}
      methodHref={methodHref} copyText={`${T(lang, 'Aditivado', 'Premium')}: ${eur(dif * litros, lang, 0)}/${T(lang, 'ano', 'year')}`} />} />;
}
