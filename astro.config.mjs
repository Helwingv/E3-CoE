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
  server: { host: true },
  // Bundle these into the server build. Left external, lucide-react and motion load
  // thousands of files at runtime and Netlify functions fail with EMFILE.
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'motion', 'framer-motion', 'motion-dom', 'motion-utils']
    }
  }
});
