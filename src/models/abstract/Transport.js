import { t, tWert } from '../../i18n/i18n.js';
import { EWIG } from '../parameter.js';
export class Transport {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean'],
    ['hoechstgeschwindigkeit', 'int'],
    ['anzahlRaeder', 'int'],
    ['motor', 'Motor']
  ];
// [name, abstrakt?, parameter: [typ, name, standardwert]] – T = generischer Typ (Zahl oder String)
  static methoden = [
    ['motorStarten', true, []],
    ['bewegen', true, [['T', 'dauer', EWIG]]],
    ['halten', false, []]
  ];
  constructor() {
    if (new.target === Transport) throw new Error(t('error.abstract'));
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.hoechstgeschwindigkeit = undefined;
    this.anzahlRaeder = undefined;
    this.motor = undefined;
  }
  motorStarten() { throw new Error(t('error.notImplemented', { methode: 'motorStarten' })); }
  bewegen(dauer = EWIG) { throw new Error(t('error.notImplemented', { methode: 'bewegen' })); }
  halten() {
    if (this.motor?.laeuft) {
      this.motor.stoppen();               // Delegation an das Motor-Objekt
      return `${t('transport.halten', { name: tWert(this.name) })}\n${t('transport.motorGestoppt')}`;
    }
    return t('transport.halten', { name: tWert(this.name) });
  }
}
