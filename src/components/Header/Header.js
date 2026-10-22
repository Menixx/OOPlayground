import { el } from '../../utils/dom.js';
export function mountHeader(root) {
  root.append(el('h1', {}, 'OOP Playground'), el('span', { class: 'badge', title: 'Deutsch' }, 'DE'),
    el('p', {}, 'Interaktive Einführung in die objektorientierte Programmierung'));
}
