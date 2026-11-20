import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://e3coe.com',
  output: 'hybrid',
  adapter: netlify(),
  integrations: [react(), tailwind(), sitemap()],
  server: { host: true }
});
