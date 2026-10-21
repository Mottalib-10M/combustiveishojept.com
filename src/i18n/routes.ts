import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/guides';
export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt';
const R = (id: string, pt: string, en: string, noindex = false): RouteDef<Locale> => ({ id, paths: { pt: `/pt/${pt}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
/** Pages du noyau. Les pages de contenu (outils, districts, îles) viennent de `src/content/` (lib/guides.ts). */
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { pt: '/pt/', en: '/en/' } },
  R('method', 'metodologia', 'method'),
  R('about', 'sobre', 'about'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contacto', 'contact', true),
  R('editorial', 'politica-editorial', 'editorial-policy', true),
  R('privacy', 'privacidade', 'privacy', true),
  R('terms', 'informacao-legal', 'legal-notice', true),
  R('cookies', 'cookies', 'cookies', true),
];
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...PAGES.map((p) => R(p.id, p.pt.slug, p.en.slug)), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
