import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
import { EWIG, dauerPruefen, anzahlPruefen, lautWiederholen } from '../parameter.js';
export class Mensch extends Tier {
  static zyklen = { lautGeben: 2.4 }; // Sekunden für einen Laut (= ein Zyklus der Animation)
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
  essen(dauer = EWIG) { dauerPruefen(dauer); return t('mensch.essen'); }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('mensch.bewegen'); }
  lautGeben(anzahl = 1) { anzahlPruefen(anzahl); return t('mensch.lautGeben', { laut: lautWiederholen(t('mensch.laut'), anzahl) }); }
}
