import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { pk, ts, enumText, enumCheck, constraints } from './_common';
import { user } from './user';
import * as e from '../enums';

/**
 * §6.16 `intervention_log`.
 *
 * Every surfacing of an intervention by the rules engine (§8) is logged here,
 * which is also how the rate limits (one per session, two per week) are enforced.
 */
export const interventionLog = sqliteTable(
  'intervention_log',
  {
    id: pk(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    triggerRule: text('trigger_rule').notNull(), // rule ID from §8, e.g. "R-05"
    intervention: enumText('intervention', e.interventionKind.values).notNull(),
    surfacedAt: ts('surfaced_at').notNull(),
    engagedAt: ts('engaged_at'),
    completedAt: ts('completed_at'),
    outcome: enumText('outcome', e.interventionOutcome.values),
  },
  (t) => constraints(
    enumCheck('intervention_kind_ck', t.intervention, e.interventionKind.values),
    enumCheck('intervention_outcome_ck', t.outcome, e.interventionOutcome.values),
  ),
);

export type InterventionLog = typeof interventionLog.$inferSelect;
export type NewInterventionLog = typeof interventionLog.$inferInsert;
