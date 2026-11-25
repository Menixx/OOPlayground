import { t } from '../../i18n/i18n.js';
import { Tier } from '../abstract/Tier.js';
import { EWIG, dauerPruefen, anzahlPruefen } from '../parameter.js';
import { zufaelligeSprache } from '../sprachen.js';
export class Mensch extends Tier {
  static zyklen = { lautGeben: 2.4 }; // Sekunden für einen Laut (= ein Zyklus der Animation)
  static eigeneFelder = [['beruf', 'String']];
  #sprache = null; // Sprache des letzten lautGeben() – Kürzel wie "uk" (gekapselt, nur lesbar)
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
  get sprache() { return this.#sprache; }
  /** Der Mensch spricht in einer zufällig gewählten Sprache (anzahl-mal dieselbe). */
  lautGeben(anzahl = 1) {
    anzahlPruefen(anzahl);
    this.#sprache = zufaelligeSprache().code;
    const sprache = t(`sprachname.${this.#sprache}`);
    return anzahl === 1 ? t('mensch.lautGeben', { sprache }) : t('mensch.lautGebenMehrmals', { sprache, anzahl });
  }
}
