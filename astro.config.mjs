import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
const siteUrl = (process.env.VITE_SITE_URL || 'https://txcourseguide.com').replace(/\/$/, '');

export default defineConfig({
  site: siteUrl,
  output: 'static',
  build: {
    // Inline all CSS — prevents unstyled-page bug after CDN cache invalidation
    // (stale HTML referencing a content-hashed CSS chunk that no longer exists)
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
