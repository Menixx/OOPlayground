import { el } from '../../utils/dom.js';
import { bus } from '../../services/EventBus.js';

export function mountConsole(root) {
  const out = el('div', { class: 'out', role: 'log', 'aria-live': 'polite', tabindex: '0' });
  const clear = el('button', { type: 'button', class: 'mini', onclick: () => out.replaceChildren(), i18n: 'console.clear' });
  root.append(clear, out);
  bus.on('log', ({ typ, text }) => {
    String(text).split('\n').forEach((zeile) =>
      out.append(el('div', { class: `zeile ${typ}` }, typ === 'befehl' ? `> ${zeile}` : typ === 'info' ? `> ${zeile}` : `  ${zeile}`)));
    out.scrollTop = out.scrollHeight;
  });
}
