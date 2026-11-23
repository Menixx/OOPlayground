// Blick in den Speicher der JVM: Schaltfläche unten links (SSD-Symbol) öffnet ein Fenster mit
// drei Bereichen – Stack, Heap und Metaspace (Farben wie auf der Folie „Die Java Virtual Machine“).
//  - Stack:     Frame von main() mit einer lokalen Variable (Referenz) je Objekt;
//               ein Methodenaufruf legt kurz einen eigenen Frame obendrauf (mit this).
//  - Heap:      jedes Objekt mit seinen Feldern; ein Motor ist ein eigenes Objekt, auf das das Feld zeigt.
//  - Metaspace: Beschreibung aller Klassen – sie stehen von Anfang an fest (Klassen ändern sich nicht).
import { el, L, javaLiteral } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';
import { manager, KLASSEN, klassenName } from '../../services/ObjectManager.js';
import { t } from '../../i18n/i18n.js';
import { Figur } from '../../models/abstract/Figur.js';
import { Motor } from '../../models/engines/Motor.js';
import { Benzinmotor } from '../../models/engines/Benzinmotor.js';
import { Elektromotor } from '../../models/engines/Elektromotor.js';
import { Turbofan } from '../../models/engines/Turbofan.js';

const AUFRUF_DAUER = 2400; // ms, so lange bleibt der Frame eines Methodenaufrufs sichtbar

const SSD_SVG = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <rect x="4" y="6" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="8" y="10" width="16" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
  <text x="16" y="15.6" text-anchor="middle" font-size="5.4" font-weight="700" font-family="system-ui, sans-serif" fill="var(--mem-btn-bg, #fff)">SSD</text>
  <path d="M9 21h2M13 21h2M17 21h2M21 21h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// ---------- Adressen ----------
/** Scheinadresse wie in Javas Object.toString() (z. B. @1b6d3586) – aus der id abgeleitet,
 *  damit Pult und Bildschirm der Demonstration dieselben Adressen zeigen. */
function adresse(text) {
  let h = 0x811c9dc5;
  for (const c of text) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return `@${((h | 0x10000000) >>> 0).toString(16)}`;
}

// ---------- Klassenbeschreibungen (Metaspace) ----------
const MOTOREN = [Benzinmotor, Elektromotor, Turbofan];
/** Felder, die eine Klasse selbst deklariert: [name, typ, privat?] */
function eigeneFelder(cls) {
  if (cls === Motor) return Motor.felder.map(([n, typ]) => [n, typ]);
  if (MOTOREN.includes(cls)) return [];
  const f = (Object.hasOwn(cls, 'felder') ? cls.felder : cls.eigeneFelder ?? []).map(([n, typ]) => [n, typ]);
  if (cls === Figur) f.push(['#winkel', 'int', true]);
  return f;
}
/** Methoden, die eine Klasse selbst deklariert: [name, abstract?, privat?] */
function eigeneMethoden(cls) {
  if (cls === Motor) return [['starten', true], ['stoppen', false]];
  if (MOTOREN.includes(cls)) return [['starten', false], ...cls.privateMethoden.map((n) => [n, false, true])];
  if (Object.hasOwn(cls, 'methoden')) return cls.methoden.map(([n, abstrakt]) => [n, abstrakt]);
  const eltern = Object.getPrototypeOf(cls);
  return (eltern.methoden ?? []).filter(([n]) => Object.hasOwn(cls.prototype, n)).map(([n]) => [n, false]);
}
const GRUPPEN = [
  ...KLASSEN.map((g) => [g.cls, ...g.kinder.map(([, c]) => c)]),
  [Motor, ...MOTOREN]
];
const name = (cls) => cls.bezeichnung ?? klassenName(cls);
const istAbstrakt = (cls) => KLASSEN.some((g) => g.cls === cls) || cls === Motor;

