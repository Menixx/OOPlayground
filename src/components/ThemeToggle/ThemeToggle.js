import { el } from '../../utils/dom.js';
import { bindAttr } from '../../i18n/i18n.js';
import { getModus, setModus, naechsterModus, MODI } from '../../services/Theme.js';
import { bus } from '../../services/EventBus.js';

const SVG = 'http://www.w3.org/2000/svg';

/** Symbole der drei Modi, alle 20×20, nur Linien (currentColor). */
const SYMBOLE = {
  // Sonne: Kreis mit acht Strahlen
  light: '<circle cx="10" cy="10" r="3.6"/>'
    + '<path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.42 1.42M14.38 14.38l1.42 1.42M4.2 15.8l1.42-1.42M14.38 5.62l1.42-1.42"/>',
  // Mond: Sichel
  dark: '<path d="M10 2.5a5 5 0 0 0 7.5 7.5 7.5 7.5 0 1 1-7.5-7.5Z"/>',
  // System: Bildschirm, darin halb Sonne/halb Mond (halb gefüllter Kreis)
  system: '<rect x="2.4" y="3.4" width="15.2" height="10.4" rx="1.8"/><path d="M7 17h6M10 13.8V17"/>'
    + '<circle cx="10" cy="8.6" r="2.6"/><path d="M10 6v5.2A2.6 2.6 0 0 0 10 6Z" fill="currentColor" stroke="none"/>'
};

function symbol(modus) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'theme-icon');
  svg.dataset.m = modus;
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${SYMBOLE[modus]}</g>`;
  return svg;
}

/** Runder Umschalter für das Farbschema: hell (Sonne) → dunkel (Mond) → System (Bildschirm) → hell.
 *  Das Symbol zeigt den aktuellen Modus; Tooltip und Beschriftung nennen ihn und den nächsten.
 *  Wird im OOPlayground (Kopfzeile) und auf der Erklärungsseite benutzt. */
export function themeToggle() {
  const btn = el('button', {
    type: 'button', class: 'theme-toggle', onclick: () => setModus(naechsterModus())
  }, MODI.map(symbol));
  function zeigen() {
    const m = getModus();
    btn.dataset.mode = m;
    bindAttr(btn, 'aria-label', `theme.${m}`);
    bindAttr(btn, 'title', `theme.${m}`);
  }
  zeigen();
  bus.on('theme', zeigen);
  return btn;
}
