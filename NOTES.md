# NOTES — decisions & outstanding assets

Build of the Nyawira Consulting bilingual (EN/PT) marketing site, per the build
brief. This file records the judgement calls made where the brief left something
undefined, and every placeholder asset still to be supplied.

## Placeholder assets to supply

| Asset | Location | Status |
|---|---|---|
| Office address | literal `[ADDRESS]` token | in footer, contact page, — to supply |
| LinkedIn URL | literal `[LINKEDIN_URL]` token | in footer, contact page, JSON-LD `sameAs` — to supply |
| Team / firm logos | `public/logos/*.svg` | text-based grayscale placeholders; real licensed marks listed in `public/logos/README.txt` |
| Nyawira brand mark | `public/logos/nyawira-mark.svg`, `public/favicon.svg` | abstract ascending-bars placeholder derived from the palette — replace with real logo |
| OG social images | `public/og/og-en.png`, `og-pt.png` | generated (1200×630, gradient + wordmark). Rasterised with system fonts, so PT accents are dropped in the image text only — replace with brand-designed OG art |
| Privacy policy copy | `src/content/{en,pt}` `privacy.body` | marked `[TO BE SUPPLIED: …]` — needs counsel-reviewed text |
| Cookie policy copy | `src/content/{en,pt}` `cookies.body` | marked `[TO BE SUPPLIED: …]` — needs counsel-reviewed text |

## Configuration

- `PUBLIC_FORM_ENDPOINT` — contact form POST target. **Unset by default**, so the
  form uses the graceful `mailto:` fallback to info@nyawiraconsulting.com. Set it
  in the host env to enable AJAX submission.
- `PUBLIC_SITE_URL` — canonical origin. Defaults to
  `https://www.nyawiraconsulting.com`. Set at build time if the domain differs
  (drives canonical, hreflang, sitemap, OG URLs, `robots.txt` sitemap line).

## Design-system decisions

- **Slate darkened for AA.** The brief's `--color-slate` `#6B7488` is 4.25:1 on
  mist (below AA 4.5:1 for normal text). Darkened to `#5D6678` (5.24:1 on mist,
  5.77:1 on paper). The brief explicitly sanctions "or darken for text use".
- **Focus ring.** Cyan `#21C6C9` is only 2.1:1 on white, so a cyan-only ring
  fails the 3:1 non-text rule on light grounds. Kept the required 2px cyan
  outline + 2px offset, and added an ink halo (`box-shadow`) on light and a
  white halo on dark so the ring always clears 3:1. Outlines are never removed.
- **Cyan restraint.** Cyan is limited to large display type, borders, markers,
  focus rings and the primary button — never small body text.
- **Links on dark.** `--color-blue-lift` is 3.7:1 on ink (fails AA for normal
  text), so on dark surfaces links are white with a persistent cyan underline and
  hover-to-cyan, rather than blue-lift.
- **Numbering.** `01/02/03`-style numbering appears **only** on the two process
  ribbons. The investment-advisory process links use "Five phases / Four phases"
  (PT: "Cinco/Quatro fases") instead of numeric ranges.

## Content architecture decisions

- **Consolidated locale modules.** Rather than 38 single-page files, page copy
  lives in one typed module per locale — `src/content/en/index.ts` and
  `src/content/pt/index.ts` — both implementing the `SiteContent` interface in
  `src/content/types.ts`. This guarantees the PT mirror cannot drift
  structurally from EN, and keeps a single source per locale. `shared.ts` holds
  cross-locale taxonomy.
- **Credentials are a single bilingual source** (`src/content/shared.ts`), not
  duplicated per locale, so the 12 canonical engagements and their service/sector
  tags can never diverge between EN and PT.
- **Credential metadata is derived, never fabricated.** No deal values, dates or
  client names were invented.
  - *Service tags* are interpretive: every engagement is transaction/valuation
    work (Investment Advisory); `strategic` was added to the IPO-plan and
    joint-venture engagements, `project` to the closing/diligence-heavy ones, so
    the Service filter returns meaningful subsets. Nothing was tagged that the
    engagement text doesn't support.
  - *Status* is `Completed` for the past-tense single engagements and
    `Track record` for the aggregate ones ("20+…", "30+…", "Independent
    valuations…"). No dates implied.
  - *Geography* uses what the text states (Angola, Sub-Saharan Africa,
    Angola/Switzerland) and "African markets" where unspecified.
- **Sector-page prose** was written grounded strictly in the 12 listed
  credentials — no engagements were invented.
- **"leading"** appears only inside verbatim canonical copy ("leading public and
  private institutions", "a leading sub-Saharan bank", "a leading private bank").
  The forbidden token is "leading provider", which appears nowhere.

## Scope decisions

- **Privacy & cookie pages** were added as real (stub) pages because the footer
  requires links to them; both have PT mirrors. This makes **44 built pages**:
  the 19 IA routes × 2 locales = 38, plus privacy + cookies × 2 = 4, plus the two
  404 pages.
- Not built (explicitly out of scope): blog/insights, careers, individual team
  profiles.

## i18n / SEO

- `src/i18n/routes.ts` is the single source of truth for the EN↔PT route map;
  both the language switcher and hreflang/canonical generation read from it.
- No IP-based redirect. Language is chosen only via the switcher and persisted in
  a single `localStorage` key (`nyawira-lang`); it is never used to redirect.
- hreflang pairs are reciprocal with `x-default → EN`; Organization JSON-LD on
  every page, Service schema on the five service pages, BreadcrumbList on nested
  pages; sitemap via `@astrojs/sitemap` (both locales), `robots.txt` allows all.

## JavaScript

Well under the 30KB-gzipped budget. Astro inlines the small island scripts
(nav toggle, language-preference persistence, scroll-reveal, credentials filter,
contact form) directly into the HTML — the heaviest page carries ~1.6KB gzipped
of inline JS and there are no external framework bundles.