/** Feldtypen eines Objekts (geerbte + eigene) */
function feldTypen(obj) {
  const cls = obj.constructor;
  if (obj instanceof Motor) return new Map(Motor.felder.map(([n, typ]) => [n, typ]));
  return new Map([...Object.getPrototypeOf(cls).felder, ...cls.eigeneFelder].map(([n, typ]) => [n, typ]));
}

// ---------- Zustand ----------
let backdrop = null;
let vorherFokus = null;
let aufruf = null;      // { id, methode } – gerade laufender Methodenaufruf (eigener Frame im Stack)
let aufrufTimer = 0;
let neu = null;         // id des zuletzt erzeugten Objekts (kurz hervorgehoben)
let neuTimer = 0;
let knopf = null;

export const speicherOffen = () => Boolean(backdrop);

// ---------- Darstellung ----------
const ref = (adr, text = adr) => el('span', { class: 'mem-ref', 'data-adr': adr }, text);

function bereich(art, titelText, beschreibung, inhalt) {
  return el('section', { class: `mem-bereich mem-${art}`, 'aria-label': titelText },
    el('header', { class: 'mem-kopf' },
      el('h3', {}, titelText),
      el('p', { i18n: beschreibung })),
    el('div', { class: 'mem-inhalt' }, inhalt));
}

function stack(objekte) {
  const frames = [];
  if (aufruf) {
    const o = objekte.find((x) => x.id === aufruf.id);
    if (o) {
      frames.push(el('div', { class: 'mem-frame aktiv' },
        el('div', { class: 'mem-frame-kopf' }, el('code', {}, `${klassenName(o.obj.constructor)}.${aufruf.methode}()`), el('small', { i18n: 'mem.frame' })),
        el('ul', { class: 'mem-zeilen' },
          el('li', {}, el('code', {}, el('span', { class: 'typ' }, klassenName(o.obj.constructor)), ' ', el('span', { class: 'mod' }, 'this'), ' = '), ref(o.adr)))));
    }
  }
  const variablen = objekte.map(({ id, obj, adr }) => el('li', { class: id === neu ? 'neu' : null },
    el('code', {}, el('span', { class: 'typ' }, klassenName(obj.constructor)), ' ', el('span', { class: 'feld' }, id), ' = '), ref(adr)));
  frames.push(el('div', { class: 'mem-frame' },
    el('div', { class: 'mem-frame-kopf' }, el('code', {}, 'main(String[] args)'), el('small', { i18n: 'mem.frame' })),
    variablen.length ? el('ul', { class: 'mem-zeilen' }, variablen) : el('p', { class: 'mem-leer', i18n: 'mem.stackLeer' })));
  return frames;
}

function heapObjekt({ adr, obj, titel, neuMarke }) {
  const typen = feldTypen(obj);
  const zeilen = Object.keys(obj).map((n) => {
    const v = obj[n];
    const wert = v && typeof v === 'object' ? ref(adresse(`${adr}:${n}`)) : javaLiteral(v, typen.get(n));
    return el('li', {}, el('code', {}, el('span', { class: 'feld' }, n), ' = '), wert);
  });
  if (obj instanceof Figur) zeilen.push(el('li', { class: 'privat' }, el('code', {}, el('span', { class: 'mod' }, 'private'), ' #winkel = '), el('code', {}, String(obj.winkel))));
  return el('div', { class: `mem-objekt${neuMarke ? ' neu' : ''}`, 'data-adr': adr, 'data-klasse': name(obj.constructor) },
    el('div', { class: 'mem-objekt-kopf' },
      el('code', {}, el('b', {}, name(obj.constructor)), ' ', el('span', { class: 'mem-adr' }, adr)),
      titel && el('small', {}, titel),
      el('span', { class: 'mem-klasse', 'data-klasse': name(obj.constructor) }, '→ ', `${name(obj.constructor)}.class`)),
    el('ul', { class: 'mem-zeilen' }, zeilen));
}

