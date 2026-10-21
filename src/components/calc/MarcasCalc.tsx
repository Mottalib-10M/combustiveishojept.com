/** Preço médio afixado por marca e por tipo de posto (DGEG) ; écart d'un plein avec la moyenne du continent. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, T, eur, litro, cent, nr, type L } from './kit';
import { FUEL_NOME, fuelOpts, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';

/** [nome, média, mínimo, nº postos] */
type Grupo = [string, number, number, number];
interface Props { lang: L; marcas: Partial<Record<Fuel, Grupo[]>>; tipos: Partial<Record<Fuel, Grupo[]>>; nacional: Partial<Record<Fuel, number>>; fuel?: Fuel; litros?: number; methodHref?: string }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];
const TIPO: Record<string, [string, string]> = { 'Outro': ['Posto de rua', 'Street station'], 'Área comercial (Hipermercados)': ['Hipermercado', 'Hypermarket'], 'Auto-estrada': ['Autoestrada', 'Motorway'] };

export default function MarcasCalc({ lang, marcas, tipos, nacional, fuel: f0 = 'gs', litros: l0 = 50, methodHref }: Props) {
  const [fuel, setFuel] = useState<Fuel>(f0);
  const lista = marcas[fuel] ?? [];
  const [marca, setMarca] = useState(lista[0]?.[0] ?? '');
  const [litros, setLitros] = useState(l0);
  useEffect(() => { const u = readParams(window.location.search); const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f); setMarca(str(u, 'mc', (marcas[f] ?? lista)[0]?.[0] ?? '')); setLitros(num(u, 'l', l0)); }, []);
  useEffect(() => { updateURL({ c: fuel, mc: marca, l: litros }); }, [fuel, marca, litros]);
  const g = lista.find((m) => m[0] === marca) ?? lista[0];
  const nac = nacional[fuel];
  const barata = lista.reduce((a, m) => (m[1] < a[1] ? m : a), lista[0]);
  const form = (
    <>
      <SelectField id="ma-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => { setFuel(v as Fuel); const l = marcas[v as Fuel] ?? []; if (!l.some((m) => m[0] === marca)) setMarca(l[0]?.[0] ?? ''); }} options={fuelOpts(lang, FS)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <SelectField id="ma-marca" label={T(lang, 'Marca', 'Brand')} value={g?.[0] ?? ''} onChange={setMarca} options={lista.map((m) => ({ value: m[0], label: `${m[0]} (${m[3]})` }))} />
        <NumberField id="ma-litros" label={T(lang, 'Litros', 'Litres')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      </div>
    </>
  );
  const tabela = (rows: Grupo[], titulo: string, nome: (s: string) => string) => (
    <div className="mt-6 overflow-x-auto"><p className="mb-2 text-sm font-semibold text-navy-900">{titulo}</p>
      <table className="w-full text-sm"><thead><tr className="border-b border-navy-300 bg-navy-50 text-left text-navy-900">
        <th scope="col" className="px-2 py-2 font-semibold">{titulo.split(':')[0]}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Postos', 'Stations')}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Média', 'Average')}</th>
        <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Mínimo', 'Lowest')}</th></tr></thead>
        <tbody>{rows.map((m) => <tr key={m[0]} className="border-b border-navy-100"><td className="px-2 py-1.5">{nome(m[0])}</td><td className="tabular-nums px-2 py-1.5 text-right">{nr(m[3], lang)}</td><td className="tabular-nums px-2 py-1.5 text-right">{litro(m[1], lang)}</td><td className="tabular-nums px-2 py-1.5 text-right">{litro(m[2], lang)}</td></tr>)}</tbody></table></div>
  );
  return <Frame form={form} result={g && nac ? (
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: preço médio afixado ${g[0]}`, `${FUEL_NOME.en[fuel]}: ${g[0]} average posted price`)} value={litro(g[1], lang)}
      sub={T(lang, `${nr(g[3], lang)} postos · ${cent(g[1] - nac, lang)} face à média`, `${nr(g[3], lang)} stations · ${cent(g[1] - nac, lang)} vs average`)}
      rows={[
        { label: T(lang, 'Média afixada no continente', 'Mainland posted average'), value: litro(nac, lang) },
        { label: T(lang, `${nr(litros, lang)} litros nesta marca`, `${nr(litros, lang)} litres at this brand`), value: eur(g[1] * litros, lang), strong: true },
        { label: T(lang, `Marca mais barata da lista: ${barata[0]}`, `Cheapest brand listed: ${barata[0]}`), value: eur(barata[1] * litros, lang) },
        { label: T(lang, 'Posto mais barato da marca', 'Cheapest station of the brand'), value: litro(g[2], lang), note: true },
      ]}
      hyp={T(lang, 'Média simples dos preços afixados pelos postos de cada marca, tal como comunicados à DGEG. Não inclui cartões de desconto nem promoções pessoais.', 'Simple average of the prices posted by each brand’s stations as reported to the DGEG. Loyalty cards and personal offers are not included.')}
      methodHref={methodHref} copyText={`${g[0]} ${FUEL_NOME[lang][fuel]}: ${litro(g[1], lang)}`} />
  ) : <div data-resultat aria-live="polite" className="mt-6 lg:mt-0">{T(lang, 'Sem dados.', 'No data.')}</div>}
    after={<>{tabela(tipos[fuel] ?? [], T(lang, 'Tipo de posto: média afixada', 'Station type: average posted price'), (s) => (TIPO[s] ? T(lang, TIPO[s][0], TIPO[s][1]) : s))}{tabela(lista, T(lang, 'Marca: média afixada', 'Brand: average posted price'), (s) => s)}</>} />;
}
