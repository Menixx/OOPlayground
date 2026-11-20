import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const file = (p) => fileURLToPath(new URL(p, import.meta.url)); // ESM-sicher ("type": "module")

// base './' funktioniert für GitHub Pages unter jedem Repository-Pfad.
// Optional: VITE_BASE=/repo-name/ npm run build
// Zwei Einstiegsseiten: der OOPlayground (index.html) und die Erklärung (docs.html).
export default defineConfig({
  base: process.env.VITE_BASE || './',
  esbuild: { keepNames: true }, // NICHT entfernen: nötig für Klassennamen/Fehlermeldungen
  build: {
    target: 'es2022', // Top-Level-await (i18n.js, docs/main.js) – Wörterbuch/Inhalt werden pro Sprache nachgeladen
    rollupOptions: {
      input: {
        main: file('./index.html'),
        docs: file('./docs.html')
      }
    }
  }
});
