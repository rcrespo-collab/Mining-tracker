/**
 * Conflict data access: quick log (S-09), the resumable seven-step deep log
 * (S-11…S-18), and reads for the entry detail (S-22).
 *
 * Free-text fields are encrypted at rest. Composite severity (§7.1) is computed
 * and stored on save but is NEVER returned to a view model (severity containment).
 * The deep log is resumable: a draft `conflict_event` is created on entry to step
 * 1 and `completed_steps` advances (0–7) so an interrupted flow can be picked up.
 */
import { eq, and } from 'drizzle-orm';
import { getDb, getKey } from '../client';
import {
  conflictEvent,
  conflictContext,
  conflictContent,
  conflictSeverity,
  conflictBehaviour,
  conflictCycle,
  conflictAttribution,
  conflictRepair,
} from '../schema';
import { encryptNullable, decryptNullable } from '../crypto';
import { packEnumArray, unpackEnumArray } from '../fields';
import { newId } from '../../lib/id';
import { computeCompositeSeverity } from '../../lib/metrics';
import * as e from '../enums';
import type {
  Setting,
  Privacy,
  Vulnerability,
  StressOrigin,
  SurfaceTopic,
  HiddenIssue,
  EscalationSlope,
  Personalisation,
  FloodingSign,
  Horseman,
  Antidote,
  OwnRole,
  PartnerRole,
  SecondaryEmotion,
  PrimaryEmotion,
  AttachmentNeed,
  RepairType,
  Resolution,
} from '../enums';

const MS_PER_HOUR = 3600 * 1000;

async function setSteps(conflictId: string, steps: number): Promise<void> {
  await getDb().update(conflictEvent).set({ completedSteps: steps }).where(eq(conflictEvent.id, conflictId));
}

// ── Quick log (S-09) ─────────────────────────────────────────────────────────

export interface QuickLogInput {
  userId: string;
  relationshipId: string;
  occurredAt: Date;
  peakIntensity: number; // 1–5
  flooded: boolean;
  surfaceTopic: SurfaceTopic | null;
}

/** Save a quick conflict; returns the id so details can be added later. */
export async function saveQuickConflict(input: QuickLogInput): Promise<string> {
  const db = getDb();
  const id = newId();
  await db.insert(conflictEvent).values({
    id,
    userId: input.userId,
    relationshipId: input.relationshipId,
    createdAt: new Date(),
    occurredAt: input.occurredAt,
    entryDepth: 'quick',
    completedSteps: 0,
    loggedWhileFlooded: false,
  });
  await db.insert(conflictSeverity).values({
    conflictId: id,
    peakIntensity: input.peakIntensity,
    flooded: input.flooded,
  });
  if (input.surfaceTopic) {
    await db.insert(conflictContent).values({ conflictId: id, surfaceTopic: input.surfaceTopic });
  }
  return id;
}

// ── Deep log (S-11…S-18) ─────────────────────────────────────────────────────

/**
 * Upgrade an existing (e.g. quick) conflict to a deep entry, carrying the
 * flooded-override flag through. Used when the deep log continues from a quick
 * log or the cooldown gate.
 */
export async function upgradeToDeep(conflictId: string, loggedWhileFlooded: boolean): Promise<void> {
  await getDb()
    .update(conflictEvent)
    .set({ entryDepth: 'deep', loggedWhileFlooded })
    .where(eq(conflictEvent.id, conflictId));
}

/** Create a resumable deep-log draft (entry to step 1). */
export async function createDeepDraft(
  userId: string,
  relationshipId: string,
  occurredAt: Date,
  loggedWhileFlooded: boolean,
): Promise<string> {
  const id = newId();
  await getDb().insert(conflictEvent).values({
    id,
    userId,
    relationshipId,
    createdAt: new Date(),
    occurredAt,
    entryDepth: 'deep',
    completedSteps: 0,
    loggedWhileFlooded,
  });
  return id;
}

export interface Step1Context {
  occurredAt: Date;
  durationMin: number | null;
  setting: Setting | null;
  privacy: Privacy | null;
  vulnerabilities: Vulnerability[];
  stressOrigin: StressOrigin | null;
}

