import { Figur } from '../abstract/Figur.js';
export class Kreis extends Figur {
  static eigeneFelder = ['radius'];
  constructor() {
    super();
    this.name = 'Kreis';
    this.anzahlEcken = 0;
    this.radius = 50;
  }

}
