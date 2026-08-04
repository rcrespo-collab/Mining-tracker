import { describe, it, expect } from 'vitest';
import { computeTriggerAssociations } from '../triggerAssociations';
import type { ConflictForTriggers } from '../types';
import type { Vulnerability } from '../../../db/enums';

function conflicts(count: number, flags: Vulnerability[]): ConflictForTriggers[] {
  return Array.from({ length: count }, () => ({ vulnerabilities: [...flags] }));
}

describe('computeTriggerAssociations (§7.5)', () => {
  it('returns [] below n=8 conflicts, however strong the signal', () => {
    // 7 of 7 conflicts involve alcohol — a perfect association, but too few.
    const data = conflicts(7, ['alcohol']);
    expect(computeTriggerAssociations(data, { alcohol: 0.05 })).toEqual([]);
  });

  it('returns [] when a flag occurs in fewer than 3 conflicts', () => {
    const data: ConflictForTriggers[] = [
      ...conflicts(2, ['alcohol']),
      ...conflicts(6, ['none']),
    ];
    expect(computeTriggerAssociations(data, { alcohol: 0.01 })).toEqual([]);
  });

  it('returns [] when lift is below 1.5', () => {
    // flag in 4 of 8 conflicts → conflictRate 0.5; baseline 0.4 → lift 1.25
    const data: ConflictForTriggers[] = [
      ...conflicts(4, ['work_stress']),
      ...conflicts(4, ['none']),
    ];
    expect(computeTriggerAssociations(data, { work_stress: 0.4 })).toEqual([]);
  });

  it('surfaces a flag meeting all three thresholds', () => {
    // alcohol in 6 of 12 → rate 0.5; baseline 0.08 → lift 6.25
    const data: ConflictForTriggers[] = [
      ...conflicts(6, ['alcohol']),
      ...conflicts(6, ['none']),
    ];
    const out = computeTriggerAssociations(data, { alcohol: 0.08 });
    expect(out).toHaveLength(1);
    expect(out[0]!.flag).toBe('alcohol');
    expect(out[0]!.conflictCount).toBe(6);
    expect(out[0]!.conflictRate).toBeCloseTo(0.5, 5);
    expect(out[0]!.lift).toBeCloseTo(6.25, 5);
  });

  it('skips a flag with no baseline estimate', () => {
    const data = conflicts(10, ['low_sleep']);
    expect(computeTriggerAssociations(data, {})).toEqual([]);
  });

  it('ignores the "none" sentinel and counts a flag once per conflict', () => {
    const data: ConflictForTriggers[] = [
      ...Array.from({ length: 9 }, () => ({ vulnerabilities: ['alcohol', 'alcohol', 'none'] as Vulnerability[] })),
    ];
    const out = computeTriggerAssociations(data, { alcohol: 0.1 });
    expect(out).toHaveLength(1);
    expect(out[0]!.conflictCount).toBe(9); // not 18
  });

  it('orders multiple associations by prevalence', () => {
    const data: ConflictForTriggers[] = [
      ...conflicts(9, ['alcohol', 'low_sleep']),
      ...conflicts(4, ['low_sleep']),
    ];
    const out = computeTriggerAssociations(data, { alcohol: 0.05, low_sleep: 0.1 });
    expect(out.map((a) => a.flag)).toEqual(['low_sleep', 'alcohol']);
  });
});
