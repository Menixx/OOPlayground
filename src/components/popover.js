import { el } from '../utils/dom.js';
const offene = new Set();
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') [...offene].forEach((f) => f()); });

/** Hover/Fokus öffnet, Klick fixiert (nochmal Klick schließt), Escape schließt alles.
 *  Verschachtelte Karten (parent) liegen im DOM-Teilbaum der Elternkarte,
 *  daher löst der Wechsel zwischen ihnen kein mouseleave aus. */
export function attach(trigger, { build, parent = null }) {
  let pop = null, body = null, pinned = false, timer = null;
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
  function open() {
    clearTimeout(timer);
    if (pop) return;
    body = el('div', { class: 'pop-body' });
    pop = el('div', { class: 'pop', role: 'dialog', tabindex: '-1' }, body);
    (parent?.root ?? document.body).append(pop);
    pop.addEventListener('mouseenter', () => clearTimeout(timer));
    pop.addEventListener('mouseleave', schedule);
    pop.addEventListener('focusin', () => clearTimeout(timer));
    pop.addEventListener('focusout', schedule);
    render(); place();
    trigger.setAttribute('aria-expanded', 'true');
    offene.add(close);
  }
  function close() {
    clearTimeout(timer);
    kids.forEach((f) => f());
    pop?.remove(); pop = body = null; pinned = false;
    trigger.setAttribute('aria-expanded', 'false');
    offene.delete(close);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(() => { if (!pinned) close(); }, 250); }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', schedule);
  trigger.addEventListener('focus', open);
  trigger.addEventListener('blur', schedule);
  trigger.addEventListener('click', () => {
    if (pinned) return close();
    open(); pinned = true; pop.classList.add('pinned');
  });
  addEventListener('resize', () => pop && place());
  return api;
}
