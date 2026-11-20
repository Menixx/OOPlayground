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

// Zähler gegen Wettläufe: Bei schnellen Klicks gewinnt nur die zuletzt angeforderte Sprache.
let anfrage = 0;

/** Wörterbuch laden und erst danach umschalten. Liefert true, wenn umgeschaltet wurde. */
async function wechsle(neu, { speichern }) {
  if (!SPRACHEN.includes(neu)) return false;
  const nr = ++anfrage;
  if (neu === sprache) return false; // eine ältere, noch ladende Anfrage wird durch nr verworfen
  try {
    await ladeWoerterbuch(neu);
  } catch (err) {
    console.error(`Wörterbuch „${neu}“ konnte nicht geladen werden:`, err);
    return false; // Sprache bleibt unverändert
  }
  if (nr !== anfrage) return false; // inzwischen wurde eine andere Sprache angefordert
  sprache = neu;
  if (speichern) {
    try { localStorage.setItem(SPEICHER_KEY, neu); } catch { /* Speicher gesperrt – Sprache gilt nur für diese Sitzung */ }
  }
  uebersetzeDom();
  bus.emit('sprache', neu);
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
