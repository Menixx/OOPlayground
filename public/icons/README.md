# Icons

Lege hier die SVG-Dateien ab (Dateinamen siehe `ICON_FILES` in `src/icons.js`).
Fehlende Dateien werden automatisch durch einen Platzhalter ersetzt.

| Datei | Verwendung |
|---|---|
| abstrakt-tier.svg, abstrakt-transport.svg, abstrakt-figur.svg | Panel „Abstrakte Klassen" |
| tier-katze.svg, tier-krokodil.svg, tier-mensch.svg | Erben-Buttons und Objekte |
| transport-auto.svg, transport-flugzeug.svg, transport-zug.svg | Erben-Buttons und Objekte |
| figur-dreieck.svg, figur-kreis.svg, figur-stern.svg | Erben-Buttons (die Objekte selbst nutzen die rotierenden Inline-SVGs aus `src/components/figurSvg.js`) |
| motor-benzin.svg, motor-turbofan.svg, motor-elektro.svg | Motor-Karten |

Empfehlung: `viewBox="0 0 48 48"`, Farbe über `currentColor`.
