import { describe, it, expect } from 'vitest';
import { evaluateInterventions } from '../evaluator';
import { RULES } from '../rules';
import type { EvaluationContext } from '../types';

const quiet: EvaluationContext = {
  now: new Date('2026-01-30T12:00:00Z'),
  unrepairedAgesHours: [],
  contemptCount30d: 0,
  contemptCount60d: 0,
  ratioBelow5Days: 0,
  ratioBelow3Days: 0,
  dominantVulnerabilityShare: 0,
  conflictCount: 0,
  daysSinceLastLog: 0,
  interventionsThisSession: 0,
  interventionsThisWeek: 0,
};

describe('intervention evaluator (§8)', () => {
  it('surfaces nothing when no rule matches', () => {
    expect(evaluateInterventions(quiet)).toEqual([]);
  });

  it('every Phase-1 rule id is present', () => {
    const ids = RULES.map((r) => r.id).sort();
    expect(ids).toEqual(
      ['R-01', 'R-02', 'R-03', 'R-04', 'R-05', 'R-06', 'R-07', 'R-08', 'R-13', 'R-14', 'R-17', 'R-18'].sort(),
    );
  });

  it('R-01 (cooldown) always fires even at the rate limit', () => {
    const out = evaluateInterventions({
      ...quiet,
      floodedAtQuickLog: true,
      interventionsThisSession: 5,
      interventionsThisWeek: 9,
    });
    expect(out.map((s) => s.ruleId)).toContain('R-01');
    expect(out.find((s) => s.ruleId === 'R-01')!.screen).toBe('S-10');
  });

  it('surfaces at most one rate-limited intervention per evaluation', () => {
    const out = evaluateInterventions({
      ...quiet,
      contemptCount60d: 4, // R-06
      ratioBelow3Days: 30, // R-08
      criticismLogged: true, // R-02
    });
    const rateLimited = out.filter((s) => s.ruleId !== 'R-01');
    expect(rateLimited).toHaveLength(1);
  });

  it('chooses the highest-priority rate-limited rule (R-06 over R-02)', () => {
    const out = evaluateInterventions({
      ...quiet,
      contemptCount60d: 4,
      criticismLogged: true,
    });
    expect(out[0]!.ruleId).toBe('R-06');
    expect(out[0]!.intervention).toBe('professional_referral');
  });

  it('respects the one-per-session cap for rate-limited rules', () => {
    const out = evaluateInterventions({ ...quiet, criticismLogged: true, interventionsThisSession: 1 });
    expect(out).toEqual([]);
  });

  it('respects the two-per-week cap for rate-limited rules', () => {
    const out = evaluateInterventions({ ...quiet, criticismLogged: true, interventionsThisWeek: 2 });
    expect(out).toEqual([]);
  });

  it('still fires R-01 when the caps are hit', () => {
    const out = evaluateInterventions({
      ...quiet,
      floodedAtQuickLog: true,
      criticismLogged: true,
      interventionsThisWeek: 2,
    });
    expect(out.map((s) => s.ruleId)).toEqual(['R-01']);
  });

  it('R-03 fires between 24h and 72h; R-04 at/after 72h', () => {
    expect(evaluateInterventions({ ...quiet, unrepairedAgesHours: [30] })[0]!.ruleId).toBe('R-03');
    expect(evaluateInterventions({ ...quiet, unrepairedAgesHours: [80] })[0]!.ruleId).toBe('R-04');
  });

  it('R-13 needs both n>=8 conflicts and a majority-share trigger', () => {
    expect(evaluateInterventions({ ...quiet, conflictCount: 7, dominantVulnerabilityShare: 0.9 })).toEqual([]);
    expect(evaluateInterventions({ ...quiet, conflictCount: 10, dominantVulnerabilityShare: 0.4 })).toEqual([]);
    expect(
      evaluateInterventions({ ...quiet, conflictCount: 10, dominantVulnerabilityShare: 0.6 })[0]!.ruleId,
    ).toBe('R-13');
  });
});
