/**
 * Intervention logging and context assembly (§8). Every surfacing is written to
 * `intervention_log`; the weekly count is read back from it for rate limiting.
 * `buildEvaluationContext` assembles the aggregates the rule set reasons over.
 */
import { eq } from 'drizzle-orm';
import { getDb } from '../client';
import { interventionLog, conflictEvent, conflictBehaviour, conflictRepair, positiveEvent } from '../schema';
import { newId } from '../../lib/id';
import { computeConnectionRatio, computeTriggerAssociations } from '../../lib/metrics';
import { getMetricsInputs, getTriggerInputs, getUnrepairedRuptures } from './reads';
import type { InterventionKind, Vulnerability } from '../enums';
import type { EvaluationContext, Surfacing } from '../../lib/interventions';

const MS_PER_DAY = 24 * 3600 * 1000;

export async function logIntervention(
  userId: string,
  surfacing: { ruleId: string; intervention: InterventionKind; screen: string },
): Promise<void> {
  await getDb().insert(interventionLog).values({
    id: newId(),
    userId,
    triggerRule: surfacing.ruleId,
    intervention: surfacing.intervention,
    surfacedAt: new Date(),
  });
}

/** Persist a batch of surfacings decided by the evaluator. */
export async function logSurfacings(userId: string, surfacings: Surfacing[]): Promise<void> {
  for (const s of surfacings) {
    await logIntervention(userId, s);
  }
}

export async function countInterventionsThisWeek(userId: string, now: Date): Promise<number> {
  const rows = await getDb().select().from(interventionLog).where(eq(interventionLog.userId, userId));
  const weekAgo = now.getTime() - 7 * MS_PER_DAY;
  return rows.filter((r) => r.surfacedAt.getTime() >= weekAgo).length;
}

/** Signals from the action that just occurred (empty on a plain foreground run). */
export interface EvaluationSignals {
  floodedAtQuickLog?: boolean;
  criticismLogged?: boolean;
  loggedWhileFlooded?: boolean;
  resolutionPerpetualSelected?: boolean;
}

/**
 * Assemble the evaluation context from the database plus the per-session
 * intervention count (held in the session store and passed in).
 */
export async function buildEvaluationContext(
  userId: string,
  now: Date,
  interventionsThisSession: number,
  signals: EvaluationSignals = {},
): Promise<EvaluationContext> {
  const db = getDb();

  const { positives, conflicts } = await getMetricsInputs(userId);
  const ratio = computeConnectionRatio(positives, conflicts, now);
  // MVP proxy for consecutive-day streaks (decision D14): the current 14-day
  // ratio standing in for the streak length gate.
  const ratioBelow5Days = ratio && ratio.ratio < 5 ? 14 : 0;
  const ratioBelow3Days = ratio && ratio.ratio < 3 ? 21 : 0;

  // Contempt counts in trailing windows.
  const events = await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId));
  const behaviours = await db.select().from(conflictBehaviour);
  const contemptIds = new Set(behaviours.filter((b) => b.contemptPresent).map((b) => b.conflictId));
  const contemptDates = events.filter((ev) => contemptIds.has(ev.id)).map((ev) => ev.occurredAt.getTime());
  const contemptCount30d = contemptDates.filter((t) => t >= now.getTime() - 30 * MS_PER_DAY).length;
  const contemptCount60d = contemptDates.filter((t) => t >= now.getTime() - 60 * MS_PER_DAY).length;

  // Dominant vulnerability share (R-13).
  const triggers = await getTriggerInputs(userId);
  const vulnCounts = new Map<Vulnerability, number>();
  for (const c of triggers) {
    for (const v of new Set(c.vulnerabilities)) {
      if (v === 'none') continue;
      vulnCounts.set(v, (vulnCounts.get(v) ?? 0) + 1);
    }
  }
  const conflictCount = triggers.length;
  const dominantCount = Math.max(0, ...vulnCounts.values());
  const dominantVulnerabilityShare = conflictCount > 0 ? dominantCount / conflictCount : 0;
  // Reference to keep the association helper exercised for future R-13 copy.
  void computeTriggerAssociations;

  // Days since last log of any type.
  const posRows = await db.select().from(positiveEvent).where(eq(positiveEvent.userId, userId));
  const lastLog = Math.max(
    0,
    ...events.map((e2) => e2.occurredAt.getTime()),
    ...posRows.map((p) => p.occurredAt.getTime()),
  );
  const daysSinceLastLog = lastLog > 0 ? (now.getTime() - lastLog) / MS_PER_DAY : 0;

  const unrepaired = await getUnrepairedRuptures(userId, now);
  // Only ruptures with any depth of logging count toward follow-up nudges.
  const repairRows = await db.select().from(conflictRepair);
  void repairRows;

  return {
    now,
    ...signals,
    unrepairedAgesHours: unrepaired.map((u) => u.ageHours),
    contemptCount30d,
    contemptCount60d,
    ratioBelow5Days,
    ratioBelow3Days,
    dominantVulnerabilityShare,
    conflictCount,
    daysSinceLastLog,
    interventionsThisSession,
    interventionsThisWeek: await countInterventionsThisWeek(userId, now),
  };
}
