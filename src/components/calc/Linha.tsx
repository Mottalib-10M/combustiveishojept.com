/** Courbe simple (SVG) des moyennes mensuelles : axe des prix à gauche, mois en bas, sans bibliothèque. */
import { T, nr, type L } from './kit';
export default function Linha({ lang, pontos, titulo }: { lang: L; pontos: Array<[string, number]>; titulo: string }) {
  if (pontos.length < 2) return null;
  const W = 640, H = 220, pl = 44, pr = 8, pt = 10, pb = 26;
  const v = pontos.map((p) => p[1]);
  const lo = Math.floor(Math.min(...v) * 10) / 10, hi = Math.ceil(Math.max(...v) * 10) / 10 || lo + 0.1;
  const x = (i: number) => pl + (i * (W - pl - pr)) / (pontos.length - 1);
  const y = (p: number) => pt + ((hi - p) * (H - pt - pb)) / (hi - lo || 1);
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  const step = Math.max(1, Math.ceil(pontos.length / 8));
  return (
    <figure className="mt-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={titulo}>
        {ticks.map((t) => <g key={t}><line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="#E2E8F0" /><text x={pl - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#475569">{nr(t, lang, 2)}</text></g>)}
        <polyline fill="none" stroke="#046A38" strokeWidth="2.5" points={pontos.map((p, i) => `${x(i)},${y(p[1])}`).join(' ')} />
        {pontos.map((p, i) => i % step === 0 || i === pontos.length - 1 ? <text key={p[0]} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#475569">{p[0].slice(5, 7)}/{p[0].slice(2, 4)}</text> : null)}
      </svg>
      <figcaption className="mt-1 text-xs text-navy-600">{titulo} · {T(lang, '€ por litro', '€ per litre')}</figcaption>
    </figure>
  );
}
