// Synchronisation „Pult → Bildschirm“ (Prototyp, nur unter /demonstration/ geladen).
// Pult (Telefon, ?rolle=pult): hört auf den EventBus und sendet created/called/navigate als „event“ mit seq.
// Bildschirm (Laptop, ?rolle=bildschirm oder ohne Parameter): spielt Ereignisse ab und antwortet mit „ack“.
// Der Bildschirm sendet nie eigene Ereignisse – so entstehen keine Echo-Schleifen.
import './sync.css';
import { bus } from '../services/EventBus.js';
import { manager, KLASSEN } from '../services/ObjectManager.js';
import { t, getSprache } from '../i18n/i18n.js';
import { el } from '../utils/dom.js';

const params = new URLSearchParams(location.search);
export const ROLLE = params.get('rolle') === 'pult' ? 'pult' : 'bildschirm';
/** Welche Seite gerade offen ist: '' = OOPlayground, 'Docs' = Erklärung. */
const ROUTE = document.body.classList.contains('docs') ? 'Docs' : '';
/** Basis aller Demo-Routen, z. B. „/demonstration/“. */
const BASIS = location.pathname.replace(/(\/demonstration)(\/.*)?$/i, '$1/');

const KLASSE = new Map(KLASSEN.flatMap((g) => g.kinder));
const aktuellerHash = () => decodeURIComponent(location.hash.slice(1));
const log = (typ, text) => bus.emit('log', { typ, text });

// ---------- Statusanzeige ----------
const status = { verbunden: false, pult: false, bildschirm: false, info: '' };
const badge = el('div', { class: 'sync-badge', role: 'status' });
document.body.append(badge);

function zeichneStatus() {
  const punkt = el('span', { class: 'sync-dot' });
  let text, zustand;
  if (status.ersetzt) { text = t('sync.ersetzt'); zustand = 'aus'; }
  else if (!status.verbunden) { text = status.info || t('sync.verbinde'); zustand = 'aus'; }
  else if (ROLLE === 'pult' ? !status.bildschirm : !status.pult) {
    text = t(ROLLE === 'pult' ? 'sync.warteBildschirm' : 'sync.wartePult'); zustand = 'warten';
  } else { text = t('sync.synchron'); zustand = 'an'; }
  badge.dataset.zustand = zustand;
  badge.replaceChildren(punkt, el('b', {}, t(`sync.${ROLLE}`)), ` · ${text}`);
  if (ROLLE === 'pult' && params.has('test')) {
    badge.append(el('button', { type: 'button', class: 'sync-test', onclick: fehlerTest }, t('sync.fehlerTest')));
  }
}
bus.on('sprache', zeichneStatus); // Sprachwechsel: Statustext neu übersetzen

// ---------- Verbindung ----------
let ws = null;
let verzoegerung = 1000;
let wiederholung = null;

function senden(nachricht) {
  if (ws?.readyState === WebSocket.OPEN) { ws.send(JSON.stringify(nachricht)); return true; }
  return false;
}

