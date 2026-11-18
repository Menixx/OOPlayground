export const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false));
  return e;
};
// Java-Notation für Felder: „Typ name = wert; // Einheit“
const EINHEITEN = { hoechstgeschwindigkeit: 'km/h', spannweite: 'm' };
export const einheit = (name) => EINHEITEN[name];
/** Wert als Java-Literal: Strings in Anführungszeichen, fehlende Referenz -> null, double immer mit Nachkommastelle. */
export const javaWert = (v, typ) => (v == null ? 'null'
  : typeof v === 'string' ? `"${v}"`
  : typ === 'double' && Number.isInteger(v) ? v.toFixed(1)
  : String(v));
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
