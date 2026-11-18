import { t, tWert } from '../../i18n/i18n.js';
export class Transport {
  static felder = [
    ['name', 'String', '"Unbenannt"'],
    ['kannFliegen', 'boolean'],
    ['hoechstgeschwindigkeit', 'int'],
    ['anzahlRaeder', 'int'],
    ['motor', 'Motor']
  ];
static methoden = [['motorStarten', true], ['bewegen', true], ['halten', false]];
  constructor() {
    if (new.target === Transport) throw new Error(t('error.abstract'));
    this.name = "Unbenannt";
    this.kannFliegen = undefined;
    this.hoechstgeschwindigkeit = undefined;
    this.anzahlRaeder = undefined;
    this.motor = undefined;
  }
  motorStarten() { throw new Error(t('error.notImplemented', { methode: 'motorStarten' })); }
  bewegen() { throw new Error(t('error.notImplemented', { methode: 'bewegen' })); }
  halten() {
    if (this.motor?.laeuft) {
      this.motor.stoppen();               // Delegation an das Motor-Objekt
      return `${t('transport.halten', { name: tWert(this.name) })}\n${t('transport.motorGestoppt')}`;
    }
    return t('transport.halten', { name: tWert(this.name) });
  }
}