export async function saveStep1(conflictId: string, input: Step1Context): Promise<void> {
  const db = getDb();
  await db
    .update(conflictEvent)
    .set({ occurredAt: input.occurredAt, durationMin: input.durationMin })
    .where(eq(conflictEvent.id, conflictId));
  await db
    .insert(conflictContext)
    .values({
      conflictId,
      setting: input.setting ?? undefined,
      privacy: input.privacy ?? undefined,
      vulnerabilities: packEnumArray(input.vulnerabilities, e.vulnerability.schema),
      stressOrigin: input.stressOrigin ?? undefined,
    })
    .onConflictDoUpdate({
      target: conflictContext.conflictId,
      set: {
        setting: input.setting ?? null,
        privacy: input.privacy ?? null,
        vulnerabilities: packEnumArray(input.vulnerabilities, e.vulnerability.schema),
        stressOrigin: input.stressOrigin ?? null,
      },
    });
  await setSteps(conflictId, 1);
}

export interface Step2Content {
  surfaceTopic: SurfaceTopic | null;
  surfaceTopicDetail: string | null;
  hiddenIssue: HiddenIssue | null;
}

export async function saveStep2(conflictId: string, input: Step2Content): Promise<void> {
  const key = getKey();
  const detail = encryptNullable(input.surfaceTopicDetail, key);
  await getDb()
    .insert(conflictContent)
    .values({
      conflictId,
      surfaceTopic: input.surfaceTopic ?? undefined,
      surfaceTopicDetail: detail,
      hiddenIssue: input.hiddenIssue ?? undefined,
    })
    .onConflictDoUpdate({
      target: conflictContent.conflictId,
      set: {
        surfaceTopic: input.surfaceTopic ?? null,
        surfaceTopicDetail: detail,
        hiddenIssue: input.hiddenIssue ?? null,
      },
    });
  await setSteps(conflictId, 2);
}

export interface Step3Severity {
  peakIntensity: number;
  escalationSlope: EscalationSlope;
  personalisation: Personalisation;
  floodingSigns: FloodingSign[];
  recoveryMinutes: number | null;
}

export async function saveStep3(conflictId: string, input: Step3Severity): Promise<void> {
  const flooded = input.floodingSigns.some((s) => s !== 'none');
  const composite = computeCompositeSeverity({
    peakIntensity: input.peakIntensity,
    flooded,
    personalisation: input.personalisation,
    escalationSlope: input.escalationSlope,
    recoveryMinutes: input.recoveryMinutes,
  });
  await getDb()
    .insert(conflictSeverity)
    .values({
      conflictId,
      peakIntensity: input.peakIntensity,
      escalationSlope: input.escalationSlope,
      personalisation: input.personalisation,
      floodingSigns: packEnumArray(input.floodingSigns, e.floodingSign.schema),
      flooded,
      recoveryMinutes: input.recoveryMinutes,
      compositeSeverity: composite,
    })
    .onConflictDoUpdate({
      target: conflictSeverity.conflictId,
      set: {
        peakIntensity: input.peakIntensity,
        escalationSlope: input.escalationSlope,
        personalisation: input.personalisation,
        floodingSigns: packEnumArray(input.floodingSigns, e.floodingSign.schema),
        flooded,
        recoveryMinutes: input.recoveryMinutes,
        compositeSeverity: composite,
      },
    });
  await setSteps(conflictId, 3);
}

export interface Step4Behaviour {
  horsemen: Horseman[];
  antidotes: Antidote[];
  ownContribution: string | null;
}

export async function saveStep4(conflictId: string, input: Step4Behaviour): Promise<void> {
  const key = getKey();
  const contemptPresent = input.horsemen.includes('contempt');
  // enum[] blobs and the free-text contribution are encrypted; contempt_present
  // stays in clear because R-05/R-06 and the trends query it.
  const horsemen = encryptNullable(packEnumArray(input.horsemen, e.horseman.schema), key);
  const antidotes = encryptNullable(packEnumArray(input.antidotes, e.antidote.schema), key);
  const ownContribution = encryptNullable(input.ownContribution, key);
  await getDb()
    .insert(conflictBehaviour)
    .values({ conflictId, horsemen, contemptPresent, antidotes, ownContribution })
    .onConflictDoUpdate({
      target: conflictBehaviour.conflictId,
      set: { horsemen, contemptPresent, antidotes, ownContribution },
    });
  await setSteps(conflictId, 4);
}

