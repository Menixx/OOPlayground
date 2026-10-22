import { Benzinmotor } from '../engines/Benzinmotor.js';
import { Transport } from '../abstract/Transport.js';
export class Auto extends Transport {
  static eigeneFelder = ['anzahlTueren'];
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
    if (this.motor.laeuft) return 'Der Motor läuft bereits.';
    return `${this.motor.starten()}\nMotor erfolgreich gestartet.`;
  }
  bewegen() { return 'Fährt auf der Straße'; }
}
