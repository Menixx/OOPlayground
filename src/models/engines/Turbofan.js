import { Motor } from './Motor.js';
import { t } from '../../i18n/i18n.js';
export class Turbofan extends Motor {
  static bezeichnung = 'Turbofan';
  static einheit = 'kN';
  static privateMethoden = ['#luftAnsaugen', '#verdichten', '#brennkammerZuenden'];
  constructor() { super('Turbofan', 120); }

  // --- privat: von außen nicht erreichbar ---
  #luftAnsaugen() { /* Luft wird angesaugt */ return t('engine.turbofan.ansaugen'); }
  #verdichten() { /* Luft wird verdichtet */ return t('engine.turbofan.verdichten'); }
  #brennkammerZuenden() { /* Brennkammer wird gezündet */ return t('engine.turbofan.zuenden'); }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#luftAnsaugen();
    this.#verdichten();
    this.#brennkammerZuenden();
    this.laeuft = true;
    return t('motor.gestartet');
  }
  /** [privater Methodenname, Wörterbuch-Schlüssel der Beschreibung] */
  get implementierung() {
    return [
      ['#luftAnsaugen', 'engine.turbofan.ansaugen'],
      ['#verdichten', 'engine.turbofan.verdichten'],
      ['#brennkammerZuenden', 'engine.turbofan.zuenden']
    ];
  }
}
