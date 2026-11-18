import { L, istMarke, bindText, bindAttr, wertSchluessel } from '../i18n/i18n.js';

/** Element-Fabrik. Übersetzbare Inhalte:
 *  - props.i18n = 'schluessel' (+ props.i18nParams) -> eigener Text des Elements
 *  - Attributwert L('schluessel') -> übersetztes Attribut (z. B. data-tip)
 *  - Kind L('schluessel') -> <span> mit übersetztem Text */
export const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  const { i18n, i18nParams, ...rest } = props;
  for (const [k, v] of Object.entries(rest)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (istMarke(v)) bindAttr(e, k, v.key, v.params);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false)
    .map((x) => (istMarke(x) ? bindText(document.createElement('span'), x.key, x.params) : x)));
  if (i18n) bindText(e, i18n, i18nParams);
  return e;
};
export { L };
// Java-Notation für Felder: „Typ name = wert; // Einheit“
const EINHEITEN = { hoechstgeschwindigkeit: 'km/h', spannweite: 'm' };
export const einheit = (name) => EINHEITEN[name];
/** Wert als Java-Literal: Strings in Anführungszeichen, fehlende Referenz -> null, double immer mit Nachkommastelle. */
export const javaWert = (v, typ) => (v == null ? 'null'
  : typeof v === 'string' ? `"${v}"`
  : typ === 'double' && Number.isInteger(v) ? v.toFixed(1)
  : String(v));
/** Feldwert als <code>-Literal; übersetzbare String-Werte bleiben an die Sprache gebunden („"Katze"“ ↔ „"Cat"“). */
export const javaLiteral = (v, typ) => {
  const k = wertSchluessel(v);
  return k ? el('code', {}, '"', el('span', { i18n: k }), '"') : el('code', {}, javaWert(v, typ));
};
/** Felddeklaration als ein Inline-Block; wert = null -> ohne Initialisierer (z. B. in der abstrakten Klasse). */
export const deklaration = (typ, name, wert = null, kommentar = null) => el('span', { class: 'dekl' },
  el('span', { class: 'typ' }, typ), ' ', el('span', { class: 'feld' }, name),
  wert != null && [' = ', wert], ';',
  kommentar && el('span', { class: 'kommentar' }, ` // ${kommentar}`));
/** Java-Methodensignatur, z. B. „public abstract void essen();“.
 *  mods: Modifikatoren, klasse: Farbe des Namens (methode/abstrakt/privat), ende: ';' oder ' { … }' oder ''. */
export const signatur = (mods, typ, name, klasse = 'methode', ende = '') => el('span', { class: 'dekl' },
  mods.length > 0 && [el('span', { class: 'mod' }, mods.join(' ')), ' '],
  el('span', { class: 'typ' }, typ), ' ', el('span', { class: klasse }, `${name}()`), ende);