export interface Step5Cycle {
  ownRole: OwnRole | null;
  partnerRole: PartnerRole | null; // perceived; labelled as perception in UI
  secondaryEmotion: SecondaryEmotion | null;
  primaryEmotion: PrimaryEmotion | null;
  attachmentNeed: AttachmentNeed | null;
  needVoiced: boolean;
}

export async function saveStep5(conflictId: string, input: Step5Cycle): Promise<void> {
  // No free text in this table; enum categories keep their CHECK constraints and
  // stay unencrypted (see PLAN.md D13).
  await getDb()
    .insert(conflictCycle)
    .values({
      conflictId,
      ownRole: input.ownRole ?? undefined,
      partnerRole: input.partnerRole ?? undefined,
      secondaryEmotion: input.secondaryEmotion ?? undefined,
      primaryEmotion: input.primaryEmotion ?? undefined,
      attachmentNeed: input.attachmentNeed ?? undefined,
      needVoiced: input.needVoiced,
    })
    .onConflictDoUpdate({
      target: conflictCycle.conflictId,
      set: {
        ownRole: input.ownRole ?? null,
        partnerRole: input.partnerRole ?? null,
        secondaryEmotion: input.secondaryEmotion ?? null,
        primaryEmotion: input.primaryEmotion ?? null,
        attachmentNeed: input.attachmentNeed ?? null,
        needVoiced: input.needVoiced,
      },
    });
  await setSteps(conflictId, 5);
}

export interface Step6Attribution {
  initialAttribution: string | null;
  reappraisal: string | null;
  reappraisalCompleted: boolean;
}

export async function saveStep6(conflictId: string, input: Step6Attribution): Promise<void> {
  const key = getKey();
  // Classifier is stubbed in Phase 1 (D4): derived dimensions stay null.
  const initialAttribution = encryptNullable(input.initialAttribution, key);
  const reappraisal = encryptNullable(input.reappraisal, key);
  await getDb()
    .insert(conflictAttribution)
    .values({ conflictId, initialAttribution, reappraisal, reappraisalCompleted: input.reappraisalCompleted })
    .onConflictDoUpdate({
      target: conflictAttribution.conflictId,
      set: { initialAttribution, reappraisal, reappraisalCompleted: input.reappraisalCompleted },
    });
  await setSteps(conflictId, 6);
}

export interface Step7Repair {
  ownRepairAttempt: boolean;
  ownRepairReceived: boolean | null;
  partnerRepairAttempt: boolean | null;
  partnerRepairAccepted: boolean | null;
  repairTypes: RepairType[];
  resolution: Resolution | null;
  reconnected: boolean;
  reconnectedHoursAfter: number | null; // user-estimated "how long did it take"
}

export async function saveStep7(conflictId: string, input: Step7Repair): Promise<void> {
  const db = getDb();
  const evt = (await db.select().from(conflictEvent).where(eq(conflictEvent.id, conflictId)).limit(1))[0];
  const occurredAt = evt?.occurredAt ?? new Date();
  const reconnectedAt =
    input.reconnected && input.reconnectedHoursAfter != null
      ? new Date(occurredAt.getTime() + input.reconnectedHoursAfter * 3600 * 1000)
      : null;
  const timeToRepairHours = input.reconnected ? input.reconnectedHoursAfter : null;

  await db
    .insert(conflictRepair)
    .values({
      conflictId,
      ownRepairAttempt: input.ownRepairAttempt,
      ownRepairReceived: input.ownRepairReceived,
      partnerRepairAttempt: input.partnerRepairAttempt,
      partnerRepairAccepted: input.partnerRepairAccepted,
      repairTypes: packEnumArray(input.repairTypes, e.repairType.schema),
      resolution: input.resolution ?? undefined,
      reconnected: input.reconnected,
      reconnectedAt,
      timeToRepairHours,
    })
    .onConflictDoUpdate({
      target: conflictRepair.conflictId,
      set: {
        ownRepairAttempt: input.ownRepairAttempt,
        ownRepairReceived: input.ownRepairReceived,
        partnerRepairAttempt: input.partnerRepairAttempt,
        partnerRepairAccepted: input.partnerRepairAccepted,
        repairTypes: packEnumArray(input.repairTypes, e.repairType.schema),
        resolution: input.resolution ?? null,
        reconnected: input.reconnected,
        reconnectedAt,
        timeToRepairHours,
      },
    });
  await setSteps(conflictId, 7);
}

