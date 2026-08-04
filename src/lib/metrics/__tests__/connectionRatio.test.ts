import { describe, it, expect } from 'vitest';
import { computeConnectionRatio } from '../connectionRatio';
import type { ConflictForMetrics, PositiveForMetrics } from '../types';

const NOW = new Date('2026-01-30T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

function positive(overrides: Partial<PositiveForMetrics> = {}): PositiveForMetrics {
  return { occurredAt: daysAgo(1), intensity: 2, expressedToPartner: true, ...overrides };
}
function conflict(overrides: Partial<ConflictForMetrics> = {}): ConflictForMetrics {
  return {
    occurredAt: daysAgo(1),
    compositeSeverity: 0.5,
    contemptPresent: false,
    reconnected: false,
    timeToRepairHours: null,
    ...overrides,
  };
}

describe('computeConnectionRatio (§7.2)', () => {
  it('returns null below 10 total events', () => {
    const positives = Array.from({ length: 8 }, () => positive());
    const conflicts = [conflict()]; // 9 total
    expect(computeConnectionRatio(positives, conflicts, NOW)).toBeNull();
  });

  it('computes once there are at least 10 events', () => {
    const positives = Array.from({ length: 9 }, () => positive({ intensity: 2 }));
    const conflicts = [conflict({ compositeSeverity: 0 })]; // neg weight = 1
    const result = computeConnectionRatio(positives, conflicts, NOW);
    expect(result).not.toBeNull();
    // 9 × (2 × 1.0) = 18 positive; 1 negative → 18:1
    expect(result!.ratio).toBeCloseTo(18, 5);
  });

  it('discounts unexpressed positives to 0.6', () => {
    const positives = [
      ...Array.from({ length: 9 }, () => positive({ intensity: 1, expressedToPartner: false })),
    ];
    const conflicts = [conflict({ compositeSeverity: 0 })];
    const result = computeConnectionRatio(positives, conflicts, NOW)!;
    // 9 × (1 × 0.6) = 5.4 ; neg = 1
    expect(result.ratio).toBeCloseTo(5.4, 5);
  });

  it('weights contempt up and discounts reconnected negatives', () => {
    const positives = Array.from({ length: 9 }, () => positive({ intensity: 1 }));
    const contemptOpen = [conflict({ compositeSeverity: 1, contemptPresent: true, reconnected: false })];
    const reconciled = [conflict({ compositeSeverity: 1, contemptPresent: false, reconnected: true })];
    // neg(contempt,open) = 1 + 1×1.5×1.0 = 2.5
    expect(computeConnectionRatio(positives, contemptOpen, NOW)!.negativeWeightTotal).toBeCloseTo(2.5, 5);
    // neg(no contempt,reconnected) = 1 + 1×1.0×0.7 = 1.7
    expect(computeConnectionRatio(positives, reconciled, NOW)!.negativeWeightTotal).toBeCloseTo(1.7, 5);
  });

  it('excludes events outside the rolling 14-day window', () => {
    const recent = Array.from({ length: 9 }, () => positive({ occurredAt: daysAgo(2) }));
    const old = Array.from({ length: 5 }, () => positive({ occurredAt: daysAgo(30) }));
    const conflicts = [conflict({ occurredAt: daysAgo(2), compositeSeverity: 0 })];
    const result = computeConnectionRatio([...recent, ...old], conflicts, NOW)!;
    expect(result.positiveCount).toBe(9); // the 5 old ones dropped
  });

  it('returns null when there are enough events but no negatives', () => {
    const positives = Array.from({ length: 12 }, () => positive());
    expect(computeConnectionRatio(positives, [], NOW)).toBeNull();
  });
});
