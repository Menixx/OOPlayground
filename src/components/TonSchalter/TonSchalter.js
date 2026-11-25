import { el } from '../../utils/dom.js';
import { bindAttr } from '../../i18n/i18n.js';
import { bus } from '../../services/EventBus.js';
import { istStumm, setStumm } from '../../services/Ton.js';

// Lautsprecher; je nach Zustand mit Schallwellen (Ton an) oder durchgestrichen (stumm)
const SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  <g class="ton-wellen" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M15.2 9.2a4 4 0 0 1 0 5.6"/><path d="M17.8 6.8a7.4 7.4 0 0 1 0 10.4"/>
  </g>
  <g class="ton-aus" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>
  </g>
</svg>`;

/** Runder Knopf „Ton aus/an“. Aktiv (gedrückt) = stumm – so startet die Seite.
 *  Desktop/Tablet: unten rechts im Fenster; Mobil: im Menü der Kopfzeile, unten rechts (header-controls.css). */
export function tonSchalter() {
  const b = el('button', { type: 'button', class: 'ton-btn', 'data-sync': 'ton:umschalten', onclick: () => setStumm(!istStumm()) });
  b.innerHTML = SVG;
  const zeigen = () => {
    const s = istStumm();
    b.setAttribute('aria-pressed', String(s));
    b.classList.toggle('stumm', s);
    const key = s ? 'ton.einschalten' : 'ton.ausschalten';
    bindAttr(b, 'aria-label', key);
    bindAttr(b, 'data-tip', key);
  };
  bus.on('ton', zeigen);
  zeigen();
  return b;
}
