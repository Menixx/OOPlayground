// Seitenmenü der Erklärungsseite: Baum aus Gruppen, Scrollspy, Suche, Schublade (< 900px).
import { el, L } from '../utils/dom.js';
import { bindAttr } from '../i18n/i18n.js';

const MOBIL = matchMedia('(max-width: 1024px)'); // Tablet-Breakpoint des OOPlayground: Menü als Schublade
const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');

/** Sichtbare, fokussierbare Elemente in der Reihenfolge des Dokuments. */
const fokussierbar = (root) => [...root.querySelectorAll('a[href], button, input, summary')]
  .filter((x) => !x.closest('[hidden]') && x.getClientRects().length > 0);

export function createNav({ nav, backdrop, menuBtn }) {
  let aktiv = null;
  let abschnitte = [];
  let spyPause = false;
  let io = null;
  let offenVorSuche = null; // Zustand der Gruppen, bevor gesucht wurde
  const offen = new Set(); // vom Benutzer geöffnete Gruppen (bleiben beim Sprachwechsel offen)
  let suche; let leer; let liste;

  bindAttr(nav, 'aria-label', 'docs.contents');

  // ---------- Aufbau ----------
  function eintrag(s) {
    return el('li', { class: 'toc-item', 'data-text': s.nav.toLowerCase() },
      el('a', { class: 'toc-link', href: `#${s.id}`, 'data-id': s.id },
        el('span', { class: 'toc-label' }, s.nav)));
  }

  function render(inhalt) {
    const q = suche?.value ?? '';
    suche = el('input', {
      type: 'search', class: 'toc-search', placeholder: L('docs.search'), 'aria-label': L('docs.search'),
      autocomplete: 'off', spellcheck: 'false', oninput: filtern,
      onkeydown: (e) => {
        if (e.key === 'Escape' && suche.value) { e.preventDefault(); e.stopPropagation(); suche.value = ''; filtern(); }
      }
    });
    suche.value = q;
    leer = el('p', { class: 'toc-empty', i18n: 'docs.noResults', hidden: true, role: 'status' });
    liste = el('ul', { class: 'toc-list' },
      inhalt.sections.filter((s) => s.group === 'start').map(eintrag),
      inhalt.groups.map((g) => {
        const d = el('details', {
          class: 'toc-details', open: offen.has(g.key),
          ontoggle: () => { if (offenVorSuche == null) (d.open ? offen.add(g.key) : offen.delete(g.key)); }
        },
        el('summary', {}, el('span', {}, g.nav)),
        el('ul', {}, inhalt.sections.filter((s) => s.group === g.key).map(eintrag)));
        return el('li', { class: 'toc-group', 'data-group': g.key }, d);
      }));
    const kopf = el('div', { class: 'toc-head' },
      el('div', { class: 'toc-drawer-bar' },
        el('span', { class: 'toc-title', i18n: 'docs.contents' }),
        el('button', {
          type: 'button', class: 'toc-close', 'aria-label': L('docs.menuClose'), title: L('docs.menuClose'),
          onclick: () => schliessen()
        }, el('span', { 'aria-hidden': 'true' }, '×'))),
      suche);
    nav.replaceChildren(kopf, leer, liste);
    const alt = aktiv; aktiv = null;
    if (alt) setActive(alt, { scroll: false });
    if (q) filtern();
  }

  // ---------- Suche ----------
  function filtern() {
    const q = suche.value.trim().toLowerCase();
    const gruppen = [...liste.querySelectorAll('.toc-details')];
    if (q && offenVorSuche == null) offenVorSuche = gruppen.map((d) => d.open);
    let treffer = 0;
    liste.querySelectorAll('.toc-item').forEach((li) => {
      const ja = !q || li.dataset.text.includes(q);
      li.hidden = !ja;
      if (ja) treffer++;
    });
    gruppen.forEach((d) => {
      const ja = [...d.querySelectorAll('.toc-item')].some((li) => !li.hidden);
      d.parentElement.hidden = !ja;
      if (q && ja) d.open = true;
    });
    if (!q && offenVorSuche) {
      gruppen.forEach((d, i) => { d.open = offenVorSuche[i]; });
      offenVorSuche = null;
      const a = aktiv && liste.querySelector(`a[data-id="${aktiv}"]`);
      if (a) a.closest('details')?.setAttribute('open', '');
    }
    leer.hidden = treffer > 0;
  }

  // ---------- Aktiver Eintrag ----------
  function insBild(a) {
    const n = nav.getBoundingClientRect();
    const kopf = nav.querySelector('.toc-head')?.offsetHeight ?? 0;
    const r = a.getBoundingClientRect();
    if (r.top < n.top + kopf + 8 || r.bottom > n.bottom - 8) {
      nav.scrollTo({ top: nav.scrollTop + (r.top - n.top) - (n.height + kopf) / 2, behavior: WENIG_BEWEGUNG.matches ? 'auto' : 'smooth' });
    }
  }

  function setActive(id, { scroll = true } = {}) {
    if (id === aktiv) return;
    const a = nav.querySelector(`a[data-id="${CSS.escape(id)}"]`);
    if (!a) return;
    aktiv = id;
    nav.querySelectorAll('[aria-current]').forEach((x) => x.removeAttribute('aria-current'));
    a.setAttribute('aria-current', 'location');
    const d = a.closest('details');
    if (d && !d.open && offenVorSuche == null) { d.open = true; offen.add(d.parentElement.dataset.group); }
    if (scroll && !a.closest('[hidden]')) requestAnimationFrame(() => insBild(a));
  }

  // ---------- Scrollspy ----------
  /** Aktiv ist der letzte Abschnitt, dessen Anfang die obere Zone (30 %) erreicht hat;
   *  ganz unten auf der Seite immer der letzte Abschnitt. */
  function spy() {
    if (spyPause || !abschnitte.length) return;
    const unten = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (unten) { setActive(abschnitte[abschnitte.length - 1].id); return; }
    const grenze = window.innerHeight * 0.4;
    let akt = abschnitte[0];
    for (const s of abschnitte) { if (s.getBoundingClientRect().top <= grenze) akt = s; else break; }
    setActive(akt.id);
  }

  function observe(root) {
    io?.disconnect();
    abschnitte = [...root.querySelectorAll('.doc-sec')];
    io = new IntersectionObserver(spy, { rootMargin: '-30% 0px -60% 0px' });
    abschnitte.forEach((s) => io.observe(s));
  }

  /** Während programmatischen Scrollens nicht mitzählen (sonst flackert das Menü). */
  function pausieren() {
    spyPause = true;
    let fertig = false;
    const weiter = () => { if (fertig) return; fertig = true; spyPause = false; spy(); };
    window.addEventListener('scrollend', weiter, { once: true });
    setTimeout(weiter, 1200);
  }

  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) spy();
    });
  }, { passive: true });

  // ---------- Schublade (< 900px) ----------
  const istOffen = () => nav.classList.contains('open');
  function inertSetzen() { nav.inert = MOBIL.matches && !istOffen(); }

  function oeffnen() {
    nav.classList.add('open');
    backdrop.hidden = false;
    document.body.classList.add('drawer-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    inertSetzen();
    const a = aktiv && nav.querySelector(`a[data-id="${aktiv}"]`);
    if (a) insBild(a);
    suche.focus({ preventScroll: true });
  }

  function schliessen({ fokusZurueck = true } = {}) {
    if (!istOffen()) return;
    nav.classList.remove('open');
    backdrop.hidden = true;
    document.body.classList.remove('drawer-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    inertSetzen();
    if (fokusZurueck) menuBtn.focus();
  }

  menuBtn.addEventListener('click', () => (istOffen() ? schliessen() : oeffnen()));
  backdrop.addEventListener('click', () => schliessen());
  MOBIL.addEventListener('change', () => { if (!MOBIL.matches) schliessen({ fokusZurueck: false }); inertSetzen(); });
  inertSetzen();

  document.addEventListener('keydown', (e) => {
    if (!istOffen()) return;
    if (e.key === 'Escape') { e.preventDefault(); schliessen(); return; }
    if (e.key === 'Tab') { // Fokusfalle: Tab bleibt in der Schublade
      const f = fokussierbar(nav);
      if (!f.length) return;
      const erstes = f[0]; const letztes = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === erstes || !nav.contains(document.activeElement))) { e.preventDefault(); letztes.focus(); }
      else if (!e.shiftKey && (document.activeElement === letztes || !nav.contains(document.activeElement))) { e.preventDefault(); erstes.focus(); }
    }
  });

  return {
    render, observe, setActive, pausieren,
    activeId: () => aktiv,
    schliessen
  };
}
