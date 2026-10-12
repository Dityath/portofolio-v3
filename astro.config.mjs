import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// NOTE: change `site` to the real production domain — it drives the canonical
// link, og:url and the absolute og:image URL in BaseLayout.astro.
export default defineConfig({
  site: 'https://dityath.dev',
  output: 'static',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // three.js is the only large chunk; it is only loaded via dynamic import behind the WebGL/reduced-motion gate.
      chunkSizeWarningLimit: 800,
    },
  },
});
