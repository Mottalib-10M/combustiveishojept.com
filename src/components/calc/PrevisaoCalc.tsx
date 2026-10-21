/**
 * Estimativa do preço médio de segunda-feira : variação = β × (média dos preços de referência diários da ENSE da
 * semana em curso − média da semana anterior), aplicada ao preço médio diário DGEG da segunda-feira atual.
 * Publicada só para os combustíveis em que o erro passado é menor do que dizer « fica igual » (método).
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, cent, nr, pct, diaLongo, type L } from './kit';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import type { Estimativa } from '../../lib/engine/previsao';

interface Props { lang: L; ests: Partial<Record<Fuel, Estimativa | null>>; fuel?: Fuel; litros?: number; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'ge', 'g95e', 'gpl'];

export default function PrevisaoCalc({ lang, ests, fuel: f0 = 'gs', litros: l0 = 50, methodHref }: Props) {
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, l: litros }); }, [fuel, litros]);
  const e = ests[fuel];
  const form = (
    <>
      <SelectField id="pv-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as Fuel)} options={fuelOpts(lang, FS)} />
      <NumberField id="pv-litros" label={T(lang, 'Litros que vai abastecer', 'Litres you will fill')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      {e && <p className="text-xs text-navy-600">{T(lang, `Preços de referência da ENSE lidos até ${diaLongo(e.ultimoEnse, lang)} (${e.dias} de 5 dias úteis da semana). Preço médio diário da DGEG de ${diaLongo(e.base, lang)}.`, `ENSE reference prices read up to ${diaLongo(e.ultimoEnse, lang)} (${e.dias} of the week’s 5 working days). DGEG daily average of ${diaLongo(e.base, lang)}.`)}</p>}
    </>
  );
  if (!e || !e.qualidade.publica) {
    const q = e?.qualidade;
    return <Frame form={form} result={
      <div data-resultat aria-live="polite" className="mt-6 rounded-xl border border-navy-200 bg-navy-50 p-4 sm:p-5 lg:mt-0">
        <p className="text-sm font-medium text-navy-700">{T(lang, `${FUEL_NOME.pt[fuel]}: estimativa não publicada`, `${FUEL_NOME.en[fuel]}: no estimate published`)}</p>
        <p className="mt-2 text-navy-800">{q ? T(lang, `Nas ${nr(q.semanas, lang)} semanas testadas, a estimativa errou em média ${cent(q.mae, lang).replace('+', '')}, mais do que dizer «fica igual» (${cent(q.maeIgual, lang).replace('+', '')}). Por isso não a mostramos.`, `Over the ${nr(q.semanas, lang)} weeks tested, the estimate missed by ${cent(q.mae, lang).replace('+', '')} on average, more than simply saying “no change” (${cent(q.maeIgual, lang).replace('+', '')}). So we do not show it.`) : T(lang, 'Faltam dados para estimar.', 'Not enough data to estimate.')}</p>
        {e && <p className="mt-2 text-navy-800">{T(lang, `Preço médio diário DGEG de ${diaLongo(e.base, lang)}: ${litro(e.precoBase, lang)}.`, `DGEG daily average on ${diaLongo(e.base, lang)}: ${litro(e.precoBase, lang)}.`)}</p>}
      </div>} />;
  }
  const efeito = e.variacao * litros;
  const sentido = Math.abs(e.variacao) < 0.005 ? T(lang, 'praticamente estável', 'roughly unchanged') : e.variacao < 0 ? T(lang, 'deve descer', 'likely to fall') : T(lang, 'deve subir', 'likely to rise');
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: estimativa para ${diaLongo(e.segunda, lang)}`, `${FUEL_NOME.en[fuel]}: estimate for ${diaLongo(e.segunda, lang)}`)}
      value={litro(e.preco, lang)} sub={`${cent(e.variacao, lang)} · ${sentido}`}
      rows={[
        { label: T(lang, `Preço médio DGEG em ${diaLongo(e.base, lang, false)}`, `DGEG average on ${diaLongo(e.base, lang, false)}`), value: litro(e.precoBase, lang) },
        { label: T(lang, `Efeito em ${nr(litros, lang)} litros`, `Effect on ${nr(litros, lang)} litres`), value: `${efeito > 0 ? '+' : ''}${eur(efeito, lang)}`, strong: true },
        { label: T(lang, 'Erro médio nas semanas testadas', 'Average error in tested weeks'), value: cent(e.qualidade.mae, lang).replace('+', '') },
        { label: T(lang, 'Erro de dizer «fica igual»', 'Error of saying “no change”'), value: cent(e.qualidade.maeIgual, lang).replace('+', ''), note: true },
        { label: T(lang, 'Sentido certo', 'Direction right'), value: `${pct(e.qualidade.sentido, lang, 0)} (${nr(e.qualidade.semanas, lang)} ${T(lang, 'semanas', 'weeks')})`, note: true },
      ]}
      notes={[T(lang, 'Estimativa estatística, nunca um preço oficial: cada posto fixa o seu preço livremente.', 'A statistical estimate, never an official price: each station sets its own price freely.')]}
      hyp={T(lang, `Variação = ${nr(e.beta, lang, 2)} × diferença entre a média dos preços de referência ENSE desta semana e a da semana anterior. O coeficiente é ajustado só com semanas passadas.`, `Change = ${nr(e.beta, lang, 2)} × the gap between this week’s and last week’s average ENSE reference price. The coefficient is fitted on past weeks only.`)}
      methodHref={methodHref}
      copyText={`${FUEL_NOME[lang][fuel]} ${diaLongo(e.segunda, lang)}: ${litro(e.preco, lang)} (${cent(e.variacao, lang)})`} />
  } after={
    <div className="mt-6 overflow-x-auto">
      <p className="mb-2 text-sm font-semibold text-navy-900">{T(lang, 'As últimas semanas: estimado e verificado', 'Recent weeks: estimated and actual')}</p>
      <table className="w-full text-sm"><thead><tr className="border-b border-navy-300 bg-navy-50 text-left text-navy-900">
        <th scope="col" className="px-2 py-2 font-semibold">{T(lang, 'Segunda-feira', 'Monday')}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Estimado', 'Estimated')}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Verificado', 'Actual')}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Erro', 'Error')}</th></tr></thead>
        <tbody>{[...e.ultimas].reverse().map((r) => <tr key={r.segunda} className="border-b border-navy-100">
          <td className="px-2 py-1.5 text-navy-800">{diaLongo(r.segunda, lang, false)}</td>
          <td className="tabular-nums px-2 py-1.5 text-right">{cent(r.estimada, lang)}</td>
          <td className="tabular-nums px-2 py-1.5 text-right">{cent(r.real, lang)}</td>
          <td className="tabular-nums px-2 py-1.5 text-right text-navy-700">{cent(r.erro, lang)}</td></tr>)}</tbody></table>
    </div>} />;
}
