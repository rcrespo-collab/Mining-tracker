#!/usr/bin/env node
/**
 * No-network guard.
 *
 * Phase 1 of Repair makes zero network calls — that is a structural privacy
 * guarantee, not a promise (see docs/SPEC.md §1.2, §11 and the build brief).
 * This script fails the build if any network primitive appears in application
 * source. It is wired into CI and also asserted from a Vitest test
 * (src/lib/__tests__/no-network.test.ts) so the guarantee cannot regress.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Directories that hold hand-written application code.
const SCAN_DIRS = ['src', 'app'];
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

// Files that legitimately reference the forbidden identifiers in order to
// forbid them (this checker, and the test that drives it).
const ALLOWLIST = new Set([
  'scripts/check-no-network.mjs',
  'src/lib/__tests__/no-network.test.ts',
]);

// Whole-word matches only, so identifiers like `loadDraft` never trip `fetch`.
const FORBIDDEN = [
  /\bfetch\b/,
  /\baxios\b/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bEventSource\b/,
  /\bnavigator\.sendBeacon\b/,
];

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.expo' || name === 'dist') continue;
      out.push(...walk(full));
    } else if (SCAN_EXTS.has(extname(name))) {
      out.push(full);
    }
  }
  return out;
}

/** @returns {{file: string, line: number, text: string, pattern: string}[]} */
export function findNetworkPrimitives() {
  /** @type {{file: string, line: number, text: string, pattern: string}[]} */
  const hits = [];
  for (const d of SCAN_DIRS) {
    for (const file of walk(join(ROOT, d))) {
      const rel = file.slice(ROOT.length + 1);
      if (ALLOWLIST.has(rel)) continue;
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((text, i) => {
        for (const pattern of FORBIDDEN) {
          if (pattern.test(text)) {
            hits.push({ file: rel, line: i + 1, text: text.trim(), pattern: String(pattern) });
          }
        }
      });
    }
  }
  return hits;
}

// Run as a CLI when invoked directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const hits = findNetworkPrimitives();
  if (hits.length > 0) {
    console.error('\n✗ No-network guard failed. Network primitives are forbidden in Phase 1:\n');
    for (const h of hits) {
      console.error(`  ${h.file}:${h.line}  ${h.pattern}\n    ${h.text}`);
    }
    console.error(`\n${hits.length} violation(s). Remove all network calls — Repair Phase 1 is offline-only.\n`);
    process.exit(1);
  }
  console.log('✓ No-network guard passed: no network primitives in app source.');
}
