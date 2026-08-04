/**
 * Runs the intervention evaluator (§8), logs surfacings, and returns the single
 * surfacing to present as a calm home card. R-01 (cooldown) is handled inline at
 * quick log, not as a home card, so it is filtered out here.
 *
 * The per-session counter lives in the session store; the weekly count comes
 * from intervention_log. Once a rate-limited intervention has surfaced this
 * session, the caps prevent further nagging.
 */
import { evaluateInterventions } from '../lib/interventions';
import { buildEvaluationContext, logSurfacings, type EvaluationSignals } from '../db/repositories/interventions';
import { useSessionStore } from '../stores/sessionStore';

export interface ActiveSurfacing {
  ruleId: string;
  screen: string;
  route: string | null; // navigation target, or null for an inline-only reframe
  title: string;
  body: string;
  cta: string;
}

// Plain, second-person copy for each Phase-1 rule. No jargon, no exclamation.
const COPY: Record<string, { title: string; body: string; cta: string }> = {
  'R-02': {
    title: 'Say it so it can be heard',
    body: 'Conversations tend to end the way they start. Want to soften how you open this one?',
    cta: 'Try the rewriter',
  },
  'R-03': {
    title: 'An argument is still open',
    body: "Time apart doesn't repair. Where are things now?",
    cta: 'Check in',
  },
  'R-04': {
    title: 'This one has been open a while',
    body: "Ruptures that aren't addressed don't fade — they accumulate. It may be worth reaching out.",
    cta: 'Reach out',
  },
  'R-05': {
    title: 'A gentle noticing',
    body: 'Contempt has come up a couple of times. A little fondness-and-admiration work can help.',
    cta: 'See the tools',
  },
  'R-06': {
    title: 'Worth talking to someone',
    body: 'Some patterns are easier with help. Here are people who work with couples.',
    cta: 'See options',
  },
  'R-07': {
    title: 'Grow the good',
    body: 'Your positives have been thin lately. A daily appreciation is an easy place to start.',
    cta: 'See rituals',
  },
  'R-08': {
    title: 'Worth talking to someone',
    body: 'Things have been hard for a while. Talking to someone can help.',
    cta: 'See options',
  },
  'R-13': {
    title: 'Something sets it off',
    body: 'One thing shows up in most of your conflicts. Worth a look, and maybe an agreement.',
    cta: 'See what sets it off',
  },
  'R-14': {
    title: 'Revisit when you are calm',
    body: 'You logged that one while overwhelmed. It can help to look again now, with fresh eyes.',
    cta: 'Open the timeline',
  },
  'R-17': {
    title: 'No pressure',
    body: "It's been a while. Whenever you want to note something — hard or good — it's here.",
    cta: 'Okay',
  },
  'R-18': {
    title: 'Not a failure to solve',
    body: 'About seven in ten of the things couples argue about never get solved. The goal is to talk about them without damage — not to win them.',
    cta: 'Got it',
  },
};

// Spec screen id → in-app route. Screens out of Phase-1 scope route to the
// nearest in-scope surface (decisions D5 for R-18 inline; R-04 → follow-up).
const SCREEN_ROUTE: Record<string, string | null> = {
  'S-20': '/(tabs)/log/repair-followup',
  'S-28': '/(tabs)/log', // aftermath (S-28) is Phase 2 — land on the timeline
  Tools: '/(tabs)/tools',
  'S-35': '/(tabs)/you/support',
  'S-31': '/(tabs)/tools/rituals',
  'S-24': '/(tabs)/patterns/triggers',
  'S-29': '/(tabs)/tools/softened-startup',
  'S-22': '/(tabs)/log',
  'S-25': null, // R-18 inline reframe only (S-25 is Phase 2)
  '': null,
};

export async function runInterventionEvaluation(
  userId: string,
  now: Date,
  signals: EvaluationSignals = {},
): Promise<ActiveSurfacing | null> {
  const session = useSessionStore.getState();
  const ctx = await buildEvaluationContext(userId, now, session.interventionsThisSession, signals);
  const surfacings = evaluateInterventions(ctx).filter((s) => s.ruleId !== 'R-01');
  if (surfacings.length === 0) return null;

  await logSurfacings(userId, surfacings);
  surfacings.forEach(() => useSessionStore.getState().noteInterventionSurfaced());

  const top = surfacings[0]!;
  const copy = COPY[top.ruleId] ?? {
    title: 'A gentle note',
    body: 'Something to consider.',
    cta: 'Okay',
  };
  return {
    ruleId: top.ruleId,
    screen: top.screen,
    route: SCREEN_ROUTE[top.screen] ?? null,
    ...copy,
  };
}
