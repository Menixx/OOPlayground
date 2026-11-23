// QR-Code-Fenster des Bildschirms: Link für das Pult (mit Raumcode) zum Scannen mit dem Telefon.
// Halbtransparenter dunkler Hintergrund, in der Mitte ein Block mit QR-Code, Link und Raumcode; × schließt.
import qrcode from 'qrcode-generator';
import { el } from '../utils/dom.js';
import { t } from '../i18n/i18n.js';

const RAND = 4; // Ruhezone um den Code (in Modulen) – nötig zum sicheren Scannen

/** QR-Code als SVG: schwarze Module auf weißem Grund (auch im dunklen Thema gut lesbar). */
function qrSvg(text) {
  const qr = qrcode(0, 'M'); // Größe automatisch, mittlere Fehlerkorrektur
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x + RAND},${y + RAND}h1v1h-1z`;
  const g = n + 2 * RAND;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${g} ${g}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', text);
  svg.innerHTML = `<rect width="${g}" height="${g}" fill="#fff"/><path d="${d}" fill="#000"/>`;
  return svg;
}

let backdrop = null;
let daten = null;      // { url, raum, gesperrt, umschalten }
let vorherFokus = null;

export const qrOffen = () => Boolean(backdrop);

function zeichnen() {
  const zu = el('button', { type: 'button', class: 'sync-qr-zu', 'aria-label': t('sync.schliessen'), title: t('sync.schliessen'), onclick: schliesseQr },
    el('span', { 'aria-hidden': 'true' }, '×'));
  const box = el('div', { class: 'sync-qr', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sync-qr-titel' },
    zu,
    el('h2', { id: 'sync-qr-titel', class: 'sync-qr-titel' }, t('sync.qrTitel')),
    el('p', { class: 'sync-qr-hinweis' }, t('sync.qrHinweis')),
    el('div', { class: 'sync-qr-bild' }, qrSvg(daten.url)),
    el('div', { class: 'sync-qr-zeile' }, el('span', { class: 'sync-qr-label' }, t('sync.qrLink')), el('code', { class: 'sync-qr-url' }, daten.url)),
    el('div', { class: 'sync-qr-zeile' }, el('span', { class: 'sync-qr-label' }, t('sync.qrCode')), el('b', { class: 'sync-qr-raum' }, daten.raum)),
    daten.umschalten && el('div', { class: 'sync-qr-sperre' },
      el('p', {}, t(daten.gesperrt ? 'sync.sperreAn' : 'sync.sperreAus')),
      el('button', { type: 'button', class: 'sync-qr-sperrknopf', onclick: daten.umschalten },
        t(daten.gesperrt ? 'sync.entsperren' : 'sync.sperren'))));
  backdrop.replaceChildren(box);
  return zu;
}

/** Escape schließt nur das Fenster (Capture: vor den Karten, die sonst ebenfalls schließen würden). */
function taste(e) {
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); schliesseQr(); return; }
  if (e.key === 'Tab') { // Fokus bleibt im Fenster
    const f = [...backdrop.querySelectorAll('button')];
    const i = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
  }
}

/** Fenster öffnen bzw. (wenn schon offen) mit neuen Daten aktualisieren. */
export function zeigeQr({ url, raum, gesperrt = false, umschalten = null }) {
  const neu = !backdrop;
  const fokusSperre = document.activeElement?.classList?.contains('sync-qr-sperrknopf');
  daten = { url, raum, gesperrt, umschalten };
  if (neu) {
    vorherFokus = document.activeElement;
    backdrop = el('div', { class: 'sync-qr-backdrop', 'data-kein-schliessen': '' });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) schliesseQr(); });
    document.body.append(backdrop);
    window.addEventListener('keydown', taste, true);
  }
  const zu = zeichnen();
  if (neu) zu.focus({ preventScroll: true });
  else if (fokusSperre) backdrop.querySelector('.sync-qr-sperrknopf')?.focus({ preventScroll: true }); // Fokus bleibt nach dem Umschalten
}

export function schliesseQr() {
  if (!backdrop) return;
  window.removeEventListener('keydown', taste, true);
  backdrop.remove();
  backdrop = null;
  // Fokus nicht zurück auf die Statusleiste setzen – sonst bleibt sie markiert (blauer Rahmen)
  if (vorherFokus && !vorherFokus.closest?.('.sync-badge')) vorherFokus.focus?.({ preventScroll: true });
  else document.activeElement?.blur?.();
  vorherFokus = null;
}

/** Sprachwechsel: Texte neu zeichnen. */
export function qrNeuZeichnen() { if (backdrop) zeichnen(); }
