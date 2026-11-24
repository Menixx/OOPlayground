import { t } from '../../i18n/i18n.js';
import { Benzinmotor } from '../engines/Benzinmotor.js';
import { Transport } from '../abstract/Transport.js';
import { EWIG, dauerPruefen } from '../parameter.js';
export class Auto extends Transport {
  static zyklen = { motorStarten: 2.5 }; // Sekunden: die Startanimation läuft genau einmal
  static eigeneFelder = [['anzahlTueren', 'int']];
  constructor() {
    super();
    this.name = 'Auto';
    this.kannFliegen = false;
    this.hoechstgeschwindigkeit = 220;
    this.anzahlRaeder = 4;
    this.motor = new Benzinmotor();
    this.anzahlTueren = 4;
  }
  motorStarten() {
    if (this.motor.laeuft) return t('transport.motorLaeuft');
    return `${this.motor.starten()}\n${t('transport.motorErfolg')}`;
  }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('auto.bewegen'); }
}