function heap(objekte) {
  if (!objekte.length) return [el('p', { class: 'mem-leer', i18n: 'mem.heapLeer' })];
  return objekte.flatMap(({ id, obj, adr }) => {
    const karten = [heapObjekt({ adr, obj, titel: id, neuMarke: id === neu })];
    for (const n of Object.keys(obj)) {
      const v = obj[n];
      if (v && typeof v === 'object') karten.push(heapObjekt({ adr: adresse(`${adr}:${n}`), obj: v, titel: `${id}.${n}`, neuMarke: id === neu }));
    }
    return karten;
  });
}

// Metaspace ändert sich zur Laufzeit nicht: keine Zähler, keine Objektdaten – nur die Klassenbeschreibungen
function metaspace() {
  return GRUPPEN.map((gruppe) => el('div', { class: 'mem-gruppe' }, gruppe.map((cls) => {
    const eltern = Object.getPrototypeOf(cls);
    const felder = eigeneFelder(cls).map(([f, typ, privat]) => el('li', { class: privat ? 'privat' : null },
      el('code', {}, privat && [el('span', { class: 'mod' }, 'private'), ' '], el('span', { class: 'typ' }, typ), ' ', el('span', { class: 'feld' }, f))));
    const methoden = eigeneMethoden(cls).map(([m, abstrakt, privat]) => el('li', { class: privat ? 'privat' : null },
      el('code', {}, abstrakt && [el('span', { class: 'mod' }, 'abstract'), ' '], privat && [el('span', { class: 'mod' }, 'private'), ' '],
        el('span', { class: abstrakt ? 'abstrakt' : privat ? 'privat' : 'methode' }, `${m}()`))));
    return el('div', { class: 'mem-klassenkarte', 'data-klasse': name(cls) },
      el('div', { class: 'mem-objekt-kopf' },
        el('code', {}, istAbstrakt(cls) && [el('span', { class: 'mod' }, 'abstract'), ' '], el('span', { class: 'mod' }, 'class'), ' ', el('b', {}, name(cls)),
          eltern !== Function.prototype && eltern.name && [' ', el('span', { class: 'mod' }, 'extends'), ' ', name(eltern)])),
      (felder.length || methoden.length) && el('ul', { class: 'mem-zeilen' }, felder, methoden));
  })));
}

function zeichnen() {
  if (!backdrop) return;
  const objekte = manager.alle.map(({ id, obj }) => ({ id, obj, adr: adresse(id) }));
  const scroll = [...backdrop.querySelectorAll('.mem-inhalt')].map((e) => e.scrollTop);
  const zu = el('button', { type: 'button', class: 'mem-zu', 'data-sync': 'speicher:schliessen', 'aria-label': L('mem.schliessen'), title: L('mem.schliessen'), onclick: schliesseSpeicher },
    el('span', { 'aria-hidden': 'true' }, '×'));
  const box = el('div', { class: 'mem', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'mem-titel' },
    zu,
    el('h2', { id: 'mem-titel', class: 'mem-titel', i18n: 'mem.titel' }),
    el('p', { class: 'mem-hinweis', i18n: 'mem.hinweis' }),
    el('div', { class: 'mem-bereiche' },
      bereich('stack', 'Stack', 'mem.stackText', stack(objekte)),
      bereich('heap', 'Heap', 'mem.heapText', heap(objekte)),
      bereich('meta', 'Metaspace', 'mem.metaText', metaspace())));
  backdrop.replaceChildren(box);
  backdrop.querySelectorAll('.mem-inhalt').forEach((e, i) => { e.scrollTop = scroll[i] ?? 0; });
  backdrop.querySelector('.mem-heap .neu')?.scrollIntoView({ block: 'nearest' });
  return zu;
}

