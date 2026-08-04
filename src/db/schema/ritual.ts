import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pk, ts, enumText, enumCheck, constraints } from './_common';
import { relationship } from './relationship';
import * as e from '../enums';

/** §6.14 `ritual_instance`. */
export const ritualInstance = sqliteTable(
  'ritual_instance',
  {
    id: pk(),
    relationshipId: text('relationship_id')
      .notNull()
      .references(() => relationship.id),
    ritualType: enumText('ritual_type', e.ritualType.values).notNull(),
    scheduledFor: ts('scheduled_for'),
    completedAt: ts('completed_at'),
    completedBy: enumText('completed_by', e.completedBy.values),
    qualityRating: integer('quality_rating'), // 1–5
  },
  (t) => constraints(
    enumCheck('ritual_type_ck', t.ritualType, e.ritualType.values),
    enumCheck('ritual_completed_by_ck', t.completedBy, e.completedBy.values),
  ),
);

export type RitualInstance = typeof ritualInstance.$inferSelect;
export type NewRitualInstance = typeof ritualInstance.$inferInsert;
