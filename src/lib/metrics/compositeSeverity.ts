/**
 * Composite severity (docs/SPEC.md §7.1) — INTERNAL ONLY.
 *
 *   severity = 0.30·norm(peak_intensity)
 *            + 0.25·flooded
 *            + 0.20·personalisation_weight
 *            + 0.15·norm(escalation_slope)
 *            + 0.10·norm(recovery_minutes)
 *
 * Used only for trend lines and clustering and as an input to the connection
 * ratio weighting (§7.2). It is NEVER rendered as a number and never used to
 * sort or filter a user-facing list — a "7.4/10 fight" is exactly the artefact
 * that turns a log into a ledger. The severity-containment guardrail test proves
 * this identifier never reaches the UI layer.
 */
import type { SeverityInput } from './types';
import type { EscalationSlope, Personalisation } from '../../db/enums';

/**
 * Cap for normalising recovery time. The spec gives the weight (0.10) but not a
 * scale; we saturate at 4 hours so that a very long recovery does not dominate
 * the composite. (Decision D-metrics-1, recorded in PLAN.md.)
 */
const RECOVERY_CAP_MINUTES = 240;

const PERSONALISATION_WEIGHT: Record<Personalisation, number> = {
  issue_focused: 0,
  drifted: 0.5,
  personal: 1.0,
};

const ESCALATION_WEIGHT: Record<EscalationSlope, number> = {
  slow: 0,
  gradual: 0.5,
  rapid: 1.0,
};

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Normalise peak intensity (1–5) to 0..1. */
function normIntensity(peak: number): number {
  return clamp01((peak - 1) / 4);
}

function normRecovery(minutes: number | null): number {
  if (minutes == null || minutes <= 0) return 0;
  return clamp01(minutes / RECOVERY_CAP_MINUTES);
}

/** Compute composite severity in [0, 1]. Internal use only. */
export function computeCompositeSeverity(input: SeverityInput): number {
  const severity =
    0.3 * normIntensity(input.peakIntensity) +
    0.25 * (input.flooded ? 1 : 0) +
    0.2 * PERSONALISATION_WEIGHT[input.personalisation] +
    0.15 * ESCALATION_WEIGHT[input.escalationSlope] +
    0.1 * normRecovery(input.recoveryMinutes);
  return clamp01(severity);
}