/**
 * Light repair-status update from the follow-up screen (S-20), without walking
 * the full step 7. Computes time-to-repair when reconnecting.
 */
export async function updateRepairFollowup(
  conflictId: string,
  input: { reconnected: boolean; resolution: Resolution | null },
): Promise<void> {
  const db = getDb();
  const evt = (await db.select().from(conflictEvent).where(eq(conflictEvent.id, conflictId)).limit(1))[0];
  const occurredAt = evt?.occurredAt ?? new Date();
  const now = new Date();
  const reconnectedAt = input.reconnected ? now : null;
  const timeToRepairHours = input.reconnected ? (now.getTime() - occurredAt.getTime()) / MS_PER_HOUR : null;
  await db
    .insert(conflictRepair)
    .values({
      conflictId,
      reconnected: input.reconnected,
      resolution: input.resolution ?? undefined,
      reconnectedAt,
      timeToRepairHours,
    })
    .onConflictDoUpdate({
      target: conflictRepair.conflictId,
      set: {
        reconnected: input.reconnected,
        resolution: input.resolution ?? null,
        reconnectedAt,
        timeToRepairHours,
      },
    });
}

// ── Reads ────────────────────────────────────────────────────────────────────

/** The most recent unfinished deep-log draft (completed_steps 1–6), if any. */
export async function getResumableDraft(userId: string) {
  const rows = await getDb()
    .select()
    .from(conflictEvent)
    .where(and(eq(conflictEvent.userId, userId), eq(conflictEvent.entryDepth, 'deep')));
  const drafts = rows.filter((r) => r.completedSteps >= 1 && r.completedSteps < 7);
  drafts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return drafts[0] ?? null;
}

/**
 * A decrypted view model for the entry detail (S-22). Note: `compositeSeverity`
 * is deliberately NOT included — severity never reaches the UI.
 */
export interface ConflictDetail {
  id: string;
  occurredAt: Date;
  surfaceTopic: SurfaceTopic | null;
  hiddenIssue: HiddenIssue | null;
  narrative: string | null;
  ownContribution: string | null;
  horsemen: Horseman[];
  antidotes: Antidote[];
  ownRole: OwnRole | null;
  partnerRole: PartnerRole | null;
  primaryEmotion: PrimaryEmotion | null;
  secondaryEmotion: SecondaryEmotion | null;
  attachmentNeed: AttachmentNeed | null;
  resolution: Resolution | null;
  reconnected: boolean;
  loggedWhileFlooded: boolean;
}

export async function getConflictDetail(conflictId: string): Promise<ConflictDetail | null> {
  const db = getDb();
  const key = getKey();
  const evt = (await db.select().from(conflictEvent).where(eq(conflictEvent.id, conflictId)).limit(1))[0];
  if (!evt) return null;
  const content = (await db.select().from(conflictContent).where(eq(conflictContent.conflictId, conflictId)).limit(1))[0];
  const behaviour = (await db.select().from(conflictBehaviour).where(eq(conflictBehaviour.conflictId, conflictId)).limit(1))[0];
  const cycle = (await db.select().from(conflictCycle).where(eq(conflictCycle.conflictId, conflictId)).limit(1))[0];
  const repair = (await db.select().from(conflictRepair).where(eq(conflictRepair.conflictId, conflictId)).limit(1))[0];

  return {
    id: evt.id,
    occurredAt: evt.occurredAt,
    surfaceTopic: content?.surfaceTopic ?? null,
    hiddenIssue: content?.hiddenIssue ?? null,
    narrative: decryptNullable(content?.narrative, key),
    ownContribution: decryptNullable(behaviour?.ownContribution, key),
    horsemen: unpackEnumArray(decryptNullable(behaviour?.horsemen, key), e.horseman.schema),
    antidotes: unpackEnumArray(decryptNullable(behaviour?.antidotes, key), e.antidote.schema),
    ownRole: cycle?.ownRole ?? null,
    partnerRole: cycle?.partnerRole ?? null,
    primaryEmotion: cycle?.primaryEmotion ?? null,
    secondaryEmotion: cycle?.secondaryEmotion ?? null,
    attachmentNeed: cycle?.attachmentNeed ?? null,
    resolution: repair?.resolution ?? null,
    reconnected: repair?.reconnected ?? false,
    loggedWhileFlooded: evt.loggedWhileFlooded,
  };
}
