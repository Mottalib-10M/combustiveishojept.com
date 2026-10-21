# Données — d'où elles viennent, comment les mettre à jour

Tout chiffre du site sort de `src/data/` ; aucun n'est tapé dans un texte.

| Fichier | Source | Mise à jour |
|---|---|---|
| `postos.json` | DGEG, `PesquisarPostos` (prix affiché de chaque posto du continent, date-heure de sa mise à jour), `GetMunicipios` | `scripts/update-data.py`, 3 fois par jour (cron) |
| `pmd.json` | DGEG, `PMD` (preço médio diário depuis 2023-01-01 : moyenne pondérée avec remises, min, max, nombre de postos, moyenne sans remises) | idem |
| `ense.json` | ENSE, prix de référence journaliers (`/precos-de-referencia/?action=xls`, CSV) et décomposition (`/decomposicao/`, valeurs du script de la page) | idem |
| `madeira.json` | JORAM II série : despachos conjuntos « Homologação dos preços máximos », 120 derniers jours | idem (`--sem-madeira` pour sauter) |
| `estado.json` | jour du build, heure, erreurs de source | écrit par le script |
| `params-2026.json` | règles fixes : IVA 23 % (CIVA art. 18.º), consommations d'exemple, URL et libellés des sources | à la main, avec `retrieved_at` |

Règles :
- Une source en erreur laisse son fichier précédent intact ; l'erreur va dans `estado.json > erros`.
- Conditions DGEG (pied du portail) : utilisation libre, citer la DGEG, montrer la date-heure de la dernière mise à jour des prix, reproduire fidèlement. Chaque page le fait (`ContentPage.astro`, `TabelaPostos`).
- Açores : `jo.azores.gov.pt` est derrière un défi Cloudflare (403) ; on ne le contourne pas et on ne publie aucun prix açorien.
- Taux d'IVA des régions autonomes : non lus à une source officielle, donc non utilisés.
- Lancer en local : `pip install pypdf && python3 scripts/update-data.py` puis `npx vitest run` (les tests vérifient 18 districts, 278 concelhos, la décomposition ENSE, le rétro-test).
