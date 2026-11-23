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

const AUSBLENDEN = 180; // ms, muss zu .mem-schliesst in memory.css passen
const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');
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
      frames.push(el('div', { class: 'mem-frame aktiv', 'data-mem': 'frame:aufruf' },
        el('div', { class: 'mem-frame-kopf' }, el('code', {}, `${klassenName(o.obj.constructor)}.${aufruf.methode}()`), el('small', { i18n: 'mem.frame' })),
        el('ul', { class: 'mem-zeilen' },
          el('li', {}, el('code', {}, el('span', { class: 'typ' }, klassenName(o.obj.constructor)), ' ', el('span', { class: 'mod' }, 'this'), ' = '), ref(o.adr)))));
    }
  }
  const variablen = objekte.map(({ id, obj, adr }) => el('li', { class: id === neu ? 'neu' : null },
    el('code', {}, el('span', { class: 'typ' }, klassenName(obj.constructor)), ' ', el('span', { class: 'feld' }, id), ' = '), ref(adr)));
  frames.push(el('div', { class: 'mem-frame', 'data-mem': 'frame:main' },
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
  return el('div', { class: `mem-objekt${neuMarke ? ' neu' : ''}`, 'data-adr': adr, 'data-klasse': name(obj.constructor), 'data-mem': `obj:${adr}` },
    el('div', { class: 'mem-objekt-kopf' },
      el('code', {}, el('b', {}, name(obj.constructor)), ' ', el('span', { class: 'mem-adr' }, adr)),
      titel && el('small', {}, titel),
      el('span', { class: 'mem-klasse', 'data-klasse': name(obj.constructor) }, '→ ', `${name(obj.constructor)}.class`)),
    el('ul', { class: 'mem-zeilen' }, zeilen));
}

function heap(objekte) {
  if (!objekte.length) return [el('p', { class: 'mem-leer', i18n: 'mem.heapLeer', 'data-mem': 'leer' })];
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
    return el('div', { class: 'mem-klassenkarte', 'data-klasse': name(cls), 'data-mem': `cls:${name(cls)}` },
      el('div', { class: 'mem-objekt-kopf' },
        el('code', {}, istAbstrakt(cls) && [el('span', { class: 'mod' }, 'abstract'), ' '], el('span', { class: 'mod' }, 'class'), ' ', el('b', {}, name(cls)),
          eltern !== Function.prototype && eltern.name && [' ', el('span', { class: 'mod' }, 'extends'), ' ', name(eltern)])),
      (felder.length || methoden.length) && el('ul', { class: 'mem-zeilen' }, felder, methoden));
  })));
}

function zeichnen() {
  if (!backdrop) return;
  const objekte = manager.alle.map(({ id, obj }) => ({ id, obj, adr: adresse(id) }));
  // Scrollpositionen erhalten: Spalten (Computer) bzw. die gemeinsame Scrollfläche (schmale Bildschirme)
  const scroll = [...backdrop.querySelectorAll('.mem-inhalt')].map((e) => e.scrollTop);
  const gesamt = backdrop.querySelector('.mem-bereiche')?.scrollTop ?? 0;
  const zu = el('button', { type: 'button', class: 'mem-zu', 'data-sync': 'speicher:schliessen', 'aria-label': L('mem.schliessen'), title: L('mem.schliessen'), onclick: schliesseSpeicher },
    el('span', { 'aria-hidden': 'true' }, '×'));
  const inhalt = [
    zu,
    el('h2', { id: 'mem-titel', class: 'mem-titel', i18n: 'mem.titel' }),
    el('p', { class: 'mem-hinweis', i18n: 'mem.hinweis' }),
    el('div', { class: 'mem-bereiche' },
      bereich('stack', 'Stack', 'mem.stackText', stack(objekte)),
      bereich('heap', 'Heap', 'mem.heapText', heap(objekte)),
      bereich('meta', 'Metaspace', 'mem.metaText', metaspace()))];
  // Das Fenster selbst bleibt bestehen – ein neues .mem würde die Öffnen-Animation wiederholen (Fenster blinkt)
  const box = backdrop.querySelector('.mem');
  if (box) box.replaceChildren(...inhalt);
  else backdrop.append(el('div', { class: 'mem', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'mem-titel', tabindex: '-1' }, ...inhalt));
  backdrop.querySelectorAll('.mem-inhalt').forEach((e, i) => { e.scrollTop = scroll[i] ?? 0; });
  backdrop.querySelector('.mem-bereiche').scrollTop = gesamt;
  backdrop.querySelector('.mem-heap .neu')?.scrollIntoView({ block: 'nearest' });
  hellZeigen({ scrollen: false });
  return zu;
}

