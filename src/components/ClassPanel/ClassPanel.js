import { el } from '../../utils/dom.js';
import { icon } from '../../icons.js';
import { KLASSEN } from '../../services/ObjectManager.js';
import { attach } from '../popover.js';
import { buildClassPopover } from '../ClassPopover/ClassPopover.js';

export function mountClassPanel(root) {
  root.className = 'class-panel';
  KLASSEN.forEach((g) => {
    const b = el('button', { type: 'button', class: 'class-btn' }, icon(g.name, 'icon big'), el('span', {}, g.name), el('small', {}, 'abstract'));
    attach(b, { key: `klasse:${g.name}`, build: () => buildClassPopover(g) });
    root.append(b);
  });
}
