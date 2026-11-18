import { Motor } from './Motor.js';
import { t } from '../../i18n/i18n.js';
export class Benzinmotor extends Motor {
  static bezeichnung = 'Benzinmotor';
  static einheit = 'PS';
  static privateMethoden = ['#kraftstoffEinspritzen', '#zuenden', '#kolbenBewegen'];
  constructor() { super('Benzin', 150); }

  // --- privat: von außen nicht erreichbar ---
  #kraftstoffEinspritzen() { /* Kraftstoff wird eingespritzt */ return t('engine.benzin.einspritzen'); }
  #zuenden() { /* Zündfunke zündet das Gemisch */ return t('engine.benzin.zuenden'); }
  #kolbenBewegen() { /* Kolben beginnen sich zu bewegen */ return t('engine.benzin.kolben'); }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#kraftstoffEinspritzen();
    this.#zuenden();
    this.#kolbenBewegen();
    this.laeuft = true;
    return t('motor.gestartet');
  }
  /** [privater Methodenname, Wörterbuch-Schlüssel der Beschreibung] */
  get implementierung() {
    return [
      ['#kraftstoffEinspritzen', 'engine.benzin.einspritzen'],
      ['#zuenden', 'engine.benzin.zuenden'],
      ['#kolbenBewegen', 'engine.benzin.kolben']
    ];
  }
}
