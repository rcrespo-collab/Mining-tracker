/**
 * Trigger association (docs/SPEC.md §7.5).
 *
 *   lift = P(flag | conflict) / P(flag | baseline day)
 *
 * Displayed ONLY when there are at least 8 conflicts, the lift is at least 1.5,
 * and the flag appears in at least 3 conflicts — ALL THREE. This threshold is a
 * correctness requirement, not a nicety: surfacing a spurious "you always fight
 * when you drink" from four data points is a real harm. Below n=8 conflicts the
 * function returns an empty array, full stop.
 *
 * Baseline probabilities are, in v1, the user's own estimate of how often each
 * flag is true on an ordinary day (ambient day-level logging is Phase 2, §7.5).
 */
import type { Vulnerability } from '../../db/enums';
import type { ConflictForTriggers } from './types';

const MIN_CONFLICTS = 8;
const MIN_FLAG_OCCURRENCES = 3;
const MIN_LIFT = 1.5;

export interface TriggerAssociation {
  flag: Vulnerability;
  conflictCount: number; // conflicts in which the flag was present
  conflictRate: number; // P(flag | conflict)
  baselineRate: number; // P(flag | ordinary day)
  lift: number;
}

/**
 * @param baselineProbability P(flag | ordinary day), per flag, in [0, 1].
 *        A flag with no baseline estimate (or a zero baseline) cannot yield a
 *        finite, honest lift and is skipped.
 */
export function computeTriggerAssociations(
  conflicts: ConflictForTriggers[],
  baselineProbability: Partial<Record<Vulnerability, number>>,
): TriggerAssociation[] {
  // Hard gate: too few conflicts to say anything responsibly.
  if (conflicts.length < MIN_CONFLICTS) return [];

  const counts = new Map<Vulnerability, number>();
  for (const c of conflicts) {
    for (const flag of new Set(c.vulnerabilities)) {
      if (flag === 'none') continue;
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }

  const out: TriggerAssociation[] = [];
  for (const [flag, count] of counts) {
    if (count < MIN_FLAG_OCCURRENCES) continue;
    const baselineRate = baselineProbability[flag];
    if (baselineRate == null || baselineRate <= 0) continue;
    const conflictRate = count / conflicts.length;
    const lift = conflictRate / baselineRate;
    if (lift < MIN_LIFT) continue;
    out.push({ flag, conflictCount: count, conflictRate, baselineRate, lift });
  }

  // Ordered by prevalence for the "strongest signals" list (S-24). This is
  // trigger prevalence, not conflict severity — the no-severity-ranking rule is
  // about ranking conflicts, which this never does.
  return out.sort((a, b) => b.conflictCount - a.conflictCount || b.lift - a.lift);
}
