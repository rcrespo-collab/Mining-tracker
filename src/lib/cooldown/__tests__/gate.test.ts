import { describe, it, expect } from 'vitest';
import {
  deepLogAccess,
  cooldownRemainingMs,
  isCooldownComplete,
  COOLDOWN_MS,
} from '../gate';

describe('cooldown gate (S-10 / R-01) — guardrail test #4', () => {
  it('deep log is unreachable from a flooded quick log with no timer and no override', () => {
    const access = deepLogAccess({
      floodedAtQuickLog: true,
      timerCompleted: false,
      overridden: false,
    });
    expect(access.unlocked).toBe(false);
    expect(access.loggedWhileFlooded).toBe(false);
  });

  it('unlocks when the 20-minute timer completes (not flooded flag)', () => {
    const access = deepLogAccess({
      floodedAtQuickLog: true,
      timerCompleted: true,
      overridden: false,
    });
    expect(access.unlocked).toBe(true);
    expect(access.loggedWhileFlooded).toBe(false);
  });

  it('unlocks via the explicit override, marking logged_while_flooded', () => {
    const access = deepLogAccess({
      floodedAtQuickLog: true,
      timerCompleted: false,
      overridden: true,
    });
    expect(access.unlocked).toBe(true);
    expect(access.loggedWhileFlooded).toBe(true);
  });

  it('does not mark logged_while_flooded when the timer completed even if overridden', () => {
    const access = deepLogAccess({
      floodedAtQuickLog: true,
      timerCompleted: true,
      overridden: true,
    });
    expect(access.loggedWhileFlooded).toBe(false);
  });

  it('imposes no gate when the user did not flood', () => {
    const access = deepLogAccess({
      floodedAtQuickLog: false,
      timerCompleted: false,
      overridden: false,
    });
    expect(access.unlocked).toBe(true);
    expect(access.loggedWhileFlooded).toBe(false);
  });

  it('counts down 20 minutes and completes at zero', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    expect(cooldownRemainingMs(start, start)).toBe(COOLDOWN_MS);
    expect(isCooldownComplete(start, start)).toBe(false);
    const later = new Date(start.getTime() + COOLDOWN_MS);
    expect(cooldownRemainingMs(start, later)).toBe(0);
    expect(isCooldownComplete(start, later)).toBe(true);
  });
});
