import { el, L, deklaration, javaLiteral, einheit, signatur } from '../../utils/dom.js';
import { manager, klassenName } from '../../services/ObjectManager.js';
import { attach } from '../popover.js';
import { buildEngine } from '../EnginePopover/EnginePopover.js';

export function buildObjectCard(id, obj, api) {
  const cls = obj.constructor, parent = Object.getPrototypeOf(cls);
  const felder = [...parent.felder.map(([n, t]) => [n, t, 'geerbt']), ...cls.eigeneFelder.map(([n, t]) => [n, t, 'eigen'])];
  const wert = (n, t) => {
    const v = obj[n];
    if (v && typeof v === 'object') { // Referenz auf ein Motor-Objekt -> verschachtelte Karte
      const b = el('button', { type: 'button', class: 'link' }, v.constructor.bezeichnung);
      attach(b, { parent: api, klasse: 'pop-motor', key: `motor:${id}`, build: (eapi) => buildEngine(v, eapi, `motor:${id}`) });
      return b;
    }
    return javaLiteral(v, t);
  };
  const methoden = parent.methoden.map(([n]) => [n, Object.hasOwn(cls.prototype, n) ? 'ueber' : 'geerbt']);
  return el('div', {},
    el('h3', {}, `class ${klassenName(cls)}`, el('small', {}, ` ${id}`)),
    el('h4', { i18n: 'card.fields' }),
    el('ul', { class: 'rows' }, felder.map(([n, t, art]) =>
      el('li', {}, deklaration(t, n, wert(n, t), einheit(n)), el('span', { class: `tag ${art}`, i18n: `tag.${art}` })))),
    el('h4', { i18n: 'card.methods' }),
    el('ul', { class: 'rows' }, methoden.map(([n, k]) =>
      el('li', {}, signatur(['public'], 'void', n), el('span', { class: `tag ${k}`, i18n: `tag.${k}` }),
        el('button', { type: 'button', class: 'run', 'data-tip': L('tip.run'), onclick: () => { try { manager.aufrufen(id, n); } catch { /* bereits protokolliert */ } }, i18n: 'card.run' })))),
    el('button', { type: 'button', class: 'loeschen', onclick: () => manager.loeschen(id) }, `${id} = null`));
}
