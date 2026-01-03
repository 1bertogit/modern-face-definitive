import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import compress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  site: 'https://drroberiobrandao.com',
  trailingSlash: 'never', // Evita duplicação canônica
  integrations: [
    mdx(),
    react(),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          'pt': 'pt',
          'en': 'en',
          'es': 'es',
        },
      },
      // Custom sitemap-index.xml will override the auto-generated one
      createLinkInHead: false, // Don't add <link> in HTML head
    }),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          continueOnParseError: true, // Skip files with complex markup
        },
      },
      Image: false, // Let Astro handle images
      JavaScript: true,
      SVG: true,
      Logger: 1, // Reduce logging verbosity (0=silent, 1=errors only, 2=all)
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'static',
  build: {
    format: 'directory',
  },
  redirects: {
    // Old PT main paths (root) -> new PT paths (/pt/*)
    // Note: Sub-routes handled by pages existing at new locations
    '/tecnicas': '/pt/tecnicas',
    '/face-moderna': '/pt/face-moderna',
    '/sobre': '/pt/sobre',
    '/educacao': '/pt/educacao',
    '/casos': '/pt/casos',
    '/biblioteca': '/pt/biblioteca',
    '/tecnologia-clinica': '/pt/tecnologia-clinica',
    '/contato': '/pt/contato',
    '/glossario': '/pt/glossario',
    '/formacao': '/pt/formacao',
    '/faq': '/pt/faq',
    '/privacidade': '/pt/privacidade',
    '/termos': '/pt/termos',

    // Legacy paths
    '/es/privacy': '/es/privacidad',
    '/es/terms': '/es/terminos',
  },
});
