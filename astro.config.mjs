import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// The public address of the site, used for the sitemap, canonical links,
// social previews, robots.txt and llms.txt. Change it here (or set SITE_URL
// in Netlify) if the domain changes.
const siteUrl = process.env.SITE_URL || 'https://e3coe.com';

export default defineConfig({
  site: siteUrl,
  output: 'hybrid',
  adapter: netlify(),
  integrations: [
    react(),
    tailwind(),
    sitemap({ filter: (page) => !page.includes('/admin') })
  ],
  server: { host: true },
  // Bundle these into the server build. Left external, lucide-react and motion load
  // thousands of files at runtime and Netlify functions fail with EMFILE.
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'motion', 'framer-motion', 'motion-dom', 'motion-utils']
    }
  }
});
