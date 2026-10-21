/**
 * Une page de contenu = UN fichier de données dans `src/content/paginas/` (outils et guides) ou
 * `src/content/distritos/` (un district). Il porte les deux langues, le texte, la FAQ, les sources, l'outil et
 * ses réglages, les liens. Le cœur (routes, menus, sitemap, hreflang, schémas) le lit seul.
 * Notice : CONTRIBUTING-PAGES.md.
 */
import type { SourceKey } from './params';
import type * as Dados from './dados';
import type * as Engine from './engine/index';
import type { Fuel } from './engine/tipos';

export type Lang = 'pt' | 'en';
export type Group = 'precos' | 'contas' | 'distritos' | 'ilhas';
export interface FAQ { q: string; a: string }
export type Tool = 'precos' | 'previsao' | 'impostos' | 'custo' | 'historico' | 'marcas' | 'madeira' | 'acores' | 'quando' | 'aditivado';

/** Outils d'écriture : liens internes, nombres au format de la langue, données du jour. */
export interface Helpers {
  lang: Lang;
  /** Lien interne vers une autre page du site, par son identifiant. */
  a: (id: string, text: string) => string;
  /** Montant en euros, sans décimales par défaut (« 109 € » / « €109 »). */
  eur: (n: number, decimals?: number) => string;
  /** Prix au litre, trois décimales comme la DGEG (« 2,176 €/l » / « €2.176/l »). */
  l: (n: number) => string;
  /** Écart en cêntimos par litre, une décimale, signe compris si signed (« +1,5 cêntimos » / « +1.5 cents »). */
  c: (eurosPorLitro: number, signed?: boolean) => string;
  /** Nombre au format de la langue. */
  num: (n: number, decimals?: number) => string;
  /** Pourcentage depuis une fraction (0,385 → « 38,5 % »). */
  pct: (x: number, decimals?: number) => string;
  /** Date ISO en toutes lettres (« 20 de outubro de 2026 »). */
  date: (iso: string) => string;
  /** Date ISO sans l'année (« 20 de outubro »), avec le jour de la semaine si wd. */
  dia: (iso: string, wd?: boolean) => string;
  /** Tableau de style journal. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Lien vers une source du fichier de paramètres. */
  src: (key: SourceKey, text?: string) => string;
  /** Ordinal (« 3.º » / « 3rd »). */
  ord: (n: number) => string;
  /** Nom du combustível dans la langue. */
  fn: (f: Fuel) => string;
  /** Données du jour et références (DGEG, ENSE, JORAM) : jamais un chiffre recopié à la main. */
  D: typeof Dados;
  /** Moteur (fonctions pures). */
  E: typeof Engine;
}

export interface PageText {
  /** Segment d'URL sans barre, sans année ni chiffre. */
  slug: string;
  /** Libellé court pour les menus et le fil d'Ariane. */
  nav: string;
  /** Une phrase pour les cartes « pages associées ». */
  card: string;
  /** 50 à 60 caractères, terme-clé en tête, année comprise (RECETTE §11). Fonction de h si un chiffre du jour y entre. */
  title: string;
  /** 150 à 160 caractères, année comprise. */
  description: string;
  h1: string;
  /** Une phrase sous le H1. */
  intro: (h: Helpers) => string;
  /** Bloc citable : UN paragraphe de 120 mots ou plus, chiffres du jour compris, première phrase = la réponse (§21). */
  resume: (h: Helpers) => string;
  /** 3 à 6 questions propres à la page, réponses de 40 à 90 mots (§7). */
  faqs: (h: Helpers) => FAQ[];
  /** Corps HTML (h2, h3, p, ul, h.table). */
  body: (h: Helpers) => string;
}

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  tool: Tool;
  /** Réglages de l'outil propres à la page : district, combustível, litros… */
  toolProps?: { distrito?: string; fuel?: Fuel; litros?: number; [k: string]: string | number | undefined };
  /** Identifiants des pages liées en fin de page (3 à 6). */
  related: string[];
  /** Clés de `params-2026.json > sources` citées par la page (2 au moins). */
  sources: SourceKey[];
  pt: PageText;
  en: PageText;
}
export const defineGuide = (g: PageDef): PageDef => g;
