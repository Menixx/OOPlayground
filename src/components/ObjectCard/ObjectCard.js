import { el, L, deklaration, javaLiteral, einheit, signatur } from '../../utils/dom.js';
import { manager, klassenName, argText } from '../../services/ObjectManager.js';
import { bus } from '../../services/EventBus.js';
import { attach } from '../popover.js';
import { buildEngine } from '../EnginePopover/EnginePopover.js';

// Eingegebene Argumente bleiben erhalten, wenn die Karte neu gezeichnet wird: "katze1.essen" -> ["5"]
const eingaben = new Map();
bus.on('deleted', ({ ids }) => { for (const k of [...eingaben.keys()]) if (ids.includes(k.split('.')[0])) eingaben.delete(k); });

/** Text aus dem Eingabefeld -> Argument. Leer = Standardwert; "ewig" auch ohne Anführungszeichen.
 *  Ungültige Werte werden durchgereicht – die Methode selbst prüft sie und meldet den Fehler. */
function lesen(text, typ, standard) {
  const s = text.trim();
  if (s === '') return standard;
  const zahl = Number(s.replace(',', '.'));
  if (typ === 'int') return Number.isNaN(zahl) ? s : zahl;
  const str = s.match(/^"(.*)"$/);
  if (str) return str[1];
  return Number.isNaN(zahl) ? s : zahl;
}

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
  const methoden = parent.methoden.map(([n, , p = []]) => [n, Object.hasOwn(cls.prototype, n) ? 'ueber' : 'geerbt', p]);

  /** Zeile einer Methode: Signatur mit Eingabefeldern für die Argumente, Abzeichen und „Ausführen“. */
  const methodenZeile = ([n, k, parameter]) => {
    const schluessel = `${id}.${n}`;
    const gemerkt = eingaben.get(schluessel) ?? [];
    const breite = (f) => { f.style.width = `${Math.max(2, f.value.length) + 1}ch`; }; // Feld wächst mit dem Text
    const felderEin = parameter.map(([typ, pn, std], i) => {
      const f = el('input', {
        class: 'arg', type: 'text', inputmode: typ === 'int' ? 'numeric' : 'text', spellcheck: 'false', autocomplete: 'off',
        value: gemerkt[i] ?? argText(std), 'aria-label': `${pn} (${typ})`,
        'data-tip': L(pn === 'dauer' ? 'tip.dauer' : 'tip.anzahl'), 'data-sync': `arg:${schluessel}:${i}`,
        oninput: (e) => { breite(e.target); const neu = [...(eingaben.get(schluessel) ?? [])]; neu[i] = e.target.value; eingaben.set(schluessel, neu); },
        onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); ausfuehren(); } }
      });
      breite(f);
      return f;
    });
    const ausfuehren = () => {
      const args = parameter.map(([typ, , std], i) => lesen(felderEin[i].value, typ, std));
      try { manager.aufrufen(id, n, args); } catch { /* bereits protokolliert */ }
    };
    return el('li', {}, signatur(['public'], 'void', n, 'methode', '', parameter, (i) => felderEin[i]),
      el('span', { class: 'zeilen-ende' }, // Abzeichen und Knopf bleiben beim Umbrechen zusammen
        el('span', { class: `tag ${k}`, i18n: `tag.${k}` }),
        el('button', { type: 'button', class: 'run', 'data-tip': L('tip.run'), onclick: ausfuehren, i18n: 'card.run' })));
  };

  return el('div', {},
    el('h3', {}, `class ${klassenName(cls)}`, el('small', {}, ` ${id}`)),
    el('h4', { i18n: 'card.fields' }),
    el('ul', { class: 'rows' }, felder.map(([n, t, art]) =>
      el('li', {}, deklaration(t, n, wert(n, t), einheit(n)), el('span', { class: `tag ${art}`, i18n: `tag.${art}` })))),
    el('h4', { i18n: 'card.methods' }),
    el('ul', { class: 'rows' }, methoden.map(methodenZeile)),
    el('button', { type: 'button', class: 'loeschen', onclick: () => manager.loeschen(id) }, `${id} = null`));
}
