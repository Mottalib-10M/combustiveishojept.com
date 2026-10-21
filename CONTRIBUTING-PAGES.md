# Pages — une page = un fichier

- Outils et guides : `src/content/paginas/<id>.ts` ; districts : `src/content/distritos/<id>.ts` (id = slug du district).
- Le fichier exporte `defineGuide({...})` (`src/lib/guide-types.ts`) : `id` (= nom du fichier), `group`, `order`, `tool`
  (le calculateur affiché au premier écran), `toolProps`, `related`, `sources` (clés de `params-2026.json`), puis `pt` et `en`
  avec `slug`, `nav`, `card`, `title` (50–60 car., terme-clé en tête), `description` (150–160 car.), `h1`, `intro(h)`,
  `resume(h)` (un paragraphe ≥ 120 mots, la réponse d'abord), `faqs(h)` (3 à 6, 40–90 mots, question unique sur tout le site), `body(h)`.
- Aucun chiffre écrit à la main : tout passe par `h.D` (données du jour, `src/lib/dados.ts`) et `h.E` (moteur), formaté par
  `h.l` (€/l à 3 décimales), `h.c` (cêntimos), `h.eur`, `h.num`, `h.pct`, `h.date`, `h.ord`. Les classements changent chaque jour :
  écrire des phrases vraies dans les deux sens.
- Routes, menus, sitemap, hreflang et schémas se mettent à jour seuls. Plafond : 100 pages HTML.
- Contrôle : `npm run check` (tous les contrôles à 0).
