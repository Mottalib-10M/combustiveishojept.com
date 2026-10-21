/** Noms et petits utilitaires partagés par les calculateurs, sans aucune donnée (rien de lourd côté navigateur). */
import type { Fuel } from '../../lib/engine/tipos';
export type { Fuel };
export const FUEL_NOME: Record<'pt' | 'en', Record<Fuel, string>> = {
  pt: { gs: 'Gasóleo simples', ge: 'Gasóleo especial', g95: 'Gasolina simples 95', g95e: 'Gasolina especial 95', g98: 'Gasolina 98', gpl: 'GPL Auto' },
  en: { gs: 'Diesel (standard)', ge: 'Diesel (premium)', g95: 'Petrol 95 (standard)', g95e: 'Petrol 95 (premium)', g98: 'Petrol 98', gpl: 'LPG (autogas)' },
};
export const ORDEM: Fuel[] = ['gs', 'g95', 'g98', 'gpl', 'ge', 'g95e'];
export const fuelOpts = (l: 'pt' | 'en', lista: Fuel[] = ORDEM) => lista.map((f) => ({ value: f, label: FUEL_NOME[l][f] }));
export const FUEL_IDX: Fuel[] = ORDEM;
export const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
