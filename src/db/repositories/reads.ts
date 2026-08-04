/**
 * Read models that feed the metrics (§7), the home dashboard (S-06), and the
 * timeline (S-21). These map database rows onto the plain metric input types and
 * the display view models. Composite severity is read here only to weight the
 * ratio — it is never placed on a view model that reaches the UI.
 */
import { eq, desc } from 'drizzle-orm';
import { getDb, getKey } from '../client';
import {
  conflictEvent,
  conflictContext,
  conflictContent,
  conflictSeverity,
  conflictBehaviour,
  conflictCycle,
  conflictRepair,
  positiveEvent,
} from '../schema';
import { decryptNullable } from '../crypto';
import { unpackEnumArray } from '../fields';
import * as e from '../enums';
import type {
  ConflictForMetrics,
  PositiveForMetrics,
  ConflictForTriggers,
  RepairForEfficacy,
} from '../../lib/metrics';
import type { OwnRole, SurfaceTopic, Vulnerability } from '../enums';

const MS_PER_HOUR = 3600 * 1000;

/** Only completed conflicts (deep steps done, or quick logs) count in metrics. */
async function completedConflictIds(userId: string): Promise<string[]> {
  const rows = await getDb().select().from(conflictEvent).where(eq(conflictEvent.userId, userId));
  return rows
    .filter((r) => r.entryDepth === 'quick' || r.completedSteps >= 7)
    .map((r) => r.id);
}

export async function getMetricsInputs(
  userId: string,
): Promise<{ positives: PositiveForMetrics[]; conflicts: ConflictForMetrics[] }> {
  const db = getDb();
  const events = await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId));
  const severities = await db.select().from(conflictSeverity);
  const behaviours = await db.select().from(conflictBehaviour);
  const repairs = await db.select().from(conflictRepair);
  const sevBy = new Map(severities.map((s) => [s.conflictId, s]));
  const behBy = new Map(behaviours.map((b) => [b.conflictId, b]));
  const repBy = new Map(repairs.map((r) => [r.conflictId, r]));

  const conflicts: ConflictForMetrics[] = events
    .filter((ev) => ev.entryDepth === 'quick' || ev.completedSteps >= 7)
    .map((ev) => {
      const sev = sevBy.get(ev.id);
      const beh = behBy.get(ev.id);
      const rep = repBy.get(ev.id);
      return {
        occurredAt: ev.occurredAt,
        compositeSeverity: sev?.compositeSeverity ?? 0,
        contemptPresent: beh?.contemptPresent ?? false,
        reconnected: rep?.reconnected ?? false,
        timeToRepairHours: rep?.timeToRepairHours ?? null,
      };
    });

  const posRows = await db.select().from(positiveEvent).where(eq(positiveEvent.userId, userId));
  const positives: PositiveForMetrics[] = posRows.map((p) => ({
    occurredAt: p.occurredAt,
    intensity: p.intensity,
    expressedToPartner: p.expressedToPartner,
  }));

  return { positives, conflicts };
}

export async function getTriggerInputs(userId: string): Promise<ConflictForTriggers[]> {
  const ids = new Set(await completedConflictIds(userId));
  const contexts = await getDb().select().from(conflictContext);
  return contexts
    .filter((c) => ids.has(c.conflictId))
    .map((c) => ({
      vulnerabilities: unpackEnumArray(c.vulnerabilities, e.vulnerability.schema) as Vulnerability[],
    }));
}

export async function getRepairInputs(userId: string): Promise<RepairForEfficacy[]> {
  const ids = new Set(await completedConflictIds(userId));
  const repairs = await getDb().select().from(conflictRepair);
  return repairs
    .filter((r) => ids.has(r.conflictId))
    .map((r) => ({
      ownRepairAttempt: r.ownRepairAttempt ?? false,
      ownRepairReceived: r.ownRepairReceived ?? null,
      partnerRepairAttempt: r.partnerRepairAttempt ?? null,
      partnerRepairAccepted: r.partnerRepairAccepted ?? null,
    }));
}

/** Unrepaired ruptures with their age in hours (for R-03/R-04 and the home card). */
export interface UnrepairedRupture {
  conflictId: string;
  occurredAt: Date;
  ageHours: number;
  surfaceTopic: SurfaceTopic | null;
}

