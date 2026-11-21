// Einstieg der Erklärungsseite (docs.html): Kopfleiste, Inhalt, Menü, Sprache, Sprungziele.
import '../styles/docs.css';
import { el, L } from '../utils/dom.js';
import { bus } from '../services/EventBus.js';
import { t, getSprache, uebersetzeDom, folgeAnderenTabs, bindAttr, beimSprachwechsel } from '../i18n/i18n.js';
import { langToggle } from '../components/LangToggle/LangToggle.js';
import { themeToggle } from '../components/ThemeToggle/ThemeToggle.js';
import { headerMenu } from '../components/HeaderMenu/HeaderMenu.js';
import { renderInhalt } from './render.js';
import { createNav } from './nav.js';

/** Bereits geladene Inhalte je Sprache – jede Sprache ist ein eigener Chunk (./content/<lang>.js). */
const INHALT = {};
async function ladeInhalt(lang) {
  if (!INHALT[lang]) INHALT[lang] = (await import(`./content/${lang}.js`)).default;
  return INHALT[lang];
}

const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');

const main = document.getElementById('inhalt');
const toTop = document.getElementById('to-top');

// ---------- Kopfleiste ----------
const SVG = 'http://www.w3.org/2000/svg';
function puzzleIcon() { // Puzzleteil – Symbol des OOPlayground-Links
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0.93 3.4 16 16'); // optisch zentriert: Quadrat statt Umriss mit Knopf oben
  svg.setAttribute('class', 'head-link-icon');
  svg.setAttribute('aria-hidden', 'true');
  // Quadrat mit Knopf oben und links (nach außen) und Kerbe rechts (nach innen)
  svg.innerHTML = '<path d="M5.6 6H9.3A1.8 1.8 0 1 1 11.7 6H15.4Q16 6 16 6.6V10.3A1.8 1.8 0 1 0 16 12.7V16.4Q16 17 15.4 17H5.6Q5 17 5 16.4V12.7A1.8 1.8 0 1 1 5 10.3V6.6Q5 6 5.6 6Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>';
  return svg;
}

function burgerIcon() { // drei dünne Linien – ☰ aus der Ersatzschrift wäre zu fett
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'menu-btn-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>';
  return svg;
}

const menuBtn = el('button', { type: 'button', class: 'menu-btn', 'aria-controls': 'toc', 'aria-expanded': 'false' },
  burgerIcon());
bindAttr(menuBtn, 'aria-label', 'docs.menuOpen');
bindAttr(menuBtn, 'title', 'docs.menuOpen');
document.getElementById('topbar').append(
  menuBtn,
  el('h1', { class: 'brand', i18n: 'docs.brand' }),
  ...headerMenu(
    themeToggle(),
    langToggle(),
    el('a', { class: 'head-link to-app', href: './index.html', target: '_blank', rel: 'noopener', 'aria-label': L('docs.toApp') },
      puzzleIcon(), el('span', { class: 'head-link-text', i18n: 'docs.toApp' })))
);

toTop.removeAttribute('hidden');
toTop.append(el('span', { 'aria-hidden': 'true' }, '↑'), el('span', { i18n: 'docs.toTop' }));

const nav = createNav({ nav: document.getElementById('toc'), backdrop: document.getElementById('toc-backdrop'), menuBtn });

// ---------- Inhalt ----------
async function zeichnen() {
  const inhalt = await ladeInhalt(getSprache());
  renderInhalt(main, inhalt);
  nav.render(inhalt);
  nav.observe(main);
  document.title = t('docs.pageTitle');
}

/** Zu einem Abschnitt springen: scrollen, Hash ohne neuen Verlaufseintrag setzen, Fokus auf die Überschrift. */
function springe(id, { sofort = false, fokus = true } = {}) {
  const ziel = id && document.getElementById(id);
  if (!ziel) return false;
  if (ziel === main) { main.focus(); return true; } // „Zum Inhalt springen“
  nav.pausieren();
  ziel.scrollIntoView({ block: 'start', behavior: sofort || WENIG_BEWEGUNG.matches ? 'instant' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
  bus.emit('navigate', { hash: id }); // replaceState löst kein hashchange aus; weitergeleitet wird nur auf dem Pult
  const sek = ziel.closest('.doc-sec') ?? ziel.querySelector('.doc-sec');
  if (sek) nav.setActive(sek.id);
  if (fokus) ziel.querySelector(':scope > h2, :scope > h3')?.focus({ preventScroll: true });
  return true;
}

await zeichnen();
uebersetzeDom();
folgeAnderenTabs();

const start = decodeURIComponent(location.hash.slice(1));
if (!springe(start, { sofort: true, fokus: false })) nav.setActive('start');

// Sprachwechsel (hier oder in einem anderen Tab): Inhalt laden, neu zeichnen, Position im aktuellen Abschnitt halten
beimSprachwechsel({
  vorbereiten: (lang) => ladeInhalt(lang), // vor dem Überblenden laden – Fehler brechen den Wechsel ab
  async zeichnen(lang) {
    // Erst nach dem Laden messen – sonst wäre die Position bis zum Neuzeichnen veraltet
    const id = nav.activeId();
    const vorher = id && document.getElementById(id)?.getBoundingClientRect().top;
    await zeichnen(); // Inhalt liegt im Cache – kein weiteres Warten
    const neu = id && document.getElementById(id);
    if (neu) {
      nav.pausieren();
      window.scrollBy({ top: neu.getBoundingClientRect().top - vorher, behavior: 'instant' });
      nav.setActive(id);
    }
  }
});

// ---------- Interne Links ----------
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const id = decodeURIComponent(a.getAttribute('href').slice(1));
  if (!document.getElementById(id)) return;
  e.preventDefault();
  nav.schliessen({ fokusZurueck: false });
  springe(id);
});
window.addEventListener('hashchange', () => springe(decodeURIComponent(location.hash.slice(1))));

// Demonstration „Pult → Bildschirm“ (nur über den Node-Server unter /demonstration/)
if (/\/demonstration(\/|$)/i.test(location.pathname)) import('../sync/sync.js');

// ---------- „Nach oben“ ----------
let tick = false;
const zeigeToTop = () => toTop.classList.toggle('visible', window.scrollY > 600);
window.addEventListener('scroll', () => {
  if (tick) return;
  tick = true;
  requestAnimationFrame(() => { tick = false; zeigeToTop(); });
}, { passive: true });
zeigeToTop();
toTop.addEventListener('click', () => {
  nav.pausieren();
  window.scrollTo({ top: 0, behavior: WENIG_BEWEGUNG.matches ? 'instant' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
  nav.setActive('start');
  document.getElementById('h-start')?.focus({ preventScroll: true });
});

// ---------- Druck: Code-Abschnitte aufklappen ----------
let zu = [];
window.addEventListener('beforeprint', () => {
  zu = [...document.querySelectorAll('details.code-details:not([open])')];
  zu.forEach((d) => { d.open = true; });
});
window.addEventListener('afterprint', () => { zu.forEach((d) => { d.open = false; }); zu = []; });
