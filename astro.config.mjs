// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical production site URL. Override at build time if the domain changes.
const SITE = process.env.PUBLIC_SITE_URL || 'https://www.nyawiraconsulting.com';

// Optional base path for sub-path hosts (e.g. GitHub project pages served at
// /<repo>/). Set BASE_PATH at build time; unset means served at the root ('/'),
// which is what Netlify/Vercel and local dev use — so this stays a no-op there.
const BASE = process.env.BASE_PATH || undefined;

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          pt: 'pt-PT',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
