/**
 * Positive event data access (S-19). First-class and low-friction. The ratio
 * weight (§7.2) is computed on save; the note is encrypted at rest.
 */
import { eq, desc } from 'drizzle-orm';
import { getDb, getKey } from '../client';
import { positiveEvent } from '../schema';
import { encryptNullable, decryptNullable } from '../crypto';
import { newId } from '../../lib/id';
import type { PositiveType } from '../enums';

export interface PositiveInput {
  userId: string;
  occurredAt: Date;
  type: PositiveType;
  note: string | null;
  expressedToPartner: boolean;
  intensity: number; // 1–3, default 2
}

export async function savePositive(input: PositiveInput): Promise<string> {
  const id = newId();
  const weight = input.intensity * (input.expressedToPartner ? 1.0 : 0.6);
  await getDb().insert(positiveEvent).values({
    id,
    userId: input.userId,
    occurredAt: input.occurredAt,
    type: input.type,
    note: encryptNullable(input.note, getKey()),
    expressedToPartner: input.expressedToPartner,
    intensity: input.intensity,
    weight,
  });
  return id;
}

export interface PositiveListItem {
  id: string;
  occurredAt: Date;
  type: PositiveType;
  note: string | null;
}

export async function listPositives(userId: string): Promise<PositiveListItem[]> {
  const key = getKey();
  const rows = await getDb()
    .select()
    .from(positiveEvent)
    .where(eq(positiveEvent.userId, userId))
    .orderBy(desc(positiveEvent.occurredAt));
  return rows.map((r) => ({
    id: r.id,
    occurredAt: r.occurredAt,
    type: r.type,
    note: decryptNullable(r.note, key),
  }));
}
