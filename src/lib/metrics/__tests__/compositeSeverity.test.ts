import { describe, it, expect } from 'vitest';
import { computeCompositeSeverity } from '../compositeSeverity';
import type { SeverityInput } from '../types';

const base: SeverityInput = {
  peakIntensity: 1,
  flooded: false,
  personalisation: 'issue_focused',
  escalationSlope: 'slow',
  recoveryMinutes: 0,
};

describe('computeCompositeSeverity (§7.1)', () => {
  it('is 0 at the gentlest possible conflict', () => {
    expect(computeCompositeSeverity(base)).toBe(0);
  });

  it('is 1 at the most severe conflict', () => {
    expect(
      computeCompositeSeverity({
        peakIntensity: 5,
        flooded: true,
        personalisation: 'personal',
        escalationSlope: 'rapid',
        recoveryMinutes: 1000, // beyond the cap
      }),
    ).toBeCloseTo(1, 5);
  });

  it('weights peak intensity at 0.30', () => {
    expect(computeCompositeSeverity({ ...base, peakIntensity: 5 })).toBeCloseTo(0.3, 5);
  });

  it('weights flooding at 0.25', () => {
    expect(computeCompositeSeverity({ ...base, flooded: true })).toBeCloseTo(0.25, 5);
  });

  it('weights personalisation: drifted 0.5 → 0.10, personal 1.0 → 0.20', () => {
    expect(computeCompositeSeverity({ ...base, personalisation: 'drifted' })).toBeCloseTo(0.1, 5);
    expect(computeCompositeSeverity({ ...base, personalisation: 'personal' })).toBeCloseTo(0.2, 5);
  });

  it('caps recovery-time contribution at 4 hours', () => {
    const atCap = computeCompositeSeverity({ ...base, recoveryMinutes: 240 });
    const beyond = computeCompositeSeverity({ ...base, recoveryMinutes: 10000 });
    expect(atCap).toBeCloseTo(0.1, 5);
    expect(beyond).toBeCloseTo(0.1, 5);
  });

  it('treats null recovery as zero', () => {
    expect(computeCompositeSeverity({ ...base, recoveryMinutes: null })).toBe(0);
  });

  it('always returns a value in [0, 1]', () => {
    const v = computeCompositeSeverity({
      peakIntensity: 3,
      flooded: true,
      personalisation: 'drifted',
      escalationSlope: 'gradual',
      recoveryMinutes: 120,
    });
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });
});
