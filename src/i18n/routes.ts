/**
 * Single source of truth for the EN↔PT route map.
 *
 * Consumed by both the language switcher and the hreflang / canonical
 * generation in BaseLayout. Route strings are declared exactly once here.
 */

export type Locale = 'en' | 'pt';

export interface RoutePair {
  /** stable identifier for the page */
  key: string;
  en: string;
  pt: string;
}

export const routes: RoutePair[] = [
  { key: 'home', en: '/', pt: '/pt/' },
  { key: 'about', en: '/about', pt: '/pt/quem-somos' },
  { key: 'what-we-do', en: '/what-we-do', pt: '/pt/o-que-fazemos' },
  {
    key: 'strategic-advisory',
    en: '/what-we-do/strategic-advisory',
    pt: '/pt/o-que-fazemos/consultoria-estrategica',
  },
  {
    key: 'investment-advisory',
    en: '/what-we-do/investment-advisory',
    pt: '/pt/o-que-fazemos/consultoria-de-investimento',
  },
  {
    key: 'project-management',
    en: '/what-we-do/project-management',
    pt: '/pt/o-que-fazemos/gestao-de-projetos',
  },
  {
    key: 'angola-market-entry',
    en: '/angola-market-entry',
    pt: '/pt/entrada-no-mercado-angolano',
  },
  { key: 'ai-readiness', en: '/ai-readiness', pt: '/pt/ai-readiness' },
  { key: 'sectors', en: '/sectors', pt: '/pt/sectores' },
  { key: 'extractives', en: '/sectors/extractives', pt: '/pt/sectores/setor-extrativo' },
  {
    key: 'ict',
    en: '/sectors/ict',
    pt: '/pt/sectores/tecnologia-informacao-telecom',
  },
  {
    key: 'financial-services',
    en: '/sectors/financial-services',
    pt: '/pt/sectores/servicos-financeiros',
  },
  { key: 'public-sector', en: '/sectors/public-sector', pt: '/pt/sectores/setor-publico' },
  {
    key: 'agribusiness-industry',
    en: '/sectors/agribusiness-industry',
    pt: '/pt/sectores/agronegocio-industria',
  },
  { key: 'approach', en: '/approach', pt: '/pt/abordagem' },
  { key: 'sell-side', en: '/approach/sell-side', pt: '/pt/abordagem/sell-side' },
  { key: 'buy-side', en: '/approach/buy-side', pt: '/pt/abordagem/buy-side' },
  { key: 'credentials', en: '/credentials', pt: '/pt/credenciais' },
  { key: 'contact', en: '/contact', pt: '/pt/contacto' },
  { key: 'privacy', en: '/privacy', pt: '/pt/privacidade' },
  { key: 'cookies', en: '/cookies', pt: '/pt/cookies' },
];

const LOCALES: Locale[] = ['en', 'pt'];

// Deployment base path (Vite injects the `base` config, always trailing-slashed:
// '/' at the root, or e.g. '/Mining-tracker/' on GitHub project pages).
const RAW_BASE = import.meta.env.BASE_URL || '/';
const BASE = RAW_BASE.replace(/\/$/, ''); // '' at root, '/Mining-tracker' otherwise

/** Prefix a logical route/asset path (leading-slashed) with the deployment base. */
export function withBase(p: string): string {
  if (p === '/') return BASE + '/'; // '/' at root, '/Mining-tracker/' otherwise
  return BASE + p;
}

/** Remove the deployment base from an incoming pathname, if present. */
function stripBase(p: string): string {
  if (BASE && p.startsWith(BASE)) {
    const rest = p.slice(BASE.length);
    return rest === '' ? '/' : rest;
  }
  return p;
}

/** Normalise a pathname: strip the base, then the trailing slash except roots. */
export function normalizePath(path: string): string {
  const stripped = stripBase(path);
  if (stripped === '/' || stripped === '/pt/' || stripped === '/pt') {
    return stripped === '/pt' ? '/pt/' : stripped;
  }
  return stripped.replace(/\/+$/, '');
}

/** Detect the locale of a pathname. */
export function localeFromPath(path: string): Locale {
  const p = normalizePath(path);
  return p === '/pt/' || p.startsWith('/pt/') || p === '/pt' ? 'pt' : 'en';
}

/** Find the route pair that owns a given pathname (any locale). */
export function findRoute(path: string): RoutePair | undefined {
  const p = normalizePath(path);
  return routes.find(
    (r) => normalizePath(r.en) === p || normalizePath(r.pt) === p,
  );
}

/** Resolve the (base-prefixed) URL for a page key in a given locale. */
export function routeFor(key: string, locale: Locale): string {
  const r = routes.find((route) => route.key === key);
  return withBase(r ? r[locale] : locale === 'pt' ? '/pt/' : '/');
}

/** Given a pathname, return the equivalent (base-prefixed) path in the target locale. */
export function alternatePath(path: string, target: Locale): string {
  const r = findRoute(path);
  if (r) return withBase(r[target]);
  // Fallback: home of the target locale.
  return withBase(target === 'pt' ? '/pt/' : '/');
}

/** All locale alternates for a path, for hreflang generation. */
export function alternates(path: string): { locale: Locale; path: string }[] {
  return LOCALES.map((locale) => ({ locale, path: alternatePath(path, locale) }));
}
