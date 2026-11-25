// Sprachen, in denen der Mensch spricht – zu jeder gehört eine Aufnahme in public/audio/man/.
// code: Sprachkürzel (Name der Sprache: i18n-Schlüssel sprachname.<code>)
export const MENSCH_SPRACHEN = [
  { code: 'ar', datei: 'man/arab.mp3' },
  { code: 'az', datei: 'man/az.mp3' },
  { code: 'zh', datei: 'man/chinese.mp3' },
  { code: 'de', datei: 'man/de.mp3' },
  { code: 'en', datei: 'man/eng.mp3' },
  { code: 'fr', datei: 'man/french.mp3' },
  { code: 'it', datei: 'man/ital.mp3' },
  { code: 'pl', datei: 'man/pl.mp3' },
  { code: 'pt', datei: 'man/port.mp3' },
  { code: 'es', datei: 'man/spanish.mp3' },
  { code: 'uk', datei: 'man/ukr.mp3' },
  { code: 'uz', datei: 'man/uz.mp3' },
  { code: 'vi', datei: 'man/vietnam.mp3' }
];

/** Zufälliges Element einer Liste; `ausser` wird übersprungen (wenn es noch etwas anderes gibt). */
export function zufallsElement(liste, ausser = null) {
  const auswahl = liste.length > 1 ? liste.filter((x) => x !== ausser) : liste;
  return auswahl[Math.floor(Math.random() * auswahl.length)];
}

let letzte = null;   // zuletzt gewählte Sprache – nie zweimal hintereinander dieselbe
let vorgabe = null;  // Demonstration: der Bildschirm übernimmt die Wahl des Pults
// Die nächste Sprache steht schon vorher fest – so kann ihre Audiodatei geladen werden, bevor sie gebraucht wird.
let naechste = zufallsElement(MENSCH_SPRACHEN);

/** Sprache, die beim nächsten lautGeben() des Mensch gesprochen wird (zum Vorladen). */
export const naechsteSprache = () => naechste;

/** Gibt die vorab gewählte Sprache zurück und wählt gleich zufällig die übernächste. */
export function zufaelligeSprache() {
  const v = vorgabe && MENSCH_SPRACHEN.find((s) => s.code === vorgabe);
  vorgabe = null;
  letzte = v || naechste;
  naechste = zufallsElement(MENSCH_SPRACHEN, letzte);
  return letzte;
}

/** Demonstration: die nächste „zufällige“ Sprache festlegen (damit Pult und Bildschirm dasselbe sagen). */
export const spracheVorgeben = (code) => { vorgabe = code; };
