// Synchronisation „Pult → Bildschirm“ (Prototyp, nur unter /demonstration/ geladen).
// Pult (Telefon, ?rolle=pult): hört auf den EventBus und auf markierte Bedienelemente (data-sync)
//   und sendet jede Aktion als „event“ mit fortlaufender seq.
// Bildschirm (Laptop, ?rolle=bildschirm oder ohne Parameter): spielt die Ereignisse der Reihe nach ab
//   und antwortet mit „ack“. Er sendet nie eigene Ereignisse – so entstehen keine Echo-Schleifen.
//
// Ereignisse (event.kind):
//   created {cls} · called {id, methode} · versucht {cls} · deleted {id} · deletedAll · movedAll
//   popover {key, offen}            – Karte geöffnet/geschlossen (Klasse, Objekt, Motor)
//   klick {ziel}                    – Knopf mit data-sync (Ausgabe leeren, Motor-Knöpfe, „Nach oben“ …)
//   eingabe {ziel, wert}            – Eingabefeld mit data-sync (Suche der Erklärung)
//   aufklappen {ziel, offen}        – <details data-sync> (Menügruppen, Code-Blöcke der Erklärung)
//   scroll {ziel, x, breite}        – waagerechtes Scrollen eines Bereichs mit data-sync (Objekte im Arbeitsbereich);
//                                     Bildschirm: x · (eigene Fensterbreite / breite des Pults)
//   seite {i, anteil}               – senkrechtes Scrollen der Seite (Playground und Erklärung): Anker-Element i (bzw. -1 = vor
//                                     dem ersten, -2 = ganz unten) und wie weit es schon unter der Kopfleiste durchgelaufen ist
//   navigate {hash} · thema {modus} · sprache {sprache}
import './sync.css';
import { bus } from '../services/EventBus.js';
import { manager, KLASSEN } from '../services/ObjectManager.js';
import { t, getSprache, setSprache, SPRACHEN, bindAttr } from '../i18n/i18n.js';
import { getModus, setModus, MODI } from '../services/Theme.js';
import { popoverNach, offenePopovers, allePopoversSchliessen } from '../components/popover.js';
import { konsolenVerlauf, konsoleSetzen } from '../components/Console/Console.js';
import { el } from '../utils/dom.js';
import { zeigeQr, schliesseQr, qrOffen, qrNeuZeichnen } from './qrDialog.js';

const params = new URLSearchParams(location.search);
export const ROLLE = params.get('rolle') === 'pult' ? 'pult' : 'bildschirm';
/** Welche Seite gerade offen ist: '' = OOPlayground, 'Docs' = Erklärung. */
const ROUTE = document.body.classList.contains('docs') ? 'Docs' : '';
/** Basis aller Demo-Routen, z. B. „/demonstration/“. */
const BASIS = location.pathname.replace(/(\/demonstration)(\/.*)?$/i, '$1/');

// ---------- Raum ----------
// Pult und Bildschirm finden sich nur über denselben Raumcode (?raum=K7QF).
// Der Bildschirm erzeugt ihn selbst, wenn er fehlt; das Pult fragt danach.
const RAUM_MUSTER = /^[A-Z0-9]{3,12}$/;
const raumAus = (v) => { const c = String(v ?? '').trim().toUpperCase(); return RAUM_MUSTER.test(c) ? c : null; };
const ZEICHEN = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ohne 0/O und 1/I – gut abzulesen
function neuerRaum() {
  const z = crypto.getRandomValues(new Uint32Array(4));
  return [...z].map((n) => ZEICHEN[n % ZEICHEN.length]).join('');
}
let RAUM = raumAus(params.get('raum'));
if (!RAUM && ROLLE === 'bildschirm') {
  RAUM = neuerRaum();
  const u = new URL(location.href);
  u.searchParams.set('raum', RAUM);
  history.replaceState(history.state, '', u.href); // Neuladen bleibt im selben Raum
}

/** Geräte-ID des Pults: alle Tabs desselben Browsers zählen als ein Pult (ein Pult je Raum). */
const GERAET = (() => {
  const KEY = 'ooplayground.geraet';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) { id = neuerRaum() + neuerRaum(); localStorage.setItem(KEY, id); }
    return id;
  } catch { return neuerRaum() + neuerRaum(); } // Speicher gesperrt: nur dieser Tab
})();

const KLASSE = new Map(KLASSEN.flatMap((g) => g.kinder));
const aktuellerHash = () => decodeURIComponent(location.hash.slice(1));
const log = (typ, text) => bus.emit('log', { typ, text });
const finde = (ziel) => document.querySelector(`[data-sync="${CSS.escape(ziel)}"]`);

