import { bus } from './EventBus.js';
import { Tier } from '../models/abstract/Tier.js';
import { Transport } from '../models/abstract/Transport.js';
import { Figur } from '../models/abstract/Figur.js';
import { Katze } from '../models/animals/Katze.js';
import { Krokodil } from '../models/animals/Krokodil.js';
import { Mensch } from '../models/animals/Mensch.js';
import { Auto } from '../models/transport/Auto.js';
import { Flugzeug } from '../models/transport/Flugzeug.js';
import { Zug } from '../models/transport/Zug.js';
import { Dreieck } from '../models/figures/Dreieck.js';
import { Kreis } from '../models/figures/Kreis.js';
import { Stern } from '../models/figures/Stern.js';

export const KLASSEN = [
  { name: 'Tier', cls: Tier, kinder: [['Katze', Katze], ['Krokodil', Krokodil], ['Mensch', Mensch]] },
  { name: 'Transport', cls: Transport, kinder: [['Auto', Auto], ['Flugzeug', Flugzeug], ['Zug', Zug]] },
  { name: 'Figur', cls: Figur, kinder: [['Dreieck', Dreieck], ['Kreis', Kreis], ['Stern', Stern]] }
];
const NAMEN = new Map(KLASSEN.flatMap((g) => [[g.cls, g.name], ...g.kinder.map(([n, c]) => [c, n])]));
export const klassenName = (cls) => NAMEN.get(cls) ?? cls.name;

const log = (typ, text) => bus.emit('log', { typ, text });

export class ObjectManager {
  #objekte = new Map(); // id -> echte JS-Instanz
  #zaehler = {};

  get alle() { return [...this.#objekte].map(([id, obj]) => ({ id, obj })); }
  get kannBewegen() { return this.alle.some(({ obj }) => obj instanceof Tier || obj instanceof Transport); }

  erstellen(cls) {
    const key = klassenName(cls).toLowerCase();
    try {
      const obj = new cls();
      this.#zaehler[key] = (this.#zaehler[key] ?? 0) + 1;
      const id = key + this.#zaehler[key];
      this.#objekte.set(id, obj);
      log('info', `Objekt ${id} wurde erstellt.`);
      bus.emit('created', { id, obj });
      return id;
    } catch (e) { log('fehler', e.message); }
  }

  // Demonstration: abstrakte Klassen lassen sich nicht instanziieren
  versuchen(cls) {
    log('befehl', `new ${klassenName(cls)}()`);
    try { new cls(); } catch (e) { log('fehler', e.message); }
  }

    aufrufen(id, methode) {
    const obj = this.#objekte.get(id);
    log('befehl', `${id}.${methode}()`);
    try {
      log('ergebnis', obj[methode]());
      bus.emit('called', { id, methode });   // Animation anstoßen
    } catch (e) { log('fehler', e.message); }
    bus.emit('changed', { id });
  }

  // Polymorphie: ein Aufruf, viele Implementierungen – keine Prüfung auf konkrete Klassen
  alleBewegen() {
    log('befehl', 'Alle bewegen');
    this.alle
      .filter(({ obj }) => obj instanceof Tier || obj instanceof Transport)
      .forEach(({ id, obj }) => {
        log('ergebnis', `${id}: ${obj.bewegen()}.`);
        bus.emit('called', { id, methode: 'bewegen' });  
      });
  }

    // Objekt freigeben: Referenz entfernen (= null)
  loeschen(id) {
    const obj = this.#objekte.get(id);
    if (!obj) return;
    this.#objekte.delete(id);
    // Gibt es keine Instanz dieser Klasse mehr, beginnt die Nummerierung wieder bei 1
    const key = klassenName(obj.constructor).toLowerCase();
    const uebrig = [...this.#objekte.values()].some((o) => klassenName(o.constructor).toLowerCase() === key);
    if (!uebrig) delete this.#zaehler[key];
    log('befehl', `${id} = null`);
    log('ergebnis', `Objekt ${id} wurde gelöscht.`);
    bus.emit('deleted', { ids: [id] });
  }

  alleLoeschen() {
    if (!this.#objekte.size) return;
    const ids = [...this.#objekte.keys()];
    this.#objekte.clear();
    this.#zaehler = {};                      // alle Nummern beginnen wieder bei 1
    log('befehl', 'Alle löschen');
    log('ergebnis', `${ids.length} Objekt(e) wurden gelöscht.`);
    bus.emit('deleted', { ids });
  }
}
export const manager = new ObjectManager();
bus.on('created', () => bus.emit('changed', {}));
