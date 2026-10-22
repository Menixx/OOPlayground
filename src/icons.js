import { klassenName } from './services/ObjectManager.js';
// Dateinamen der Icons in public/icons/ (SVG-Dateien werden später ergänzt).
export const ICON_FILES = {
  Tier: 'abstrakt-tier.svg', Transport: 'abstrakt-transport.svg', Figur: 'abstrakt-figur.svg',
  Katze: 'tier-katze.svg', Krokodil: 'tier-krokodil.svg', Mensch: 'tier-mensch.svg',
  Auto: 'transport-auto.svg', Flugzeug: 'transport-flugzeug.svg', Zug: 'transport-zug.svg',
  Dreieck: 'figur-dreieck.svg', Kreis: 'figur-kreis.svg', Stern: 'figur-stern.svg',
  Benzinmotor: 'motor-benzin.svg', Turbofan: 'motor-turbofan.svg', Elektromotor: 'motor-elektro.svg'
};
// Fehlt die Datei, erscheint ein Platzhalter mit dem Anfangsbuchstaben.
export function icon(cls, css = 'icon') {
  const name = typeof cls === 'string' ? cls : (cls.bezeichnung ?? klassenName(cls));
  const img = document.createElement('img');
  img.className = css;
  img.alt = '';
  img.src = `${import.meta.env.BASE_URL}icons/${ICON_FILES[name] ?? name.toLowerCase() + '.svg'}`;
  img.addEventListener('error', () => {
    const ph = document.createElement('span');
    ph.className = `${css} icon-ph`;
    ph.textContent = name[0];
    img.replaceWith(ph);
  });
  return img;
}
