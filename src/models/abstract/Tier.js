export class Tier {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean', 'undefined'],
    ['anzahlBeine', 'number', 'undefined'],
    ['hatSchwanz', 'boolean', 'undefined'],
    ['kannGestreicheltWerden', 'boolean', 'undefined']
  ];
static methoden = [['essen', true], ['bewegen', true], ['halten', false]];
  constructor() {
    if (new.target === Tier) throw new Error('Abstrakte Klassen können nicht instanziiert werden.');
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.anzahlBeine = undefined;
    this.hatSchwanz = undefined;
    this.kannGestreicheltWerden = undefined;
  }
  essen() { throw new Error('Die Methode essen() muss implementiert werden.'); }
  bewegen() { throw new Error('Die Methode bewegen() muss implementiert werden.'); }
  halten() { return `${this.name} bleibt stehen.`; }
}
