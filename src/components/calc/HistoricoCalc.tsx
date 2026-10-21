/** Historique du preço médio diário DGEG : moyenne mensuelle, comparaison avec le même mois un an plus tôt, coût d'un plein alors et aujourd'hui. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, cent, nr, type L } from './kit';
import Linha from './Linha';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';

/** [mês AAAA-MM, média, mínimo, máximo, dias] */
type Mes = [string, number, number, number, number];
interface Props { lang: L; meses: Partial<Record<Fuel, Mes[]>>; ultimo: Partial<Record<Fuel, [string, number]>>; fuel?: Fuel; litros?: number; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];
const NOMES_MES = { pt: ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
const mesNome = (m: string, l: L) => `${NOMES_MES[l][Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;

export default function HistoricoCalc({ lang, meses, ultimo, fuel: f0 = 'gs', litros: l0 = 50, methodHref }: Props) {
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [janela, setJanela] = useState(24);
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f); setJanela(num(u, 'n', 24)); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, n: janela, l: litros }); }, [fuel, janela, litros]);
  const todos = meses[fuel] ?? [];
  const serie = todos.slice(-janela);
  const atual = todos[todos.length - 1];
  const mesAno = atual && todos.find((m) => m[0] === `${Number(atual[0].slice(0, 4)) - 1}${atual[0].slice(4)}`);
  const lo = serie.reduce((a, m) => (m[1] < a[1] ? m : a), serie[0]);
  const hi = serie.reduce((a, m) => (m[1] > a[1] ? m : a), serie[0]);
  const u = ultimo[fuel];
  const form = (
    <>
      <SelectField id="hi-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as Fuel)} options={fuelOpts(lang, FS)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <SelectField id="hi-jan" label={T(lang, 'Período', 'Period')} value={String(janela)} onChange={(v) => setJanela(Number(v))} options={[{ value: '12', label: T(lang, '12 meses', '12 months') }, { value: '24', label: T(lang, '24 meses', '24 months') }, { value: '120', label: T(lang, 'Desde janeiro de 2023', 'Since January 2023') }]} />
        <NumberField id="hi-litros" label={T(lang, 'Litros', 'Litres')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      </div>
    </>
  );
  if (!atual || !u) return <Frame form={form} result={<div data-resultat aria-live="polite" className="mt-6 lg:mt-0">{T(lang, 'Sem dados.', 'No data.')}</div>} />;
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: preço médio diário DGEG mais recente`, `${FUEL_NOME.en[fuel]}: latest DGEG daily average`)} value={litro(u[1], lang)}
      sub={mesAno ? T(lang, `${cent(atual[1] - mesAno[1], lang)} face a ${mesNome(mesAno[0], lang)}`, `${cent(atual[1] - mesAno[1], lang)} vs ${mesNome(mesAno[0], lang)}`) : undefined}
      rows={[
        { label: T(lang, `Média de ${mesNome(atual[0], lang)} (${atual[4]} dias)`, `${mesNome(atual[0], lang)} average (${atual[4]} days)`), value: litro(atual[1], lang) },
        ...(mesAno ? [{ label: T(lang, `Média de ${mesNome(mesAno[0], lang)}`, `${mesNome(mesAno[0], lang)} average`), value: litro(mesAno[1], lang) }] : []),
        { label: T(lang, 'Mês mais barato do período', 'Cheapest month in period'), value: `${mesNome(lo[0], lang)} · ${litro(lo[1], lang)}` },
        { label: T(lang, 'Mês mais caro do período', 'Dearest month in period'), value: `${mesNome(hi[0], lang)} · ${litro(hi[1], lang)}` },
        { label: T(lang, `${nr(litros, lang)} litros hoje`, `${nr(litros, lang)} litres today`), value: eur(u[1] * litros, lang), strong: true },
        { label: T(lang, `${nr(litros, lang)} litros no mês mais barato`, `${nr(litros, lang)} litres in the cheapest month`), value: eur(lo[1] * litros, lang) },
      ]}
      hyp={T(lang, 'Média simples dos preços médios diários publicados pela DGEG em cada mês (continente, com descontos).', 'Simple average of the daily averages published by the DGEG in each month (mainland, discounts included).')}
      methodHref={methodHref} copyText={`${FUEL_NOME[lang][fuel]}: ${litro(u[1], lang)}`} />
  } after={<Linha lang={lang} pontos={serie.map((m) => [m[0], m[1]])} titulo={T(lang, `${FUEL_NOME.pt[fuel]}: média mensal do preço médio diário DGEG`, `${FUEL_NOME.en[fuel]}: monthly mean of the DGEG daily average`)} />} />;
}
