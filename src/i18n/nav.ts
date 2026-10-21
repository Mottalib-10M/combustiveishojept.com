import { route, type Locale } from './routes';
import { PAGES, pageById, GROUPS } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  pt: { home: 'Preço dos combustíveis hoje', method: 'Método e fontes', about: 'Quem somos', widget: 'Inserir a calculadora', contact: 'Contacto', editorial: 'Política editorial', privacy: 'Privacidade', terms: 'Informação legal', cookies: 'Cookies' },
  en: { home: 'Fuel prices today', method: 'Method and sources', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
export const GROUP_LABEL: Record<Locale, Record<Group, string>> = {
  pt: { precos: 'Preços e estimativa', contas: 'Contas e impostos', distritos: 'Distritos', ilhas: 'Madeira e Açores' },
  en: { precos: 'Prices and estimate', contas: 'Costs and taxes', distritos: 'Districts', ilhas: 'Madeira and the Azores' },
};
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? pageById(id)?.[lang].nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).sort((a, b) => a.order - b.order || a[lang].nav.localeCompare(b[lang].nav, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return (GROUPS as Group[]).map((g) => ({ label: GROUP_LABEL[lang][g], links: g === 'precos' ? [link('home', lang), ...inGroup(g, lang)] : inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: lang === 'pt' ? 'O site' : 'Site', links: ['method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
