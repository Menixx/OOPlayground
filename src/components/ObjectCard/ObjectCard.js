import { el, fmt } from '../../utils/dom.js';
import { manager, klassenName } from '../../services/ObjectManager.js';
import { attach } from '../popover.js';
import { buildEngine } from '../EnginePopover/EnginePopover.js';

export function buildObjectCard(id, obj, api) {
  const cls = obj.constructor, parent = Object.getPrototypeOf(cls);
  const felder = [...parent.felder.map(([n, t]) => [n, t, 'geerbt']), ...cls.eigeneFelder.map((n) => [n, typeof obj[n], 'eigen'])];
  const wert = (n) => {
    const v = obj[n];
    if (v && typeof v === 'object') { // Referenz auf ein Motor-Objekt -> verschachtelte Karte
      const b = el('button', { type: 'button', class: 'link' }, v.constructor.bezeichnung);
      attach(b, { parent: api, build: (eapi) => buildEngine(v, eapi) });
      return b;
    }
    return el('code', {}, fmt(n, v));
  };
  const methoden = parent.methoden.map(([n]) => [n, Object.hasOwn(cls.prototype, n) ? ['überschrieben', 'ueber'] : ['geerbt', 'geerbt']]);
  return el('div', {},
    el('h3', {}, `class: ${klassenName(cls)}`, el('small', {}, ` ${id}`)),
    el('h4', {}, 'Felder'),
    el('ul', { class: 'rows' }, felder.map(([n, t, art]) =>
      el('li', {}, el('span', { class: 'feld' }, n), el('span', { class: 'typ' }, `: ${t} = `), wert(n), el('span', { class: `tag ${art}` }, art)))),
    el('h4', {}, 'Methoden'),
    el('ul', { class: 'rows' }, methoden.map(([n, [label, k]]) =>
      el('li', {}, el('span', { class: 'methode' }, `${n}()`), el('span', { class: `tag ${k}` }, label),
        el('button', { type: 'button', class: 'run', 'data-tip': 'Ausführen', onclick: () => manager.aufrufen(id, n) }, 'Ausführen')))));
}
