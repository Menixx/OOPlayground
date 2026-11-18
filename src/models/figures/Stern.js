import { Figur } from '../abstract/Figur.js';
export class Stern extends Figur {
  static eigeneFelder = [['anzahlSpitzen', 'int']];
  constructor() {
    super();
    this.name = 'Stern';
    this.anzahlEcken = 10;
    this.anzahlSpitzen = 5;
  }

}
