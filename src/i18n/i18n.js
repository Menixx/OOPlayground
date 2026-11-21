import { bus } from '../services/EventBus.js';

export const SPRACHEN = ['en', 'de'];
const STANDARD = 'de';
const SPEICHER_KEY = 'ooplayground.sprache';

function gespeicherteSprache() {
  try {
    const l = localStorage.getItem(SPEICHER_KEY);
    return SPRACHEN.includes(l) ? l : STANDARD;
  } catch { return STANDARD; }
}

/** Bereits geladene Wörterbücher je Sprache. Jede Sprache liegt in einem eigenen Chunk (./dict/<lang>.js)
 *  und wird erst geladen, wenn sie gebraucht wird. */
const WOERTERBUCH = {};

async function ladeWoerterbuch(lang) {
  if (!WOERTERBUCH[lang]) WOERTERBUCH[lang] = (await import(`./dict/${lang}.js`)).default;
  return WOERTERBUCH[lang];
}

let sprache = gespeicherteSprache();
export const getSprache = () => sprache;

// Top-Level-await: Alle Module, die i18n.js importieren, laufen erst, wenn das Wörterbuch da ist –
// t() bleibt dadurch synchron.
await ladeWoerterbuch(sprache);

/** Übersetzt einen Schlüssel in die aktuelle Sprache; {platzhalter} werden durch params ersetzt.
 *  Rückfall auf die Standardsprache nur, wenn sie schon geladen ist (die Schlüsselmengen sind gleich). */
export function t(key, params = {}) {
  const text = WOERTERBUCH[sprache]?.[key] ?? WOERTERBUCH[STANDARD]?.[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

/** Schlüssel für den Wert eines String-Feldes – oder null, wenn der Wert nicht im Wörterbuch steht. */
export const wertSchluessel = (v) => (typeof v === 'string' && `value.${v}` in WOERTERBUCH[sprache] ? `value.${v}` : null);
/** Feldwert in der aktuellen Sprache (unbekannte Werte bleiben unverändert). */
export const tWert = (v) => { const k = wertSchluessel(v); return k ? t(k) : v; };

/** Markierung für el(): als Kind -> <span> mit übersetztem Text, als Attributwert -> übersetztes Attribut.
 *  Beide werden beim Sprachwechsel automatisch aktualisiert. */
const MARKE = Symbol('i18n');
export const L = (key, params) => ({ [MARKE]: true, key, params });
export const istMarke = (v) => v != null && typeof v === 'object' && v[MARKE] === true;

/** Text eines Elements an einen Schlüssel binden. */
export function bindText(node, key, params) {
  node.dataset.i18n = key;
  if (params) node.dataset.i18nParams = JSON.stringify(params); else delete node.dataset.i18nParams;
  node.textContent = t(key, params);
  return node;
}

/** Attribut eines Elements an einen Schlüssel binden. */
export function bindAttr(node, attr, key, params) {
  const map = node.dataset.i18nAttr ? JSON.parse(node.dataset.i18nAttr) : {};
  map[attr] = [key, params ?? null];
  node.dataset.i18nAttr = JSON.stringify(map);
  node.setAttribute(attr, t(key, params ?? {}));
  return node;
}

const leseParams = (e) => (e.dataset.i18nParams ? JSON.parse(e.dataset.i18nParams) : {});

/** Alle gebundenen Texte/Attribute im Dokument neu übersetzen – ohne Neuaufbau der Komponenten. */
export function uebersetzeDom(root = document) {
  document.documentElement.lang = sprache;
  root.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n, leseParams(e)); });
  root.querySelectorAll('[data-i18n-attr]').forEach((e) => {
    for (const [attr, [key, params]] of Object.entries(JSON.parse(e.dataset.i18nAttr))) e.setAttribute(attr, t(key, params ?? {}));
  });
}

/** Arbeiten, die vor bzw. während des Wechsels fertig sein müssen (z. B. Inhalte der Erklärungsseite).
 *  vorbereiten(lang): läuft vor dem Überblenden (Laden); zeichnen(lang): läuft im Überblenden (Neuaufbau). */
