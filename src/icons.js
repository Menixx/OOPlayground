import { klassenName } from './services/ObjectManager.js';
// Dateinamen (ohne Endung) der Icons in public/icons/. Unterstützt: .png, .svg, .webp
export const ICON_FILES = {
  Tier: 'abstrakt-tier', Transport: 'abstrakt-transport', Figur: 'abstrakt-figur',
  Katze: 'tier-katze', Krokodil: 'tier-krokodil', Mensch: 'tier-mensch', Eule: 'tier-eule',
  Auto: 'transport-auto', Flugzeug: 'transport-flugzeug', Zug: 'transport-zug',
  Dreieck: 'figur-dreieck', Kreis: 'figur-kreis', Stern: 'figur-stern',
  Benzinmotor: 'motor-benzin', Turbofan: 'motor-turbofan', Elektromotor: 'motor-elektro'
};
const BASIS = `${import.meta.env.BASE_URL}icons/`;
const ENDUNGEN = ['png', 'svg', 'webp'];

// Kandidaten: erst der erwartete Name (tier-katze), dann der einfache (katze), jeweils mit allen Endungen.
function kandidaten(name) {
  const staemme = [...new Set([ICON_FILES[name], name.toLowerCase()].filter(Boolean))];
  return staemme.flatMap((s) => ENDUNGEN.map((e) => `${BASIS}${s}.${e}`));
}

// Fehlt jede Datei, erscheint ein Platzhalter mit dem Anfangsbuchstaben (und eine Warnung in der Browser-Konsole).
export function icon(cls, css = 'icon') {
  const name = typeof cls === 'string' ? cls : (cls.bezeichnung ?? klassenName(cls));
  const liste = kandidaten(name);
  let i = 0;
  const img = document.createElement('img');
  img.className = css;
  img.alt = '';
  img.src = liste[i];
  img.addEventListener('error', () => {
    if (++i < liste.length) { img.src = liste[i]; return; }
    console.warn(`Icon für „${name}“ nicht gefunden. Versucht:\n${liste.join('\n')}`);
    const ph = document.createElement('span');
    ph.className = `${css} icon-ph`;
    ph.textContent = name[0];
    img.replaceWith(ph);
  });
  return img;
}