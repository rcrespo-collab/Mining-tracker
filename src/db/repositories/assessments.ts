/**
 * Assessment results (S-04 baseline CSI-16). Never shareable. `rawResponses` is
 * encrypted at rest. Scoring is stored but never surfaced as a verdict — only as
 * a trend later (S-26), and not until two administrations exist.
 */
import { eq, and, desc } from 'drizzle-orm';
import { getDb, getKey } from '../client';
import { assessmentResult } from '../schema';
import { encryptString } from '../crypto';
import { newId } from '../../lib/id';
import type { Instrument, AssessmentBand } from '../enums';

export interface SaveAssessmentInput {
  userId: string;
  instrument: Instrument;
  rawResponses: unknown; // JSON-serialisable
  score: number | null;
  band: AssessmentBand | null;
}

export async function saveAssessment(input: SaveAssessmentInput): Promise<string> {
  const id = newId();
  await getDb().insert(assessmentResult).values({
    id,
    userId: input.userId,
    instrument: input.instrument,
    takenAt: new Date(),
    rawResponses: encryptString(JSON.stringify(input.rawResponses), getKey()),
    score: input.score,
    band: input.band ?? undefined,
  });
  return id;
}

export async function countAdministrations(userId: string, instrument: Instrument): Promise<number> {
  const rows = await getDb()
    .select()
    .from(assessmentResult)
    .where(and(eq(assessmentResult.userId, userId), eq(assessmentResult.instrument, instrument)));
  return rows.length;
}

/** Scores over time for the CSI trend (only shown once two exist). */
export async function assessmentScores(
  userId: string,
  instrument: Instrument,
): Promise<{ takenAt: Date; score: number | null }[]> {
  const rows = await getDb()
    .select()
    .from(assessmentResult)
    .where(and(eq(assessmentResult.userId, userId), eq(assessmentResult.instrument, instrument)))
    .orderBy(desc(assessmentResult.takenAt));
  return rows.map((r) => ({ takenAt: r.takenAt, score: r.score }));
}
