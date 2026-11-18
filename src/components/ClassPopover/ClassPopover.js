import { el, L, deklaration, javaLiteral, signatur } from '../../utils/dom.js';
import { icon } from '../../icons.js';
import { manager } from '../../services/ObjectManager.js';

export function buildClassPopover(g) {
  return el('div', {},
    el('h3', {}, `abstract class ${g.name}`),
    el('h4', { i18n: 'card.fields' }),
    el('ul', { class: 'rows' }, g.cls.felder.map(([n, t, d]) =>
      el('li', {}, deklaration(t, n, d && (/^".*"$/.test(d) ? javaLiteral(d.slice(1, -1), t) : el('code', {}, d)))))),
    el('h4', { i18n: 'card.methods' }),
    el('ul', { class: 'rows' }, g.cls.methoden.map(([n, abs]) =>
      el('li', {}, abs ? signatur(['public', 'abstract'], 'void', n, 'abstrakt', ';') : signatur(['public'], 'void', n, 'methode', ' { … }'),
        el('span', { class: `tag ${abs ? 'abstract' : 'impl'}`, i18n: abs ? 'tag.abstract' : 'tag.impl' })))),
    el('h4', { i18n: 'card.subclasses' }),
    el('div', { class: 'erben' }, g.kinder.map(([n, c]) =>
      el('button', { type: 'button', class: 'erbe', 'data-tip': L('tip.instantiate'), onclick: (e) => { e.stopPropagation(); manager.erstellen(c); } }, icon(n), n))),
    el('button', { type: 'button', class: 'versuch', 'data-tip': L('tip.instantiateDirect'), onclick: () => manager.versuchen(g.cls) }, `new ${g.name}()`));
}
