/**
 * Types for the intervention rules engine (docs/SPEC.md §8).
 */
import type { InterventionKind } from '../../db/enums';

/** A snapshot the evaluator reasons over. Built on app foreground and after each save. */
export interface EvaluationContext {
  now: Date;

  // ── Signals from the action that just occurred (may be absent on foreground) ──
  /** "Flooded / overwhelmed" checked at quick log (S-09). */
  floodedAtQuickLog?: boolean;
  /** Criticism logged, or a harsh start-up detected in narrative (R-02). */
  criticismLogged?: boolean;
  /** The deep log was just entered via the cooldown override (R-14). */
  loggedWhileFlooded?: boolean;
  /** The user selected resolution = "this one never resolves" (R-18). */
  resolutionPerpetualSelected?: boolean;

  // ── Rolling aggregates ──
  /** Ages (hours) of conflicts still unrepaired, for R-03/R-04. */
  unrepairedAgesHours: number[];
  /** Contempt occurrences in the trailing 30 / 60 days (R-05/R-06). */
  contemptCount30d: number;
  contemptCount60d: number;
  /** Consecutive days the connection ratio has been below 5:1 / 3:1 (R-07/R-08). */
  ratioBelow5Days: number;
  ratioBelow3Days: number;
  /** The most prevalent vulnerability flag and its share of conflicts (R-13). */
  dominantVulnerabilityShare: number; // 0..1
  conflictCount: number;
  /** Days since any log of any type (R-17). */
  daysSinceLastLog: number;

  // ── Rate-limit state ──
  interventionsThisSession: number;
  interventionsThisWeek: number;
}

export interface InterventionRule {
  id: string; // e.g. "R-05"
  intervention: InterventionKind;
  screen: string; // spec screen id, e.g. "S-29", or "Tools"
  /** Higher = more clinically urgent; chosen first when rate-limited. */
  priority: number;
  /** R-01 and R-16 always fire regardless of rate limits (§8). */
  alwaysFires: boolean;
  evaluate: (ctx: EvaluationContext) => boolean;
  /** Short, plain-language reason (for logs/telemetry, never shown as jargon). */
  rationale: string;
}

export interface Surfacing {
  ruleId: string;
  intervention: InterventionKind;
  screen: string;
}
