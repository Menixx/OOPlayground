import { el, L } from '../../utils/dom.js';
import { getSprache, setSprache, SPRACHEN } from '../../i18n/i18n.js';
import { bus } from '../../services/EventBus.js';

/** Sprachumschalter: zwei Hälften (EN | DE), der Schieber gleitet zur aktiven Sprache.
 *  Wird im OOPlayground (Kopfzeile) und auf der Erklärungsseite benutzt. */
export function langToggle() {
  const opt = (l) => el('span', { class: 'lang-opt', 'data-l': l }, l.toUpperCase());
  const btn = el('button', {
    type: 'button', class: 'lang-toggle', role: 'switch', 'aria-label': L('lang.toggle'), title: L('lang.toggle'),
    onclick: (e) => {
      // Klick auf eine Hälfte wählt diese Sprache, sonst (Tastatur) umschalten
      const ziel = e.target.closest('.lang-opt')?.dataset.l ?? SPRACHEN.find((l) => l !== getSprache());
      setSprache(ziel);
    }
  }, el('span', { class: 'lang-thumb', 'aria-hidden': 'true' }), SPRACHEN.map(opt));
  function zeigen() {
    const l = getSprache();
    btn.dataset.lang = l;
    btn.setAttribute('aria-checked', String(l === 'en'));
  }
  zeigen();
  bus.on('sprache', zeigen);
  return btn;
}
