import { el } from '../../utils/dom.js';
import { icon } from '../../icons.js';
import { bus } from '../../services/EventBus.js';
import { manager, klassenName } from '../../services/ObjectManager.js';
import { Figur } from '../../models/abstract/Figur.js';
import { attach } from '../popover.js';
import { buildObjectCard } from '../ObjectCard/ObjectCard.js';
import { figurSvg } from '../figurSvg.js';

export function mountWorkspace(root) {
  const alle = el('button', { type: 'button', class: 'primary', disabled: true, onclick: () => manager.alleBewegen() }, 'Alle bewegen');
  const leer = el('p', { class: 'hint' }, 'Noch keine Objekte. Fahre über eine abstrakte Klasse und instanziiere einen Erben.');
  const grid = el('div', { class: 'grid' });
  root.append(el('div', { class: 'bar' }, alle), leer, grid);
  const items = new Map();

  bus.on('created', ({ id, obj }) => {
    const name = klassenName(obj.constructor);
    let fig = null, vis;
    if (obj instanceof Figur) { fig = el('span', { class: 'fig-wrap' }); fig.innerHTML = figurSvg(name); vis = fig; }
    else vis = icon(name, 'icon big');
    const t = el('button', { type: 'button', class: 'obj', 'aria-label': `${id} (${name})` }, vis, el('span', {}, id));
    const pop = attach(t, { build: (api) => buildObjectCard(id, obj, api) });
    items.set(id, { pop, fig, obj });
    grid.append(t);
    leer.hidden = true;
  });
  bus.on('changed', ({ id }) => {
    const i = items.get(id);
    if (i) { i.pop.refresh(); if (i.fig) i.fig.style.transform = `rotate(${i.obj.winkel}deg)`; }
    alle.disabled = !manager.kannBewegen;
  });
}
