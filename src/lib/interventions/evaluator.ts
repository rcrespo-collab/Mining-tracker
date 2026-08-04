/**
 * Intervention evaluator (docs/SPEC.md §8).
 *
 * Runs the rule set against a context snapshot and returns the surfacings to
 * enact, honouring the rate limits:
 *   - at most ONE intervention per session and TWO per week,
 *   - EXCEPT always-fire rules (R-01 cooldown, R-16 safety) which are never
 *     rate-limited.
 *
 * When several rate-limited rules match, the single highest-priority one is
 * chosen. Every enacted surfacing should be written to `intervention_log` by the
 * caller (which is also where the session/week counts come from).
 */
import { RULES } from './rules';
import type { EvaluationContext, InterventionRule, Surfacing } from './types';

const MAX_PER_SESSION = 1;
const MAX_PER_WEEK = 2;

function toSurfacing(rule: InterventionRule): Surfacing {
  return { ruleId: rule.id, intervention: rule.intervention, screen: rule.screen };
}

export function evaluateInterventions(
  ctx: EvaluationContext,
  rules: InterventionRule[] = RULES,
): Surfacing[] {
  const matched = rules.filter((r) => r.evaluate(ctx));

  const alwaysFire = matched.filter((r) => r.alwaysFires).map(toSurfacing);

  // Rate-limited candidates, most urgent first.
  const rateLimited = matched
    .filter((r) => !r.alwaysFires)
    .sort((a, b) => b.priority - a.priority);

  const underSessionCap = ctx.interventionsThisSession < MAX_PER_SESSION;
  const underWeekCap = ctx.interventionsThisWeek < MAX_PER_WEEK;

  const rateLimitedPick =
    underSessionCap && underWeekCap && rateLimited[0] ? [toSurfacing(rateLimited[0])] : [];

  return [...alwaysFire, ...rateLimitedPick];
}