// Hover über einem Objekt oder einer Adresse hebt alles hervor, was zu diesem Objekt gehört:
// die Referenzen im Stack (und in anderen Objekten), das Objekt im Heap und seine Klasse im Metaspace.
// Die innerste Adresse zählt: die motor-Referenz in einem Auto hebt den Motor hervor, nicht das Auto.
// Die Adresse bleibt hervorgehoben, auch wenn das Fenster neu gezeichnet wird (hellAdr).
let hellAdr = null;
function hervorheben(e) {
  const adr = e.type === 'mouseleave' ? null : e.target.closest?.('[data-adr]')?.dataset.adr ?? null;
  if (adr === hellAdr) return;
  hellAdr = adr;
  // Die Spalte unter dem Mauszeiger nicht scrollen – sonst rutscht der Inhalt unter der Maus weg
  hellZeigen({ ausser: e.target.closest?.('.mem-bereich') });
  bus.emit('speicher', { art: 'hell', adr }); // Demonstration: der Bildschirm hebt dasselbe hervor
}

/** Hervorhebung anzeigen. Objekt (Heap) und Klasse (Metaspace) werden in ihrer Spalte sichtbar gescrollt,
 *  außer in der Spalte `ausser` (dort steht der Mauszeiger). Ohne eigene Scrollleiste (Telefon) passiert nichts. */
function hellZeigen({ scrollen = true, ausser = null } = {}) {
  backdrop.querySelectorAll('.hell').forEach((x) => x.classList.remove('hell'));
  if (!hellAdr) return;
  const adr = CSS.escape(hellAdr);
  backdrop.querySelectorAll(`[data-adr="${adr}"]`).forEach((x) => x.classList.add('hell'));
  const objekt = backdrop.querySelector(`.mem-objekt[data-adr="${adr}"]`);
  const klasse = objekt?.dataset.klasse;
  const karte = klasse && backdrop.querySelector(`.mem-klassenkarte[data-klasse="${CSS.escape(klasse)}"]`);
  karte?.classList.add('hell');
  if (!scrollen) return;
  for (const e of [objekt, karte]) if (e && !ausser?.contains(e)) insBild(e);
}

/** Eintrag außerhalb des sichtbaren Teils seiner Spalte: Spalte so scrollen, dass er in der Mitte steht. */
function insBild(e) {
  const spalte = e.closest('.mem-inhalt');
  const k = e.getBoundingClientRect(), s = spalte.getBoundingClientRect();
  if (k.top < s.top || k.bottom > s.bottom) {
    // Verborgener Tab: weiches Scrollen bleibt dort auf halbem Weg stehen – dann sofort springen
    spalte.scrollTo({ top: spalte.scrollTop + k.top - s.top - Math.max(0, (s.height - k.height) / 2), behavior: document.hidden ? 'instant' : 'smooth' });
  }
}

// ---------- Leseposition (Demonstration: Pult -> Bildschirm) ----------
// Telefon und Laptop zeigen das Fenster verschieden (untereinander in einer Scrollfläche bzw. drei Spalten mit eigener
// Scrollleiste). Deshalb keine Pixel, sondern ein Anker: der Eintrag (Frame, Objekt, Klasse) an der Oberkante der
// Scrollfläche und wie weit er schon durchgelaufen ist. Der Bildschirm scrollt die Spalte dieses Bereichs dorthin.
const BEREICHE = ['stack', 'heap', 'meta'];
const spaltenModus = () => getComputedStyle(backdrop.querySelector('.mem-inhalt')).overflowY !== 'visible';

