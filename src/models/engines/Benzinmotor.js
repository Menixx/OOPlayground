import { Motor } from './Motor.js';
export class Benzinmotor extends Motor {
  static bezeichnung = 'Benzinmotor';
  static einheit = 'PS';
  static privateMethoden = ['#kraftstoffEinspritzen', '#zuenden', '#kolbenBewegen'];
  constructor() { super('Benzin', 150); }

  // --- privat: von außen nicht erreichbar ---
  #kraftstoffEinspritzen() { /* Kraftstoff wird eingespritzt */ return 'Kraftstoff wird eingespritzt'; }
  #zuenden() { /* Zündfunke zündet das Gemisch */ return 'Zündfunke zündet das Gemisch'; }
  #kolbenBewegen() { /* Kolben beginnen sich zu bewegen */ return 'Kolben beginnen sich zu bewegen'; }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#kraftstoffEinspritzen();
    this.#zuenden();
    this.#kolbenBewegen();
    this.laeuft = true;
    return 'Motor gestartet!';
  }
  get implementierung() {
    return [
    '#kraftstoffEinspritzen()  →  Kraftstoff wird eingespritzt',
    '#zuenden()  →  Zündfunke zündet das Gemisch',
    '#kolbenBewegen()  →  Kolben beginnen sich zu bewegen'
    ];
  }
}
