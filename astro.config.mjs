// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://arshad-kazi.com',
  integrations: [sitemap()],
  // Notebooks now live on the Blogs page; SLAM was withdrawn. Old links land there.
  redirects: {
    '/notebooks': '/blog',
    '/notebooks/slam': '/blog',
  },
});