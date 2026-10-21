import raw from '../data/params-2026.json';
export const P = raw;
export type Params = typeof P;
export type SourceKey = keyof typeof raw.sources;
