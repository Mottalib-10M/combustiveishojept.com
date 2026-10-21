/**
 * Pièces communes des calculateurs.
 * - `useParams` : état ; premier rendu = valeurs par défaut du build (RECETTE §17.5), le lien partagé ne
 *   s'applique qu'après le montage et l'URL ne change qu'après une interaction (url-state.ts).
 * - `ResultPanel` : la carte de résultat (chiffre principal, lignes, barre, hypothèses, copier / partager / imprimer).
 * - `Frame` : formulaire à gauche, résultat à droite (empilés sur téléphone).
 */
import { useEffect, useState, type ReactNode } from 'react';
import StackedBar from '../ui/StackedBar';
import { readParams, num, updateURL } from '../../lib/url-state';
import { formatMoney, formatPercent, formatNumber } from '../../lib/format';

export type L = 'pt' | 'en';
export const T = <A,>(l: L, pt: A, en: A) => (l === 'en' ? en : pt);
/** Montant en euros : deux décimales sous 100 € (un plein se lit au cêntimo), aucune au-delà. */
export const eur = (x: number, l: L, d?: number) => formatMoney(x, d ?? (Math.abs(x) < 100 ? 2 : 0), l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const nr = (x: number, l: L, d = 0) => formatNumber(x, d, l);
/** Prix au litre, trois décimales comme la DGEG. */
export const litro = (x: number, l: L) => (l === 'pt' ? `${formatNumber(x, 3, l)} €/l` : `€${formatNumber(x, 3, l)}/l`);
/** Écart en cêntimos par litre, signé. */
export const cent = (x: number, l: L) => { const v = Math.round(x * 1000) / 10; return `${v > 0 ? '+' : ''}${formatNumber(v, 1, l)} ${T(l, 'cênt./l', 'c/l')}`; };
/** « 2026-10-21 14:55 » → « 21/10 às 14:55 » / « 21/10 at 14:55 » */
export const quando = (s: string, l: L) => { const [d, h] = s.split(' '); const [, m, dd] = d.split('-'); return `${dd}/${m}${h ? T(l, ' às ', ' at ') + h : ''}`; };
export const diaLongo = (iso: string, l: L, wd = true) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(l === 'pt' ? 'pt-PT' : 'en-GB', { ...(wd ? { weekday: 'long' } : {}), day: 'numeric', month: 'long', timeZone: 'UTC' });

export function useParams<K extends string>(defs: Record<K, number>): [Record<K, number>, (k: K) => (x: number) => void] {
  const [v, setV] = useState<Record<K, number>>(defs);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    setV((o) => Object.fromEntries(Object.keys(o).map((k) => [k, num(u, k, (o as Record<string, number>)[k])])) as Record<K, number>);
  }, []);
  useEffect(() => { updateURL(v as Record<string, number>); }, [v]);
  const set = (k: K) => (x: number) => setV((o) => ({ ...o, [k]: x }));
  return [v, set];
}

