/**
 * Data management (S-34 / §11 retention). User-initiated deletion is immediate
 * and complete. There is NO export in any format (non-negotiable #2): the app
 * exposes deletion, never extraction.
 */
import { getDb } from '../client';
import {
  interventionLog,
  ritualInstance,
  assessmentResult,
  sharedItem,
  positiveEvent,
  conflictRepair,
  conflictAttribution,
  conflictCycle,
  conflictBehaviour,
  conflictSeverity,
  conflictContent,
  conflictContext,
  conflictEvent,
  perpetualTheme,
  relationship,
  user,
} from '../schema';

/**
 * Delete everything, in FK-safe order (children before parents). Immediate and
 * complete — nothing is soft-deleted or retained.
 */
export async function deleteAllData(): Promise<void> {
  const db = getDb();
  // Children first.
  await db.delete(interventionLog);
  await db.delete(ritualInstance);
  await db.delete(assessmentResult);
  await db.delete(sharedItem);
  await db.delete(positiveEvent);
  await db.delete(conflictRepair);
  await db.delete(conflictAttribution);
  await db.delete(conflictCycle);
  await db.delete(conflictBehaviour);
  await db.delete(conflictSeverity);
  await db.delete(conflictContent);
  await db.delete(conflictContext);
  await db.delete(conflictEvent);
  await db.delete(perpetualTheme);
  await db.delete(relationship);
  await db.delete(user);
}
