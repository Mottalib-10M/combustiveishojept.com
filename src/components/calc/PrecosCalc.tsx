/**
 * Preço afixado por zona (DGEG) : district → concelho → combustível. Moyenne simple des prix affichés, minimum,
 * nombre de postes, comparaison avec le preço médio diário national de la DGEG (pondéré par les ventes, remises
 * comprises), coût d'un plein et les 5 postes les moins chers avec la date-heure de leur mise à jour.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, TabelaPostos, T, eur, litro, cent, nr, quando, diaLongo, type L } from './kit';
import { FUEL_NOME, fuelOpts, slug, type Fuel } from './nomes';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import type { BundlePrecos, PostosDistrito } from '../../lib/bundle';

interface Props { lang: L; datos: BundlePrecos; fuel?: Fuel; concelho?: string; litros?: number; methodHref?: string; secundario?: boolean }
const FS: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];

export default function PrecosCalc({ lang, datos, fuel: f0 = 'gs', concelho: c0 = '*', litros: l0 = 50, methodHref }: Props) {
  const [fuel, setFuel] = useState<Fuel>(f0);
  const [dist, setDist] = useState(datos.distrito);
  const [conc, setConc] = useState(c0);
  const [litros, setLitros] = useState(l0);
  const [cache, setCache] = useState<Record<string, PostosDistrito>>({ [datos.distrito]: datos.postos });
  useEffect(() => {
    const u = readParams(window.location.search);
    const f = str(u, 'c', f0) as Fuel; if (FS.includes(f)) setFuel(f);
    const d = str(u, 'd', ''); const dd = datos.distritos.find((x) => slug(x) === d);
    if (dd) { setDist(dd); setConc(str(u, 'm', '*')); }
    setLitros(num(u, 'l', l0));
  }, []);
  useEffect(() => { updateURL({ c: fuel, d: slug(dist), m: conc === '*' ? undefined : conc, l: litros }); }, [fuel, dist, conc, litros]);
  useEffect(() => {
    if (cache[dist]) return;
    let ok = true;
    fetch(`/dados/${slug(dist)}.json`).then((r) => r.json()).then((j) => { if (ok) setCache((c) => ({ ...c, [dist]: j })); }).catch(() => {});
    return () => { ok = false; };
  }, [dist]);

  const zona = datos.zonas[dist] ?? {};
  const concelhos = Object.keys(zona).filter((c) => c !== '*').sort((a, b) => a.localeCompare(b, 'pt'));
  const cAtual = zona[conc] ? conc : '*';
  const s = zona[cAtual]?.[fuel];
  const nac = datos.nacional[fuel];
  const lista = cache[dist]?.[cAtual]?.[fuel] ?? [];
  const nome = cAtual === '*' ? T(lang, `distrito de ${dist}`, `${dist} district`) : `${cAtual} (${dist})`;
  const out = useMemo(() => {
    if (!s) return null;
    const [media, min, n] = s;
    return { media, min, n, cheio: media * litros, cheioMin: min * litros, poupa: (media - min) * litros };
  }, [s, litros]);

  const form = (
    <>
      <SelectField id="pc-fuel" label={T(lang, 'Combustível', 'Fuel')} value={fuel} onChange={(v) => setFuel(v as Fuel)} options={fuelOpts(lang)} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <SelectField id="pc-dist" label={T(lang, 'Distrito', 'District')} value={dist} onChange={(v) => { setDist(v); setConc('*'); }} options={datos.distritos.map((d) => ({ value: d, label: d }))} />
        <SelectField id="pc-conc" label={T(lang, 'Concelho', 'Municipality')} value={cAtual} onChange={setConc} options={[{ value: '*', label: T(lang, 'Todo o distrito', 'Whole district') }, ...concelhos.map((c) => ({ value: c, label: c }))]} />
      </div>
      <NumberField id="pc-litros" label={T(lang, 'Litros a abastecer', 'Litres to fill')} value={litros} onChange={setLitros} unit="l" min={1} max={200} lang={lang} />
      <p className="text-xs text-navy-600">{T(lang, `Preços afixados comunicados à DGEG (Direção-Geral de Energia e Geologia), última atualização ${quando(datos.lido, lang)}.`, `Posted prices reported to the DGEG (Directorate-General for Energy and Geology), last update ${quando(datos.lido, lang)}.`)}</p>
    </>
  );
  const result = out ? (
    <ResultPanel lang={lang} head={T(lang, `${FUEL_NOME.pt[fuel]}: preço médio afixado, ${nome}`, `${FUEL_NOME.en[fuel]}: average posted price, ${nome}`)}
      value={litro(out.media, lang)}
      sub={T(lang, `mínimo ${litro(out.min, lang)} · ${nr(out.n, lang)} postos`, `lowest ${litro(out.min, lang)} · ${nr(out.n, lang)} stations`)}
      rows={[
        ...(nac ? [
          { label: T(lang, 'Média afixada no continente', 'Mainland posted average'), value: litro(nac.media, lang) },
          { label: T(lang, 'Diferença para essa média', 'Difference from that average'), value: cent(out.media - nac.media, lang) },
          { label: T(lang, `Preço médio diário DGEG (${diaLongo(nac.pmdDia, lang, false)})`, `DGEG daily average (${diaLongo(nac.pmdDia, lang, false)})`), value: litro(nac.pmd, lang), note: true },
        ] : []),
        { label: T(lang, `${nr(litros, lang)} litros ao preço médio`, `${nr(litros, lang)} litres at the average`), value: eur(out.cheio, lang), strong: true },
        { label: T(lang, `${nr(litros, lang)} litros no posto mais barato`, `${nr(litros, lang)} litres at the cheapest`), value: eur(out.cheioMin, lang) },
        { label: T(lang, 'Poupança possível neste abastecimento', 'Possible saving on this fill'), value: eur(out.poupa, lang) },
      ]}
      hyp={T(lang, 'Média simples dos preços afixados pelos postos da zona (cada posto conta uma vez). O preço médio diário da DGEG é outra medida: pondera as vendas e desconta as promoções, por isso costuma ficar abaixo.', 'Simple average of the prices posted by the stations in the area (each counts once). The DGEG daily average is a different measure: it weights sales and nets out discounts, so it is usually lower.')}
      methodHref={methodHref}
      copyText={`${FUEL_NOME[lang][fuel]} ${nome}: ${litro(out.media, lang)}`} />
  ) : (
    <div data-resultat aria-live="polite" className="mt-6 rounded-xl border border-navy-200 bg-navy-50 p-4 lg:mt-0"><p className="text-navy-800">{T(lang, 'Nenhum posto desta zona comunica este combustível à DGEG.', 'No station in this area reports this fuel to the DGEG.')}</p></div>
  );
  return <Frame form={form} result={result} after={<TabelaPostos lang={lang} postos={lista} refPreco={s?.[0]} titulo={T(lang, `Os postos mais baratos: ${nome}`, `Cheapest stations: ${nome}`)} />} />;
}
