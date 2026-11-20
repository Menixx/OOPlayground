import { el, L } from '../../utils/dom.js';
import { getSprache, setSprache, SPRACHEN } from '../../i18n/i18n.js';
import { bus } from '../../services/EventBus.js';

const WENIG_BEWEGUNG = matchMedia('(prefers-reduced-motion: reduce)');

/** Umschalt-Animation (nach „Animated Toggle.svg“): Der Kreis staucht sich und kriecht los,
 *  streckt sich in der Mitte und schnellt rund ans Ziel; die Schiene zieht sich dabei kurz zusammen.
 *  Phasen wie im Vorbild: 62,5 % Anlauf (ease-in), 12,5 % Strecken, 25 % Ankommen (ease-out). */
function schwung(toggle, thumb, track, vonLinks) {
  const W = toggle.clientWidth;
  const cs = getComputedStyle(toggle);
  const k = parseFloat(cs.getPropertyValue('--k')), rand = parseFloat(cs.getPropertyValue('--rand'));
  const a = rand + k / 2, b = W - rand - k / 2;
  const x = (f) => `${vonLinks ? a + (b - a) * f : b - (b - a) * f}px`;
  const ANLAUF = 'cubic-bezier(.32, 0, .67, 0)', AUS = 'cubic-bezier(0, 0, .58, 1)';
  const dauer = 620; // = Überblendung beim Sprachwechsel in base.css
  thumb.getAnimations().forEach((an) => an.cancel());
  track.getAnimations().forEach((an) => an.cancel());
  thumb.animate([
    { left: x(0), width: `${k}px`, height: `${k}px`, easing: ANLAUF },
    { offset: 0.625, left: x(0.34), width: `${k}px`, height: `${k * 62 / 90}px`, easing: AUS },
    { offset: 0.75, left: x(0.49), width: `${k * 118 / 90}px`, height: `${k * 52 / 90}px`, easing: AUS },
    { left: x(1), width: `${k}px`, height: `${k}px` }
  ], { duration: dauer });
  track.animate([
    { transform: 'scale(1)', easing: ANLAUF },
    { offset: 0.625, transform: 'scale(.924, .935)', easing: AUS },
    { offset: 0.75, transform: 'scale(.869, .902)', easing: AUS },
    { transform: 'scale(1)' }
  ], { duration: dauer });
}

/** Sprachumschalter: Schiene mit EN | DE, ein blauer Kreis liegt um das aktive Kürzel.
 *  Ein Klick irgendwo auf den Schalter wechselt die Sprache.
 *  Wird im OOPlayground (Kopfzeile) und auf der Erklärungsseite benutzt. */
export function langToggle() {
  const opt = (l) => el('span', { class: 'lang-opt', 'data-l': l }, l.toUpperCase());
  const track = el('span', { class: 'lang-track', 'aria-hidden': 'true' });
  const thumb = el('span', { class: 'lang-thumb', 'aria-hidden': 'true' });
  const btn = el('button', {
    type: 'button', class: 'lang-toggle', role: 'switch', 'aria-label': L('lang.toggle'), title: L('lang.toggle'),
    onclick: () => setSprache(SPRACHEN.find((l) => l !== getSprache()))
  }, track, thumb, SPRACHEN.map(opt));
  let vorher = null;
  function zeigen() {
    const l = getSprache();
    if (l === vorher) return;
    btn.dataset.lang = l;
    btn.setAttribute('aria-checked', String(l === 'en'));
    if (vorher && btn.isConnected && !WENIG_BEWEGUNG.matches) {
      schwung(btn, thumb, track, SPRACHEN.indexOf(l) > SPRACHEN.indexOf(vorher));
    }
    vorher = l;
  }
  zeigen();
  bus.on('sprache', zeigen);
  return btn;
}