// ---------- Statusanzeige ----------
const status = { verbunden: false, pult: false, bildschirm: false, aktiv: false, abgelehnt: false, fehler: null, pultUrls: [], info: '' };
const badge = el('div', { class: 'sync-badge', role: 'status' });
document.body.append(badge);
// Höhe der Leiste als CSS-Variable: die Speicher-Schaltfläche (memory.css) steht genau darüber
new ResizeObserver(() => document.documentElement.style.setProperty('--sync-badge-h', `${badge.offsetHeight}px`)).observe(badge);

/** Link, mit dem das Telefon als Pult in diesen Raum kommt (LAN-Adresse vom Server, sonst die eigene Adresse). */
const pultLink = () => status.pultUrls[0] ?? `${location.origin}${BASIS}?rolle=pult&raum=${RAUM}`;
const qrZeigen = () => { if (RAUM) zeigeQr({ url: pultLink(), raum: RAUM, gesperrt, umschalten: () => sperreSetzen(!gesperrt) }); };

// ---------- Sperre des Bildschirms ----------
// Sobald ein Pult (neu) dazukommt und sein Zustand übernommen ist, folgt der Bildschirm nur noch dem Pult:
// Maus und Tastatur lösen nichts aus (kein Hover, keine Klicks) – sonst entstünden Karten oder Objekte, die das Pult
// nicht kennt. Bedienbar bleiben nur die Statusleiste und ihr Fenster; dort lässt sich die Sperre aufheben.
// Die Aufhebung gilt, bis sich das nächste Mal ein Pult anmeldet.
let gesperrt = false;
let sperrenBeimSnapshot = true; // nächster Snapshot sperrt (Start bzw. Pult neu angemeldet)
function sperreSetzen(an) {
  gesperrt = an;
  document.documentElement.classList.toggle('sync-gesperrt', an);
  if (an && !document.activeElement?.closest?.('.sync-badge, .sync-qr-backdrop')) document.activeElement?.blur?.();
  zeichneStatus();
  if (qrOffen()) qrZeigen();
}
if (ROLLE === 'bildschirm') {
  // Tastatur: nichts auslösen (Tab, Enter, Escape …) – außer im QR-Fenster, das eigene Tasten hat
  window.addEventListener('keydown', (e) => {
    if (!gesperrt || qrOffen() || e.target.closest?.('.sync-badge')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
  // Maus: pointer-events (sync.css) verhindert Hover und Klicks auf Elemente – ein Klick landet dann aber auf der
  // Seite selbst und würde z. B. offene Karten schließen (popover.js). Echte Klicks hier abfangen;
  // nachgespielte Klicks des Pults (element.click(), isTrusted = false) gehen durch.
  for (const typ of ['click', 'dblclick', 'auxclick', 'contextmenu', 'pointerdown', 'mousedown', 'mouseup']) {
    window.addEventListener(typ, (e) => {
      if (!gesperrt || !e.isTrusted || e.target.closest?.('.sync-badge, .sync-qr-backdrop')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);
  }
}
let qrGezeigt = false; // beim Start einmal automatisch öffnen

// Bildschirm: Klick (oder Enter/Leertaste) auf die Statusleiste öffnet den QR-Code
if (ROLLE === 'bildschirm') {
  badge.classList.add('klickbar');
  badge.setAttribute('role', 'button');
  badge.tabIndex = 0;
  badge.dataset.keinSchliessen = ''; // Klick schließt keine offenen Karten (popover.js)
  badge.addEventListener('click', qrZeigen);
  badge.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); qrZeigen(); } });
  bus.on('sprache', qrNeuZeichnen);
}

/** Pult ohne (gültigen) Raumcode: Eingabefeld – die Seite lädt dann mit ?raum=… neu. */
function raumFormular() {
  const feld = el('input', {
    class: 'sync-raum-feld', type: 'text', inputmode: 'text', autocapitalize: 'characters', autocomplete: 'off',
    spellcheck: 'false', maxlength: '12', placeholder: 'K7QF', 'aria-label': t('sync.raumFehlt'), value: params.get('raum') ?? ''
  });
  const form = el('form', {
    class: 'sync-raum-form',
    onsubmit: (e) => {
      e.preventDefault();
      const code = raumAus(feld.value);
      if (!code) { feld.setCustomValidity(t('sync.raumUngueltig')); feld.reportValidity(); return; }
      const u = new URL(location.href);
      u.searchParams.set('raum', code);
      location.assign(u.href);
    }
  }, feld, el('button', { type: 'submit', class: 'sync-test' }, t('sync.verbinden')));
  feld.addEventListener('input', () => feld.setCustomValidity(''));
  return form;
}

function zeichneStatus() {
  const punkt = el('span', { class: 'sync-dot' });
  const kopf = [punkt, el('b', {}, t(`sync.${ROLLE}`))];
  if (RAUM && !status.fehler) kopf.push(' · ', el('span', { class: 'sync-raum' }, t('sync.raum', { raum: RAUM })));
  if (gesperrt) kopf.push(' · ', el('span', { class: 'sync-schloss', title: t('sync.gesperrtTitel') }, `🔒 ${t('sync.gesperrt')}`));
  let text, zustand, extra = null;
  if (!RAUM || status.fehler === 'raum') {
    text = t(RAUM ? 'sync.raumUngueltig' : 'sync.raumFehlt'); zustand = 'warten'; extra = raumFormular();
  } else if (status.ersetzt) { text = t('sync.ersetzt'); zustand = 'aus'; }
  else if (!status.verbunden) { text = status.info || t('sync.verbinde'); zustand = 'aus'; }
  else if (ROLLE === 'pult' && status.abgelehnt) { text = t('sync.andererPult'); zustand = 'aus'; }
  else if (ROLLE === 'pult' ? !status.bildschirm : !status.pult) {
    text = t(ROLLE === 'pult' ? 'sync.warteBildschirm' : 'sync.wartePult'); zustand = 'warten';
    // Bildschirm: Link für das Telefon anzeigen (LAN-Adresse vom Server, sonst die eigene Adresse)
    // Bildschirm: kein Link in der Leiste – den gibt es im QR-Fenster (Klick auf die Leiste)
  } else { text = t('sync.synchron'); zustand = 'an'; }
  badge.dataset.zustand = zustand;
  if (ROLLE === 'bildschirm') badge.title = t('sync.qrOeffnen');
  badge.replaceChildren(el('span', { class: 'sync-zeile' }, ...kopf, ` · ${text}`));
  if (extra) badge.append(extra);
  if (ROLLE === 'pult' && params.has('test') && !extra) {
    badge.firstChild.append(el('button', { type: 'button', class: 'sync-test', onclick: fehlerTest }, t('sync.fehlerTest')));
  }
}
bus.on('sprache', zeichneStatus); // Sprachwechsel: Statustext neu übersetzen

// ---------- Verbindung ----------
let ws = null;
let verzoegerung = 1000;
let wiederholung = null;
let verlassen = false; // Seite wird verlassen (pagehide) – nicht neu verbinden

// Herzschlag: Ein gesperrtes Telefon friert die Seite ein, und das Betriebssystem kappt die Verbindung oft still.
// Nach dem Entsperren meldet der Browser die tote Verbindung erst nach vielen Sekunden als geschlossen – bzw. ein im
// Hintergrund begonnener Verbindungsaufbau hängt. Deshalb prüft der Client selbst: ping an den Server, Antwort
// (pong oder irgendeine Nachricht) innerhalb der Frist – sonst sofort eine neue Verbindung.
const PING_MS = 5000;          // regelmäßiger ping, solange verbunden
const PONG_FRIST = 3000;       // so lange auf Antwort warten
const PONG_FRIST_WACH = 1500;  // nach dem Entsperren / Zurückkehren: schneller entscheiden
const AUFBAU_FRIST = 4000;     // Verbindungsaufbau, der länger dauert, gilt als hängend
let pingTimer = null;
let pongFrist = null;
let aufbauFrist = null;

function herzschlag(frist = PONG_FRIST) {
  // Verborgen: Timer werden gedrosselt bzw. eingefroren – eine Frist würde beim Aufwachen fälschlich ablaufen
  if (ws?.readyState !== WebSocket.OPEN || document.visibilityState === 'hidden') return;
  if (pongFrist) { if (frist >= PONG_FRIST) return; clearTimeout(pongFrist); } // kürzere Frist ersetzt die laufende
  const sock = ws;
  senden({ type: 'ping' });
  pongFrist = setTimeout(() => { pongFrist = null; if (ws === sock) neuVerbinden(); }, frist);
}

function timerStoppen() {
  clearInterval(pingTimer); pingTimer = null;
  clearTimeout(pongFrist); pongFrist = null;
  clearTimeout(aufbauFrist); aufbauFrist = null;
}

/** Verbindung gilt als tot: verwerfen und ohne Wartezeit neu aufbauen. */
function neuVerbinden() {
  if (verlassen || status.ersetzt) return;
  const alt = ws;
  ws = null; // onclose der alten Verbindung wird dadurch ignoriert
  timerStoppen();
  try { alt?.close(4000, 'herzschlag'); } catch { /* schon zu */ }
  if (status.verbunden) { status.verbunden = false; beimTrennen(); }
  verzoegerung = 1000;
  verbinden();
}

function senden(nachricht) {
  if (ws?.readyState === WebSocket.OPEN) { ws.send(JSON.stringify(nachricht)); return true; }
  return false;
}

// sichtbar: Nach einem Verbindungsabbruch melden sich alle Pult-Tabs neu – nur der sichtbare darf steuern
const anmelden = () => senden({
  type: 'hello', rolle: ROLLE, route: ROUTE, raum: RAUM, geraet: GERAET, sichtbar: document.visibilityState === 'visible'
});

function verbinden() {
  if (!RAUM) return; // Pult ohne Raumcode: erst eingeben
  clearTimeout(wiederholung);
  wiederholung = null;
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  timerStoppen();
  const sock = new WebSocket(`${proto}//${location.host}/ws?rolle=${ROLLE}`);
  sock.begonnen = Date.now();
  ws = sock;
  status.info = '';
  zeichneStatus();
  aufbauFrist = setTimeout(() => { if (ws === sock && sock.readyState === WebSocket.CONNECTING) neuVerbinden(); }, AUFBAU_FRIST);
  sock.onopen = () => {
    if (ws !== sock) return;
    clearTimeout(aufbauFrist); aufbauFrist = null;
    verzoegerung = 1000;
    status.verbunden = true;
    anmelden();
    zeichneStatus();
    pingTimer = setInterval(() => herzschlag(), PING_MS);
  };
  sock.onmessage = (m) => {
    if (ws !== sock) return;
    clearTimeout(pongFrist); pongFrist = null; // jede Nachricht zeigt: die Verbindung lebt
    let msg;
    try { msg = JSON.parse(m.data); } catch { return; }
    if (msg.type === 'pong') return;
    if (msg.type === 'status') {
      const warPult = status.pult;
      Object.assign(status, {
        pult: Boolean(msg.pult), bildschirm: Boolean(msg.bildschirm), aktiv: Boolean(msg.aktiv),
        abgelehnt: Boolean(msg.abgelehnt), fehler: msg.fehler ?? null, pultUrls: msg.pultUrls ?? status.pultUrls
      });
      zeichneStatus();
      if (ROLLE === 'bildschirm' && !warPult && status.pult) sperrenBeimSnapshot = true;
      if (ROLLE === 'bildschirm' && !msg.fehler) {
        // Beim Start ohne Pult: QR-Code zeigen; sobald ein Pult kommt, schließt er sich von selbst
        if (!qrGezeigt) { qrGezeigt = true; if (!status.pult) qrZeigen(); }
        else if (qrOffen()) { if (!warPult && status.pult) schliesseQr(); else qrZeigen(); }
      }
      return;
    }
    (ROLLE === 'pult' ? pultEmpfang : bildschirmEmpfang)(msg);
  };
  sock.onclose = (e) => {
    if (ws !== sock) return;
    timerStoppen();
    if (verlassen) { status.verbunden = false; beimTrennen(); return; }
    status.verbunden = false;
    beimTrennen();
    if (e.code === 4001) { status.ersetzt = true; zeichneStatus(); return; } // anderer Bildschirm hat übernommen
    // Exponentielle Wartezeit: 1, 2, 4, 8, 10, 10 … s
    status.info = t('sync.getrennt', { s: verzoegerung / 1000 });
    zeichneStatus();
    wiederholung = setTimeout(verbinden, verzoegerung);
    verzoegerung = Math.min(verzoegerung * 2, 10000);
  };
}

// Telefon entsperrt / Tab wieder sichtbar: sofort neu verbinden bzw. sich als aktives Pult melden
// (mehrere Pult-Tabs: Playground + Erklärung – der Bildschirm folgt dem, der zuletzt benutzt wurde)
function wiederAktiv() {
  if (document.visibilityState !== 'visible' || status.ersetzt || verlassen) return;
  if (ws?.readyState === WebSocket.OPEN) {
    herzschlag(PONG_FRIST_WACH); // lebt die Verbindung nach dem Schlaf noch? Sonst in 1,5 s neu verbinden
    if (ROLLE === 'pult' && !status.aktiv) anmelden();
  } else if (ws?.readyState === WebSocket.CONNECTING) {
    // Aufbau hängt (z. B. im Hintergrund begonnen, während das Telefon schlief): neu beginnen
    if (Date.now() - ws.begonnen > 1000) neuVerbinden();
  } else { verzoegerung = 1000; verbinden(); }
}
document.addEventListener('visibilitychange', () => {
  // Verborgen: Pult meldet sich ab (der Bildschirm zeigt „warte auf Pult“); sichtbar: wieder anmelden
  if (document.visibilityState === 'hidden') {
    clearTimeout(pongFrist); pongFrist = null; // siehe herzschlag(): beim Aufwachen neu prüfen
    if (ROLLE === 'pult') senden({ type: 'pause' });
  }
  else wiederAktiv();
});
// Tab wird geschlossen oder verlassen: Verbindung sofort sauber schließen
window.addEventListener('pagehide', () => {
  if (ROLLE === 'pult') senden({ type: 'pause' });
  verlassen = true;
  clearTimeout(wiederholung);
  timerStoppen();
  ws?.close(1000, 'pagehide');
});
window.addEventListener('focus', wiederAktiv);
window.addEventListener('online', wiederAktiv); // Netz wieder da (z. B. WLAN nach dem Aufwachen)
window.addEventListener('pageshow', (e) => { if (e.persisted) { verlassen = false; wiederAktiv(); } }); // aus dem Back-Forward-Cache

// ---------- Pult ----------
let seq = 0;              // zuletzt vergebene Nummer
let synchron = false;     // erst nach dem ersten Snapshot werden Ereignisse gesendet
const offen = new Map();  // seq -> { event, erwartet }

/** Alles, was der Bildschirm braucht, um genauso auszusehen. */
function zustand() {
  const alle = (sel) => [...document.querySelectorAll(sel)];
  const ui = {
    thema: getModus(),
    sprache: getSprache(),
    popovers: offenePopovers(),
    gedrueckt: alle('button[data-sync][aria-expanded="true"]').map((b) => b.dataset.sync),
    eingaben: Object.fromEntries(alle('input[data-sync]').map((i) => [i.dataset.sync, i.value])),
    scroll: Object.fromEntries(alle('[data-sync]').filter((e) => e.scrollLeft > 0).map((e) => [e.dataset.sync, e.scrollLeft])),
    breite: innerWidth,
    details: Object.fromEntries(alle('details[data-sync]').map((d) => [d.dataset.sync, d.open]))
  };
  ui.seite = seitenPosition();
  if (ROUTE === 'Docs') return { route: ROUTE, hash: aktuellerHash(), objects: [], counters: {}, ui };
  return { route: ROUTE, hash: '', ...manager.exportieren(), konsole: konsolenVerlauf(), ui };
}

function snapshotSenden() {
  offen.clear();
  synchron = senden({ type: 'snapshot', seq, state: zustand() });
}

function ereignis(event, erwartet) {
  if (ROLLE !== 'pult' || !synchron) return; // ohne Bildschirm gehen Ereignisse verloren – der nächste Snapshot holt sie nach
  seq += 1;
  offen.set(seq, { event, erwartet });
  if (!senden({ type: 'event', seq, event })) offen.delete(seq);
}

function pultEmpfang(msg) {
  if (msg.type === 'need_snapshot') { snapshotSenden(); return; }
  if (msg.type !== 'ack') return;
  const e = offen.get(msg.seq);
  offen.delete(msg.seq);
  if (!msg.ok) {
    log('fehler', t('sync.ackFehler', { seq: msg.seq, fehler: msg.error }));
    return; // Server fordert daraufhin selbst einen Snapshot an
  }
  if (!e?.erwartet) return;
  const r = msg.result ?? {};
  const abweichung = e.event.kind === 'created' ? r.id !== e.erwartet.id
    : e.event.kind === 'called' ? r.sprache === getSprache() && r.ergebnis !== e.erwartet.ergebnis // Texte sind sprachabhängig
    : false;
  if (abweichung) {
    log('fehler', t('sync.abweichung', { seq: msg.seq }));
    console.warn('[sync] Abweichung', { seq: msg.seq, erwartet: e.erwartet, erhalten: r });
    snapshotSenden();
  }
}

if (ROLLE === 'pult') {
  // Fachliche Aktionen (ObjectManager)
  bus.on('created', ({ id, obj }) => ereignis({ kind: 'created', cls: obj.constructor.name }, { id }));
  bus.on('called', ({ id, methode, ergebnis, teil }) => { if (!teil) ereignis({ kind: 'called', id, methode }, { ergebnis }); });
  bus.on('aktion', (a) => ereignis(a)); // versucht / deleted / deletedAll / movedAll
  // Oberfläche
  bus.on('popover', ({ key, offen: auf }) => ereignis({ kind: 'popover', key, offen: auf }));
  bus.on('navigate', ({ hash }) => ereignis({ kind: 'navigate', hash }));
  bus.on('theme', (modus) => ereignis({ kind: 'thema', modus }));
  bus.on('sprache', (sprache) => ereignis({ kind: 'sprache', sprache }));

  // Markierte Bedienelemente: Knöpfe, Auf-/Zuklappen, Eingaben (Capture: vor den eigenen Handlern)
  document.addEventListener('click', (e) => {
    const knopf = e.target.closest?.('button[data-sync]');
    if (knopf) { ereignis({ kind: 'klick', ziel: knopf.dataset.sync }); return; }
    const d = e.target.closest?.('summary')?.parentElement;
    if (d?.matches('details[data-sync]')) ereignis({ kind: 'aufklappen', ziel: d.dataset.sync, offen: !d.open });
  }, true);
  // Senkrechtes Scrollen der Seite (Erklärung und Playground – z. B. wenn der Laptop-Bildschirm zu niedrig ist):
  // höchstens ein Ereignis je Bild
  let seiteBild = 0;
  window.addEventListener('scroll', () => {
    seiteBild ||= requestAnimationFrame(() => { seiteBild = 0; ereignis({ kind: 'seite', ...seitenPosition() }); });
  }, { passive: true });

  // Waagerechtes Scrollen (scroll steigt nicht auf – daher Capture); höchstens ein Ereignis je Bild
  const scrollOffen = new Map(); // ziel -> Element
  let scrollBild = 0;
  document.addEventListener('scroll', (e) => {
    const z = e.target;
    if (!(z instanceof Element) || !z.dataset.sync) return;
    scrollOffen.set(z.dataset.sync, z);
    scrollBild ||= requestAnimationFrame(() => {
      scrollBild = 0;
      scrollOffen.forEach((elm, ziel) => ereignis({ kind: 'scroll', ziel, x: Math.round(elm.scrollLeft), breite: innerWidth }));
      scrollOffen.clear();
    });
  }, true);
  document.addEventListener('input', (e) => {
    const f = e.target.closest?.('input[data-sync], textarea[data-sync]');
    if (f) ereignis({ kind: 'eingabe', ziel: f.dataset.sync, wert: f.value });
  }, true);
}

/** Testknopf (nur mit ?test): Aufruf einer Methode, die es nicht gibt → ack.ok === false. */
function fehlerTest() {
  const id = manager.alle[0]?.id ?? 'katze1';
  ereignis({ kind: 'called', id, methode: 'gibtEsNicht' });
}

// ---------- Bildschirm ----------
let letzte = null; // zuletzt angewandte seq; null = noch kein Snapshot
let kette = Promise.resolve(); // Nachrichten streng nacheinander abarbeiten (Sprachwechsel ist asynchron)

/** URL der Seite, die zum Zustand des Pults passt (Rolle und andere Parameter bleiben erhalten). */
function zielUrl(route, hash) {
  const u = new URL(location.href);
  u.pathname = BASIS + route;
  u.hash = hash ? encodeURIComponent(hash) : '';
  return u.href;
}

function springeZu(hash) {
  if (!hash) return;
  if (!document.getElementById(hash)) throw new Error(t('sync.keinAbschnitt', { hash }));
  if (aktuellerHash() === hash) window.dispatchEvent(new HashChangeEvent('hashchange')); // erneut scrollen
  else location.hash = hash; // löst hashchange -> springe() aus
}

function element(ziel) {
  const e = finde(ziel);
  if (!e) throw new Error(t('sync.keinElement', { ziel }));
  return e;
}

// ---------- Senkrechtes Scrollen der Seite ----------
// Telefon und Laptop brechen den Text verschieden um – die Seite ist auf dem Telefon viel länger. Deshalb kein
// Verhältnis der Höhen, sondern ein Anker: das Element, das gerade unter der Kopfleiste steht, und der Anteil,
// um den es schon durchgelaufen ist (bis zum nächsten Element). Beide Seiten zeigen so dieselbe Stelle oben.
// Playground: die Abschnitte und ihre Teile (Kopfzeile = vor dem ersten Anker).
const ANKER = ROUTE === 'Docs'
  ? '#inhalt :is(h2, h3, h4, p, pre, ul, ol, table, details, figure, blockquote, hr, img)'
  : 'main :is(section, h2, #class-panel, .bar, .hint, .grid, .out)';

/** Unterkante der festen Kopfleiste – die Lesekante (eigene Höhe je Gerät). */
const lesekante = () => Math.max(0, document.getElementById('topbar')?.getBoundingClientRect().bottom ?? 0);

/** Sichtbare Anker mit ihrer Oberkante in Seitenkoordinaten (zugeklappte Inhalte haben keine Höhe und fallen weg). */
function anker() {
  const y0 = window.scrollY;
  return [...document.querySelectorAll(ANKER)]
    .map((e) => e.getBoundingClientRect())
    .filter((r) => r.height > 0)
    .map((r) => r.top + y0);
}

function seitenPosition() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (window.scrollY >= max - 1 && max > 0) return { i: -2, anteil: 0 }; // ganz unten
  const tops = anker();
  const y = window.scrollY + lesekante();
  let i = -1;
  for (let k = 0; k < tops.length && tops[k] <= y; k++) i = k;
  if (i < 0) { // vor dem ersten Anker: Anteil der Strecke bis dorthin
    const bis = (tops[0] ?? y) - lesekante();
    return { i: -1, anteil: bis > 0 ? Math.min(1, window.scrollY / bis) : 0 };
  }
  const naechste = tops[i + 1] ?? document.documentElement.scrollHeight;
  return { i, anteil: Math.min(1, Math.max(0, (y - tops[i]) / Math.max(1, naechste - tops[i]))) };
}

