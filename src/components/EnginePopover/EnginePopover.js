import { el, deklaration, javaWert, signatur } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';
import { Motor } from '../../models/engines/Motor.js';

export function buildEngine(motor, api) {
  const C = motor.constructor;
  let zeigen = false;
  const typen = Object.fromEntries(Motor.felder); // Java-Typen der Felder aus der abstrakten Klasse
  const feld = (n) => deklaration(typen[n] ?? typeof motor[n], n, el('code', {}, javaWert(motor[n], typen[n])), n === 'leistung' ? C.einheit : null);
  const impl = el('ol', { class: 'impl', hidden: true }, motor.implementierung.map((s) => el('li', {}, el('code', {}, s.replaceAll('#', '')))));
  const toggle = el('button', { type: 'button', class: 'versuch', onclick: () => { zeigen = !zeigen; impl.hidden = !zeigen; toggle.textContent = zeigen ? 'Implementierung ausblenden' : 'Implementierung anzeigen'; } }, 'Implementierung anzeigen');
  // echter Zugriffsversuch von außen: scheitert, weil #-Methoden privat sind
  const versuch = (n) => {
    bus.emit('log', { typ: 'befehl', text: `motor['${n}']()` });
    try { motor[n](); } catch (e) { bus.emit('log', { typ: 'fehler', text: `Zugriff verweigert – ${n} ist privat. (${e.constructor.name})` }); }
  };
  return el('div', {},
    el('h3', {}, `class ${C.bezeichnung}`, el('small', {}, ' extends Motor')),
    el('h4', {}, 'Felder'),
    el('ul', { class: 'rows' }, Object.keys(motor).map((n) => el('li', {}, feld(n)))),
    el('h4', {}, 'Methoden'),
    el('ul', { class: 'rows' },
      el('li', {}, signatur(['public'], 'void', 'starten')),
      // In Java heißen private Methoden ohne JS-Präfix „#“; der Zugriffsversuch nutzt weiter den echten #-Namen
      C.privateMethoden.map((n) => el('li', {}, signatur(['private'], 'void', n.slice(1), 'privat'),
        el('button', { type: 'button', class: 'mini', 'data-tip': 'Zugriff von außen versuchen', onclick: () => versuch(n) }, 'testen')))),
    el('p', { class: 'hint' }, 'Aufgerufen wird nur motorStarten() am Transportobjekt.'),
    toggle, impl);
}
