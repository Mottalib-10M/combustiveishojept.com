/** Madeira : prix maximums homologués chaque semaine par despacho conjunto au JORAM ; comparaison avec la moyenne DGEG du continent. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, cent, nr, diaLongo, type L } from './kit';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import type { MadeiraDespacho } from '../../lib/engine/tipos';

type K = 'g95' | 'gs' | 'colorido';
interface Props { lang: L; despachos: MadeiraDespacho[]; continente: { g95?: number; gs?: number; dia: string }; fuel?: K; litros?: number; methodHref?: string }
const NOME: Record<K, [string, string]> = { g95: ['Gasolina sem chumbo 95', 'Unleaded petrol 95'], gs: ['Gasóleo rodoviário', 'Road diesel'], colorido: ['Gasóleo colorido e marcado', 'Coloured (marked) diesel'] };

export default function MadeiraCalc({ lang, despachos, continente, fuel: f0 = 'g95', litros: l0 = 50, methodHref }: Props) {
  const [fuel, setFuel] = useState<K>(f0);
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as K; if (f in NOME) setFuel(f); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, l: litros }); }, [fuel, litros]);
  const ds = despachos.filter((d) => d[fuel] != null);
  const atual = ds[ds.length - 1], ant = ds[ds.length - 2];
  const p = atual?.[fuel] as number;
  const cont = fuel === 'colorido' ? undefined : continente[fuel];
  const form = (
    <>
      <SelectField id="md-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as K)} options={(Object.keys(NOME) as K[]).map((k) => ({ value: k, label: T(lang, NOME[k][0], NOME[k][1]) }))} />
      <NumberField id="md-litros" label={T(lang, 'Litros', 'Litres')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
    </>
  );
  if (!atual) return <Frame form={form} result={<div data-resultat aria-live="polite" className="mt-6 lg:mt-0">{T(lang, 'Sem dados.', 'No data.')}</div>} />;
  return <Frame form={form} result={
    <ResultPanel lang={lang} head={T(lang, `${NOME[fuel][0]}: preço máximo na Madeira desde ${diaLongo(atual.vigor, lang)}`, `${NOME[fuel][1]}: maximum price in Madeira from ${diaLongo(atual.vigor, lang)}`)} value={litro(p, lang)}
      sub={ant ? T(lang, `${cent(p - (ant[fuel] as number), lang)} face à semana anterior`, `${cent(p - (ant[fuel] as number), lang)} vs the previous week`) : undefined}
      rows={[
        { label: T(lang, `${nr(litros, lang)} litros ao preço máximo`, `${nr(litros, lang)} litres at the maximum price`), value: eur(p * litros, lang), strong: true },
        ...(cont ? [{ label: T(lang, `Preço médio diário no continente (DGEG, ${diaLongo(continente.dia, lang, false)})`, `Mainland daily average (DGEG, ${diaLongo(continente.dia, lang, false)})`), value: litro(cont, lang) }, { label: T(lang, 'Diferença por litro', 'Difference per litre'), value: cent(p - cont, lang) }] : []),
        { label: T(lang, 'Despacho conjunto', 'Joint order'), value: `n.º ${atual.despacho}`, note: true },
      ]}
      hyp={T(lang, 'Preços máximos de venda ao público homologados pelo Governo Regional e publicados no Jornal Oficial da Região Autónoma da Madeira, em vigor a partir das 0 horas da data indicada. Um posto pode vender abaixo.', 'Maximum retail prices approved by the Regional Government and published in the Official Journal of the Autonomous Region of Madeira, in force from midnight on the date shown. A station may sell for less.')}
      methodHref={methodHref} copyText={`${NOME[fuel][lang === 'pt' ? 0 : 1]} Madeira: ${litro(p, lang)}`} />
  } after={
    <div className="mt-6 overflow-x-auto"><p className="mb-2 text-sm font-semibold text-navy-900">{T(lang, 'Despachos lidos no JORAM', 'Orders read in the JORAM')}</p>
      <table className="w-full text-sm"><thead><tr className="border-b border-navy-300 bg-navy-50 text-left text-navy-900">
        <th scope="col" className="px-2 py-2 font-semibold">{T(lang, 'Em vigor desde', 'In force from')}</th><th scope="col" className="px-2 py-2 font-semibold">Despacho</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Gasolina 95', 'Petrol 95')}</th><th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Gasóleo', 'Diesel')}</th></tr></thead>
        <tbody>{[...despachos].reverse().slice(0, 10).map((d) => <tr key={d.despacho} className="border-b border-navy-100"><td className="px-2 py-1.5">{diaLongo(d.vigor, lang, false)}</td><td className="px-2 py-1.5"><a href={d.url} target="_blank" rel="nofollow noopener noreferrer" className="underline">{d.despacho}</a></td><td className="tabular-nums px-2 py-1.5 text-right">{litro(d.g95, lang)}</td><td className="tabular-nums px-2 py-1.5 text-right">{litro(d.gs, lang)}</td></tr>)}</tbody></table></div>
  } />;
}
