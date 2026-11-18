import { Tier } from '../abstract/Tier.js';
export class Mensch extends Tier {
  static eigeneFelder = [['beruf', 'String']];
  constructor() {
    super();
    this.name = 'Mensch';
    this.kannFliegen = false;
    this.anzahlBeine = 2;
    this.hatSchwanz = false;
    this.kannGestreicheltWerden = true;
    this.beruf = 'Student';
  }
  essen() { return 'Der Mensch isst eine Pizza.'; }
  bewegen() { return 'Geht auf zwei Beinen'; }
}
