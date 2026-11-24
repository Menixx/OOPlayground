import { t } from '../../i18n/i18n.js';
import { Elektromotor } from '../engines/Elektromotor.js';
import { Transport } from '../abstract/Transport.js';
import { EWIG, dauerPruefen } from '../parameter.js';
export class Zug extends Transport {
  static zyklen = { motorStarten: 1.8 }; // Sekunden: die Startanimation läuft genau einmal
  static eigeneFelder = [['anzahlWaggons', 'int']];
  constructor() {
    super();
    this.name = 'Zug';
    this.kannFliegen = false;
    this.hoechstgeschwindigkeit = 300;
    this.anzahlRaeder = 32;
    this.motor = new Elektromotor();
    this.anzahlWaggons = 8;
  }
  motorStarten() {
    if (this.motor.laeuft) return t('transport.motorLaeuft');
    return `${this.motor.starten()}\n${t('transport.motorErfolg')}`;
  }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('zug.bewegen'); }
}
