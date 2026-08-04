import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { bool } from './_common';
import { conflictEvent } from './conflictEvent';

/**
 * §6.7 `conflict_behaviour` — SELF-REPORT ONLY.
 *
 * Every field here describes the *user's own* conduct. There is deliberately no
 * table, column, or enum anywhere in this system that records the partner's
 * behaviour, fault, or character (the schema-guarantee test proves it).
 *
 * `horsemen` and `antidotes` are enum[] stored as JSON text and encrypted at
 * rest along with `ownContribution`.
 */
export const conflictBehaviour = sqliteTable('conflict_behaviour', {
  conflictId: text('conflict_id')
    .primaryKey()
    .references(() => conflictEvent.id),
  horsemen: text('horsemen'), // enum[] JSON, encrypted
  contemptPresent: bool('contempt_present'), // denormalised; drives alerting
  antidotes: text('antidotes'), // enum[] JSON, encrypted
  ownContribution: text('own_contribution'), // "My share of it", encrypted
});

export type ConflictBehaviour = typeof conflictBehaviour.$inferSelect;
export type NewConflictBehaviour = typeof conflictBehaviour.$inferInsert;