export async function getUnrepairedRuptures(userId: string, now: Date): Promise<UnrepairedRupture[]> {
  const db = getDb();
  const events = await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId));
  const repairs = await db.select().from(conflictRepair);
  const contents = await db.select().from(conflictContent);
  const repBy = new Map(repairs.map((r) => [r.conflictId, r]));
  const conBy = new Map(contents.map((c) => [c.conflictId, c]));

  return events
    .filter((ev) => {
      const rep = repBy.get(ev.id);
      // Unrepaired = no repair row yet, or explicitly not reconnected.
      return !rep || rep.reconnected === false;
    })
    .map((ev) => ({
      conflictId: ev.id,
      occurredAt: ev.occurredAt,
      ageHours: (now.getTime() - ev.occurredAt.getTime()) / MS_PER_HOUR,
      surfaceTopic: conBy.get(ev.id)?.surfaceTopic ?? null,
    }))
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
}

/** Pursue/withdraw tallies over the last N completed conflicts (home pattern hint). */
export async function getRoleTally(userId: string, lastN = 10): Promise<{ role: OwnRole; count: number }[]> {
  const db = getDb();
  const events = (await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId)))
    .filter((ev) => ev.completedSteps >= 5)
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, lastN);
  const ids = new Set(events.map((ev) => ev.id));
  const cycles = (await db.select().from(conflictCycle)).filter((c) => ids.has(c.conflictId));
  const tally = new Map<OwnRole, number>();
  for (const c of cycles) {
    if (c.ownRole) tally.set(c.ownRole, (tally.get(c.ownRole) ?? 0) + 1);
  }
  return [...tally.entries()].map(([role, count]) => ({ role, count }));
}

/**
 * Horsemen counts over a trailing window (S-26 trends). Contempt is read from
 * the denormalised flag; the others from the encrypted horsemen blob.
 */
export async function getHorsemanCounts(
  userId: string,
  now: Date,
  days: number,
): Promise<{ contempt: number; defensiveness: number; criticism: number; stonewalling: number }> {
  const db = getDb();
  const key = getKey();
  const since = now.getTime() - days * 24 * 3600 * 1000;
  const events = (await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId))).filter(
    (ev) => ev.occurredAt.getTime() >= since,
  );
  const ids = new Set(events.map((ev) => ev.id));
  const behaviours = (await db.select().from(conflictBehaviour)).filter((b) => ids.has(b.conflictId));
  const counts = { contempt: 0, defensiveness: 0, criticism: 0, stonewalling: 0 };
  for (const b of behaviours) {
    if (b.contemptPresent) counts.contempt += 1;
    const list = unpackEnumArray(decryptNullable(b.horsemen, key), e.horseman.schema);
    if (list.includes('defensiveness')) counts.defensiveness += 1;
    if (list.includes('criticism')) counts.criticism += 1;
    if (list.includes('stonewalling')) counts.stonewalling += 1;
  }
  return counts;
}

/** Merged chronological timeline (S-21) — conflicts and positives, newest first. */
export type TimelineItem =
  | {
      kind: 'conflict';
      id: string;
      occurredAt: Date;
      surfaceTopic: SurfaceTopic | null;
      hiddenIssue: e.HiddenIssue | null;
      peakIntensity: number | null;
      reconnected: boolean;
    }
  | { kind: 'positive'; id: string; occurredAt: Date; type: e.PositiveType; note: string | null };

export async function getTimeline(userId: string): Promise<TimelineItem[]> {
  const db = getDb();
  const key = getKey();
  const events = await db.select().from(conflictEvent).where(eq(conflictEvent.userId, userId));
  const contents = await db.select().from(conflictContent);
  const severities = await db.select().from(conflictSeverity);
  const repairs = await db.select().from(conflictRepair);
  const conBy = new Map(contents.map((c) => [c.conflictId, c]));
  const sevBy = new Map(severities.map((s) => [s.conflictId, s]));
  const repBy = new Map(repairs.map((r) => [r.conflictId, r]));

  const conflictItems: TimelineItem[] = events
    .filter((ev) => ev.entryDepth === 'quick' || ev.completedSteps >= 1)
    .map((ev) => ({
      kind: 'conflict' as const,
      id: ev.id,
      occurredAt: ev.occurredAt,
      surfaceTopic: conBy.get(ev.id)?.surfaceTopic ?? null,
      hiddenIssue: conBy.get(ev.id)?.hiddenIssue ?? null,
      peakIntensity: sevBy.get(ev.id)?.peakIntensity ?? null,
      reconnected: repBy.get(ev.id)?.reconnected ?? false,
    }));

  const positives = await db
    .select()
    .from(positiveEvent)
    .where(eq(positiveEvent.userId, userId))
    .orderBy(desc(positiveEvent.occurredAt));
  const positiveItems: TimelineItem[] = positives.map((p) => ({
    kind: 'positive' as const,
    id: p.id,
    occurredAt: p.occurredAt,
    type: p.type,
    note: decryptNullable(p.note, key),
  }));

  return [...conflictItems, ...positiveItems].sort(
    (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
  );
}
