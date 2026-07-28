/**
 * No Astro content collections are used. Page content lives in typed TS modules
 * under src/content/{en,pt} and shared.ts, imported directly by pages.
 * Declaring an empty collections map stops Astro from auto-generating (and
 * warning about) Markdown collections for those folders.
 */
export const collections = {};
