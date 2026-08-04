import { describe, it, expect } from 'vitest';
import { computeRepairEfficacy } from '../repairEfficacy';
import type { RepairForEfficacy } from '../types';

function repair(overrides: Partial<RepairForEfficacy> = {}): RepairForEfficacy {
  return {
    ownRepairAttempt: false,
    ownRepairReceived: null,
    partnerRepairAttempt: null,
    partnerRepairAccepted: null,
    ...overrides,
  };
}

describe('computeRepairEfficacy (§7.7)', () => {
  it('returns null rates when there are no attempts', () => {
    const r = computeRepairEfficacy([repair(), repair()]);
    expect(r.ownRepairLandingRate).toBeNull();
    expect(r.partnerRepairAcceptRate).toBeNull();
  });

  it('computes own landing rate from attempts that were received', () => {
    const r = computeRepairEfficacy([
      repair({ ownRepairAttempt: true, ownRepairReceived: true }),
      repair({ ownRepairAttempt: true, ownRepairReceived: false }),
      repair({ ownRepairAttempt: true, ownRepairReceived: true }),
    ]);
    expect(r.ownRepairAttempts).toBe(3);
    expect(r.ownRepairReceived).toBe(2);
    expect(r.ownRepairLandingRate).toBeCloseTo(2 / 3, 5);
  });

  it('computes partner accept rate independently', () => {
    const r = computeRepairEfficacy([
      repair({ partnerRepairAttempt: true, partnerRepairAccepted: true }),
      repair({ partnerRepairAttempt: true, partnerRepairAccepted: false }),
    ]);
    expect(r.partnerRepairAttempts).toBe(2);
    expect(r.partnerRepairAccepted).toBe(1);
    expect(r.partnerRepairAcceptRate).toBeCloseTo(0.5, 5);
  });

  it('does not count a received flag when no attempt was made', () => {
    const r = computeRepairEfficacy([repair({ ownRepairAttempt: false, ownRepairReceived: true })]);
    expect(r.ownRepairAttempts).toBe(0);
    expect(r.ownRepairLandingRate).toBeNull();
  });
});
