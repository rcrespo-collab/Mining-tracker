# Nyawira Consulting — website

Production-ready bilingual (English / European Portuguese) marketing site for
Nyawira Consulting, a boutique strategic and investment advisory firm operating
in African markets.

Static site, no CMS, no database, no client-side framework. The site typeface is
Trebuchet MS (a system font, no download); there are zero external network
requests at runtime.

## Stack

- **Astro 5** (static output) · TypeScript (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`, design tokens in `@theme`
- Astro native **i18n** routing (`en` default, `pt` non-prefixed default)
- **Trebuchet MS** as the site typeface (system font — no download, no external font request)
- `@astrojs/sitemap` for the multi-locale sitemap

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build → ./dist
npm run preview    # serve ./dist
npm run check      # astro check (types + a11y hints)
```

Node 20+ required.

## Environment variables

| Var | Purpose | Default |
|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | Contact-form POST target. If unset, the form falls back to a `mailto:` compose. | *(unset)* |
| `PUBLIC_SITE_URL` | Canonical origin (canonical/hreflang/sitemap/OG). | `https://www.nyawiraconsulting.com` |

## Project layout

```
src/
├── components/        UI + the signature ProcessRibbon; islands: ContactForm, CredentialsFilter
├── layouts/           BaseLayout (SEO/JSON-LD/hreflang) · PageLayout · ServiceLayout
├── content/
│   ├── en/index.ts    English copy (implements SiteContent)
│   ├── pt/index.ts    Portuguese mirror (implements SiteContent)
│   ├── shared.ts      cross-locale taxonomy + the 12 canonical credentials (bilingual)
│   └── types.ts       SiteContent interface
├── i18n/
│   ├── routes.ts      single source of truth for the EN↔PT route map
│   └── ui.ts          nav / CTA / form / footer chrome strings
├── pages/             EN routes at root, PT routes under /pt
└── styles/global.css  @theme tokens, type scale, base, motion
public/
├── logos/  og/        placeholder marks + generated OG images
└── robots.txt, favicon.svg
```

## Signature element

The **process ribbon** (`src/components/ProcessRibbon.astro`) on
`/approach/sell-side` and `/approach/buy-side`: a rising, numbered Nyawira track
in cyan on the navy gradient over a flat, muted "typical alternative" track, with
the vertical gap widening across the sequence to encode the firm's argument. It
becomes a vertical stepper below 768px. It is the only place `01/02/03` numbering
is used.

## Deployment

Static output in `./dist`. Config included for **Netlify** (`netlify.toml`),
**Vercel** (`vercel.json`), and **GitHub Pages** (`.github/workflows/deploy.yml`).
Any static host works — point it at the build command `npm run build` and the
`dist` directory.

### GitHub Pages

A workflow builds and publishes to Pages on every push to `main`. The site is
served at the root of the custom domain **www.nyawiraconsulting.com**
(`public/CNAME`), so the Pages build runs at the root path with
`PUBLIC_SITE_URL=https://www.nyawiraconsulting.com`.

To go live:
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. DNS at the domain provider: `www` → `CNAME` → `<owner>.github.io`; apex
   `nyawiraconsulting.com` → GitHub Pages `A` records
   (185.199.108–111.153). Leave `MX`/email records untouched.
3. After DNS resolves, tick **Enforce HTTPS** in Settings → Pages.

`astro.config.mjs` still supports an optional `BASE_PATH` for sub-path hosting
(e.g. a project page at `/<repo>/`); it's unset here because the custom domain
serves at the root.

## Notes

See [`NOTES.md`](./NOTES.md) for design/content decisions and the list of
placeholder assets still to be supplied (address, LinkedIn, real logos, legal
copy).
