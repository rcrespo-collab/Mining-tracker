import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pk, ts, bool, enumText, enumCheck, constraints } from './_common';
import { user } from './user';
import { relationship } from './relationship';
import * as e from '../enums';

/**
 * §6.3 `conflict_event` — root record.
 *
 * Resumable deep log: a draft row is inserted on entry to step 1 with
 * `completedSteps = 0`; each step advances it (0–7). The Home screen offers to
 * resume any event with `completedSteps < 7`.
 */
export const conflictEvent = sqliteTable(
  'conflict_event',
  {
    id: pk(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    relationshipId: text('relationship_id')
      .notNull()
      .references(() => relationship.id),
    createdAt: ts('created_at').notNull(),
    occurredAt: ts('occurred_at').notNull(),
    durationMin: integer('duration_min'),
    entryDepth: enumText('entry_depth', e.entryDepth.values).notNull(),
    completedSteps: integer('completed_steps').notNull(), // 0–7
    loggedWhileFlooded: bool('logged_while_flooded').notNull(),
  },
  (t) => constraints(enumCheck('conflict_event_depth_ck', t.entryDepth, e.entryDepth.values)),
);

export type ConflictEvent = typeof conflictEvent.$inferSelect;
export type NewConflictEvent = typeof conflictEvent.$inferInsert;
