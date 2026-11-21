// Demonstration „Pult → Bildschirm“: Node-Server mit WebSocket (ws).
// - liefert dist/ aus (zuerst `npm run build`), /demonstration/ -> index.html, /demonstration/Docs -> docs.html
// - leitet Ereignisse vom Pult an den Bildschirm weiter und acks zurück; keine Geschäftslogik
// - Zustand nur im Speicher, solange mindestens ein Client verbunden ist
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

// ---------- Synchronisation ----------
const pults = new Set();       // mehrere Tabs auf dem Telefon möglich (Playground + Erklärung)
let aktiverPult = null;        // der zuletzt gemeldete Tab ist die Quelle der Wahrheit
let bildschirm = null;
let snapshot = null;           // letzter Zustand vom Pult (nur zur Kontrolle / Fehlersuche)
let offeneAcks = [];           // seq der weitergeleiteten Ereignisse, in Reihenfolge
let ignorierBis = -1;          // acks zu Ereignissen vor dem letzten Snapshot werden nicht geprüft
let angefordert = false;       // need_snapshot unterwegs – nicht mehrfach anfordern

const offen = (ws) => ws && ws.readyState === ws.OPEN;
const schicke = (ws, msg) => { if (offen(ws)) ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg)); };

function zustandsBericht() {
  return {
    clients: { pults: pults.size, bildschirm: Boolean(bildschirm) },
    state: snapshot,
    offeneAcks
  };
}

function status() {
  const basis = { type: 'status', pult: Boolean(aktiverPult), bildschirm: Boolean(bildschirm) };
  for (const ws of wss.clients) schicke(ws, { ...basis, aktiv: ws === aktiverPult });
}

function snapshotAnfordern(grund, { erzwingen = false } = {}) {
  if (!aktiverPult || !bildschirm || (angefordert && !erzwingen)) return;
  angefordert = true;
  log(`need_snapshot -> Pult (${grund})`);
  schicke(aktiverPult, { type: 'need_snapshot' });
}

function hello(ws, rolle) {
  if (rolle === 'pult') {
    ws.rolle = 'pult';
    pults.add(ws);
    if (aktiverPult !== ws) log(`Pult aktiv (${ws.ip}), Pult-Tabs: ${pults.size}`);
    aktiverPult = ws;
    snapshotAnfordern('Pult gemeldet', { erzwingen: true });
  } else {
    ws.rolle = 'bildschirm';
    if (bildschirm && bildschirm !== ws) { log('alter Bildschirm ersetzt'); bildschirm.close(4001, 'ersetzt'); }
    bildschirm = ws;
    offeneAcks = [];
    log(`Bildschirm verbunden (${ws.ip})${aktiverPult ? '' : ' – warte auf Pult'}`);
    snapshotAnfordern('Bildschirm verbunden', { erzwingen: true });
  }
  status();
}

function nachricht(ws, text) {
  let msg;
  try { msg = JSON.parse(text); } catch { return; }
  switch (msg.type) {
    case 'hello': hello(ws, msg.rolle === 'pult' ? 'pult' : 'bildschirm'); break;

    case 'snapshot':
      if (ws !== aktiverPult) return;
      snapshot = msg.state ?? null;
      angefordert = false;
      offeneAcks = [];
      ignorierBis = msg.seq ?? -1;
      log(`snapshot seq=${msg.seq} route="${snapshot?.route ?? ''}" Objekte=${snapshot?.objects?.length ?? 0}`);
      schicke(bildschirm, text);
      break;

    case 'event':
      if (ws !== aktiverPult) return;
      if (!bildschirm) return; // niemand schaut zu – der nächste Snapshot holt es nach
      offeneAcks.push(msg.seq);
      log(`event #${msg.seq} ${JSON.stringify(msg.event)}`);
      schicke(bildschirm, text); // unverändert weiterleiten (seq bleibt)
      break;

    case 'ack': {
      if (ws !== bildschirm) return;
      schicke(aktiverPult, text);
      const geprueft = offeneAcks.length > 0 || msg.seq > ignorierBis;
      const erwartet = offeneAcks.shift();
      log(`ack #${msg.seq} ok=${msg.ok}${msg.ok ? '' : ` error=${msg.error}`}`);
      if (!geprueft) return;
      if (!msg.ok) snapshotAnfordern(`ack #${msg.seq} fehlgeschlagen`);
      else if (msg.seq !== erwartet) snapshotAnfordern(`ack #${msg.seq}, erwartet #${erwartet}`);
      break;
    }
  }
}

function getrennt(ws) {
  if (ws.rolle === 'pult') {
    pults.delete(ws);
    log(`Pult getrennt, Pult-Tabs: ${pults.size}`);
    if (aktiverPult === ws) {
      aktiverPult = [...pults].at(-1) ?? null;
      angefordert = false;
      snapshotAnfordern('anderer Pult-Tab übernimmt', { erzwingen: true });
    }
  } else if (ws.rolle === 'bildschirm' && bildschirm === ws) {
    bildschirm = null;
    offeneAcks = [];
    angefordert = false;
    log('Bildschirm getrennt');
  }
  if (!pults.size && !bildschirm && snapshot !== null) {
    snapshot = null;
    offeneAcks = [];
    ignorierBis = -1;
    log('Beide Seiten getrennt – Zustand gelöscht.');
  }
  status();
}

const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws, req) => {
  ws.ip = req.socket.remoteAddress?.replace(/^::ffff:/, '');
  ws.letzterPong = Date.now();
  ws.on('pong', () => { ws.letzterPong = Date.now(); });
  ws.on('message', (d) => nachricht(ws, d.toString()));
  ws.on('close', () => getrennt(ws));
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
  const ips = Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log(`\nOOPlayground-Demonstration läuft auf Port ${PORT}`);
  for (const ip of ips.length ? ips : ['localhost']) {
    console.log(`\n  Netzwerk ${ip}:`);
    console.log(`    Bildschirm: http://${ip}:${PORT}/demonstration/?rolle=bildschirm`);
    console.log(`    Pult:       http://${ip}:${PORT}/demonstration/?rolle=pult`);
  }
  console.log(`\n  Zustand:    http://localhost:${PORT}/api/state\n`);
});
