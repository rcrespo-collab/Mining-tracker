import { describe, it, expect } from 'vitest';
import { evaluateSafetyScreen, type SafetyAnswers } from '../screen';

const clear: SafetyAnswers = { afraid: 'never', physicalHarm: 'no', control: 'no' };

describe('safety screen routing (S-02 / §9) — guardrail test #5', () => {
  it('a clear screen does not route to support and keeps linked mode', () => {
    const out = evaluateSafetyScreen(clear);
    expect(out.flag).toBe('clear');
    expect(out.routeToSupport).toBe(false);
    expect(out.linkedModeEligible).toBe(true);
    expect(out.suppressImprovementCopy).toBe(false);
  });

  // Each above-threshold answer, on its own, must produce elevated + routing.
  const elevatingAnswers: Array<[string, SafetyAnswers]> = [
    ['afraid: often', { ...clear, afraid: 'often' }],
    ['physical harm: yes', { ...clear, physicalHarm: 'yes' }],
    ['control: yes', { ...clear, control: 'yes' }],
  ];

  it.each(elevatingAnswers)('elevated on %s → routes to S-35 and flags elevated', (_label, answers) => {
    const out = evaluateSafetyScreen(answers);
    expect(out.flag).toBe('elevated');
    expect(out.routeToSupport).toBe(true);
    expect(out.linkedModeEligible).toBe(false);
    expect(out.suppressImprovementCopy).toBe(true);
  });

  it('softer signals produce caution without routing', () => {
    expect(evaluateSafetyScreen({ ...clear, afraid: 'sometimes' }).flag).toBe('caution');
    expect(evaluateSafetyScreen({ ...clear, control: 'sometimes' }).flag).toBe('caution');
    expect(evaluateSafetyScreen({ ...clear, physicalHarm: 'prefer_not' }).flag).toBe('caution');
    expect(evaluateSafetyScreen({ ...clear, afraid: 'sometimes' }).routeToSupport).toBe(false);
  });

  it('elevated wins over caution when both are present', () => {
    const out = evaluateSafetyScreen({ afraid: 'sometimes', physicalHarm: 'yes', control: 'sometimes' });
    expect(out.flag).toBe('elevated');
  });
});
