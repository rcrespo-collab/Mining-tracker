/**
 * Safety screen scoring (docs/SPEC.md S-02, §9).
 *
 * ⚠️ CLINICAL GOVERNANCE REQUIRED (spec §9.3, §14). The spec names validated
 * brief instruments (HITS / WAST-short) for this screen. The three plain
 * questions below come from the S-02 wireframe; the threshold→flag mapping here
 * is a DELIBERATELY PROVISIONAL placeholder and MUST be reviewed and signed off
 * by the clinical advisor before launch. It is not represented anywhere in the
 * product as a validated score, and the product never uses the word "abuse" or
 * labels the user's situation (§9.3).
 *
 * An `elevated` result routes to S-35 (support & resources), permanently
 * disables linked mode until re-screened, and suppresses all
 * relationship-improvement copy.
 */
import type { SafetyFlag } from '../../db/enums';

export type AfraidAnswer = 'never' | 'rarely' | 'sometimes' | 'often';
export type HarmAnswer = 'no' | 'yes' | 'prefer_not';
export type ControlAnswer = 'no' | 'sometimes' | 'yes';

export interface SafetyAnswers {
  afraid: AfraidAnswer;
  physicalHarm: HarmAnswer;
  control: ControlAnswer;
}

export interface SafetyOutcome {
  flag: SafetyFlag;
  /** Route to S-35 support & crisis resources (§9.3). */
  routeToSupport: boolean;
  /** False disables linked-mode affordances (user.linked_mode_eligible). */
  linkedModeEligible: boolean;
  /** Suppress all "strengthen your relationship" copy (§9.3). */
  suppressImprovementCopy: boolean;
}

/**
 * PROVISIONAL mapping — see the clinical-governance note above.
 *  - elevated: feeling afraid "often", any physical harm/threat, or clear control
 *  - caution:  feeling afraid "sometimes", some control, or declining to answer harm
 *  - clear:    otherwise
 */
function scoreFlag(answers: SafetyAnswers): SafetyFlag {
  const elevated =
    answers.afraid === 'often' || answers.physicalHarm === 'yes' || answers.control === 'yes';
  if (elevated) return 'elevated';

  const caution =
    answers.afraid === 'sometimes' ||
    answers.control === 'sometimes' ||
    answers.physicalHarm === 'prefer_not';
  if (caution) return 'caution';

  return 'clear';
}

export function evaluateSafetyScreen(answers: SafetyAnswers): SafetyOutcome {
  const flag = scoreFlag(answers);
  const isElevated = flag === 'elevated';
  return {
    flag,
    routeToSupport: isElevated,
    linkedModeEligible: !isElevated,
    suppressImprovementCopy: isElevated,
  };
}
