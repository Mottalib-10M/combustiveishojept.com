import type { Locale } from './routes';
const pt = {
  updatedOn: 'Atualizado em', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Verificado por',
  skipToContent: 'Ir para o conteúdo', mainNav: 'Menu principal', breadcrumbLabel: 'Caminho', breadcrumbHome: 'Início', menuOpen: 'Abrir o menu',
  faqTitle: 'Perguntas frequentes', relatedCalculators: 'Páginas e calculadoras relacionadas', sourcesTitle: 'Fontes', writtenBy: 'Escrito por',
  asOf: 'Dados oficiais de', lastUpdated: 'lidos em', footerValidated: 'Fontes: DGEG (preços por posto e preço médio diário), ENSE (preços de referência e decomposição), JORAM (Madeira), Código do IVA',
  footerBrowser: 'Calculado no seu navegador · nenhum dado enviado · grátis · sem conta, sem telefone, sem formulário',
  footerDisclaimer: 'Site independente publicado pela Radif Partners, sem ligação à DGEG, à ENSE, aos governos regionais nem a qualquer marca ou posto. Os preços por posto são os que os postos comunicam à DGEG e citam-se com a data e a hora da última atualização; as médias por concelho e por distrito são cálculos nossos sobre esses preços; a estimativa da próxima semana é uma estimativa com método e erro publicados, nunca um preço oficial. Todos os resultados são indicativos: o preço que conta é o da bomba. Não vendemos combustível nem pedimos dados de contacto.',
  footerPopular: '', notFound: 'Esta página não existe.', readMore: 'Ler mais',
};
const en: typeof pt = {
  updatedOn: 'Updated', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main menu', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Official data of', lastUpdated: 'read on', footerValidated: 'Sources: DGEG (station prices and daily average), ENSE (reference prices and breakdown), JORAM (Madeira), Portuguese VAT Code',
  footerBrowser: 'Calculated in your browser · no data sent · free · no account, no phone number, no form',
  footerDisclaimer: 'Independent website published by Radif Partners, with no link to the DGEG, the ENSE, the regional governments or any fuel brand or station. Station prices are those the stations report to the DGEG and are quoted with the date and time of their last update; municipality and district averages are our own sums on those prices; next week’s figure is an estimate with its method and error published, never an official price. All results are indicative: the price that counts is the one on the pump. We sell no fuel and ask for no contact details.',
  footerPopular: '', notFound: 'This page does not exist.', readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : pt; }
