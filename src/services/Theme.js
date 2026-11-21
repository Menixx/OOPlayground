import { bus } from './EventBus.js';

/** Farbschema der Seite: 'light' | 'dark' | 'system' (folgt der Einstellung des Betriebssystems).
 *  Das aufgelöste Schema steht als data-theme="light|dark" an <html>; die Farben dazu in variables.css.
 *  Ein kleines Inline-Skript im <head> (index.html, docs.html) setzt es schon vor dem ersten Zeichnen –
 *  ohne Aufblitzen der hellen Seite. Schlüssel und Logik dort müssen hierzu passen. */
export const MODI = ['light', 'dark', 'system'];
const SPEICHER_KEY = 'ooplayground.theme';
const SYSTEM_DUNKEL = matchMedia('(prefers-color-scheme: dark)');
const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');

function gespeicherterModus() {
  try {
    const m = localStorage.getItem(SPEICHER_KEY);
    return MODI.includes(m) ? m : 'system';
  } catch { return 'system'; }
}

let modus = gespeicherterModus();
export const getModus = () => modus;
/** Tatsächlich angezeigtes Schema ('light' oder 'dark'). */
export const getSchema = () => (modus === 'system' ? (SYSTEM_DUNKEL.matches ? 'dark' : 'light') : modus);

/** data-theme setzen; bei sichtbarem Wechsel die ganze Seite weich überblenden (wie beim Sprachwechsel). */
function anwenden({ weich }) {
  const html = document.documentElement;
  const neu = getSchema();
  const aendern = () => { html.dataset.theme = neu; };
  if (html.dataset.theme === neu) { aendern(); return; }
  if (!weich || WENIG_BEWEGUNG.matches || document.hidden) { aendern(); return; }
  if (document.startViewTransition) {
    html.classList.add('theme-wechsel'); // kürzere Überblendung als beim Sprachwechsel (base.css)
    const vt = document.startViewTransition(aendern);
    vt.finished.catch(() => {}).finally(() => html.classList.remove('theme-wechsel'));
    vt.ready.catch(() => {});
  } else {
    // ohne View Transitions: Farben per CSS-Übergang gleiten lassen (base.css)
    html.classList.add('theme-wechsel-css');
    aendern();
    setTimeout(() => html.classList.remove('theme-wechsel-css'), 320);
  }
}

function wechsle(neu, { speichern }) {
  if (!MODI.includes(neu) || neu === modus) return;
  modus = neu;
  if (speichern) {
    try { localStorage.setItem(SPEICHER_KEY, neu); } catch { /* Speicher gesperrt – gilt nur für diese Sitzung */ }
  }
  anwenden({ weich: true });
  bus.emit('theme', neu);
}

export const setModus = (neu) => wechsle(neu, { speichern: true });/** Nächster Modus im Kreis: hell → dunkel → System → hell. */
export const naechsterModus = (m = modus) => MODI[(MODI.indexOf(m) + 1) % MODI.length];

anwenden({ weich: false });
// Systemeinstellung ändert sich (z. B. abends automatisch dunkel) – nur im Modus „System“ sichtbar
SYSTEM_DUNKEL.addEventListener('change', () => { if (modus === 'system') anwenden({ weich: true }); });
// Drucken immer hell (dunkler Text auf weißem Papier)
window.addEventListener('beforeprint', () => { document.documentElement.dataset.theme = 'light'; });
window.addEventListener('afterprint', () => anwenden({ weich: false }));
// Wechsel im anderen Tab (OOPlayground ↔ Erklärung) übernehmen
window.addEventListener('storage', (e) => {
  if (e.key === SPEICHER_KEY) wechsle(MODI.includes(e.newValue) ? e.newValue : 'system', { speichern: false });
});