export interface Row { label: string; value: string; strong?: boolean; note?: boolean }
interface PanelProps {
  lang: L; head: string; value: string; sub?: string; rows: Row[]; notes?: ReactNode[];
  bar?: { segments: Array<{ label: string; value: number; color: string }>; total: number; aria: string };
  hyp?: string; methodHref?: string; copyText: string; children?: ReactNode; badge?: ReactNode;
}
export function ResultPanel({ lang, head, value, sub, rows, notes = [], bar, hyp, methodHref, copyText, children, badge }: PanelProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(`${copyText} · ${window.location.href}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  const btn = 'rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-800 hover:bg-navy-50';
  return (
    <div aria-live="polite" data-resultat className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
      <p className="text-sm font-medium text-navy-700">{head}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="tabular-nums mt-1 text-navy-700">{sub}</p>}
      {badge}
      {bar && <div className="mt-4"><StackedBar segments={bar.segments} total={bar.total} ariaPrefix={bar.aria} /></div>}
      <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {rows.map((r, i) => <tr key={i} className={r.strong ? 'font-semibold' : ''}><td className={`py-1.5 pr-3 ${r.note ? 'text-navy-600' : 'text-navy-700'}`}>{r.label}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{r.value}</td></tr>)}
      </tbody></table>
      {notes.length > 0 && <ul className="mt-3 space-y-1 text-sm text-navy-700">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
      {children}
      {hyp && <details className="mt-3 text-sm text-navy-700"><summary className="cursor-pointer font-medium">{T(lang, 'Hipóteses do cálculo', 'Assumptions')}</summary><p className="mt-2">{hyp} {methodHref && <a href={methodHref} className="underline">{T(lang, 'Método e fontes', 'Method and sources')}</a>}</p></details>}
      <div className="no-print mt-4 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={copy} className={btn}>{copied ? T(lang, 'Copiado', 'Copied') : T(lang, 'Copiar o resultado', 'Copy result')}</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className={btn}>{T(lang, 'Ligação para partilhar', 'Share link')}</button>
        <button type="button" onClick={() => window.print()} className={btn}>{T(lang, 'Imprimir', 'Print')}</button>
      </div>
    </div>
  );
}

export function Frame({ form, result, after }: { form: ReactNode; result: ReactNode; after?: ReactNode }) {
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="content-start space-y-5">{form}</form>
        {result}
      </div>
      {after}
    </div>
  );
}

/** Sélecteur à boutons : l'option choisie remplit toute sa zone (RECETTE §10.3). */
export function Botoes<V extends string | number>({ id, label, value, options, onChange }: { id: string; label: string; value: V; options: Array<{ value: V; label: string }>; onChange: (v: V) => void }) {
  return (
    <div className="grid grid-rows-subgrid row-span-3">
      <span id={`${id}-label`} className="block text-sm font-medium text-navy-800">{label}</span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="mt-1 grid h-12 grid-flow-col auto-cols-fr overflow-hidden rounded-lg border border-navy-300">
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}
            className={`h-full px-2 text-sm font-medium ${o.value === value ? 'bg-accent-700 text-white' : 'bg-white text-navy-800 hover:bg-navy-50'}`}>{o.label}</button>
        ))}
      </div>
      <span />
    </div>
  );
}

/** Liste de postes (nom, marque, localité, prix, mise à jour) ; données DGEG reproduites telles quelles. */
export type PostoLinha = [string, string, string, number, string];
export function TabelaPostos({ lang, postos, titulo, refPreco }: { lang: L; postos: PostoLinha[]; titulo: string; refPreco?: number }) {
  if (!postos.length) return null;
  return (
    <div className="mt-6 overflow-x-auto">
      <p className="mb-2 text-sm font-semibold text-navy-900">{titulo}</p>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-navy-300 bg-navy-50 text-left text-navy-900">
          <th scope="col" className="px-2 py-2 font-semibold">{T(lang, 'Posto', 'Station')}</th>
          <th scope="col" className="px-2 py-2 font-semibold">{T(lang, 'Localidade', 'Locality')}</th>
          <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Preço', 'Price')}</th>
          <th scope="col" className="px-2 py-2 text-right font-semibold">{T(lang, 'Atualizado', 'Updated')}</th>
        </tr></thead>
        <tbody>{postos.map((p, i) => (
          <tr key={i} className="border-b border-navy-100">
            <td className="px-2 py-1.5 text-navy-900">{p[0]}<span className="block text-xs text-navy-600">{p[1]}</span></td>
            <td className="px-2 py-1.5 text-navy-700">{p[2]}</td>
            <td className="tabular-nums px-2 py-1.5 text-right font-semibold text-navy-900">{litro(p[3], lang)}{refPreco != null && <span className="block text-xs font-normal text-navy-600">{cent(p[3] - refPreco, lang)}</span>}</td>
            <td className="tabular-nums px-2 py-1.5 text-right text-navy-700">{quando(p[4], lang)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
