// Demonstration „Pult → Bildschirm“: Node-Server mit WebSocket (ws).
// - liefert dist/ aus (zuerst `npm run build`), /demonstration/ -> index.html, /demonstration/Docs -> docs.html
// - leitet Ereignisse vom Pult an den Bildschirm weiter und acks zurück; keine Geschäftslogik
// - Räume (?raum=CODE): je Raum ein Bildschirm und ein Pult-Gerät
// - Zustand nur im Speicher, solange mindestens ein Client im Raum verbunden ist
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const PING_MS = 15_000;
const TIMEOUT_MS = 30_000;

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error(`dist/ fehlt (${DIST}). Zuerst bauen: npm run build`);
  process.exit(1);
}

const zeit = () => new Date().toLocaleTimeString('de-DE');
const log = (...a) => console.log(`[${zeit()}]`, ...a);

// ---------- Statische Dateien ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json'
};

function datei(rel) {
  const p = path.normalize(path.join(DIST, rel));
  if (p !== DIST && !p.startsWith(DIST + path.sep)) return null; // kein Ausbruch aus dist/
  try { return fs.statSync(p).isFile() ? p : null; } catch { return null; }
}

function senden(res, p) {
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(p).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': p.endsWith('.html') ? 'no-cache' : 'public, max-age=3600'
  });
  fs.createReadStream(p).pipe(res);
}

function umleiten(res, ziel) { res.writeHead(302, { Location: ziel }); res.end(); }

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let pfad;
  try { pfad = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }

  if (pfad === '/api/state') { // Kontrolle: was der Server gerade hält
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(zustandsBericht(), null, 2));
    return;
  }
  // Relative Pfade (./assets/…) brauchen einen Schrägstrich am Ende von /demonstration bzw. keinen nach Docs
  if (/^\/demonstration$/i.test(pfad)) return umleiten(res, '/demonstration/' + url.search);
  if (/^\/demonstration\/docs\/$/i.test(pfad)) return umleiten(res, '/demonstration/Docs' + url.search);

  const demo = /^\/demonstration(\/|$)/i.test(pfad);
  const rel = demo ? pfad.replace(/^\/demonstration/i, '') || '/' : pfad;
  const p = datei(rel === '/' ? 'index.html' : rel);
  if (p) return senden(res, p);
  if (demo) return senden(res, path.join(DIST, /^\/docs$/i.test(rel) ? 'docs.html' : 'index.html'));
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404');
});

// ---------- Räume ----------
// Pult und Bildschirm finden sich nur über denselben Raumcode (?raum=K7QF).
// Je Raum: ein Bildschirm und ein Pult-Gerät. Ein Gerät darf mehrere Tabs haben (Playground + Erklärung);
// es wird über eine zufällige Geräte-ID erkannt, die der Browser in localStorage ablegt.
// Ein zweites Gerät wartet („anderer Pult verbunden“) und übernimmt, sobald das erste den Raum verlässt.
const raeume = new Map(); // code -> Raum
let lanIps = [];

const RAUM_MUSTER = /^[A-Z0-9]{3,12}$/;
const raumCode = (v) => { const c = String(v ?? '').trim().toUpperCase(); return RAUM_MUSTER.test(c) ? c : null; };

function raumHolen(code) {
  let r = raeume.get(code);
  if (!r) {
    r = {
      code,
      pults: new Set(),     // Tabs des Pult-Geräts, dem der Raum gehört
      wartend: new Set(),   // Tabs anderer Geräte (abgelehnt, warten auf Übernahme)
      besitzer: null,       // Geräte-ID des Pults
      aktiverPult: null,    // der zuletzt benutzte, sichtbare Tab – Quelle der Wahrheit
      bildschirm: null,
      snapshot: null,       // letzter Zustand vom Pult (nur zur Kontrolle / Fehlersuche)
      offeneAcks: [],       // seq der weitergeleiteten Ereignisse, in Reihenfolge
      ignorierBis: -1,      // acks zu Ereignissen vor dem letzten Snapshot werden nicht geprüft
      angefordert: false    // need_snapshot unterwegs – nicht mehrfach anfordern
    };
    raeume.set(code, r);
    log(`[${code}] Raum eröffnet`);
  }
  return r;
}

const rlog = (r, text) => log(`[${r.code}] ${text}`);
const offen = (ws) => ws && ws.readyState === ws.OPEN;
const schicke = (ws, msg) => { if (offen(ws)) ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg)); };
const mitglieder = (r) => [...r.pults, ...r.wartend, ...(r.bildschirm ? [r.bildschirm] : [])];

function zustandsBericht() {
  return {
    raeume: [...raeume.values()].map((r) => ({
      raum: r.code,
      pultTabs: r.pults.size,
      pausiert: [...r.pults].filter((p) => p.pausiert).length,
      wartend: r.wartend.size,
      bildschirm: Boolean(r.bildschirm),
      state: r.snapshot,
      offeneAcks: r.offeneAcks
    }))
  };
}

