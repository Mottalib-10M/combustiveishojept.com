import estado from './estado.json';
/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://combustiveishojept.com";
export const SITE_NAMES: Record<string, string> = {"pt": "Combustíveis Hoje", "en": "Combustíveis Hoje"};
export const LANG_TAGS: Record<string, string> = {"pt": "pt-PT", "en": "en-PT"};
export const OG_LOCALES: Record<string, string> = {"pt": "pt_PT", "en": "en_GB"};
export const LOCALE_TAG = 'pt-PT';
/** Locale de formatage des nombres par langue de page (RECETTE §4) : virgule en portugais, point en anglais. */
export const LOCALE_BY_LANG: Record<string, string> = { pt: 'pt-PT', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
/** Date des dernières données officielles lues (scripts/update-data.py, chaque jour) : c'est la date de mise à jour
 *  affichée et celle de dateModified, jamais saisie à la main (RECETTE §8.4). */
export const LAST_UPDATED: string = estado.hoje;
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"pt": "Editor independente de preços de combustíveis em Portugal, calculados a partir dos dados abertos da DGEG e dos preços de referência da ENSE", "en": "Independent publisher of Portuguese fuel prices, worked out from the DGEG open station data and the ENSE reference prices"};
export const AUTHOR_DESC: Record<string, string> = {"pt": "A Radif Partners lê todos os dias os preços que os cerca de 3 000 postos do continente comunicam à Direção-Geral de Energia e Geologia, calcula a média de cada concelho e distrito e estima a variação da segunda-feira seguinte a partir do preço de referência diário da ENSE, com o erro das semanas anteriores à vista. Não vende combustível, não tem acordos com marcas nem postos e não pede dados pessoais.", "en": "Radif Partners reads every day the prices that some 3,000 mainland filling stations report to the Directorate-General for Energy and Geology, averages them by municipality and district, and estimates next Monday's change from the ENSE daily reference price, with the error of past weeks in plain sight. It sells no fuel, has no deal with any brand or station and asks for no personal data."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"pt": ["Preços de venda ao público dos combustíveis por posto, concelho e distrito", "Preços de referência da ENSE e variação semanal", "Imposto sobre os produtos petrolíferos (ISP), taxa de carbono e IVA", "Preços máximos dos combustíveis na Madeira e regime dos Açores", "Custo de um depósito e orçamento anual de combustível"], "en": ["Retail fuel prices by station, municipality and district in Portugal", "ENSE reference prices and the weekly price change", "Portuguese fuel tax (ISP), carbon levy and VAT", "Maximum fuel prices in Madeira and the Azores regime", "Cost of a full tank and yearly fuel budget"]};
export const CONTACT_EMAIL = "contacto@combustiveishojept.com";
export const THEME_COLOR = '#046A38';
export const LOGO_SYMBOL = '€/L';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-Q4BC5TGBWX';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z2hdqpjaby';
export const INDEXNOW_KEY = 'd64e3621dcf553332b35c431f614d21e';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',             // vide à dessein, comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
