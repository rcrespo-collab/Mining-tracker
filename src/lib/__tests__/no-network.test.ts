import { describe, it, expect } from 'vitest';
// @ts-expect-error — plain .mjs guard script, no type declarations.
import { findNetworkPrimitives } from '../../../scripts/check-no-network.mjs';

/**
 * Required guardrail test #2 (no-network).
 *
 * Repair Phase 1 makes zero network calls — a structural privacy guarantee.
 * This asserts the static scanner finds no `fetch` / `axios` / `XMLHttpRequest`
 * (and related) primitives anywhere in application source. If this fails,
 * someone has introduced a network dependency that breaks the Phase 1 promise.
 */
describe('no-network guarantee', () => {
  it('finds no network primitives in app source', () => {
    const hits = findNetworkPrimitives();
    const detail = hits.map((h: { file: string; line: number }) => `${h.file}:${h.line}`).join(', ');
    expect(hits, `network primitives found: ${detail}`).toHaveLength(0);
  });
});
