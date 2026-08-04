/**
 * Declarative intervention rules (docs/SPEC.md §8).
 *
 * Phase 1 implements R-01, R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-13, R-14,
 * R-17, R-18. (R-16 safety is enforced in onboarding and always takes
 * precedence; R-09–R-12, R-15 are Phase 2+.)
 *
 * Each rule is a plain object with an `evaluate(ctx)` predicate. The single
 * evaluator (evaluator.ts) runs them on app foreground and after each save,
 * enforcing the rate limits (one per session, two per week) except for the
 * always-fire rules.
 */
import type { InterventionRule } from './types';

const CONFLICT_MIN_FOR_TRIGGER = 8;

export const RULES: InterventionRule[] = [
  {
    id: 'R-01',
    intervention: 'self_soothe',
    screen: 'S-10',
    priority: 100,
    alwaysFires: true, // §8: always fires
    evaluate: (c) => c.floodedAtQuickLog === true,
    rationale: 'Flooded at quick log — force the 20-minute cooldown.',
  },
  {
    id: 'R-06',
    intervention: 'professional_referral',
    screen: 'S-35',
    priority: 90,
    alwaysFires: false,
    evaluate: (c) => c.contemptCount60d >= 4,
    rationale: 'Contempt four times in 60 days — offer a professional referral.',
  },
  {
    id: 'R-08',
    intervention: 'professional_referral',
    screen: 'S-35',
    priority: 85,
    alwaysFires: false,
    evaluate: (c) => c.ratioBelow3Days >= 21,
    rationale: 'Connection ratio below 3:1 for 21 days — referral + Magic Six Hours.',
  },
  {
    id: 'R-04',
    intervention: 'aftermath',
    screen: 'S-28',
    priority: 80,
    alwaysFires: false,
    evaluate: (c) => c.unrepairedAgesHours.some((h) => h >= 72),
    rationale: 'A rupture is unrepaired at 72h — strongly surface the aftermath.',
  },
  {
    id: 'R-03',
    intervention: 'repair_followup',
    screen: 'S-20',
    priority: 75,
    alwaysFires: false,
    evaluate: (c) => c.unrepairedAgesHours.some((h) => h >= 24 && h < 72),
    rationale: 'A rupture is unrepaired at 24h — repair follow-up.',
  },
  {
    id: 'R-05',
    intervention: 'contempt_alert',
    screen: 'Tools',
    priority: 70,
    alwaysFires: false,
    evaluate: (c) => c.contemptCount30d >= 2,
    rationale: 'Contempt twice in 30 days — fondness-and-admiration work.',
  },
  {
    id: 'R-18',
    intervention: 'perpetual_reframe',
    screen: 'S-25',
    priority: 65,
    alwaysFires: false,
    evaluate: (c) => c.resolutionPerpetualSelected === true,
    rationale: 'User marked a fight as never-resolving — reframe problem to dialogue.',
  },
  {
    id: 'R-02',
    intervention: 'softened_startup',
    screen: 'S-29',
    priority: 60,
    alwaysFires: false,
    evaluate: (c) => c.criticismLogged === true,
    rationale: 'Criticism / harsh start-up — offer the softened start-up rewriter.',
  },
  {
    id: 'R-13',
    intervention: 'trigger_insight',
    screen: 'S-24',
    priority: 55,
    alwaysFires: false,
    evaluate: (c) =>
      c.conflictCount >= CONFLICT_MIN_FOR_TRIGGER && c.dominantVulnerabilityShare >= 0.5,
    rationale: 'One trigger in the majority of conflicts — insight + agreement.',
  },
  {
    id: 'R-07',
    intervention: 'ratio_nudge',
    screen: 'S-31',
    priority: 50,
    alwaysFires: false,
    evaluate: (c) => c.ratioBelow5Days >= 14,
    rationale: 'Connection ratio below 5:1 for 14 days — positive-logging nudge.',
  },
  {
    id: 'R-14',
    intervention: 'self_soothe',
    screen: 'S-22',
    priority: 45,
    alwaysFires: false,
    evaluate: (c) => c.loggedWhileFlooded === true,
    rationale: 'Entry logged while flooded — gently prompt a revisit after 24h.',
  },
  {
    id: 'R-17',
    intervention: 'reengagement',
    screen: '',
    priority: 20,
    alwaysFires: false,
    evaluate: (c) => c.daysSinceLastLog >= 14,
    rationale: '14 days without logging — one gentle message, then silence.',
  },
];
