# OOP Playground

Interaktive Einführung in die OOP (UI auf Deutsch): Abstraktion, Vererbung, Polymorphie, Kapselung.
Vanilla JS (ES Modules) + Vite, ohne Backend.

## Start
    npm install
    npm run dev      # Entwicklung
    npm run build    # Ergebnis in dist/ (GitHub Pages)

`vite.config.js` nutzt `base: './'` (läuft unter jedem Repo-Pfad). Optional: `VITE_BASE=/repo-name/ npm run build`.
Automatisches Deployment: `.github/workflows/deploy.yml` (Settings → Pages → Source: GitHub Actions).

## Erklärungsseite (docs.html)
Zweite Einstiegsseite (Vite multi-page), erreichbar über den Link „Erklärung“ (Buch-Symbol) in der Kopfzeile (neuer Tab).
- Texte: `src/docs/content/de.js` und `en.js` (Auszeichnung siehe Dateikopf). Ändert sich ein Knopf oder eine Ausgabe im OOPlayground, hier mit anpassen.
- `src/docs/render.js` (Daten → HTML), `src/docs/nav.js` (Menü, Scrollspy, Suche, Schublade), `src/styles/docs.css`.
- Die Sprache wird zwischen beiden Tabs synchronisiert (`localStorage`-Schlüssel `ooplayground.sprache`).

## Demonstration „Pult → Bildschirm“ (Branch `demo-sync`, Prototyp)
Telefon (Pult) steuert, Laptop (Bildschirm) zeigt dasselbe – über einen Node-Server mit WebSocket (`ws`).

    npm install
    npm run demo     # = vite build + node server/server.js (Port 8080, PORT=… änderbar)

- Der Server gibt beim Start die LAN-Adressen aus: `/demonstration/?rolle=bildschirm` (Laptop) und `/demonstration/?rolle=pult` (Telefon). Ohne `rolle` = Bildschirm. `/demonstration/Docs` = Erklärung.
- Synchronisiert: Objekte erstellen/löschen, Methoden, „Alle bewegen/löschen“, `new Tier()`, Karten öffnen/schließen (Klasse, Objekt, Motor), Motor-Knöpfe, Ausgabe (inkl. „Leeren“), Thema, Sprache, Wechsel zur Erklärung und zurück, Suche, Menügruppen, Code-Blöcke, Abschnitte, „Nach oben“. Beim (Wieder-)Verbinden übernimmt der Bildschirm den kompletten Zustand.
- Neue Bedienelemente einbinden: Knopf/Eingabefeld/`<details>` mit `data-sync="eindeutiger-schluessel"` versehen, Karten mit `attach(…, { key })` – dann überträgt `sync.js` sie automatisch. Waagerechtes Scrollen der Objekte wird übertragen: Verschiebung am Bildschirm = Verschiebung am Pult × (Fensterbreite Bildschirm / Fensterbreite Pult). Nicht übertragen: Scrollen der Seite, mobile Menüs (Drei-Punkte-Menü, Seitenmenü-Schublade).
- `?rolle=pult&test=1` zeigt einen Knopf „Fehlertest“ (Aufruf einer nicht existierenden Methode → `ack.ok: false`).
- `GET /api/state` zeigt, was der Server hält (leer, wenn niemand verbunden ist).
- Code: `server/server.js`, `src/sync/sync.js`; Protokoll siehe Kopf von `sync.js`.

## Icons
SVG-Dateien nach `public/icons/` legen. Dateinamen: siehe `public/icons/README.md` und `src/icons.js`.
Fehlende Icons werden durch einen Platzhalter ersetzt.

## Struktur
- `src/models/` – echte Klassen (abstrakt via `new.target`, `extends`/`super`, private `#`-Methoden in den Motoren)
- `src/services/` – `ObjectManager` (Instanzen, IDs, Methodenaufrufe), `EventBus`
- `src/components/` – UI; `popover.js` = Hover/Klick/Escape/Tastatur-Logik inkl. verschachtelter Karten
