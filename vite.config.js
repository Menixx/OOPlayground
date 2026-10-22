import { defineConfig } from 'vite';
// base './' funktioniert für GitHub Pages unter jedem Repository-Pfad.
// Optional: VITE_BASE=/repo-name/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || './',
  esbuild: { keepNames: true }
});
