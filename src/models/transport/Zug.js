import { Elektromotor } from '../engines/Elektromotor.js';
import { Transport } from '../abstract/Transport.js';
export class Zug extends Transport {
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
    if (this.motor.laeuft) return 'Der Motor läuft bereits.';
    return `${this.motor.starten()}\nMotor erfolgreich gestartet.`;
  }
  bewegen() { return 'Fährt auf Schienen'; }
}
