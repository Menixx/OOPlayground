import { el } from '../../utils/dom.js';
import { icon } from '../../icons.js';
import { bus } from '../../services/EventBus.js';
import { manager, klassenName } from '../../services/ObjectManager.js';
import { Figur } from '../../models/abstract/Figur.js';
import { attach } from '../popover.js';
import { buildObjectCard } from '../ObjectCard/ObjectCard.js';
import { figurSvg } from '../figurSvg.js';
import { createAnimation } from '../animations.js';

export function mountWorkspace(root) {
  const alle = el('button', { type: 'button', class: 'primary', disabled: true, onclick: () => manager.alleBewegen(), i18n: 'workspace.moveAll' });
  const alleLoeschen = el('button', { type: 'button', class: 'loeschen', disabled: true, onclick: () => manager.alleLoeschen(), i18n: 'workspace.deleteAll' });
  const leer = el('p', { class: 'hint', i18n: 'workspace.empty' });
  const grid = el('div', { class: 'grid' });
  root.append(el('div', { class: 'bar' }, alle, alleLoeschen), leer, grid);
  const items = new Map();

  bus.on('created', ({ id, obj }) => {
  const name = klassenName(obj.constructor);
  let fig = null, anim = null, vis;
  if (obj instanceof Figur) { fig = el('span', { class: 'fig-wrap' }); fig.innerHTML = figurSvg(name); vis = fig; }
  else { anim = createAnimation(name); vis = anim?.el ?? icon(name, 'icon big'); }
  const t = el('button', { type: 'button', class: 'obj', 'aria-label': `${id} (${name})` }, vis, el('span', {}, id));
  const pop = attach(t, { klasse: 'pop-objekt', build: (api) => buildObjectCard(id, obj, api) });
  items.set(id, { pop, fig, obj, anim, tile: t });
  grid.append(t);
  leer.hidden = true;
});

bus.on('called', ({ id, methode }) => {
  const a = items.get(id)?.anim;
  if (!a) return;
  if (methode === 'halten') a.halt(); else a.play(methode);
});

bus.on('deleted', ({ ids }) => {
  ids.forEach((id) => {
    const i = items.get(id);
    if (!i) return;
    i.pop.close();      // Karte schließen
    i.tile.remove();    // Kachel entfernen
    items.delete(id);
  });
  leer.hidden = items.size > 0;
  alle.disabled = !manager.kannBewegen;
  alleLoeschen.disabled = manager.alle.length === 0;
});

bus.on('changed', ({ id }) => {
    const i = items.get(id);
    if (i) { i.pop.refresh(); if (i.fig) i.fig.style.transform = `rotate(${i.obj.winkel}deg)`; }
    alle.disabled = !manager.kannBewegen;
    alleLoeschen.disabled = manager.alle.length === 0;
  });
}
