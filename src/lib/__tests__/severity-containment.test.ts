import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Required guardrail test #3 — severity containment.
 *
 * `composite_severity` (§7.1) is computed and stored but must NEVER be rendered
 * as a number and never used to sort or filter a user-facing list. A
 * "7.4/10 fight" is the artefact that turns a log into a ledger.
 *
 * Structural enforcement: the identifiers `compositeSeverity` /
 * `composite_severity` must not appear anywhere in the UI layer — the route
 * tree (`app/`), shared components, or the design system. Severity lives only in
 * the metrics and data-access layers, where it feeds trends and the ratio
 * weighting without ever being shown.
 */
const ROOT = fileURLToPath(new URL('../../..', import.meta.url));

// UI layers that must never reference severity.
const UI_DIRS = ['app', 'src/components', 'src/design'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const FORBIDDEN = [/compositeSeverity/, /composite_severity/];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (EXTS.has(extname(name))) {
      out.push(full);
    }
  }
  return out;
}

describe('severity containment (§7.1 / non-negotiable #3)', () => {
  it('composite severity is never referenced in the UI layer', () => {
    const offenders: string[] = [];
    for (const dir of UI_DIRS) {
      for (const file of walk(join(ROOT, dir))) {
        const lines = readFileSync(file, 'utf8').split('\n');
        lines.forEach((text, i) => {
          if (FORBIDDEN.some((re) => re.test(text))) {
            offenders.push(`${file.slice(ROOT.length + 1)}:${i + 1}`);
          }
        });
      }
    }
    expect(
      offenders,
      `composite severity reached the UI layer at: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});
