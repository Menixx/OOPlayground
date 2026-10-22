# OOP Playground

Interaktive Einführung in die OOP (UI auf Deutsch): Abstraktion, Vererbung, Polymorphie, Kapselung.
Vanilla JS (ES Modules) + Vite, ohne Backend.

## Start
    npm install
    npm run dev      # Entwicklung
    npm run build    # Ergebnis in dist/ (GitHub Pages)

`vite.config.js` nutzt `base: './'` (läuft unter jedem Repo-Pfad). Optional: `VITE_BASE=/repo-name/ npm run build`.
Automatisches Deployment: `.github/workflows/deploy.yml` (Settings → Pages → Source: GitHub Actions).

## Icons
SVG-Dateien nach `public/icons/` legen. Dateinamen: siehe `public/icons/README.md` und `src/icons.js`.
Fehlende Icons werden durch einen Platzhalter ersetzt.

## Struktur
- `src/models/` – echte Klassen (abstrakt via `new.target`, `extends`/`super`, private `#`-Methoden in den Motoren)
- `src/services/` – `ObjectManager` (Instanzen, IDs, Methodenaufrufe), `EventBus`
- `src/components/` – UI; `popover.js` = Hover/Klick/Escape/Tastatur-Logik inkl. verschachtelter Karten
