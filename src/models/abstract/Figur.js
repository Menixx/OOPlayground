export class Figur {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['anzahlEcken', 'int']
  ];
  static methoden = [['drehen90', false]];
  #winkel = 0; // gekapselt: nur über drehen90() änderbar
  constructor() {
    if (new.target === Figur) throw new Error('Abstrakte Klassen können nicht instanziiert werden.');
    this.name = "Unbenannt";
    this.anzahlEcken = undefined;
  }
  get winkel() { return this.#winkel; }
  drehen90() {
    this.#winkel += 90;
    return `${this.name} wurde um 90° gedreht (jetzt ${this.#winkel % 360}°).`;
  }
}
