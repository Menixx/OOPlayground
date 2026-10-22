import { Tier } from '../abstract/Tier.js';
export class Krokodil extends Tier {
  static eigeneFelder = ['anzahlZaehne'];
  constructor() {
    super();
    this.name = 'Krokodil';
    this.kannFliegen = false;
    this.anzahlBeine = 4;
    this.hatSchwanz = true;
    this.kannGestreicheltWerden = false;
    this.anzahlZaehne = 66;
  }
  essen() { return 'Das Krokodil frisst Fleisch.'; }
  bewegen() { return 'Kriecht'; }
}
