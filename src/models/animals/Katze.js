import { Tier } from '../abstract/Tier.js';
export class Katze extends Tier {
  static eigeneFelder = ['schnurrt'];
  constructor() {
    super();
    this.name = 'Katze';
    this.kannFliegen = false;
    this.anzahlBeine = 4;
    this.hatSchwanz = true;
    this.kannGestreicheltWerden = true;
    this.schnurrt = true;
  }
  essen() { return 'Die Katze frisst Fisch.'; }
  bewegen() { return 'Läuft auf vier Pfoten'; }
}