const helfer = [];
export function beimSprachwechsel({ vorbereiten, zeichnen }) { helfer.push({ vorbereiten, zeichnen }); }

const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');
const UEBERBLENDEN = 620; // ms, = dauer in LangToggle.js und ::view-transition in base.css

/** Ist gerade die (ein-/ausfahrende) Browserleiste mobiler Browser sichtbar?
 *  Dann ist der sichtbare Bereich (innerHeight) kleiner als der große Viewport (100lvh).
 *  In diesem Zustand zeichnen mobile Browser die View-Transition-Bilder um die Höhe der Leiste
 *  verschoben – die Kopfzeile rutscht kurz unter die Leiste und „verschwindet“. */
let sonde = null;
function browserleisteSichtbar() {
  if (!CSS.supports('height', '100lvh')) return false;
  if (!sonde) {
    sonde = document.createElement('div');
    sonde.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none';
    document.body.append(sonde);
  }
  return sonde.offsetHeight - innerHeight > 1;
}

/** Ersatz ohne View Transitions: Texte wechseln sofort und blenden weich auf – die Kopfzeile bleibt stehen. */
function sanftEinblenden() {
  document.querySelectorAll('main, #header h1, #header p, .topbar .brand, .head-link-text, .toc')
    .forEach((e) => e.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: UEBERBLENDEN, easing: 'ease' }));
}

// Zähler gegen Wettläufe: Bei schnellen Klicks gewinnt nur die zuletzt angeforderte Sprache.
let anfrage = 0;

/** Wörterbuch laden und erst danach umschalten. Liefert true, wenn umgeschaltet wurde. */
async function wechsle(neu, { speichern }) {
  if (!SPRACHEN.includes(neu)) return false;
  const nr = ++anfrage;
  if (neu === sprache) return false; // eine ältere, noch ladende Anfrage wird durch nr verworfen
  try {
    await ladeWoerterbuch(neu);
    await Promise.all(helfer.map((h) => h.vorbereiten?.(neu)));
  } catch (err) {
    console.error(`Wörterbuch „${neu}“ konnte nicht geladen werden:`, err);
    return false; // Sprache bleibt unverändert
  }
  if (nr !== anfrage) return false; // inzwischen wurde eine andere Sprache angefordert
  sprache = neu;
  if (speichern) {
    try { localStorage.setItem(SPEICHER_KEY, neu); } catch { /* Speicher gesperrt – Sprache gilt nur für diese Sitzung */ }
  }
  const anwenden = async () => {
    uebersetzeDom();
    bus.emit('sprache', neu);
    await Promise.all(helfer.map((h) => h.zeichnen?.(neu)));
  };
  // Ganze Seite weich überblenden (View Transitions); ohne Unterstützung oder bei reduzierter Bewegung sofort
  if (WENIG_BEWEGUNG.matches || document.hidden) {
    await anwenden();
  } else if (!document.startViewTransition || browserleisteSichtbar()) {
    await anwenden();
    sanftEinblenden();
  } else {
    const vt = document.startViewTransition(anwenden);
    vt.ready.catch(() => {}); vt.finished.catch(() => {}); // übersprungen bei schnellem Doppelklick – kein Fehler
    await vt.updateCallbackDone.catch(() => {});
  }
  return true;
}

export async function setSprache(neu) {
  return wechsle(neu, { speichern: true });
}

/** Sprache übernehmen, die ein anderer Tab gewählt hat – ohne erneut in den Speicher zu schreiben. */
export async function syncSprache(neu) {
  return wechsle(neu, { speichern: false });
}

/** Sprachwechsel in anderen Tabs (OOPlayground ↔ Erklärung) sofort übernehmen. */
export function folgeAnderenTabs() {
  window.addEventListener('storage', (e) => {
    if (e.key === SPEICHER_KEY && e.newValue) syncSprache(e.newValue);
  });
}
