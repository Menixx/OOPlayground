import { Turbofan } from '../engines/Turbofan.js';
import { Transport } from '../abstract/Transport.js';
export class Flugzeug extends Transport {
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
    if (this.motor.laeuft) return 'Der Motor läuft bereits.';
    return `${this.motor.starten()}\nMotor erfolgreich gestartet.`;
  }
  bewegen() { return 'Fliegt durch die Luft'; }
}
