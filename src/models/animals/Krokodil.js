import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
export class Krokodil extends Tier {
  static eigeneFelder = [['anzahlZaehne', 'int']];
  constructor() {
    super();
    this.name = 'Krokodil';
    this.kannFliegen = false;
    this.anzahlBeine = 4;
    this.hatSchwanz = true;
    this.kannGestreicheltWerden = false;
    this.anzahlZaehne = 66;
  }
  essen() { return t('krokodil.essen'); }
  bewegen() { return t('krokodil.bewegen'); }
}
