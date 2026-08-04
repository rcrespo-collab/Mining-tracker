/**
 * Connection ratio (docs/SPEC.md §7.2) — the hero metric.
 *
 *   ratio = Σ(positive_weight) / Σ(negative_weight)   over rolling 14 days
 *
 *   positive_weight = intensity × (expressed_to_partner ? 1.0 : 0.6)
 *   negative_weight = 1 + composite_severity
 *                        × (contempt_present ? 1.5 : 1.0)
 *                        × (reconnected ? 0.7 : 1.0)
 *
 * Unexpressed positives count less (they aren't interactions); contempt is
 * weighted up; a successful repair discounts the negative. Returns `null` below
 * 10 total events (the display gate), or when there are no negatives to form a
 * ratio against.
 */
import type { ConflictForMetrics, PositiveForMetrics } from './types';

const WINDOW_DAYS = 14;
const MIN_EVENTS_FOR_DISPLAY = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface ConnectionRatioResult {
  ratio: number;
  positiveWeightTotal: number;
  negativeWeightTotal: number;
  positiveCount: number;
  conflictCount: number;
}

function positiveWeight(p: PositiveForMetrics): number {
  return p.intensity * (p.expressedToPartner ? 1.0 : 0.6);
}

function negativeWeight(c: ConflictForMetrics): number {
  return (
    1 +
    c.compositeSeverity * (c.contemptPresent ? 1.5 : 1.0) * (c.reconnected ? 0.7 : 1.0)
  );
}

/**
 * @param now Anchor for the rolling window (defaults to caller-supplied to keep
 *            the function pure and deterministic in tests).
 * @returns the ratio result, or `null` when there is not enough data to show it.
 */
export function computeConnectionRatio(
  positives: PositiveForMetrics[],
  conflicts: ConflictForMetrics[],
  now: Date,
): ConnectionRatioResult | null {
  const cutoff = now.getTime() - WINDOW_DAYS * MS_PER_DAY;
  const inWindow = (d: Date) => d.getTime() >= cutoff && d.getTime() <= now.getTime();

  const pos = positives.filter((p) => inWindow(p.occurredAt));
  const con = conflicts.filter((c) => inWindow(c.occurredAt));

  if (pos.length + con.length < MIN_EVENTS_FOR_DISPLAY) return null;

  const positiveWeightTotal = pos.reduce((sum, p) => sum + positiveWeight(p), 0);
  const negativeWeightTotal = con.reduce((sum, c) => sum + negativeWeight(c), 0);

  // Without any negative weight there is no ratio to express; withhold rather
  // than show an infinite or meaningless number.
  if (negativeWeightTotal <= 0) return null;

  return {
    ratio: positiveWeightTotal / negativeWeightTotal,
    positiveWeightTotal,
    negativeWeightTotal,
    positiveCount: pos.length,
    conflictCount: con.length,
  };
}
