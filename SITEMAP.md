# Sitemap — Nyawira Consulting

Every page exists in both English (default, unprefixed) and European Portuguese
(`/pt/…`). 19 information-architecture routes × 2 locales + two 404 pages = **44
pages**.

The machine-readable sitemaps are generated at build time:
`/sitemap-index.xml` → `/sitemap-0.xml` (both locales, with `hreflang`
alternates). `robots.txt` references the sitemap index.

## Structure

```
Home
├── About us
├── What we do
│   ├── Strategic Advisory
│   ├── Investment Advisory
│   ├── Project Management
│   ├── Angola Market Entry        (specialist offer)
│   └── AI Readiness               (specialist offer)
├── Sectors
│   ├── Extractives
│   ├── Technology, Information & Telecom
│   ├── Financial Services
│   ├── Public Sector
│   └── Agribusiness & Industry
├── Our approach
│   ├── Sell-side process          (process ribbon)
│   └── Buy-side process           (process ribbon)
├── Credentials
├── Contact
├── Privacy policy                 (footer)
└── Cookie policy                  (footer)
```

## Route table

| Page | English | Português (pt-PT) |
|---|---|---|
| Home | `/` | `/pt/` |
| About us | `/about` | `/pt/quem-somos` |
| What we do (hub) | `/what-we-do` | `/pt/o-que-fazemos` |
| — Strategic Advisory | `/what-we-do/strategic-advisory` | `/pt/o-que-fazemos/consultoria-estrategica` |
| — Investment Advisory | `/what-we-do/investment-advisory` | `/pt/o-que-fazemos/consultoria-de-investimento` |
| — Project Management | `/what-we-do/project-management` | `/pt/o-que-fazemos/gestao-de-projetos` |
| Angola Market Entry | `/angola-market-entry` | `/pt/entrada-no-mercado-angolano` |
| AI Readiness | `/ai-readiness` | `/pt/ai-readiness` |
| Sectors (hub) | `/sectors` | `/pt/sectores` |
| — Extractives | `/sectors/extractives` | `/pt/sectores/setor-extrativo` |
| — Technology, Information & Telecom | `/sectors/ict` | `/pt/sectores/tecnologia-informacao-telecom` |
| — Financial Services | `/sectors/financial-services` | `/pt/sectores/servicos-financeiros` |
| — Public Sector | `/sectors/public-sector` | `/pt/sectores/setor-publico` |
| — Agribusiness & Industry | `/sectors/agribusiness-industry` | `/pt/sectores/agronegocio-industria` |
| Our approach (hub) | `/approach` | `/pt/abordagem` |
| — Sell-side process | `/approach/sell-side` | `/pt/abordagem/sell-side` |
| — Buy-side process | `/approach/buy-side` | `/pt/abordagem/buy-side` |
| Credentials | `/credentials` | `/pt/credenciais` |
| Contact | `/contact` | `/pt/contacto` |
| Privacy policy | `/privacy` | `/pt/privacidade` |
| Cookie policy | `/cookies` | `/pt/cookies` |
| Not found (404) | `/404` | `/pt/404` |

The EN↔PT mapping above is generated from a single source of truth,
`src/i18n/routes.ts`, which also drives the language switcher and the reciprocal
`hreflang` / canonical tags on every page.

## Global navigation

- **Header:** About us · What we do · Sectors · Credentials · Our approach · language switcher (EN/PT) · "Talk to us" CTA.
- **Footer:** positioning statement; full navigation (every service and sector page); contact block; language switcher; privacy & cookie links.
