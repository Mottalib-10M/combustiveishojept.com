import { describe, it, expect } from 'vitest';
import { comPreco, stats, maisBaratos, agrupar, centimos } from '../src/lib/engine/precos';
import { addDays, diaSemana, segundaDe, proximaSegunda, mediaSemana, beta, retroteste, qualidade, semanas, estimativa } from '../src/lib/engine/previsao';
import { anual, decompor, deposito, IVA_CONTINENTE } from '../src/lib/engine/custos';
import type { Posto } from '../src/lib/engine/tipos';
import * as D from '../src/lib/dados';

const P = (id: number, c: string, preco: number, at = '2026-10-20 10:00'): Posto => ({ id, n: `Posto ${id}`, m: 'X', t: 'Outro', d: 'Lisboa', c, l: c, p: { gs: [preco, at] } });

describe('agrégats par poste', () => {
  const postos = [P(1, 'Sintra', 2.1), P(2, 'Sintra', 2.0), P(3, 'Loures', 2.2), P(4, 'Loures', 0), { ...P(5, 'Loures', 2.05), p: {} }];
  it('écarte les prix nuls et les postes sans le combustível', () => {
    expect(comPreco(postos, 'gs').map((p) => p.id)).toEqual([1, 2, 3]);
  });
  it('moyenne simple, min, max, nombre', () => {
    expect(stats(comPreco(postos, 'gs'))).toEqual({ media: 2.1, min: 2.0, max: 2.2, n: 3 });
  });
  it('le moins cher d’abord, puis le plus récent à prix égal', () => {
    const l = comPreco([P(1, 'A', 2.0, '2026-10-19 08:00'), P(2, 'A', 2.0, '2026-10-20 08:00'), P(3, 'A', 1.9)], 'gs');
    expect(maisBaratos(l, 2).map((p) => p.id)).toEqual([3, 2]);
  });
  it('regroupe par concelho', () => {
    const g = agrupar(comPreco(postos, 'gs'), (p) => p.concelho);
    expect(g.Sintra).toEqual({ media: 2.05, min: 2.0, max: 2.1, n: 2 });
  });
  it('écart en cêntimos au dixième', () => {
    expect(centimos(2.176, 2.096)).toBe(8);
    expect(centimos(2.0, 2.0125)).toBe(-1.3);
  });
});

