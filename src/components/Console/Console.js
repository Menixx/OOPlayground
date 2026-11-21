import { el } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';

const MAX = 500;  // Zeilen im Verlauf (für den Zustand der Demonstration)
let verlauf = []; // [{ typ, text }] – was gerade in der Ausgabe steht
let zeichnen = null;

const zeile = (typ, text) => el('div', { class: `zeile ${typ}` }, typ === 'befehl' || typ === 'info' ? `> ${text}` : `  ${text}`);

/** Inhalt der Ausgabe als Liste. */
export const konsolenVerlauf = () => verlauf.map((e) => ({ ...e }));
/** Ausgabe ersetzen (Bildschirm übernimmt den Zustand des Pults). */
export function konsoleSetzen(liste = []) {
  verlauf = liste.slice(-MAX).map(({ typ, text }) => ({ typ, text: String(text) }));
  zeichnen?.();
}

export function mountConsole(root) {
  const out = el('div', { class: 'out', role: 'log', 'aria-live': 'polite', tabindex: '0' });
  const clear = el('button', { type: 'button', class: 'mini', 'data-sync': 'konsole:leeren', onclick: () => konsoleSetzen([]), i18n: 'console.clear' });
  root.append(clear, out);
  zeichnen = () => {
    out.replaceChildren(...verlauf.flatMap(({ typ, text }) => text.split('\n').map((z) => zeile(typ, z))));
    out.scrollTop = out.scrollHeight;
  };
  bus.on('log', ({ typ, text }) => {
    verlauf.push({ typ, text: String(text) });
    if (verlauf.length > MAX) verlauf.shift();
    String(text).split('\n').forEach((z) => out.append(zeile(typ, z)));
    out.scrollTop = out.scrollHeight;
  });
}
