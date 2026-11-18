import { Motor } from './Motor.js';
import { t } from '../../i18n/i18n.js';
export class Elektromotor extends Motor {
  static bezeichnung = 'Elektromotor';
  static einheit = 'kW';
  static privateMethoden = ['#batterieAktivieren', '#spannungAnlegen', '#rotorDrehen'];
  constructor() { super('Elektro', 5600); }

  // --- privat: von außen nicht erreichbar ---
  #batterieAktivieren() { /* Stromversorgung wird aktiviert */ return t('engine.elektro.batterie'); }
  #spannungAnlegen() { /* Spannung liegt an den Spulen an */ return t('engine.elektro.spannung'); }
  #rotorDrehen() { /* Rotor beginnt sich zu drehen */ return t('engine.elektro.rotor'); }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#batterieAktivieren();
    this.#spannungAnlegen();
    this.#rotorDrehen();
    this.laeuft = true;
    return t('motor.gestartet');
  }
  /** [privater Methodenname, Wörterbuch-Schlüssel der Beschreibung] */
  get implementierung() {
    return [
      ['#batterieAktivieren', 'engine.elektro.batterie'],
      ['#spannungAnlegen', 'engine.elektro.spannung'],
      ['#rotorDrehen', 'engine.elektro.rotor']
    ];
  }
}
