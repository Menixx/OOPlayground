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
const UNITS = { hoechstgeschwindigkeit: ' km/h', spannweite: ' m' };
export const fmt = (name, v) => (typeof v === 'string' ? `"${v}"` : String(v)) + (v !== undefined && UNITS[name] ? UNITS[name] : '');