function verbinden() {
  clearTimeout(wiederholung);
  wiederholung = null;
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const sock = new WebSocket(`${proto}//${location.host}/ws?rolle=${ROLLE}`);
  ws = sock;
  status.info = '';
  zeichneStatus();
  sock.onopen = () => {
    verzoegerung = 1000;
    status.verbunden = true;
    senden({ type: 'hello', rolle: ROLLE, route: ROUTE });
    zeichneStatus();
  };
  sock.onmessage = (m) => {
    let msg;
    try { msg = JSON.parse(m.data); } catch { return; }
    if (msg.type === 'status') { Object.assign(status, { pult: msg.pult, bildschirm: msg.bildschirm, aktiv: msg.aktiv }); zeichneStatus(); return; }
    (ROLLE === 'pult' ? pultEmpfang : bildschirmEmpfang)(msg);
  };
  sock.onclose = (e) => {
    if (ws !== sock) return;
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
  if (document.visibilityState !== 'visible' || status.ersetzt) return;
  if (ws?.readyState === WebSocket.OPEN) { if (ROLLE === 'pult' && !status.aktiv) senden({ type: 'hello', rolle: ROLLE, route: ROUTE }); }
  else if (ws?.readyState !== WebSocket.CONNECTING) { verzoegerung = 1000; verbinden(); }
}
document.addEventListener('visibilitychange', wiederAktiv);
window.addEventListener('focus', wiederAktiv);
window.addEventListener('pageshow', (e) => { if (e.persisted) wiederAktiv(); }); // aus dem Back-Forward-Cache

// ---------- Pult ----------
let seq = 0;              // zuletzt vergebene Nummer
let synchron = false;     // erst nach dem ersten Snapshot werden Ereignisse gesendet
const offen = new Map();  // seq -> { event, erwartet }

function zustand() {
  const { objects, counters } = ROUTE === '' ? manager.exportieren() : { objects: [], counters: {} };
  return { route: ROUTE, hash: ROUTE === 'Docs' ? aktuellerHash() : '', objects, counters };
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
  bus.on('created', ({ id, obj }) => ereignis({ kind: 'created', cls: obj.constructor.name }, { id }));
  bus.on('called', ({ id, methode, ergebnis }) => ereignis({ kind: 'called', id, methode }, { ergebnis }));
  bus.on('navigate', ({ hash }) => ereignis({ kind: 'navigate', hash }));
  // Löschen ist (noch) kein eigenes Ereignis: der Bildschirm bekommt stattdessen den neuen Zustand
  bus.on('deleted', () => { if (synchron) snapshotSenden(); });
}

/** Testknopf (nur mit ?test): Aufruf einer Methode, die es nicht gibt → ack.ok === false. */
function fehlerTest() {
  const id = manager.alle[0]?.id ?? 'katze1';
  ereignis({ kind: 'called', id, methode: 'gibtEsNicht' });
}

// ---------- Bildschirm ----------
let letzte = null; // zuletzt angewandte seq; null = noch kein Snapshot

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

function anwenden(ev) {
  switch (ev.kind) {
    case 'created': {
      if (ROUTE !== '') throw new Error('route');
      const K = KLASSE.get(ev.cls);
      if (!K) throw new Error(t('error.unknownClass', { liste: ev.cls }));
      const id = manager.erstellen(K);
      if (!id) throw new Error(t('error.abstract'));
      return { id };
    }
    case 'called': {
      if (ROUTE !== '') throw new Error('route');
      return { ergebnis: manager.aufrufen(ev.id, ev.methode), sprache: getSprache() };
    }
    case 'navigate': {
      if (ROUTE !== 'Docs') throw new Error('route');
      springeZu(ev.hash);
      return { hash: ev.hash };
    }
    default: throw new Error(`unknown kind: ${ev.kind}`);
  }
}

function bildschirmEmpfang(msg) {
  if (msg.type === 'snapshot') {
    const s = msg.state ?? {};
    if ((s.route ?? '') !== ROUTE) { location.replace(zielUrl(s.route ?? '', s.hash)); return; }
    letzte = msg.seq;
    if (ROUTE === '') {
      try { manager.wiederherstellen(s); } catch (e) { log('fehler', e.message); }
      log('info', t('sync.uebernommen', { n: s.objects?.length ?? 0 }));
    } else {
      try { springeZu(s.hash); } catch { /* Abschnitt fehlt – Seite bleibt, wo sie ist */ }
    }
    return;
  }
  if (msg.type !== 'event') return;
  if (letzte === null || msg.seq !== letzte + 1) {
    senden({ type: 'ack', seq: msg.seq, ok: false, error: 'seq_gap' });
    return;
  }
  letzte = msg.seq;
  try { senden({ type: 'ack', seq: msg.seq, ok: true, result: anwenden(msg.event) }); }
  catch (e) { senden({ type: 'ack', seq: msg.seq, ok: false, error: e.message }); }
}

function beimTrennen() {
  synchron = false;
  offen.clear();
  letzte = null;
}

// ---------- Links innerhalb der Demonstration ----------
// index.html / docs.html -> /demonstration/ bzw. /demonstration/Docs, die Rolle bleibt erhalten.
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]');
  if (!a) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  const seite = u.pathname.match(/\/(index|docs)\.html$/i)?.[1]?.toLowerCase();
  if (!seite) return;
  u.pathname = BASIS + (seite === 'docs' ? 'Docs' : '');
  u.searchParams.set('rolle', ROLLE);
  a.href = u.href;
}, true);

window.ooSync = { rolle: ROLLE, get seq() { return ROLLE === 'pult' ? seq : letzte; }, fehlerTest };
zeichneStatus();
verbinden();
