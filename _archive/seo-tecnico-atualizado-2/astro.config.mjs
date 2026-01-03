import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  // UPDATED: New domain
  site: 'https://drroberiobrandao.com',
  trailingSlash: 'never', // Prevents canonical duplication
  integrations: [
    react(),
    tailwind(),
    sitemap({
      i18n: {
        // UPDATED: EN as default
        defaultLocale: 'en',
        locales: {
          'en': 'en',
          'pt': 'pt-BR',
          'es': 'es',
        },
      },
    }),
  ],
  i18n: {
    // UPDATED: EN as default
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: {
      prefixDefaultLocale: false, // EN has no prefix
    },
  },
  output: 'static',
  build: {
    format: 'directory',
  },
  // UPDATED: Redirects for new structure
  redirects: {
    // Old PT structure to new
    '/face-moderna': '/pt/face-moderna',
    '/tecnicas': '/pt/tecnicas',
    '/educacao': '/pt/educacao',
    '/sobre': '/pt/sobre',
    '/contato': '/pt/contato',
    '/privacidade': '/pt/privacidade',
    '/termos': '/pt/termos',
    
    // Old EN structure to new (remove /en prefix)
    '/en': '/',
    '/en/modern-face': '/modern-face',
    '/en/techniques': '/techniques',
    '/en/education': '/education',
    '/en/about': '/about',
    '/en/contact': '/contact',
    '/en/blog': '/blog',
    
    // Legal pages
    '/pt/privacy': '/pt/privacidade',
    '/es/privacy': '/es/privacidad',
  },
});
