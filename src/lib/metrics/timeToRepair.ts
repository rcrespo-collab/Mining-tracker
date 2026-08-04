/**
 * Time to repair (docs/SPEC.md §7.3) — the PRIMARY outcome metric.
 *
 *   median(reconnected_at − occurred_at) over trailing 90 days,
 *   with unrepaired events censored at the observation date and counted
 *   separately.
 *
 * Healthy couples do not fight less; they recover faster. This is the number
 * the product cares about most.
 */
import type { ConflictForMetrics } from './types';

const WINDOW_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface TimeToRepairResult {
  /** Median hours-to-repair over repaired events, or null if none repaired. */
  medianHours: number | null;
  repairedCount: number;
  /** Unrepaired events in-window — censored, reported separately. */
  unrepairedCount: number;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

export function computeTimeToRepair(
  conflicts: ConflictForMetrics[],
  now: Date,
): TimeToRepairResult {
  const cutoff = now.getTime() - WINDOW_DAYS * MS_PER_DAY;
  const inWindow = conflicts.filter(
    (c) => c.occurredAt.getTime() >= cutoff && c.occurredAt.getTime() <= now.getTime(),
  );

  const repairedHours: number[] = [];
  let unrepairedCount = 0;

  for (const c of inWindow) {
    if (c.reconnected && c.timeToRepairHours != null) {
      repairedHours.push(c.timeToRepairHours);
    } else {
      // Censored: still open at the observation date. Counted, never guessed.
      unrepairedCount += 1;
    }
  }

  return {
    medianHours: median(repairedHours),
    repairedCount: repairedHours.length,
    unrepairedCount,
  };
}
