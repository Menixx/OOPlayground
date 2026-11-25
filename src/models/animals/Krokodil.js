import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
import { EWIG, dauerPruefen, anzahlPruefen, lautWiederholen } from '../parameter.js';
export class Krokodil extends Tier {
  static zyklen = { lautGeben: 3 }; // Sekunden für einen Laut (= ein Zyklus der Animation)
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
  essen(dauer = EWIG) { dauerPruefen(dauer); return t('krokodil.essen'); }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('krokodil.bewegen'); }
  lautGeben(anzahl = 1) { anzahlPruefen(anzahl); return t('krokodil.lautGeben', { laut: lautWiederholen(t('krokodil.laut'), anzahl) }); }
}
