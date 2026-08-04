/**
 * Plain input types for the derived metrics (docs/SPEC.md §7).
 *
 * These are intentionally decoupled from the Drizzle row types so the metric
 * functions are pure and unit-testable in isolation. Repositories map database
 * rows onto these shapes.
 */
import type {
  EscalationSlope,
  Personalisation,
  Vulnerability,
} from '../../db/enums';

/** Inputs to composite severity (§7.1). */
export interface SeverityInput {
  peakIntensity: number; // 1–5
  flooded: boolean;
  personalisation: Personalisation;
  escalationSlope: EscalationSlope;
  recoveryMinutes: number | null;
}

/** A conflict as the ratio and time-to-repair metrics see it. */
export interface ConflictForMetrics {
  occurredAt: Date;
  compositeSeverity: number; // 0..1, from computeCompositeSeverity
  contemptPresent: boolean;
  reconnected: boolean;
  timeToRepairHours: number | null; // null when unrepaired
}

/** A positive event as the ratio metric sees it. */
export interface PositiveForMetrics {
  occurredAt: Date;
  intensity: number; // 1–3
  expressedToPartner: boolean;
}

/** A conflict as the trigger-association metric sees it. */
export interface ConflictForTriggers {
  vulnerabilities: Vulnerability[];
}

/** A repair record as the efficacy metric sees it. */
export interface RepairForEfficacy {
  ownRepairAttempt: boolean;
  ownRepairReceived: boolean | null;
  partnerRepairAttempt: boolean | null;
  partnerRepairAccepted: boolean | null;
}
