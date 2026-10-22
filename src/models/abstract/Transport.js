export class Transport {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean', 'undefined'],
    ['hoechstgeschwindigkeit', 'number', 'undefined'],
    ['anzahlRaeder', 'number', 'undefined'],
    ['motor', 'Motor', 'undefined']
  ];
  static methoden = [['motorStarten', true], ['bewegen', true]];
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
}
