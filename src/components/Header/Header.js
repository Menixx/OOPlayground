import { el, L } from '../../utils/dom.js';
import { langToggle } from '../LangToggle/LangToggle.js';

const SVG = 'http://www.w3.org/2000/svg';

/** Buch mit Lesezeichen – Symbol des Erklärungs-Links. */
function buchIcon() {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'head-link-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">'
    + '<path d="M4.75 15.25V4.5A1.75 1.75 0 0 1 6.5 2.75h8.75v12.5H6.5a1.75 1.75 0 0 0 0 3.5h8.75v-3.5"/>'
    + '<path d="M9.5 2.75v5.5l1.75-1.4L13 8.25v-5.5"/></g>';
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
  root.append(el('h1', {}, 'OOPlayground'), docsLink(), langToggle(), el('p', { i18n: 'header.subtitle' }));
}
