import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
export class Katze extends Tier {
  static eigeneFelder = [['schnurrt', 'boolean']];
  constructor() {
    super();
    this.name = 'Katze';
    this.kannFliegen = false;
    this.anzahlBeine = 4;
    this.hatSchwanz = true;
    this.kannGestreicheltWerden = true;
    this.schnurrt = true;
  }
  essen() { return t('katze.essen'); }
  bewegen() { return t('katze.bewegen'); }
}
