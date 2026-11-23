// Inhalt der Erklärungsseite (Daten aus content/de.js bzw. en.js) -> HTML.
// Die Texte sind vertrauenswürdige, lokale Daten; trotzdem wird jeder Text escaped,
// bevor die Auszeichnung (siehe Kopf von content/de.js) in HTML umgewandelt wird.
import { t } from '../i18n/i18n.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** {{tag}} -> Klasse wie in den Karten (class-popover / tag.css). */
const TAGS = {
  geerbt: '', inherited: '',
  eigen: 'eigen', own: 'eigen',
  'überschrieben': 'ueber', overridden: 'ueber',
  abstract: 'abstract', implemented: 'impl',
  // Speicherbereiche der JVM – Farben wie im Fenster „Speicher“ des OOPlayground
  Stack: 'stack', Heap: 'heap', Metaspace: 'meta'
};

const chip = (text) => `<span class="ui-chip">${text}</span>`;

/** Inline-Auszeichnung: `code`, [[Chip]], {{tag}}, **fett**, *kursiv*, [Text](#id). */
export function inline(src) {
  const keep = [];
  const hold = (html) => `\u0000${keep.push(html) - 1}\u0000`;
  // Code zuerst herausnehmen, damit darin nichts weiter umgewandelt wird
  let s = src.replace(/`([^`]+)`/g, (_, c) => {
    const ui = c.match(/^\[\[(.+)\]\]$/);
    if (ui) return hold(chip(esc(ui[1])));
    const art = /^[a-z]\w*\(\)$/.test(c) ? ' class="m"' : ''; // Methodenname -> grün wie in den Karten
    return hold(`<code${art}>${esc(c)}</code>`);
  });
  s = esc(s)
    .replace(/\[\[(.+?)\]\]/g, (_, x) => chip(x))
    .replace(/\{\{(.+?)\}\}/g, (m, x) => (x in TAGS ? `<span class="tag ${TAGS[x]}">${x}</span>` : m))
    .replace(/\[([^\]]+)\]\(#([\w-]+)\)/g, '<a href="#$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[Number(i)]);
}

const LISTE = /^(\s*)(\d+\.|-)\s+/;

/** Verschachtelte Liste aus Markdown-Zeilen; die oberste Ebene bekommt optional eine Klasse. */
function liste(zeilen, klasse) {
  let pos = 0;
  const ebene = (einzug, top) => {
    const geordnet = /\d/.test(zeilen[pos].match(LISTE)[2]);
    let html = '';
    while (pos < zeilen.length) {
      const m = zeilen[pos].match(LISTE);
      const e = m[1].length;
      if (e < einzug) break;
      if (e > einzug) { html = html.replace(/<\/li>$/, '') + ebene(e, false) + '</li>'; continue; }
      html += `<li>${inline(zeilen[pos].slice(m[0].length))}</li>`;
      pos++;
    }
    const tag = geordnet ? 'ol' : 'ul';
    return `<${tag}${top && klasse ? ` class="${klasse}"` : ''}>${html}</${tag}>`;
  };
  return ebene(zeilen[0].match(LISTE)[1].length, true);
}

function tabelle(zeilen) {
  const zellen = (z) => z.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const [kopf, , ...rumpf] = zeilen;
  return `<div class="table-wrap"><table><thead><tr>${zellen(kopf).map((c) => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead>`
    + `<tbody>${rumpf.map((z) => `<tr>${zellen(z).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** Ausgabe-Block wie die Konsole des OOPlayground: „> …“ Befehl, „  …“ Ergebnis, „!! …“ Fehler. */
function konsole(zeilen) {
  const label = esc(t('docs.outputLabel'));
  const html = zeilen.map((z) => {
    if (z.startsWith('!! ')) return `<span class="zeile fehler">  ${esc(z.slice(3))}</span>`;
    if (z.startsWith('> ')) return `<span class="zeile befehl">${esc(z)}</span>`;
    return `<span class="zeile ergebnis">${esc(z)}</span>`;
  }).join('\n');
  return `<figure class="doc-console"><figcaption aria-hidden="true">${label}</figcaption><pre class="out" aria-label="${label}">${html}</pre></figure>`;
}

function codeblock(sprache, zeilen) {
  if (sprache === 'console') return konsole(zeilen);
  const art = sprache === 'text' ? 'schema' : 'code';
  return `<pre class="doc-${art}"><code>${esc(zeilen.join('\n'))}</code></pre>`;
}

/** Block-Markdown: Absätze, (verschachtelte) Listen, Tabellen, Code-Zäune. */
export function md(src, { listenKlasse = null } = {}) {
  const L = src.split('\n');
  const out = [];
  let i = 0;
  let ersteListe = true;
  while (i < L.length) {
    const z = L[i];
    if (!z.trim()) { i++; continue; }
    const zaun = z.match(/^```(\w*)/);
    if (zaun) {
      const rumpf = [];
      for (i++; i < L.length && !/^```\s*$/.test(L[i]); i++) rumpf.push(L[i]);
      i++;
      out.push(codeblock(zaun[1], rumpf));
      continue;
    }
    if (z.startsWith('|')) {
      const zeilen = [];
      while (i < L.length && L[i].startsWith('|')) zeilen.push(L[i++]);
      out.push(tabelle(zeilen));
      continue;
    }
    if (LISTE.test(z)) {
      const zeilen = [];
      while (i < L.length && LISTE.test(L[i])) zeilen.push(L[i++]);
      out.push(liste(zeilen, ersteListe ? listenKlasse : null));
      ersteListe = false;
      continue;
    }
    const absatz = [];
    while (i < L.length && L[i].trim() && !LISTE.test(L[i]) && !L[i].startsWith('|') && !L[i].startsWith('```')) absatz.push(L[i++]);
    out.push(`<p>${inline(absatz.join(' '))}</p>`);
  }
  return out.join('');
}

// ---------- Bausteine der Abschnitte ----------

const h4 = (text, extra = '') => `<h4>${esc(text)}${extra}</h4>`;

/** Chips mit Links auf Begriffe: „Passt zu: …“ bzw. „← Zurück zu: …“. */
function verweise(label, related, klasse) {
  if (!related?.length) return '';
  return `<p class="${klasse}"><span class="refs-label">${esc(label)}</span> `
    + related.map((r) => `<a class="ref-chip" href="#${r.id}">${esc(r.label)}</a>`).join(' ')
    + '</p>';
}

/** Schema der vier Bereiche des OOPlayground (6.6). */
function zonen() {
  const z = [
    ['ui-kopfzeile', 'docs.zoneHeader', 'kopf'],
    ['ui-klassen', 'section.classes', 'panel'],
    ['ui-objekte', 'section.objects', 'panel'],
    ['ui-ausgabe', 'section.output', 'konsole']
  ];
  return `<ol class="zones">${z.map(([id, key, art], n) => `<li><a class="zone zone-${art}" href="#${id}">`
    + `<span class="zone-num" aria-hidden="true">${n + 1}</span><span class="zone-name">${esc(t(key))}</span></a></li>`).join('')}</ol>`;
}

const EMOJI = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*️?)\s*/u;

function begriffBlock({ k, md: text }) {
  switch (k) {
    case 'short': return `<div class="box box-short">${h4(t('docs.short'))}${md(text)}</div>`;
    case 'life': {
      const m = text.match(EMOJI);
      const icon = m ? `<span class="life-icon" aria-hidden="true">${m[1]}</span>` : '';
      return `<div class="block block-life">${h4(t('docs.life'))}<div class="life-row">${icon}<div>${md(m ? text.slice(m[0].length) : text)}</div></div></div>`;
    }
    case 'inApp': return `<div class="block">${h4(t('docs.inApp'))}${md(text)}</div>`;
    case 'memory': return `<div class="block block-memory">${h4(t('docs.memory'))}${md(text)}</div>`;
    case 'remember': return `<div class="box box-remember">${h4(t('docs.remember'))}${md(text)}</div>`;
    case 'code': return `<details class="code-details"><summary>${h4(t('docs.code'))}</summary>${md(text)}</details>`;
    default: return md(text);
  }
}

function demoBlock({ k, md: text, note }) {
  switch (k) {
    case 'goal': return `<div class="box box-goal">${h4(t('docs.goal'))}${md(text)}</div>`;
    case 'before': return `<div class="note">${md(text)}</div>`;
    case 'steps': return `<div class="block">${h4(t('docs.steps'))}${md(text, { listenKlasse: 'steps' })}</div>`;
    case 'output': return `<div class="block block-output">${h4(t('docs.output'), note ? ` <span class="h-note">${esc(note)}</span>` : '')}${md(text)}</div>`;
    case 'watch': return `<div class="block block-watch">${h4(t('docs.watch'))}${md(text)}</div>`;
    default: return `<div class="block">${md(text)}</div>`;
  }
}

function abschnittInhalt(s) {
  switch (s.type) {
    case 'concept':
      return s.blocks.map(begriffBlock).join('')
        + (s.demo ? `<p class="demo-cta"><a class="primary demo-link" href="#${s.demo}">${esc(t('docs.showDemo'))}</a></p>` : '');
    case 'demo':
      return s.blocks.map(demoBlock).join('') + verweise(t('docs.back'), s.related, 'refs refs-back');
    default: // intro | ui
      return s.blocks.map((b) => (b.k === 'zones' ? zonen() : md(b.md))).join('')
        + (s.cards ? `<ul class="entry-cards">${s.cards.map((c, n) => `<li><a class="entry-card" href="#${c.id}">`
          + `<span class="entry-num" aria-hidden="true">${n + 1}</span><strong>${esc(c.title)}</strong><span>${esc(c.text)}</span></a></li>`).join('')}</ul>` : '')
        + verweise(t('docs.related'), s.related, 'refs');
  }
}

/** Ein Abschnitt (<section id=…>) mit Überschrift h2 (Willkommen) bzw. h3. */
function abschnitt(s, ebene) {
  const hid = `h-${s.id}`;
  const kopf = [];
  if (s.num && s.group !== 'oberflaeche') kopf.push(`<span class="eyebrow-num">${esc(s.num)}</span>`); // wie im Menü: B… und D…
  if (s.pillar) kopf.push(`<span class="eyebrow-pillar">${esc(t('docs.pillar', { n: s.pillar }))}</span>`);
  return `<section id="${s.id}" class="doc-sec doc-${s.type}" aria-labelledby="${hid}">`
    + (kopf.length ? `<p class="eyebrow">${kopf.join('')}</p>` : '')
    + `<h${ebene} id="${hid}" tabindex="-1">${esc(s.title)}</h${ebene}>`
    + abschnittInhalt(s)
    + '</section>';
}

const TEIL_TITEL = { oberflaeche: 'docs.part1', begriffe: 'docs.part2', vorfuehren: 'docs.part3' };

/** Ganze Seite: Willkommen + drei Teile mit Trennern. */
export function renderInhalt(root, inhalt) {
  const html = [];
  for (const s of inhalt.sections.filter((x) => x.group === 'start')) html.push(abschnitt(s, 2));
  inhalt.groups.forEach((g) => {
    const hid = `h-${g.id}`;
    html.push(`<section id="${g.id}" class="doc-part" aria-labelledby="${hid}">`
      + `<h2 class="part-title" id="${hid}" tabindex="-1">${esc(t(TEIL_TITEL[g.key]))}</h2>`
      + inhalt.sections.filter((s) => s.group === g.key).map((s) => abschnitt(s, 3)).join('')
      + '</section>');
  });
  root.innerHTML = html.join('');
}
