/**
 * Açores : les prix maximums sont fixés chaque mois par le Governo Regional (Jornal Oficial), source que nous ne
 * pouvons pas lire automatiquement. L'outil ne montre donc aucun prix açorien : le visiteur écrit le prix affiché
 * à son posto et obtient le coût d'un plein, d'un mois et l'écart avec la moyenne DGEG du continent.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, cent, nr, diaLongo, type L } from './kit';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { anual } from '../../lib/engine/custos';

type K = 'g95' | 'gs';
interface Props { lang: L; continente: { g95: number; gs: number; dia: string }; consumos: { g95: number; gs: number }; methodHref?: string }

export default function AcoresCalc({ lang, continente, consumos, methodHref }: Props) {
  const [fuel, setFuel] = useState<K>('gs');
  const [preco, setPreco] = useState(1.6);
  const [litros, setLitros] = useState(50);
  const [km, setKm] = useState(12000);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', 'gs') as K; if (f === 'gs' || f === 'g95') setFuel(f); setPreco(num(u, 'p', 1.6)); setLitros(num(u, 'l', 50)); setKm(num(u, 'km', 12000)); }, []);
  useEffect(() => { updateURL({ c: fuel, p: preco, l: litros, km }); }, [fuel, preco, litros, km]);
  const a = anual(km, consumos[fuel], preco);
  const cont = continente[fuel];
  const nome = (k: K) => (k === 'gs' ? T(lang, 'Gasóleo rodoviário', 'Road diesel') : T(lang, 'Gasolina sem chumbo 95', 'Unleaded petrol 95'));
  const form = (
    <>
      <SelectField id="ac-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as K)} options={(['gs', 'g95'] as K[]).map((k) => ({ value: k, label: nome(k) }))} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberField id="ac-preco" label={T(lang, 'Preço afixado no seu posto', 'Price posted at your station')} value={preco} onChange={setPreco} unit="€/l" min={0.3} max={5} decimals={2} lang={lang} help={T(lang, 'Escreva o preço que vê na bomba', 'Type the price shown on the pump')} />
        <NumberField id="ac-litros" label={T(lang, 'Litros', 'Litres')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
        <NumberField id="ac-km" label={T(lang, 'Quilómetros por ano', 'Kilometres per year')} value={km} onChange={setKm} unit="km" min={0} max={200000} lang={lang} />
      </div>
    </>
  );
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${nome(fuel)}: custo do abastecimento ao preço escrito`, `${nome(fuel)}: cost of the fill at the price typed`)} value={eur(preco * litros, lang)}
      sub={T(lang, `${nr(litros, lang)} litros a ${litro(preco, lang)}`, `${nr(litros, lang)} litres at ${litro(preco, lang)}`)}
      rows={[
        { label: T(lang, `Por ano (${nr(km, lang)} km a ${nr(consumos[fuel], lang, 1)} l/100 km)`, `Per year (${nr(km, lang)} km at ${nr(consumos[fuel], lang, 1)} l/100 km)`), value: eur(a.custo, lang, 0), strong: true },
        { label: T(lang, 'Por mês', 'Per month'), value: eur(a.mes, lang, 0) },
        { label: T(lang, 'Preço usado', 'Price used'), value: litro(preco, lang), note: true },
        { label: T(lang, `Preço médio diário no continente (DGEG, ${diaLongo(continente.dia, lang, false)})`, `Mainland daily average (DGEG, ${diaLongo(continente.dia, lang, false)})`), value: litro(cont, lang), note: true },
        { label: T(lang, 'Diferença por litro face ao continente', 'Difference per litre vs mainland'), value: cent(preco - cont, lang) },
        { label: T(lang, 'Diferença num ano', 'Difference over a year'), value: eur((preco - cont) * a.litros, lang, 0) },
      ]}
      hyp={T(lang, 'Nos Açores, o preço máximo é fixado mensalmente pelo Governo Regional. Este site não o reproduz: o cálculo usa o preço que escreve. O preço por omissão é apenas um exemplo para o formulário funcionar.', 'In the Azores the maximum price is set monthly by the Regional Government. This site does not reproduce it: the calculation uses the price you type. The default price is only an example so the form works.')}
      methodHref={methodHref} copyText={`${nome(fuel)}: ${eur(preco * litros, lang)}`} />} />;
}
