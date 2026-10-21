/** Quel jour faire le plein : écart moyen de chaque jour de la semaine à la moyenne de sa semaine (PMD DGEG), et sens attendu lundi (estimation). */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, cent, nr, diaLongo, type L } from './kit';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { lang: L; efeito: Partial<Record<Fuel, number[]>>; semanas: number; segunda: Partial<Record<Fuel, { variacao: number; data: string } | null>>; fuel?: Fuel; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];
const DIAS = { pt: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'], en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] };

export default function QuandoCalc({ lang, efeito, semanas, segunda, fuel: f0 = 'gs', methodHref }: Props) {
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [litros, setLitros] = useState(50);
  const [vezes, setVezes] = useState(3);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f); setLitros(num(u, 'l', 50)); setVezes(num(u, 'v', 3)); }, []);
  useEffect(() => { updateURL({ c: fuel, l: litros, v: vezes }); }, [fuel, litros, vezes]);
  const ef = efeito[fuel] ?? [];
  const iMin = ef.indexOf(Math.min(...ef)), iMax = ef.indexOf(Math.max(...ef));
  const dif = (ef[iMax] ?? 0) - (ef[iMin] ?? 0);
  const ano = dif * litros * vezes * 12;
  const seg = segunda[fuel];
  const conselho = !seg ? T(lang, 'Sem estimativa publicada para segunda-feira neste combustível.', 'No Monday estimate is published for this fuel.')
    : Math.abs(seg.variacao) < 0.005 ? T(lang, `Para ${diaLongo(seg.data, lang)} a estimativa é de preço praticamente estável: o dia da semana pesa mais.`, `For ${diaLongo(seg.data, lang)} the estimate is roughly unchanged: the weekday matters more.`)
    : seg.variacao > 0 ? T(lang, `Para ${diaLongo(seg.data, lang)} a estimativa é de subida (${cent(seg.variacao, lang)}): abastecer antes compensa.`, `For ${diaLongo(seg.data, lang)} the estimate is a rise (${cent(seg.variacao, lang)}): filling up before pays.`)
    : T(lang, `Para ${diaLongo(seg.data, lang)} a estimativa é de descida (${cent(seg.variacao, lang)}): se puder, espere por segunda-feira.`, `For ${diaLongo(seg.data, lang)} the estimate is a fall (${cent(seg.variacao, lang)}): if you can, wait for Monday.`);
  const form = (
    <>
      <SelectField id="qd-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as Fuel)} options={fuelOpts(lang, FS)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberField id="qd-litros" label={T(lang, 'Litros por abastecimento', 'Litres per fill')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
        <NumberField id="qd-vezes" label={T(lang, 'Abastecimentos por mês', 'Fills per month')} value={vezes} onChange={setVezes} min={0} max={60} lang={lang} />
      </div>
    </>
  );
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: dia mais barato da semana`, `${FUEL_NOME.en[fuel]}: cheapest day of the week`)} value={DIAS[lang][iMin] ?? '—'}
      sub={T(lang, `${cent(ef[iMin] ?? 0, lang)} face à média da semana`, `${cent(ef[iMin] ?? 0, lang)} vs the week’s average`)}
      rows={[
        { label: T(lang, `Dia mais caro: ${DIAS.pt[iMax]}`, `Dearest day: ${DIAS.en[iMax]}`), value: cent(ef[iMax] ?? 0, lang) },
        { label: T(lang, 'Diferença entre os dois', 'Gap between the two'), value: cent(dif, lang).replace('+', '') },
        { label: T(lang, 'Poupança num ano, sempre no dia mais barato', 'Saving over a year, always on the cheapest day'), value: eur(ano, lang), strong: true },
      ]}
      notes={[conselho]}
      hyp={T(lang, `Média, em ${nr(semanas, lang)} semanas completas, da diferença entre o preço médio diário DGEG de cada dia e a média da sua semana. Os preços mudam sobretudo à segunda-feira.`, `Average over ${nr(semanas, lang)} full weeks of the gap between each day’s DGEG daily average and its week’s mean. Prices mostly change on Mondays.`)}
      methodHref={methodHref} copyText={`${FUEL_NOME[lang][fuel]}: ${DIAS[lang][iMin]}`} />
  } after={
    <div className="mt-6 overflow-x-auto"><table className="w-full text-sm"><caption className="mb-2 text-left text-sm font-semibold text-navy-900">{T(lang, 'Diferença média de cada dia face à média da semana', 'Average gap of each day vs the week’s mean')}</caption>
      <thead><tr className="border-b border-navy-300 bg-navy-50 text-left text-navy-900">{DIAS[lang].map((d) => <th key={d} scope="col" className="px-2 py-2 text-right font-semibold">{d}</th>)}</tr></thead>
      <tbody><tr>{ef.map((x, i) => <td key={i} className={`tabular-nums px-2 py-1.5 text-right ${i === iMin ? 'font-bold text-accent-800' : ''}`}>{cent(x, lang)}</td>)}</tr></tbody></table></div>
  } />;
}
