import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import react from '@astrojs/react';

// https://astro.build/config - reloaded for new favicons
export default defineConfig({
  site: import.meta.env.SITE || 'http://localhost:4321', // Auto-detect for local dev
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    icon(),
    react(),
  ],
  redirects: {
    '/portfolio/villa-modern-batu': '/portfolio/villa',
    '/portfolio/cafe-batu-estetik': '/portfolio/cafe-batu',
    '/portfolio/kitchen-set-pasuruan': '/portfolio/kitchen-set',
  },
  image: {
    domains: ['cdn.jsdelivr.net', 'images.unsplash.com', 'raw.githubusercontent.com'],
  },
  vite: {
    build: {
      sourcemap: false,
    },
    server: {
      watch: {
        ignored: ['**/assets/**'],
      },
      proxy: {
        '/media': {
          target: 'https://cdn.jsdelivr.net/gh/binaprojectcontent1-hue/bina-media@main',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, ''),
        },
      },
    },
    optimizeDeps: {
      exclude: ['jquery', 'isotope-layout'],
    },
  },
});
