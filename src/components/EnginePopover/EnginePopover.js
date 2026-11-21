import { el, L, deklaration, javaLiteral, signatur } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';
import { Motor } from '../../models/engines/Motor.js';
import { t, bindText } from '../../i18n/i18n.js';

/** key: Schlüssel der Karte (z. B. „motor:auto1“) – macht die Knöpfe für die Demonstration adressierbar. */
export function buildEngine(motor, api, key = 'motor') {
  const C = motor.constructor;
  let zeigen = false;
  const typen = Object.fromEntries(Motor.felder); // Java-Typen der Felder aus der abstrakten Klasse
  const feld = (n) => deklaration(typen[n] ?? typeof motor[n], n, javaLiteral(motor[n], typen[n]), n === 'leistung' ? C.einheit : null);
  const impl = el('ol', { class: 'impl', hidden: true }, motor.implementierung.map(([n, key]) => el('li', {}, el('code', {}, `${n.slice(1)}()  →  `, L(key)))));
  const toggle = el('button', { type: 'button', class: 'versuch', 'data-sync': `${key}:impl`, 'aria-expanded': 'false', onclick: () => { zeigen = !zeigen; impl.hidden = !zeigen; toggle.setAttribute('aria-expanded', String(zeigen)); bindText(toggle, zeigen ? 'engine.hideImpl' : 'engine.showImpl'); }, i18n: 'engine.showImpl' });
  // echter Zugriffsversuch von außen: scheitert, weil #-Methoden privat sind
  const versuch = (n) => {
    bus.emit('log', { typ: 'befehl', text: `motor['${n}']()` });
    try { motor[n](); } catch (e) { bus.emit('log', { typ: 'fehler', text: t('error.private', { methode: n, fehler: e.constructor.name }) }); }
  };
  return el('div', {},
    el('h3', {}, `class ${C.bezeichnung}`, el('small', {}, ' extends Motor')),
    el('h4', { i18n: 'card.fields' }),
    el('ul', { class: 'rows' }, Object.keys(motor).map((n) => el('li', {}, feld(n)))),
    el('h4', { i18n: 'card.methods' }),
    el('ul', { class: 'rows' },
      el('li', {}, signatur(['public'], 'void', 'starten')),
      // In Java heißen private Methoden ohne JS-Präfix „#“; der Zugriffsversuch nutzt weiter den echten #-Namen
      C.privateMethoden.map((n) => el('li', {}, signatur(['private'], 'void', n.slice(1), 'privat'),
        el('button', { type: 'button', class: 'mini', 'data-sync': `${key}:${n}`, 'data-tip': L('tip.tryAccess'), onclick: () => versuch(n), i18n: 'engine.test' })))),
    el('p', { class: 'hint', i18n: 'engine.hint', i18nParams: { methode: 'motorStarten' } }),
    toggle, impl);
}
