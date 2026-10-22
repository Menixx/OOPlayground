import { Figur } from '../abstract/Figur.js';
export class Dreieck extends Figur {
  static eigeneFelder = ['seitenlaenge'];
  constructor() {
    super();
    this.name = 'Dreieck';
    this.anzahlEcken = 3;
    this.seitenlaenge = 100;
  }

}
