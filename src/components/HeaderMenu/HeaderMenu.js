import { el } from '../../utils/dom.js';
import { bindAttr } from '../../i18n/i18n.js';

const SVG = 'http://www.w3.org/2000/svg';
const MOBIL = matchMedia('(max-width: 600px)'); // Mobil-Breakpoint des OOPlayground
let zaehler = 0;

function punkteIcon() { // drei Punkte untereinander („mehr“)
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'head-menu-icon head-menu-icon-open');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<g fill="currentColor"><circle cx="10" cy="4.5" r="1.8"/><circle cx="10" cy="10" r="1.8"/><circle cx="10" cy="15.5" r="1.8"/></g>';
  return svg;
}

/** Bedienelemente der Kopfzeile (Sprachumschalter, Link zur anderen Seite).
 *  Desktop/Tablet: stehen ganz normal in der Kopfzeile (der Behälter ist display: contents).
 *  Mobil (≤ 600px): ein Knopf an ihrer Stelle; beim Öffnen gleiten die Elemente von rechts herein,
 *  dahinter ein halbdurchsichtiger Hintergrund. Gibt [Behälter, Knopf, Hintergrund] zurück. */
export function headerMenu(...items) {
  const id = `head-menu-${++zaehler}`;
  const box = el('div', { class: 'head-menu', id }, items);
  const backdrop = el('div', { class: 'head-menu-backdrop', 'aria-hidden': 'true', onclick: () => schliessen() });
  const btn = el('button', {
    type: 'button', class: 'head-menu-btn', 'aria-controls': id, 'aria-expanded': 'false',
    onclick: () => (offen() ? schliessen() : oeffnen())
  }, punkteIcon(), el('span', { class: 'head-menu-icon head-menu-icon-close', 'aria-hidden': 'true' }, '×'));
  bindAttr(btn, 'aria-label', 'header.menu');
  bindAttr(btn, 'title', 'header.menu');

  const offen = () => box.classList.contains('open');
  function setzen(an) {
    box.classList.toggle('open', an);
    backdrop.classList.toggle('open', an);
    btn.setAttribute('aria-expanded', String(an));
  }
  function oeffnen() {
    // Elemente direkt unter dem Knopf, rechtsbündig mit ihm
    const r = btn.getBoundingClientRect();
    box.style.setProperty('--menu-top', `${Math.round(r.bottom + 12)}px`);
    box.style.setProperty('--menu-right', `${Math.round(innerWidth - r.right)}px`);
    setzen(true);
    box.querySelector('button, a')?.focus({ preventScroll: true });
  }
  function schliessen({ fokus = true } = {}) {
    if (!offen()) return;
    setzen(false);
    if (fokus && box.contains(document.activeElement)) btn.focus({ preventScroll: true });
  }

  box.addEventListener('click', (e) => { if (e.target.closest('a')) schliessen({ fokus: false }); }); // Link öffnet neuen Tab
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && offen()) { e.preventDefault(); schliessen(); } });
  MOBIL.addEventListener('change', () => { if (!MOBIL.matches) schliessen({ fokus: false }); });
  return [box, btn, backdrop];
}
