import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { pk, ts, bool, enumText, enumCheck, constraints } from './_common';
import { user } from './user';
import * as e from '../enums';

/**
 * §6.11 `positive_event`.
 *
 * First-class and lowest-friction (S-08 lists "Something good" first).
 * `expressedToPartner` distinguishes private noticing from an actual positive
 * interaction; it feeds the connection-ratio weighting (§7.2). `note` encrypted.
 */
export const positiveEvent = sqliteTable(
  'positive_event',
  {
    id: pk(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    occurredAt: ts('occurred_at').notNull(),
    type: enumText('type', e.positiveType.values).notNull(),
    note: text('note'), // encrypted
    expressedToPartner: bool('expressed_to_partner').notNull(),
    intensity: integer('intensity').notNull(), // 1–3, default 2
    weight: real('weight'), // ratio weight §7.2
  },
  (t) => constraints(enumCheck('positive_event_type_ck', t.type, e.positiveType.values)),
);

export type PositiveEvent = typeof positiveEvent.$inferSelect;
export type NewPositiveEvent = typeof positiveEvent.$inferInsert;