// Hover über einem Objekt oder einer Adresse hebt alles hervor, was zu diesem Objekt gehört:
// die Referenzen im Stack (und in anderen Objekten), das Objekt im Heap und seine Klasse im Metaspace.
// Die innerste Adresse zählt: die motor-Referenz in einem Auto hebt den Motor hervor, nicht das Auto.
function hervorheben(e) {
  const quelle = e.target.closest?.('[data-adr]');
  backdrop.querySelectorAll('.hell').forEach((x) => x.classList.remove('hell'));
  if (!quelle) return;
  const adr = CSS.escape(quelle.dataset.adr);
  backdrop.querySelectorAll(`[data-adr="${adr}"]`).forEach((x) => x.classList.add('hell'));
  const klasse = backdrop.querySelector(`.mem-objekt[data-adr="${adr}"]`)?.dataset.klasse;
  const karte = klasse && backdrop.querySelector(`.mem-klassenkarte[data-klasse="${CSS.escape(klasse)}"]`);
  if (!karte) return;
  karte.classList.add('hell');
  // Klasse außerhalb des sichtbaren Bereichs: Metaspace (nur diese Spalte) dorthin scrollen
  const spalte = karte.closest('.mem-inhalt');
  const k = karte.getBoundingClientRect(), s = spalte.getBoundingClientRect();
  if (k.top < s.top || k.bottom > s.bottom) {
    spalte.scrollTo({ top: spalte.scrollTop + k.top - s.top - (s.height - k.height) / 2, behavior: 'smooth' });
  }
}

/** Escape schließt nur das Fenster (Capture: vor den Karten). Fokus bleibt im Fenster. */
function taste(e) {
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); backdrop.querySelector('.mem-zu')?.click(); return; }
  if (e.key === 'Tab') { e.preventDefault(); backdrop.querySelector('.mem-zu')?.focus(); }
}

export function oeffneSpeicher() {
  if (backdrop) return;
  vorherFokus = document.activeElement;
  backdrop = el('div', { class: 'mem-backdrop', 'data-kein-schliessen': '' });
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.querySelector('.mem-zu')?.click(); });
  backdrop.addEventListener('mouseover', hervorheben);
  backdrop.addEventListener('mouseleave', hervorheben);
  document.body.append(backdrop);
  window.addEventListener('keydown', taste, true);
  knopf?.setAttribute('aria-expanded', 'true');
  zeichnen().focus({ preventScroll: true });
}

export function schliesseSpeicher() {
  if (!backdrop) return;
  window.removeEventListener('keydown', taste, true);
  backdrop.remove();
  backdrop = null;
  knopf?.setAttribute('aria-expanded', 'false');
  if (vorherFokus && vorherFokus !== knopf) vorherFokus.focus?.({ preventScroll: true });
  else document.activeElement?.blur?.();
  vorherFokus = null;
}

export function mountMemory() {
  knopf = el('button', {
    type: 'button', class: 'mem-btn', 'data-sync': 'speicher:oeffnen', 'data-kein-schliessen': '',
    'data-tip': L('mem.tip'), 'aria-label': L('mem.tip'), 'aria-haspopup': 'dialog', 'aria-expanded': 'false',
    onclick: oeffneSpeicher
  });
  knopf.innerHTML = SSD_SVG;
  document.body.append(knopf);

  bus.on('created', ({ id }) => {
    neu = id;
    clearTimeout(neuTimer);
    neuTimer = setTimeout(() => { neu = null; zeichnen(); }, 1600);
  });
  bus.on('called', ({ id, methode, teil }) => {
    if (teil) return; // „Alle bewegen“: viele Aufrufe auf einmal – kein einzelner Frame
    aufruf = { id, methode };
    clearTimeout(aufrufTimer);
    aufrufTimer = setTimeout(() => { aufruf = null; zeichnen(); }, AUFRUF_DAUER);
    zeichnen();
  });
  bus.on('changed', () => zeichnen());
  bus.on('deleted', ({ ids }) => { if (aufruf && ids.includes(aufruf.id)) aufruf = null; zeichnen(); });
  bus.on('sprache', () => zeichnen());
}
