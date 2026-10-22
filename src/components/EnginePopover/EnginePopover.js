import { el } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';

export function buildEngine(motor, api) {
  const C = motor.constructor;
  let zeigen = false;
  const wert = (n) => (n === 'leistung' ? `${motor[n]} ${C.einheit}` : n === 'laeuft' ? String(motor[n]) : `"${motor[n]}"`);
  const impl = el('ol', { class: 'impl', hidden: true }, motor.implementierung.map((s) => el('li', {}, el('code', {}, s))));
  const toggle = el('button', { type: 'button', class: 'versuch', onclick: () => { zeigen = !zeigen; impl.hidden = !zeigen; toggle.textContent = zeigen ? 'Implementierung ausblenden' : 'Implementierung anzeigen'; } }, 'Implementierung anzeigen');
  // echter Zugriffsversuch von außen: scheitert, weil #-Methoden privat sind
  const versuch = (n) => {
    bus.emit('log', { typ: 'befehl', text: `motor['${n}']()` });
    try { motor[n](); } catch (e) { bus.emit('log', { typ: 'fehler', text: `Zugriff verweigert – ${n} ist privat. (${e.constructor.name})` }); }
  };
  return el('div', {},
    el('h3', {}, `class: ${C.bezeichnung}`, el('small', {}, ' extends Motor')),
    el('h4', {}, 'Felder'),
    el('ul', { class: 'rows' }, Object.keys(motor).map((n) => el('li', {}, el('span', { class: 'feld' }, n), ': ', el('code', {}, wert(n))))),
    el('h4', {}, 'Methoden'),
    el('ul', { class: 'rows' },
      el('li', {}, el('span', { class: 'methode' }, 'starten()'), el('span', { class: 'tag eigen' }, 'public')),
      C.privateMethoden.map((n) => el('li', {}, el('span', { class: 'privat' }, `${n}()`),
        el('span', { class: 'tag' }, 'private'),
        el('button', { type: 'button', class: 'mini', 'data-tip': 'Zugriff von außen versuchen', onclick: () => versuch(n) }, 'testen')))),
    el('p', { class: 'hint' }, 'Aufgerufen wird nur motorStarten() am Transportobjekt.'),
    toggle, impl);
}