function seiteSetzen({ i, anteil = 0 }) {
  const max = document.documentElement.scrollHeight - innerHeight;
  const tops = anker();
  let ziel;
  if (i === -2) ziel = max;
  else if (i === -1) ziel = anteil * Math.max(0, (tops[0] ?? 0) - lesekante());
  else {
    if (tops[i] === undefined) throw new Error(t('sync.keinElement', { ziel: `#${i}` }));
    const naechste = tops[i + 1] ?? document.documentElement.scrollHeight;
    ziel = tops[i] + anteil * (naechste - tops[i]) - lesekante();
  }
  window.scrollTo({ top: Math.round(ziel), behavior: 'instant' });
  return Math.round(window.scrollY);
}

/** Scrollposition proportional zur Fensterbreite übernehmen: x · (Breite Bildschirm / Breite Pult). */
function scrollen(e, x, breite) {
  const faktor = breite > 0 ? innerWidth / breite : 1;
  const ziel = Math.round((Number(x) || 0) * faktor);
  e.scrollTo({ left: ziel, behavior: 'instant' }); // Browser begrenzt auf [0, scrollWidth - clientWidth]
  return Math.round(e.scrollLeft) || ziel;
}

function eingeben(feld, wert) {
  if (feld.value === wert) return;
  feld.value = wert;
  feld.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Sprache wechseln, aber höchstens 3 s warten: Bleibt die Überblendung hängen (Tab wird nicht gezeichnet),
 *  darf das nicht die ganze Warteschlange blockieren. Der Wechsel selbst läuft trotzdem zu Ende. */
// Der Bildschirm speichert Sprache und Thema des Pults (setSprache/setModus) – so startet jede neu geladene
// Seite (z. B. beim Wechsel zwischen Playground und Erklärung) gleich in der Sprache des Pults.
const spracheUebernehmen = (lang) => Promise.race([setSprache(lang), new Promise((r) => setTimeout(r, 3000))]);

/** Vor dem Seitenwechsel: Sprache und Thema des Pults direkt speichern (gelesen beim Laden, vor dem ersten Zeichnen). */
function vorabSpeichern(ui = {}) {
  try {
    if (SPRACHEN.includes(ui.sprache)) localStorage.setItem('ooplayground.sprache', ui.sprache); // = SPEICHER_KEY in i18n.js
    if (MODI.includes(ui.thema)) localStorage.setItem('ooplayground.theme', ui.thema);            // = SPEICHER_KEY in Theme.js
  } catch { /* Speicher gesperrt – dann wie bisher erst nach dem Snapshot */ }
}

const nurPlayground =() => { if (ROUTE !== '') throw new Error('route'); };

async function anwenden(ev) {
  switch (ev.kind) {
    case 'created': {
      nurPlayground();
      const K = KLASSE.get(ev.cls);
      if (!K) throw new Error(t('error.unknownClass', { liste: ev.cls }));
      const id = manager.erstellen(K);
      if (!id) throw new Error(t('error.abstract'));
      return { id };
    }
    case 'called':
      nurPlayground();
      return { ergebnis: manager.aufrufen(ev.id, ev.methode), sprache: getSprache() };
    case 'versucht': {
      nurPlayground();
      const g = KLASSEN.find((k) => k.name === ev.cls);
      if (!g) throw new Error(t('error.unknownClass', { liste: ev.cls }));
      manager.versuchen(g.cls);
      return {};
    }
    case 'deleted':
      nurPlayground();
      if (!manager.alle.some((o) => o.id === ev.id)) throw new Error(t('error.noObject', { id: ev.id }));
      manager.loeschen(ev.id);
      return {};
    case 'deletedAll': nurPlayground(); manager.alleLoeschen(); return {};
    case 'movedAll': nurPlayground(); manager.alleBewegen(); return {};
    case 'popover': {
      const api = popoverNach(ev.key);
      if (!api) { if (!ev.offen) return {}; throw new Error(t('sync.keinElement', { ziel: ev.key })); } // weg = schon zu
      if (ev.offen) api.open(); else api.close();
      return {};
    }
    case 'klick': element(ev.ziel).click(); return {};
    case 'eingabe': eingeben(element(ev.ziel), ev.wert ?? ''); return {};
    case 'aufklappen': element(ev.ziel).open = Boolean(ev.offen); return {};
    case 'scroll': return { scroll: scrollen(element(ev.ziel), ev.x, ev.breite) };
    case 'seite': return { scroll: seiteSetzen(ev) };
    case 'thema': setModus(ev.modus); return { modus: getModus() };
    case 'sprache': await spracheUebernehmen(ev.sprache); return { sprache: getSprache() };
    case 'navigate':
      if (ROUTE !== 'Docs') throw new Error('route');
      springeZu(ev.hash);
      return { hash: ev.hash };
    default: throw new Error(`unknown kind: ${ev.kind}`);
  }
}

async function snapshotAnwenden(s, snapSeq) {
  if ((s.route ?? '') !== ROUTE) { vorabSpeichern(s.ui); location.replace(zielUrl(s.route ?? '', s.hash)); return; }
  letzte = snapSeq;
  const ui = s.ui ?? {};
  if (ui.thema) setModus(ui.thema);
  if (ui.sprache) await spracheUebernehmen(ui.sprache); // Erklärung wird dabei neu gezeichnet – danach erst den Rest
  const versuch = (f) => { try { f(); } catch (e) { console.warn('[sync]', e.message); } };
  if (ROUTE === '') {
    allePopoversSchliessen();
    versuch(() => manager.wiederherstellen(s));
    konsoleSetzen(s.konsole ?? []);
    for (const key of ui.popovers ?? []) popoverNach(key)?.open(); // Eltern vor Kindern
    for (const [ziel, x] of Object.entries(ui.scroll ?? {})) { const e = finde(ziel); if (e) scrollen(e, x, ui.breite); }
    for (const ziel of ui.gedrueckt ?? []) {
      const b = finde(ziel);
      if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    }
    if (ui.seite) versuch(() => seiteSetzen(ui.seite));
  } else {
    // Suche und Auf-/Zuklappen wie beim Pult, danach die genaue Scrollposition (hängt von den Höhen ab)
    for (const [ziel, wert] of Object.entries(ui.eingaben ?? {})) { const f = finde(ziel); if (f) eingeben(f, wert); }
    for (const [ziel, auf] of Object.entries(ui.details ?? {})) { const d = finde(ziel); if (d) d.open = auf; }
    // Hash nur still setzen – springe() würde zum Abschnittsanfang scrollen
    history.replaceState(null, '', location.pathname + location.search + (s.hash ? `#${encodeURIComponent(s.hash)}` : ''));
    if (ui.seite) versuch(() => seiteSetzen(ui.seite));
    else if (s.hash) versuch(() => springeZu(s.hash));
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (sperrenBeimSnapshot) { sperrenBeimSnapshot = false; sperreSetzen(true); }
  console.info(`[sync] Zustand vom Pult übernommen (seq ${snapSeq}, ${s.objects?.length ?? 0} Objekt(e)).`);
}

async function verarbeiten(msg) {
  if (msg.type === 'snapshot') { await snapshotAnwenden(msg.state ?? {}, msg.seq); return; }
  if (msg.type !== 'event') return;
  if (letzte === null || msg.seq !== letzte + 1) {
    senden({ type: 'ack', seq: msg.seq, ok: false, error: 'seq_gap' });
    return;
  }
  letzte = msg.seq;
  try { senden({ type: 'ack', seq: msg.seq, ok: true, result: await anwenden(msg.event) }); }
  catch (e) { senden({ type: 'ack', seq: msg.seq, ok: false, error: e.message }); }
}

function bildschirmEmpfang(msg) {
  kette = kette.then(() => verarbeiten(msg)).catch((e) => console.error('[sync]', e));
}

function beimTrennen() {
  synchron = false;
  offen.clear();
  letzte = null;
}

// ---------- Links innerhalb der Demonstration ----------
// index.html / docs.html -> /demonstration/ bzw. /demonstration/Docs, die Rolle bleibt erhalten.
// Auf der normalen Seite öffnen diese Links einen neuen Tab; in der Demonstration bleibt alles im selben Tab –
// so steuert das Pult (wie der Bildschirm) immer genau eine Seite.
const istSeitenLink = (a) => /\/(index|docs)\.html$/i.test(new URL(a.href, location.href).pathname);
for (const a of document.querySelectorAll('a[target="_blank"][href]')) {
  if (!istSeitenLink(a)) continue;
  a.removeAttribute('target');
  if (a.classList.contains('docs-link')) { bindAttr(a, 'title', 'header.docsTipDemo'); bindAttr(a, 'aria-label', 'header.docsTipDemo'); }
}
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]');
  if (!a) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  const seite = u.pathname.match(/\/(index|docs)\.html$/i)?.[1]?.toLowerCase();
  if (!seite) return;
  u.pathname = BASIS + (seite === 'docs' ? 'Docs' : '');
  u.searchParams.set('rolle', ROLLE);
  if (RAUM) u.searchParams.set('raum', RAUM);
  a.href = u.href;
  a.removeAttribute('target'); // auch Links, die erst später entstanden sind
}, true);

window.ooSync = { rolle: ROLLE, get seq() { return ROLLE === 'pult' ? seq : letzte; }, fehlerTest };
zeichneStatus();
verbinden();
