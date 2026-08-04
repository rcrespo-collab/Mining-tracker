/**
 * Cooldown gate (docs/SPEC.md S-10, rule R-01) — the product's most important
 * friction.
 *
 * If the user reports flooding at quick log, the deep log is LOCKED behind the
 * 20-minute self-soothe timer. There is exactly one explicit override
 * ("I'm calm enough"); using it records `logged_while_flooded = true` so the
 * entry is internally marked lower-reliability (rule R-14). This is a hard gate:
 * you cannot reach the deep log from a flooded quick log by any other path.
 *
 * Pure logic, unit-tested — the screen (app/(tabs)/log/cooldown) renders this.
 */
export const COOLDOWN_MINUTES = 20;
export const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

export interface CooldownState {
  /** Did the user check "Flooded / overwhelmed" at quick log (S-09)? */
  floodedAtQuickLog: boolean;
  /** Has the 20-minute timer elapsed? */
  timerCompleted: boolean;
  /** Did the user tap the single explicit "I'm calm enough" override? */
  overridden: boolean;
}

export interface DeepLogAccess {
  unlocked: boolean;
  /** True only when the deep log is entered via the override while still flooded. */
  loggedWhileFlooded: boolean;
}

/**
 * Decide whether the deep log is reachable, and whether entering it counts as
 * "logged while flooded".
 */
export function deepLogAccess(state: CooldownState): DeepLogAccess {
  // Not flooded → no gate at all.
  if (!state.floodedAtQuickLog) {
    return { unlocked: true, loggedWhileFlooded: false };
  }
  // Flooded → only the timer or the explicit override opens it.
  const unlocked = state.timerCompleted || state.overridden;
  const loggedWhileFlooded = unlocked && state.overridden && !state.timerCompleted;
  return { unlocked, loggedWhileFlooded };
}

/** Remaining cooldown in ms given the timer start; never negative. */
export function cooldownRemainingMs(startedAt: Date, now: Date): number {
  return Math.max(0, COOLDOWN_MS - (now.getTime() - startedAt.getTime()));
}

/** Whether the timer has elapsed since it started. */
export function isCooldownComplete(startedAt: Date, now: Date): boolean {
  return cooldownRemainingMs(startedAt, now) <= 0;
}
