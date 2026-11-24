import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
import { EWIG, dauerPruefen, anzahlPruefen, lautWiederholen } from '../parameter.js';
export class Katze extends Tier {
  static zyklen = { lautGeben: 2 }; // Sekunden für einen Laut (= ein Zyklus der Animation)
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
  essen(dauer = EWIG) { dauerPruefen(dauer); return t('katze.essen'); }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('katze.bewegen'); }
  lautGeben(anzahl = 1) { anzahlPruefen(anzahl); return t('katze.lautGeben', { laut: lautWiederholen(t('katze.laut'), anzahl) }); }
}
