import { el } from '../utils/dom.js';
// close-Funktion -> { trigger, pop() }, damit Klicks außerhalb erkannt werden können
const offene = new Map();
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') [...offene.keys()].forEach((f) => f()); });

// Klick irgendwo außerhalb einer offenen Karte (und außerhalb ihres Triggers) schließt sie.
// Capture-Phase: funktioniert auch, wenn ein Handler stopPropagation() aufruft.
document.addEventListener('click', (e) => {
  [...offene].forEach(([close, { trigger, pop }]) => {
    const p = pop();
    if (trigger.contains(e.target) || p?.contains(e.target)) return;
    close();
  });
}, true);

// Scrollen innerhalb einer Karte darf nie die Seite scrollen (auch wenn die Karte selbst keinen Scrollbar hat).
function sperreSeitenScroll(pop) {
  pop.addEventListener('wheel', (e) => {
    e.stopPropagation(); // nur die innerste Karte entscheidet (verschachtelte Karten)
    const max = pop.scrollHeight - pop.clientHeight;
    const amEnde = e.deltaY < 0 ? pop.scrollTop <= 0 : pop.scrollTop >= max - 1;
    if (max <= 0 || amEnde) e.preventDefault();
  }, { passive: false });
}

/** Hover/Fokus öffnet, Verlassen schließt (nach kurzer Verzögerung), Escape oder Klick daneben schließt alles.
 *  Verschachtelte Karten (parent) liegen im DOM-Teilbaum der Elternkarte,
 *  daher löst der Wechsel zwischen ihnen kein mouseleave der Elternkarte aus.
 *  Touch: Tippen öffnet, erneutes Tippen auf den Trigger oder Tippen daneben schließt. */
const SCHLIESS_VERZOEGERUNG = 100; // ms nach dem Verlassen – reicht, um vom Trigger in die Karte zu wechseln
const AUSBLENDEN = 150; // ms, muss zu .pop-closing in class-popover.css passen
const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');

export function attach(trigger, { build, parent = null, klasse = '' }) {
  let pop = null, body = null, timer = null, fade = null, touch = false, warOffen = false;
  const kids = new Set();
  const api = {
    get root() { return pop; },
    kids,
    refresh() { if (pop) { render(); place(); } },
    close
  };
  if (parent) parent.kids.add(close);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');

  function render() {
    kids.forEach((f) => f()); // Kind-Karten schließen, da ihre Trigger neu gebaut werden
    body.replaceChildren(build(api));
  }
  function place() {
    const r = trigger.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight, W = innerWidth, H = innerHeight;
    let x, y;
    if (parent?.root) {
      const p = parent.root.getBoundingClientRect();
      x = p.right + 8; if (x + w > W - 8) x = p.left - w - 8;
      y = r.top;
    } else {
      x = r.left; y = r.bottom + 8; if (y + h > H - 8) y = r.top - h - 8;
    }
    pop.style.left = Math.max(8, Math.min(x, W - w - 8)) + 'px';
    pop.style.top = Math.max(8, Math.min(y, H - h - 8)) + 'px';
  }
  /** Zurückkehren während des Ausblendens hält die Karte offen. */
  function halten() {
    clearTimeout(timer);
    if (!fade) return;
    clearTimeout(fade); fade = null;
    pop?.classList.remove('pop-closing');
  }
  function open() {
    halten();
    if (pop) return;
    body = el('div', { class: 'pop-body' });
    pop = el('div', { class: `pop ${klasse}`.trim(), role: 'dialog', tabindex: '-1' }, body);
    (parent?.root ?? document.body).append(pop);
    pop.addEventListener('mouseenter', halten);
    pop.addEventListener('mouseleave', schedule);
    pop.addEventListener('focusin', halten);
    pop.addEventListener('focusout', schedule);
    sperreSeitenScroll(pop);
    render(); place();
    trigger.setAttribute('aria-expanded', 'true');
    offene.set(close, { trigger, pop: () => pop });
  }
  function close() {
    clearTimeout(timer); clearTimeout(fade); fade = null;
    kids.forEach((f) => f());
    pop?.remove(); pop = body = null;
    trigger.setAttribute('aria-expanded', 'false');
    offene.delete(close);
  }
  /** Nach dem Verlassen: kurz warten, dann ausblenden und schließen (Esc/Klick daneben schließen sofort). */
  function ausblenden() {
    if (!pop || WENIG_BEWEGUNG.matches) { close(); return; }
    pop.classList.add('pop-closing');
    fade = setTimeout(close, AUSBLENDEN);
  }
  function schedule() { clearTimeout(timer); if (!fade) timer = setTimeout(ausblenden, SCHLIESS_VERZOEGERUNG); }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', schedule);
  trigger.addEventListener('focus', open);
  trigger.addEventListener('blur', schedule);
  // Touch-Geräte: der emulierte mouseenter öffnet die Karte; ein Tippen auf den Trigger bei offener Karte schließt sie.
  trigger.addEventListener('pointerdown', (e) => { touch = e.pointerType !== 'mouse'; warOffen = !!pop; });
  trigger.addEventListener('click', () => { if (touch && warOffen) close(); else open(); });
  addEventListener('resize', () => pop && place());
  return api;
}
