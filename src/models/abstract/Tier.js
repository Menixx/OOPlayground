import { t, tWert } from '../../i18n/i18n.js';
import { EWIG } from '../parameter.js';
export class Tier {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean'],
    ['anzahlBeine', 'int'],
    ['hatSchwanz', 'boolean'],
    ['kannGestreicheltWerden', 'boolean']
  ];
  // [name, abstrakt?, parameter: [typ, name, standardwert]] – T = generischer Typ (Zahl oder String)
  static methoden = [
    ['essen', true, [['T', 'dauer', EWIG]]],
    ['bewegen', true, [['T', 'dauer', EWIG]]],
    ['lautGeben', true, [['int', 'anzahl', 1]]],
    ['halten', false, []]
  ];
  constructor() {
    if (new.target === Tier) throw new Error(t('error.abstract'));
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.anzahlBeine = undefined;
    this.hatSchwanz = undefined;
    this.kannGestreicheltWerden = undefined;
  }
  essen(dauer = EWIG) { throw new Error(t('error.notImplemented', { methode: 'essen' })); }
  bewegen(dauer = EWIG) { throw new Error(t('error.notImplemented', { methode: 'bewegen' })); }
  lautGeben(anzahl = 1) { throw new Error(t('error.notImplemented', { methode: 'lautGeben' })); }
  halten() { return t('tier.halten', { name: tWert(this.name) }); }
}
