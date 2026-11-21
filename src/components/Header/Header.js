import { el, L } from '../../utils/dom.js';
import { langToggle } from '../LangToggle/LangToggle.js';
import { themeToggle } from '../ThemeToggle/ThemeToggle.js';
import { headerMenu } from '../HeaderMenu/HeaderMenu.js';

const SVG = 'http://www.w3.org/2000/svg';

/** Aufgeschlagenes Buch – Symbol des Erklärungs-Links. */
function buchIcon() {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'head-link-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">'
    + '<path d="M10 5.5Q8 3.4 5 3V13.3Q8 13.6 10 16.5Q12 13.6 15 13.3V3Q12 3.4 10 5.5V16.5"/>' // Seiten + Buchrücken
    + '<path d="M5 5.2H2.75V15.3Q7 15.3 10 17Q13 15.3 17.25 15.3V5.2H15"/></g>'; // Einband
  return svg;
}

/** Link zur Erklärungsseite (öffnet in neuem Tab). */
function docsLink() {
  return el('a', {
    class: 'head-link docs-link', href: './docs.html', target: '_blank', rel: 'noopener',
    title: L('header.docsTip'), 'aria-label': L('header.docsTip')
  }, buchIcon(), el('span', { class: 'head-link-text', i18n: 'header.docs' }));
}

export function mountHeader(root) {
  root.append(el('h1', {}, 'OOPlayground'), ...headerMenu(themeToggle(), langToggle(), docsLink()), el('p', { i18n: 'header.subtitle' }));
}
