export class Transport {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean', 'undefined'],
    ['hoechstgeschwindigkeit', 'number', 'undefined'],
    ['anzahlRaeder', 'number', 'undefined'],
    ['motor', 'Motor', 'undefined']
  ];
static methoden = [['motorStarten', true], ['bewegen', true], ['halten', false]];
  constructor() {
    if (new.target === Transport) throw new Error('Abstrakte Klassen können nicht instanziiert werden.');
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.hoechstgeschwindigkeit = undefined;
    this.anzahlRaeder = undefined;
    this.motor = undefined;
  }
  motorStarten() { throw new Error('Die Methode motorStarten() muss implementiert werden.'); }
  bewegen() { throw new Error('Die Methode bewegen() muss implementiert werden.'); }
  halten() {
    if (this.motor?.laeuft) {
      this.motor.stoppen();               // Delegation an das Motor-Objekt
      return `${this.name} hält an.\nMotor gestoppt.`;
    }
    return `${this.name} hält an.`;
  }
}
