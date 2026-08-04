import { describe, it, expect } from 'vitest';
import { computeTimeToRepair } from '../timeToRepair';
import type { ConflictForMetrics } from '../types';

const NOW = new Date('2026-01-30T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

function conflict(overrides: Partial<ConflictForMetrics> = {}): ConflictForMetrics {
  return {
    occurredAt: daysAgo(1),
    compositeSeverity: 0.5,
    contemptPresent: false,
    reconnected: true,
    timeToRepairHours: 4,
    ...overrides,
  };
}

describe('computeTimeToRepair (§7.3)', () => {
  it('returns null median with no repaired events', () => {
    const r = computeTimeToRepair([conflict({ reconnected: false, timeToRepairHours: null })], NOW);
    expect(r.medianHours).toBeNull();
    expect(r.repairedCount).toBe(0);
    expect(r.unrepairedCount).toBe(1);
  });

  it('computes the median over repaired events (odd count)', () => {
    const r = computeTimeToRepair(
      [
        conflict({ timeToRepairHours: 2 }),
        conflict({ timeToRepairHours: 6 }),
        conflict({ timeToRepairHours: 4 }),
      ],
      NOW,
    );
    expect(r.medianHours).toBe(4);
    expect(r.repairedCount).toBe(3);
  });

  it('computes the median over repaired events (even count)', () => {
    const r = computeTimeToRepair(
      [conflict({ timeToRepairHours: 2 }), conflict({ timeToRepairHours: 8 })],
      NOW,
    );
    expect(r.medianHours).toBe(5);
  });

  it('censors unrepaired events and counts them separately', () => {
    const r = computeTimeToRepair(
      [
        conflict({ timeToRepairHours: 3 }),
        conflict({ reconnected: false, timeToRepairHours: null }),
        conflict({ reconnected: false, timeToRepairHours: null }),
      ],
      NOW,
    );
    expect(r.medianHours).toBe(3);
    expect(r.repairedCount).toBe(1);
    expect(r.unrepairedCount).toBe(2);
  });

  it('excludes conflicts older than the trailing 90-day window', () => {
    const r = computeTimeToRepair(
      [conflict({ occurredAt: daysAgo(200), timeToRepairHours: 99 }), conflict({ timeToRepairHours: 5 })],
      NOW,
    );
    expect(r.medianHours).toBe(5);
    expect(r.repairedCount).toBe(1);
  });
});
