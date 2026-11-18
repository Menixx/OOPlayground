import { t, tWert } from '../../i18n/i18n.js';
export class Tier {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean'],
    ['anzahlBeine', 'int'],
    ['hatSchwanz', 'boolean'],
    ['kannGestreicheltWerden', 'boolean']
  ];
static methoden = [['essen', true], ['bewegen', true], ['halten', false]];
  constructor() {
    if (new.target === Tier) throw new Error(t('error.abstract'));
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.anzahlBeine = undefined;
    this.hatSchwanz = undefined;
    this.kannGestreicheltWerden = undefined;
  }
  essen() { throw new Error(t('error.notImplemented', { methode: 'essen' })); }
  bewegen() { throw new Error(t('error.notImplemented', { methode: 'bewegen' })); }
  halten() { return t('tier.halten', { name: tWert(this.name) }); }
}
