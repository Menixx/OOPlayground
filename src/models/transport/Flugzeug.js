import { t } from '../../i18n/i18n.js';
import { Turbofan } from '../engines/Turbofan.js';
import { Transport } from '../abstract/Transport.js';
import { EWIG, dauerPruefen } from '../parameter.js';
export class Flugzeug extends Transport {
  static zyklen = { motorStarten: 2 }; // Sekunden: die Startanimation läuft genau einmal
  static eigeneFelder = [['spannweite', 'double']];
  constructor() {
    super();
    this.name = 'Flugzeug';
    this.kannFliegen = true;
    this.hoechstgeschwindigkeit = 900;
    this.anzahlRaeder = 6;
    this.motor = new Turbofan();
    this.spannweite = 35.8;
  }
  motorStarten() {
    if (this.motor.laeuft) return t('transport.motorLaeuft');
    return `${this.motor.starten()}\n${t('transport.motorErfolg')}`;
  }
  bewegen(dauer = EWIG) { dauerPruefen(dauer); return t('flugzeug.bewegen'); }
}