function status(r) {
  const basis = { type: 'status', raum: r.code, pult: Boolean(r.aktiverPult), bildschirm: Boolean(r.bildschirm) };
  const pultUrls = lanIps.map((ip) => `http://${ip}:${PORT}/demonstration/?rolle=pult&raum=${r.code}`);
  for (const ws of mitglieder(r)) {
    schicke(ws, { ...basis, aktiv: ws === r.aktiverPult, abgelehnt: r.wartend.has(ws), ...(ws === r.bildschirm ? { pultUrls } : {}) });
  }
}

function snapshotAnfordern(r, grund, { erzwingen = false } = {}) {
  if (!r.aktiverPult || !r.bildschirm || (r.angefordert && !erzwingen)) return;
  r.angefordert = true;
  rlog(r, `need_snapshot -> Pult (${grund})`);
  schicke(r.aktiverPult, { type: 'need_snapshot' });
}

/** Jüngster Pult-Tab, der gerade sichtbar ist – oder null. */
const naechsterPult = (r) => [...r.pults].reverse().find((p) => !p.pausiert) ?? null;

/** Kein Tab des Besitzers mehr da: das erste wartende Gerät übernimmt den Raum (mit allen seinen Tabs). */
function befoerdern(r) {
  if ([...r.pults].some((p) => p.geraet === r.besitzer)) return;
  r.besitzer = null;
  const erster = r.wartend.values().next().value;
  if (!erster) return;
  r.besitzer = erster.geraet;
  for (const p of [...r.wartend]) if (p.geraet === r.besitzer) { r.wartend.delete(p); r.pults.add(p); }
  r.aktiverPult = naechsterPult(r);
  r.angefordert = false;
  rlog(r, `wartender Pult übernimmt (${erster.ip})`);
  snapshotAnfordern(r, 'neuer Pult', { erzwingen: true });
}

/** Pult-Tab verborgen (Telefon gesperrt, Tab gewechselt oder geschlossen): nicht mehr aktiv.
 *  Mobile Browser schließen die Verbindung beim Schließen eines Tabs oft nicht sofort –
 *  das Verbergen ist das zuverlässigste Signal. Wird der Tab wieder sichtbar, meldet er sich mit hello. */
function pause(ws) {
  const r = ws.raum;
  if (!r || ws.rolle !== 'pult' || ws.pausiert) return;
  ws.pausiert = true;
  if (r.aktiverPult === ws) {
    r.aktiverPult = naechsterPult(r);
    r.angefordert = false;
    rlog(r, `Pult pausiert${r.aktiverPult ? ' – anderer Tab übernimmt' : ''}`);
    snapshotAnfordern(r, 'anderer Pult-Tab übernimmt', { erzwingen: true });
  }
  status(r);
}

function hello(ws, msg) {
  const code = raumCode(msg.raum);
  if (!code) { schicke(ws, { type: 'status', fehler: 'raum' }); return; }
  if (ws.raum && ws.raum.code !== code) entfernen(ws);
  const r = raumHolen(code);
  ws.raum = r;

  if (msg.rolle === 'pult') {
    ws.rolle = 'pult';
    ws.geraet = String(msg.geraet || ws.ip).slice(0, 64);
    // Verborgene Tabs (z. B. nach einem Verbindungsabbruch neu verbunden) melden sich an, steuern aber nicht
    ws.pausiert = msg.sichtbar === false;
    if (r.besitzer && r.besitzer !== ws.geraet) {
      if (!r.wartend.has(ws)) rlog(r, `Pult abgelehnt (${ws.ip}) – im Raum ist schon ein Pult`);
      r.wartend.add(ws);
      status(r);
      return;
    }
    r.besitzer = ws.geraet;
    r.wartend.delete(ws);
    r.pults.add(ws);
    if (ws.pausiert) {
      rlog(r, `Pult-Tab im Hintergrund angemeldet (${ws.ip}), Pult-Tabs: ${r.pults.size}`);
      if (r.aktiverPult === ws) { r.aktiverPult = naechsterPult(r); r.angefordert = false; snapshotAnfordern(r, 'anderer Pult-Tab übernimmt', { erzwingen: true }); }
    } else {
      if (r.aktiverPult !== ws) rlog(r, `Pult aktiv (${ws.ip}), Pult-Tabs: ${r.pults.size}`);
      r.aktiverPult = ws;
      snapshotAnfordern(r, 'Pult gemeldet', { erzwingen: true });
    }
  } else {
    ws.rolle = 'bildschirm';
    if (r.bildschirm && r.bildschirm !== ws) { rlog(r, 'alter Bildschirm ersetzt'); r.bildschirm.close(4001, 'ersetzt'); }
    r.bildschirm = ws;
    r.offeneAcks = [];
    rlog(r, `Bildschirm verbunden (${ws.ip})${r.aktiverPult ? '' : ' – warte auf Pult'}`);
    snapshotAnfordern(r, 'Bildschirm verbunden', { erzwingen: true });
  }
  status(r);
}

