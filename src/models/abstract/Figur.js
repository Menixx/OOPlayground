import { t, tWert } from '../../i18n/i18n.js';
export class Figur {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['anzahlEcken', 'int']
  ];
  static methoden = [['drehen90', false]];
  #winkel = 0; // gekapselt: nur über drehen90() änderbar
  constructor() {
    if (new.target === Figur) throw new Error(t('error.abstract'));
    this.name = "Unbenannt";
    this.anzahlEcken = undefined;
  }
  get winkel() { return this.#winkel; }
  drehen90() {
    this.#winkel += 90;
    return t('figur.drehen', { name: tWert(this.name), winkel: this.#winkel % 360 });
  }
}
