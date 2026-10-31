import { describe, expect, it } from 'vitest';
import { stats } from '../src/lib/engine/precos';
// Audit de Sami (2026-10-28) : une moyenne exacte de 2,2725 € s'affichait 2,272. La somme binaire de
// 1,900 + 1,902 + 1,904 + 1,904 donne 1,90249999… au lieu de 1,9025 : l'arrondi doit donner 1,903.
describe('arrondi des moyennes au millième', () => {
  it('moyenne exacte à la demi-unité arrondie au-dessus', () => expect(stats([1.9, 1.902, 1.904, 1.904].map((preco) => ({ preco })))!.media).toBe(1.903));
});