describe('calendrier de la semaine', () => {
  it('lundi = 0, dimanche = 6', () => {
    expect(diaSemana('2026-10-19')).toBe(0);
    expect(diaSemana('2026-10-25')).toBe(6);
  });
  it('lundi de la semaine et lundi suivant', () => {
    expect(segundaDe('2026-10-21')).toBe('2026-10-19');
    expect(proximaSegunda('2026-10-21')).toBe('2026-10-26');
    expect(proximaSegunda('2026-10-19')).toBe('2026-10-26');
    expect(proximaSegunda('2026-10-25')).toBe('2026-10-26');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
  it('moyenne des jours ouvrés publiés, coupée à la date', () => {
    const ref = { '2026-10-19': 2, '2026-10-20': 2.1, '2026-10-21': 2.2, '2026-10-24': 9 };
    expect(mediaSemana(ref, '2026-10-19')).toEqual({ media: 2.1, dias: 3 });
    expect(mediaSemana(ref, '2026-10-19', '2026-10-20')!.media).toBeCloseTo(2.05, 10);
    expect(mediaSemana({}, '2026-10-19')).toBeNull();
  });
});

describe('estimation et rétro-test', () => {
  it('β des moindres carrés par l’origine', () => {
    expect(beta([{ x: 1, y: 0.8 }, { x: 2, y: 1.6 }])).toBeCloseTo(0.8, 10);
    expect(beta([])).toBe(0);
  });
  it('le rétro-test n’utilise jamais la semaine testée', () => {
    const s = Array.from({ length: 60 }, (_, i) => ({ segunda: addDays('2025-01-06', 7 * i), x: i % 2 ? 0.02 : -0.01, y: i % 2 ? 0.016 : -0.008 }));
    s[55] = { ...s[55], y: 1 }; // valeur aberrante : ne doit pas influencer sa propre estimation
    const t = retroteste(s, 52);
    expect(t).toHaveLength(8);
    expect(t[3].beta).toBeCloseTo(0.8, 10);
    expect(t[3].estimada).toBeCloseTo(0.8 * s[55].x, 10);
  });
  it('qualité : erreur moyenne, référence « ne bouge pas », sens', () => {
    const q = qualidade([{ segunda: 'a', estimada: 0.02, real: 0.03, erro: -0.01, beta: 1 }, { segunda: 'b', estimada: -0.01, real: 0.002, erro: -0.012, beta: 1 }]);
    expect(q.mae).toBeCloseTo(0.011, 10);
    expect(q.maeIgual).toBeCloseTo(0.016, 10);
    expect(q.sentido).toBe(0.5);
    expect(q.publica).toBe(true);
  });
  it('estimation sur un cas construit : variation = β × écart des moyennes ENSE', () => {
    const ref: Record<string, number> = {}, pmd: Record<string, { gs: [number, number, number, number, number] }> = {};
    // Le prix de la semaine w suit à moitié le niveau ENSE de la semaine w−1 : β attendu = 0,5.
    const nivel = (w: number) => 1.5 + (w % 3) * 0.02;
    for (let w = 0; w < 40; w++) {
      const m = addDays('2025-12-29', 7 * w);
      for (let i = 0; i < 5; i++) ref[addDays(m, i)] = nivel(w);
      const preco = 2 + 0.5 * nivel(w - 1);
      for (let i = 0; i < 7; i++) pmd[addDays(m, i)] = { gs: [preco, 0, 0, 1, 0] };
    }
    const s = semanas(ref, pmd, 'gs');
    expect(s.length).toBeGreaterThan(30);
    const e = estimativa(ref, pmd, 'gs', addDays('2025-12-29', 7 * 39 + 2))!;
    expect(e.segunda).toBe(addDays('2025-12-29', 7 * 40));
    expect(e.dias).toBe(3);
    expect(e.beta).toBeCloseTo(0.5, 10);
    expect(e.variacao).toBeCloseTo(0.5 * (nivel(39) - nivel(38)), 10);
    expect(e.preco).toBeCloseTo(e.precoBase + e.variacao, 12);
  });
});

describe('coûts et impôts', () => {
  it('plein et budget annuel', () => {
    expect(deposito(50, 2.1)).toBeCloseTo(105, 10);
    const a = anual(15000, 6, 2);
    expect(a.litros).toBe(900);
    expect(a.custo).toBe(1800);
    expect(a.mes).toBe(150);
    expect(a.porKm).toBeCloseTo(0.12, 10);
  });
  it('IVA à 23 % (Código do IVA, art. 18.º)', () => {
    expect(IVA_CONTINENTE).toBe(0.23);
    const d = decompor(2.46, 0.437);
    expect(d.iva).toBeCloseTo(0.46, 10);
    expect(d.isp).toBe(0.437);
    expect(d.semImpostos).toBeCloseTo(1.563, 10);
    expect(d.iva + d.isp + d.semImpostos).toBeCloseTo(2.46, 10);
  });
});

describe('données réelles (DGEG, ENSE, JORAM)', () => {
  it('les 18 districts et 278 concelhos du continent', () => {
    expect(D.DISTRITOS).toHaveLength(18);
    expect(D.POSTOS.concelhos).toHaveLength(278);
    expect(D.slug('Évora')).toBe('evora');
    expect(D.slug('Viana do Castelo')).toBe('viana-do-castelo');
  });
  it('plus de 2 500 postes affichent le gasóleo simples', () => {
    expect(D.lista('gs').length).toBeGreaterThan(2500);
  });
  it('la décomposition ENSE retombe sur son prix', () => {
    for (const s of ['gasolina', 'gasoleo', 'gpl'] as const) {
      const d = D.ENSE.decomp[s];
      expect(d.partes.reduce((a, x) => a + x, 0)).toBeCloseTo(d.preco, 2);
    }
    // l'IVA de la décomposition est bien 23 % du reste
    const g = D.ENSE.decomp.gasoleo;
    expect(g.partes[0] / (g.preco - g.partes[0])).toBeCloseTo(0.23, 2);
  });
  it('l’estimation bat « ne bouge pas » pour le gasóleo et la gasolina, pas pour le GPL', () => {
    expect(D.est('gs')!.qualidade.publica).toBe(true);
    expect(D.est('g95')!.qualidade.publica).toBe(true);
    expect(D.est('gs')!.qualidade.semanas).toBeGreaterThan(80);
    expect(D.est('gpl')?.qualidade.publica ?? false).toBe(false);
  });
  it('Madeira : prix maximums homologués, les plus récents d’abord lus', () => {
    expect(D.MADEIRA.despachos.length).toBeGreaterThan(4);
    expect(D.MADEIRA_ATUAL.g95).toBeGreaterThan(1);
    expect(D.MADEIRA_ATUAL.gs).toBeGreaterThan(1);
  });
});
