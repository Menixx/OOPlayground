import { Motor } from './Motor.js';
export class Turbofan extends Motor {
  static bezeichnung = 'Turbofan';
  static einheit = 'kN';
  static privateMethoden = ['#luftAnsaugen', '#verdichten', '#brennkammerZuenden'];
  constructor() { super('Turbofan', 120); }

  // --- privat: von außen nicht erreichbar ---
  #luftAnsaugen() { /* Luft wird angesaugt */ return 'Luft wird angesaugt'; }
  #verdichten() { /* Luft wird verdichtet */ return 'Luft wird verdichtet'; }
  #brennkammerZuenden() { /* Brennkammer wird gezündet */ return 'Brennkammer wird gezündet'; }

  // --- öffentliche Schnittstelle ---
  starten() {
    this.#luftAnsaugen();
    this.#verdichten();
    this.#brennkammerZuenden();
    this.laeuft = true;
    return 'Motor gestartet!';
  }
  get implementierung() {
    return [
    '#luftAnsaugen()  →  Luft wird angesaugt',
    '#verdichten()  →  Luft wird verdichtet',
    '#brennkammerZuenden()  →  Brennkammer wird gezündet'
    ];
  }
}
