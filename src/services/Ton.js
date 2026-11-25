// Töne zu lautGeben(): Katze, Krokodil und Eule haben je eine Aufnahme, der Mensch eine pro Sprache.
//  - Web Audio API: jede Datei wird einmal geladen und dekodiert (AudioBuffer); ein Ton startet dann
//    ohne Verzögerung über einen AudioBufferSourceNode – gleichzeitig mit der Animation.
//  - Stumm ist voreingestellt (Knopf TonSchalter.js). Stumm: keine Töne – Animation und Ausgabe laufen trotzdem.
//  - Lazy: geladen wird erst, wenn der Ton an ist – die Laute der vorhandenen Tiere und beim Mensch nur die Datei
//    der vorab gewählten nächsten Sprache (sprachen.js). Nach jedem Sprechen wird die übernächste vorgeladen.
//  - lautGeben(n): der Ton beginnt mit jedem Zyklus der Animation neu (n-mal, genau getaktet über die Uhr des
//    AudioContext). halten(), ein neuer Aufruf oder Löschen bricht ab; läuft die Methode aus, klingt der Ton zu Ende.
import { bus } from './EventBus.js';
import { manager, klassenName } from './ObjectManager.js';
import { MENSCH_SPRACHEN, naechsteSprache } from '../models/sprachen.js';

const BASIS = `${import.meta.env.BASE_URL}audio/`;
const TIERLAUTE = { Katze: 'cat.mp3', Krokodil: 'crocodile.mp3', Eule: 'owl.mp3' };

let stumm = true;
let ctx = null; // AudioContext – erst beim Einschalten erzeugt (Browser erlauben Ton erst nach einer Bedienung)

export const istStumm = () => stumm;
export function setStumm(an) {
  stumm = Boolean(an);
  if (stumm) [...laeufe.keys()].forEach((id) => stoppen(id));
  else { kontext(); vorladen(); }
  bus.emit('ton', stumm);
}

function kontext() {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// ---------- Laden (lazy, einmal je Datei) ----------
const puffer = new Map(); // datei -> Promise<AudioBuffer>
function laden(datei) {
  if (!puffer.has(datei)) {
    puffer.set(datei, fetch(BASIS + datei)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
      .then((daten) => kontext().decodeAudioData(daten))
      .catch((e) => { puffer.delete(datei); throw e; })); // beim nächsten Mal neu versuchen
  }
  return puffer.get(datei);
}
const leise = (p) => p.catch((e) => console.warn('Ton nicht geladen:', e.message));

const menschDatei = (code) => MENSCH_SPRACHEN.find((s) => s.code === code)?.datei ?? null;

/** Datei für ein Objekt: beim Mensch die Sprache seines letzten lautGeben(), sonst der Tierlaut. */
function dateiFuer(obj) {
  if (obj.sprache) return menschDatei(obj.sprache);
  return TIERLAUTE[klassenName(obj.constructor)] ?? null;
}

/** Ton an: Laute der vorhandenen Objekte laden – beim Mensch nur die nächste Sprache. */
function vorladen() {
  if (stumm) return;
  for (const { obj } of manager.alle) {
    const k = klassenName(obj.constructor);
    if (TIERLAUTE[k]) leise(laden(TIERLAUTE[k]));
    if (k === 'Mensch') leise(laden(naechsteSprache().datei));
  }
}

// ---------- Abspielen ----------
const laeufe = new Map(); // id -> { quellen: AudioBufferSourceNode[], aus: boolean }

function stoppen(id, { ausklingen = false } = {}) {
  const l = laeufe.get(id);
  if (!l) return;
  l.aus = true;
  if (!ausklingen) l.quellen.forEach((q) => { try { q.stop(); } catch { /* schon zu Ende */ } });
  laeufe.delete(id);
}

async function abspielen(id, datei, anzahl, zyklus) {
  stoppen(id);
  const l = { quellen: [], aus: false };
  laeufe.set(id, l);
  const c = kontext();
  const beginn = c.currentTime; // Zeitpunkt des Aufrufs = Start der Animation
  let buffer;
  try { buffer = await laden(datei); } catch (e) { console.warn(`Ton „${datei}“ nicht geladen:`, e.message); return; }
  if (l.aus) return;
  // War die Datei noch nicht geladen, beginnt der Ton mit dem nächsten Zyklus, der noch kommt – nie versetzt
  for (let i = 0; i < anzahl; i++) {
    const zeit = beginn + i * zyklus;
    if (zeit < c.currentTime - 0.05) continue;
    const q = c.createBufferSource();
    q.buffer = buffer;
    q.connect(c.destination);
    q.start(Math.max(zeit, c.currentTime));
    l.quellen.push(q);
  }
}

bus.on('called', ({ id, obj, methode, args = [] }) => {
  if (stumm || !obj) return;
  if (methode !== 'lautGeben') return;
  const datei = dateiFuer(obj);
  if (datei) abspielen(id, datei, args[0] ?? 1, obj.constructor.zyklen?.lautGeben ?? 2);
  if (obj.sprache) leise(laden(naechsteSprache().datei)); // Mensch: die übernächste Sprache schon jetzt laden
});
bus.on('created', ({ obj }) => {
  if (stumm) return;
  const k = klassenName(obj.constructor);
  if (TIERLAUTE[k]) leise(laden(TIERLAUTE[k]));
  if (k === 'Mensch') leise(laden(naechsteSprache().datei));
});
bus.on('beendet', ({ id, grund }) => stoppen(id, { ausklingen: grund === 'fertig' }));
