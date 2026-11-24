import { el } from '../utils/dom.js';
import { icon } from '../icons.js';

const BASIS = `${import.meta.env.BASE_URL}animations/`;

// Methode -> CSS-Klasse am Wurzel-<svg> (die Klassen stehen im <style> der SVG-Datei)
export const ANIMATIONEN = {
  Katze:    { datei: 'animation-cat',       methoden: { essen: 'state-eat',   bewegen: 'state-walk',  lautGeben: 'state-meow' } },
  Krokodil: { datei: 'animation-crocodile', methoden: { essen: 'state-eat',   bewegen: 'state-crawl', lautGeben: 'state-hiss' } },
  Mensch:   { datei: 'animation-man',       methoden: { essen: 'state-pizza', bewegen: 'state-walk',  lautGeben: 'state-talk' }, smil: 'state-pizza' },
  Eule:     { datei: 'animation-owl',       methoden: { essen: 'state-eat',   bewegen: 'state-fly',   lautGeben: 'state-hoot' } },
  Auto:     { datei: 'animation-car',       methoden: { motorStarten: 'state-start', bewegen: 'state-drive' } },
  Flugzeug: { datei: 'animation-plane',     methoden: { motorStarten: 'state-start', bewegen: 'state-fly' } },
  Zug:      { datei: 'animation-train',     methoden: { motorStarten: 'state-start', bewegen: 'state-drive' } }
};

// Jede Datei wird nur einmal geladen; jede Instanz bekommt ihre eigene SVG-Kopie.
const cache = new Map();
const laden = (datei) => {
  if (!cache.has(datei)) {
    cache.set(datei, fetch(`${BASIS}${datei}.svg`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      // Schutz: verirrte </svg>-Tags direkt vor </style> machen das XML ungültig
      .then((t) => t.replace(/(?:<\/svg>\s*)+(?=<\/style>)/g, '')));
  }
  return cache.get(datei);
};

function parse(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  if (doc.querySelector('parsererror')) throw new Error('SVG nicht lesbar');
  const svg = document.importNode(doc.documentElement, true);
  ['id', 'width', 'height'].forEach((a) => svg.removeAttribute(a));
  // Zustandsklassen (z. B. state-pizza im Mensch-SVG) entfernen -> Ruhezustand; andere Klassen (z. B. owl-icon) tragen die Styles
  svg.classList.remove(...[...svg.classList].filter((c) => c.startsWith('state-')));
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

/** Liefert { el, play(methode), halt() } oder null, wenn die Klasse keine Animation hat. */
export function createAnimation(klasse) {
  const cfg = ANIMATIONEN[klasse];
  if (!cfg) return null;
  const alleStates = Object.values(cfg.methoden);
  const wrap = el('span', { class: 'anim' }, icon(klasse, 'icon big')); // Platzhalter bis das SVG geladen ist
  let svg = null, zustand = null;

  function anwenden() {
    if (!svg) return;
    svg.classList.remove(...alleStates);
    void svg.getBoundingClientRect();           // Neustart, auch wenn derselbe Zustand erneut gesetzt wird
    if (zustand) svg.classList.add(zustand);
    // SMIL (<animate>) läuft unabhängig von CSS-Klassen -> nur im passenden Zustand abspielen
    if (zustand && zustand === cfg.smil) { svg.setCurrentTime(0); svg.unpauseAnimations(); }
    else { svg.pauseAnimations(); svg.setCurrentTime(0); }
  }

  laden(cfg.datei).then((text) => {
    svg = parse(text);
    wrap.replaceChildren(svg);
    anwenden();                                  // Ruhezustand (oder bereits angeforderter Zustand)
  }).catch((e) => console.warn(`Animation für „${klasse}“ nicht geladen:`, e.message));

  return {
    el: wrap,
    play(methode) { const s = cfg.methoden[methode]; if (s) { zustand = s; anwenden(); } },
    halt() { zustand = null; anwenden(); }
  };
}