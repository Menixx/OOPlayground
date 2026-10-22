import { el } from '../../utils/dom.js';
import { icon } from '../../icons.js';
import { manager } from '../../services/ObjectManager.js';

export function buildClassPopover(g) {
  return el('div', {},
    el('h3', {}, `abstract class: ${g.name}`),
    el('h4', {}, 'Felder'),
    el('ul', { class: 'rows' }, g.cls.felder.map(([n, t, d]) =>
      el('li', {}, el('span', { class: 'feld' }, n), el('span', { class: 'typ' }, `: ${t} = `), el('code', {}, d)))),
    el('h4', {}, 'Methoden'),
    el('ul', { class: 'rows' }, g.cls.methoden.map(([n, abs]) =>
      el('li', {}, el('span', { class: abs ? 'abstrakt' : 'methode' }, `${n}()`),
        el('span', { class: `tag ${abs ? 'abstract' : 'impl'}` }, abs ? 'abstract' : 'implemented')))),
    el('h4', {}, 'Erben'),
    el('div', { class: 'erben' }, g.kinder.map(([n, c]) =>
      el('button', { type: 'button', class: 'erbe', 'data-tip': 'Instanziieren', onclick: (e) => { e.stopPropagation(); manager.erstellen(c); } }, icon(n), n))),
    el('button', { type: 'button', class: 'versuch', 'data-tip': 'Direkt instanziieren (verboten)', onclick: () => manager.versuchen(g.cls) }, `new ${g.name}()`));
}
