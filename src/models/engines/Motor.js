import { t } from '../../i18n/i18n.js';
export class Motor {
  static felder = [['typ', 'String'], ['leistung', 'int'], ['laeuft', 'boolean']];
  static bezeichnung = 'Motor';
  static einheit = '';
  static privateMethoden = [];
  constructor(typ, leistung) {
    if (new.target === Motor) throw new Error(t('error.abstract'));
    this.typ = typ;
    this.leistung = leistung;
    this.laeuft = false;
  }
  starten() { throw new Error(t('error.notImplemented', { methode: 'starten' })); }
  stoppen() {
    this.laeuft = false;
    return t('motor.gestoppt');
  }
}
