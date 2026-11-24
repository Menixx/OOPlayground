import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
import { EWIG, dauerPruefen, anzahlPruefen, lautWiederholen } from '../parameter.js';
export class Eule extends Tier {
  static zyklen = { lautGeben: 1.6 }; // Sekunden für einen Laut (= ein Zyklus der Animation)
  static eigeneFelder = [['kopfDrehung', 'int']];
  constructor() {
    super();
    this.name = 'Eule';
    this.kannFliegen = true;
    this.anzahlBeine = 2;
    this.hatSchwanz = true;
    this.kannGestreicheltWerden = false;
    this.kopfDrehung = 270; // Grad: so weit kann eine Eule ihren Kopf drehen
  }
  essen(dauer = EWIG) { dauerPruefen(dauer); return t('eule.essen'); }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('eule.bewegen'); }
  lautGeben(anzahl = 1) { anzahlPruefen(anzahl); return t('eule.lautGeben', { laut: lautWiederholen(t('eule.laut'), anzahl) }); }
}
