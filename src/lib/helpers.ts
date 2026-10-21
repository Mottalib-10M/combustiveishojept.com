/** Fabrique les outils d'écriture (`Helpers`) passés au texte de chaque page. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { P, type SourceKey } from './params';
import * as D from './dados';
import * as E from './engine/index';
import type { Helpers } from './guide-types';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';
import { LANG_TAGS } from '../data/site-config';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function helpers(lang: Locale): Helpers {
  const num = (n: number, d = 0) => formatNumber(n, d, lang);
  return {
    lang, D, E,
    a: (id, text) => (ROUTES.some((r) => r.id === id) ? `<a href="${route(id, lang)}">${text}</a>` : text),
    eur: (n, d = 0) => formatMoney(n, d, lang),
    l: (n) => (lang === 'pt' ? `${num(n, 3)} €/l` : `€${num(n, 3)}/l`),
    c: (x, signed = false) => { const v = Math.round(x * 1000) / 10; const s = signed && v > 0 ? '+' : ''; return `${s}${num(v, 1)} ${lang === 'pt' ? (Math.abs(v) === 1 ? 'cêntimo' : 'cêntimos') : (Math.abs(v) === 1 ? 'cent' : 'cents')}`; },
    num,
    pct: (x, d = 1) => formatPercent(x, d, lang),
    date: (iso) => displayDate(iso, LANG_TAGS[lang]),
    dia: (iso, wd = false) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(LANG_TAGS[lang], { ...(wd ? { weekday: 'long' } : {}), day: 'numeric', month: 'long', timeZone: 'UTC' }),
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label[lang]}</a>`; },
    fn: (f) => D.FUEL_NOME[lang][f],
    ord: (n) => (lang === 'pt' ? `${n}.º` : `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`),
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-700">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 bg-navy-50 px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, ri) => `<tr class="${ri % 2 ? 'bg-navy-50/40' : ''}">${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
