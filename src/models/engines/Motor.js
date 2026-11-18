export class Motor {
  static felder = [['typ', 'String'], ['leistung', 'int'], ['laeuft', 'boolean']];
  static bezeichnung = 'Motor';
  static einheit = '';
  static privateMethoden = [];
  constructor(typ, leistung) {
    if (new.target === Motor) throw new Error('Abstrakte Klassen können nicht instanziiert werden.');
    this.typ = typ;
    this.leistung = leistung;
    this.laeuft = false;
  }
  starten() { throw new Error('Die Methode starten() muss implementiert werden.'); }
  stoppen() {
    this.laeuft = false;
    return 'Motor gestoppt!';
  }
}
