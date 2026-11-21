import { bus } from './EventBus.js';
import { t } from '../i18n/i18n.js';
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
const KINDKLASSEN = new Map(KLASSEN.flatMap((g) => g.kinder));
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
      log('info', t('log.created', { id }));
      bus.emit('created', { id, obj });
      return id;
    } catch (e) { log('fehler', e.message); }
  }

  // Demonstration: abstrakte Klassen lassen sich nicht instanziieren
  versuchen(cls) {
    log('befehl', `new ${klassenName(cls)}()`);
    try { new cls(); } catch (e) { log('fehler', e.message); }
  }

  /** Ruft eine öffentliche Methode auf. Gibt das Ergebnis zurück oder wirft den Fehler weiter
   *  (der Sync-Bridge baut daraus seinen ack); protokolliert wird beides wie bisher. */
  aufrufen(id, methode) {
    const obj = this.#objekte.get(id);
    log('befehl', `${id}.${methode}()`);
    try {
      if (!obj) throw new Error(t('error.noObject', { id }));
      const erlaubt = Object.getPrototypeOf(obj.constructor).methoden?.some(([n]) => n === methode);
      if (!erlaubt || typeof obj[methode] !== 'function') throw new Error(t('error.noMethod', { methode }));
      const ergebnis = obj[methode]();
      log('ergebnis', ergebnis);
      bus.emit('called', { id, methode, ergebnis });   // Animation anstoßen (und Pult: Ereignis senden)
      return ergebnis;
    } catch (e) {
      log('fehler', e.message);
      throw e;
    } finally {
      bus.emit('changed', { id });
    }
  }

  // Polymorphie: ein Aufruf, viele Implementierungen – keine Prüfung auf konkrete Klassen
  alleBewegen() {
    log('befehl', t('workspace.moveAll'));
    this.alle
      .filter(({ obj }) => obj instanceof Tier || obj instanceof Transport)
      .forEach(({ id, obj }) => {
        const ergebnis = obj.bewegen();
        log('ergebnis', `${id}: ${ergebnis}.`);
        bus.emit('called', { id, methode: 'bewegen', ergebnis });
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
    log('ergebnis', t('log.deleted', { id }));
    bus.emit('deleted', { ids: [id] });
  }

  alleLoeschen({ still = false } = {}) {
    if (!this.#objekte.size) return;
    const ids = [...this.#objekte.keys()];
    this.#objekte.clear();
    this.#zaehler = {};                      // alle Nummern beginnen wieder bei 1
    if (!still) {
      log('befehl', t('workspace.deleteAll'));
      log('ergebnis', t('log.deletedAll', { n: ids.length }));
    }
    bus.emit('deleted', { ids });
  }

  // ---------- Synchronisation (Demonstration „Pult → Bildschirm“) ----------

  /** Zustand als JSON-fähiges Objekt: nur öffentliche Felder (Object.keys), Motor als eigener Eintrag.
   *  Ausnahme: der gekapselte Drehwinkel der Figuren (#winkel) – er ist über den Getter lesbar und
   *  wird in wiederherstellen() über drehen90() nachgebaut. */
  exportieren() {
    const objects = this.alle.map(({ id, obj }) => {
      const fields = {};
      let engine = null;
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v && typeof v === 'object') engine = { cls: v.constructor.name, fields: { ...v } };
        else fields[k] = v;
      }
      const eintrag = { id, cls: klassenName(obj.constructor), fields, engine };
      if (obj instanceof Figur) eintrag.privat = { winkel: obj.winkel };
      return eintrag;
    });
    return { objects, counters: { ...this.#zaehler } };
  }

  /** Zustand übernehmen (Bildschirm): alles still leeren und die Objekte mit denselben ids neu anlegen.
   *  Zähler kommen ausschließlich aus state.counters. Unbekannte Klassen werden übersprungen. */
  wiederherstellen(state) {
    this.alleLoeschen({ still: true });
    const fehler = [];
    for (const { id, cls, fields = {}, engine, privat } of state.objects ?? []) {
      const K = KINDKLASSEN.get(cls);
      if (!K) { fehler.push(`${id}: ${cls}`); continue; }
      const obj = new K();
      Object.assign(obj, fields);
      if (engine && obj.motor && obj.motor.constructor.name === engine.cls) Object.assign(obj.motor, engine.fields);
      if (privat?.winkel && obj instanceof Figur) for (let w = 0; w < privat.winkel; w += 90) obj.drehen90();
      this.#objekte.set(id, obj);
      bus.emit('created', { id, obj });
      bus.emit('changed', { id });
    }
    this.#zaehler = { ...(state.counters ?? {}) };
    bus.emit('changed', {});
    if (fehler.length) throw new Error(t('error.unknownClass', { liste: fehler.join(', ') }));
  }
}
export const manager = new ObjectManager();
bus.on('created', () => bus.emit('changed', {}));
