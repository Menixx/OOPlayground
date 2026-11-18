import { t } from '../../i18n/i18n.js';
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
  essen() { return t('mensch.essen'); }
  bewegen() { return t('mensch.bewegen'); }
}
