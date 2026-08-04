/**
 * Rituals (S-31). Records completions and reports a neutral weekly count — a
 * gentle progress indicator, never a streak, never a punishment for a missed day.
 */
import { eq } from 'drizzle-orm';
import { getDb } from '../client';
import { ritualInstance } from '../schema';
import { newId } from '../../lib/id';
import type { RitualType } from '../enums';

const MS_PER_DAY = 24 * 3600 * 1000;

export async function completeRitual(relationshipId: string, ritualType: RitualType): Promise<void> {
  await getDb().insert(ritualInstance).values({
    id: newId(),
    relationshipId,
    ritualType,
    completedAt: new Date(),
    completedBy: 'me',
  });
}

export async function ritualWeeklyCounts(
  relationshipId: string,
  now: Date,
): Promise<Record<string, number>> {
  const rows = await getDb()
    .select()
    .from(ritualInstance)
    .where(eq(ritualInstance.relationshipId, relationshipId));
  const weekAgo = now.getTime() - 7 * MS_PER_DAY;
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.completedAt && r.completedAt.getTime() >= weekAgo) {
      counts[r.ritualType] = (counts[r.ritualType] ?? 0) + 1;
    }
  }
  return counts;
}
