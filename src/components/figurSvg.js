const stern = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 19 : 46, a = -Math.PI / 2 + (i * Math.PI) / 5;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(' ');
const FORMEN = {
  Dreieck: '<polygon points="50,12 92,84 8,84"/>',
  Kreis: '<circle cx="50" cy="50" r="40"/><line x1="50" y1="50" x2="90" y2="50" class="marke"/>',
  Stern: `<polygon points="${stern}"/>`
};
export const figurSvg = (name) => `<svg class="fig" viewBox="0 0 100 100" aria-hidden="true">${FORMEN[name]}${name === 'Dreieck' ? '<circle cx="50" cy="12" r="4" class="marke"/>' : ''}</svg>`;
