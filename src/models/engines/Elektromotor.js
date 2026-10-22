import { Motor } from './Motor.js';
export class Elektromotor extends Motor {
  static bezeichnung = 'Elektromotor';
  static einheit = 'kW';
  static privateMethoden = ['#batterieAktivieren', '#spannungAnlegen', '#rotorDrehen'];
  constructor() { super('Elektro', 5600); }

  // --- privat: von außen nicht erreichbar ---
  #batterieAktivieren() { /* Stromversorgung wird aktiviert */ return 'Stromversorgung wird aktiviert'; }
  #spannungAnlegen() { /* Spannung liegt an den Spulen an */ return 'Spannung liegt an den Spulen an'; }
  #rotorDrehen() { /* Rotor beginnt sich zu drehen */ return 'Rotor beginnt sich zu drehen'; }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#batterieAktivieren();
    this.#spannungAnlegen();
    this.#rotorDrehen();
    this.laeuft = true;
    return 'Motor gestartet!';
  }
  get implementierung() {
    return [
    '#batterieAktivieren()  →  Stromversorgung wird aktiviert',
    '#spannungAnlegen()  →  Spannung liegt an den Spulen an',
    '#rotorDrehen()  →  Rotor beginnt sich zu drehen'
    ];
  }
}