/** Position in einer Scrollfläche (.mem-inhalt einer Spalte oder .mem-bereiche): { bereich, anker, anteil }. */
function lesen(flaeche) {
  const y = flaeche.getBoundingClientRect().top + 1;
  const kandidaten = flaeche.classList.contains('mem-inhalt') ? [flaeche.closest('.mem-bereich')] : [...flaeche.querySelectorAll('.mem-bereich')];
  const b = kandidaten.find((x) => x.getBoundingClientRect().bottom > y) ?? kandidaten.at(-1);
  let anker = null;
  for (const e of b.querySelectorAll('[data-mem]')) { if (e.getBoundingClientRect().top <= y) anker = e; else break; }
  const r = anker?.getBoundingClientRect();
  return {
    bereich: BEREICHE.find((a) => b.classList.contains(`mem-${a}`)),
    anker: anker?.dataset.mem ?? null,
    anteil: r ? Math.min(1, Math.max(0, (y - r.top) / Math.max(1, r.height))) : 0
  };
}

/** Bereich so scrollen, dass der Anker (bzw. der Kopf des Bereichs) oben steht. Gibt die neue Scrollposition zurück. */
function scrollenZu({ bereich, anker, anteil = 0 }) {
  const b = backdrop.querySelector(`.mem-${bereich}`);
  if (!b) throw new Error(`bereich: ${bereich}`);
  const spalte = spaltenModus();
  const flaeche = spalte ? b.querySelector('.mem-inhalt') : backdrop.querySelector('.mem-bereiche');
  const oben = flaeche.getBoundingClientRect().top;
  const ziel = anker && b.querySelector(`[data-mem="${CSS.escape(anker)}"]`); // fehlt er (z. B. Frame schon weg): Kopf
  const r = ziel?.getBoundingClientRect();
  const delta = r ? r.top + anteil * r.height - oben : spalte ? -flaeche.scrollTop : b.getBoundingClientRect().top - oben;
  flaeche.scrollTo({ top: flaeche.scrollTop + delta, behavior: 'instant' });
  return Math.round(flaeche.scrollTop);
}

/** Zustand für den Snapshot der Demonstration (null = Fenster zu). */
export function speicherZustand() {
  if (!backdrop) return null;
  const flaechen = spaltenModus() ? [...backdrop.querySelectorAll('.mem-inhalt')] : [backdrop.querySelector('.mem-bereiche')];
  return { positionen: flaechen.map(lesen), hell: hellAdr };
}
export function speicherZustandSetzen({ positionen = [], hell = null } = {}) {
  if (!backdrop) return;
  hellAdr = hell;
  hellZeigen({ scrollen: false });
  positionen.forEach(scrollenZu);
}

/** Ereignis vom Pult anwenden: { art: 'scroll', bereich, anker, anteil } oder { art: 'hell', adr }. */
export function speicherAnwenden(ev) {
  if (!backdrop) throw new Error('speicher zu');
  if (ev.art === 'hell') { hellAdr = ev.adr ?? null; hellZeigen(); return { still: true }; }
  return { scroll: scrollenZu(ev) };
}

/** Scrollen im Fenster melden (höchstens einmal je Bild und Scrollfläche). */
const scrollOffen = new Set();
let scrollBild = 0;
function gescrollt(e) {
  const f = e.target;
  if (!(f instanceof Element) || !f.matches('.mem-inhalt, .mem-bereiche')) return;
  scrollOffen.add(f);
  scrollBild ||= requestAnimationFrame(() => {
    scrollBild = 0;
    for (const x of scrollOffen) if (x.isConnected) bus.emit('speicher', { art: 'scroll', ...lesen(x) });
    scrollOffen.clear();
  });
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
  backdrop.addEventListener('scroll', gescrollt, true); // scroll steigt nicht auf – Capture
  document.body.append(backdrop);
  window.addEventListener('keydown', taste, true);
  knopf?.setAttribute('aria-expanded', 'true');
  zeichnen();
  // Fokus auf das Fenster selbst, nicht auf × – sonst zeigt der Bildschirm (Klick vom Pult) einen Fokusrahmen am ×.
  // Tab führt weiterhin zum × (taste()).
  backdrop.querySelector('.mem')?.focus({ preventScroll: true });
}

export function schliesseSpeicher() {
  if (!backdrop) return;
  window.removeEventListener('keydown', taste, true);
  // Zustand sofort „zu“ (Demonstration/Sync), das Element blendet noch kurz aus und verschwindet dann
  const alt = backdrop;
  backdrop = null;
  if (WENIG_BEWEGUNG.matches) alt.remove();
  else { alt.classList.add('mem-schliesst'); setTimeout(() => alt.remove(), AUSBLENDEN); }
  hellAdr = null;
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