function nachricht(ws, text) {
  let msg;
  try { msg = JSON.parse(text); } catch { return; }
  if (msg.type === 'hello') { hello(ws, msg); return; }
  if (msg.type === 'ping') { schicke(ws, { type: 'pong' }); return; } // Herzschlag des Clients (sync.js)
  const r = ws.raum;
  if (!r) return;
  switch (msg.type) {
    case 'pause': pause(ws); break;

    case 'snapshot':
      if (ws !== r.aktiverPult) return;
      r.snapshot = msg.state ?? null;
      r.angefordert = false;
      r.offeneAcks = [];
      r.ignorierBis = msg.seq ?? -1;
      rlog(r, `snapshot seq=${msg.seq} route="${r.snapshot?.route ?? ''}" Objekte=${r.snapshot?.objects?.length ?? 0}`);
      schicke(r.bildschirm, text);
      break;

    case 'event':
      if (ws !== r.aktiverPult) return; // nur der aktive Tab des Raum-Pults steuert
      if (!r.bildschirm) return;        // niemand schaut zu – der nächste Snapshot holt es nach
      r.offeneAcks.push(msg.seq);
      if (!['scroll', 'seite'].includes(msg.event?.kind)) rlog(r, `event #${msg.seq} ${JSON.stringify(msg.event)}`); // Scrollen nicht protokollieren
      schicke(r.bildschirm, text);      // unverändert weiterleiten (seq bleibt)
      break;

    case 'ack': {
      if (ws !== r.bildschirm) return;
      schicke(r.aktiverPult, text);
      const geprueft = r.offeneAcks.length > 0 || msg.seq > r.ignorierBis;
      const erwartet = r.offeneAcks.shift();
      if (!msg.ok || msg.result?.scroll === undefined) rlog(r, `ack #${msg.seq} ok=${msg.ok}${msg.ok ? '' : ` error=${msg.error}`}`);
      if (!geprueft) return;
      if (!msg.ok) snapshotAnfordern(r, `ack #${msg.seq} fehlgeschlagen`);
      else if (msg.seq !== erwartet) snapshotAnfordern(r, `ack #${msg.seq}, erwartet #${erwartet}`);
      break;
    }
  }
}

/** Verbindung aus ihrem Raum nehmen; leere Räume werden mit ihrem Zustand gelöscht. */
function entfernen(ws) {
  const r = ws.raum;
  if (!r) return;
  ws.raum = null;
  if (ws.rolle === 'pult') {
    if (r.wartend.delete(ws)) rlog(r, 'wartender Pult getrennt');
    if (r.pults.delete(ws)) {
      rlog(r, `Pult getrennt, Pult-Tabs: ${r.pults.size}`);
      if (r.aktiverPult === ws) {
        r.aktiverPult = naechsterPult(r);
        r.angefordert = false;
        snapshotAnfordern(r, 'anderer Pult-Tab übernimmt', { erzwingen: true });
      }
      befoerdern(r);
    }
  } else if (ws.rolle === 'bildschirm' && r.bildschirm === ws) {
    r.bildschirm = null;
    r.offeneAcks = [];
    r.angefordert = false;
    rlog(r, 'Bildschirm getrennt');
  }
  if (!mitglieder(r).length) {
    raeume.delete(r.code);
    rlog(r, 'Raum leer – Zustand gelöscht.');
    return;
  }
  status(r);
}

const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws, req) => {
  ws.ip = req.socket.remoteAddress?.replace(/^::ffff:/, '');
  ws.letzterPong = Date.now();
  ws.on('pong', () => { ws.letzterPong = Date.now(); });
  ws.on('message', (d) => nachricht(ws, d.toString()));
  ws.on('close', () => entfernen(ws));
  ws.on('error', (e) => log('ws-Fehler', e.message));
});

// Heartbeat: alle 15 s ping; ohne pong seit 30 s -> Verbindung schließen
setInterval(() => {
  for (const ws of wss.clients) {
    if (Date.now() - ws.letzterPong > TIMEOUT_MS) { log(`kein pong von ${ws.rolle ?? '?'} (${ws.ip}) – getrennt`); ws.terminate(); }
    else ws.ping();
  }
}, PING_MS).unref();

server.listen(PORT, HOST, () => {
  lanIps = Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.')).map((i) => i.address);
  console.log(`\nOOPlayground-Demonstration läuft auf Port ${PORT}`);
  for (const ip of lanIps.length ? lanIps : ['localhost']) {
    console.log(`\n  Netzwerk ${ip}:`);
    console.log(`    Bildschirm: http://${ip}:${PORT}/demonstration/`);
  }
  console.log('\n  Der Bildschirm erzeugt einen Raumcode und zeigt den Link für das Pult an.');
  console.log(`  Zustand:    http://localhost:${PORT}/api/state\n`);
});
