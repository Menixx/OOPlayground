import { t } from '../i18n/i18n.js';

// Parameter der Methoden (für Tier und Transport gleich).
//  - dauer:  generischer Parameter T – eine Zahl (Sekunden) oder der String "ewig"
//  - anzahl: int – wie oft ein Laut wiederholt wird
export const EWIG = 'ewig';

const text = (v) => (typeof v === 'string' ? `"${v}"` : String(v));

/** Prüft die Dauer wie ein Java-Programm seine Argumente: gibt Sekunden (> 0) oder EWIG zurück. */
export function dauerPruefen(dauer) {
  if (dauer === EWIG) return EWIG;
  if (typeof dauer === 'number' && Number.isFinite(dauer) && dauer > 0) return dauer;
  throw new Error(t('error.dauer', { wert: text(dauer) }));
}

/** Prüft die Anzahl der Wiederholungen: ganze Zahl ≥ 1. */
export function anzahlPruefen(anzahl) {
  if (Number.isInteger(anzahl) && anzahl >= 1) return anzahl;
  throw new Error(t('error.anzahl', { wert: text(anzahl) }));
}

/** Laut n-mal hintereinander (ab 6 Wiederholungen gekürzt): „Miau! Miau! Miau!“ */
export function lautWiederholen(laut, anzahl) {
  const n = Math.min(anzahl, 5);
  return Array(n).fill(laut).join(' ') + (anzahl > n ? ` … (×${anzahl})` : '');
}
