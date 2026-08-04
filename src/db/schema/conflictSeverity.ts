import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { bool, enumText, enumCheck } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/**
 * §6.6 `conflict_severity` (1:1).
 *
 * `compositeSeverity` (§7.1) is derived and stored for trend/clustering use
 * only. It is NEVER rendered as a number and never used to sort a user-facing
 * list (the severity-containment guardrail test enforces this).
 */
export const conflictSeverity = sqliteTable(
  'conflict_severity',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    peakIntensity: integer('peak_intensity'), // 1–5
    escalationSlope: enumText('escalation_slope', e.escalationSlope.values),
    personalisation: enumText('personalisation', e.personalisation.values),
    floodingSigns: text('flooding_signs'), // enum[] JSON
    flooded: bool('flooded'),
    recoveryMinutes: integer('recovery_minutes'),
    compositeSeverity: real('composite_severity'), // internal only
  },
  (t) => [
    enumCheck('conflict_severity_slope_ck', t.escalationSlope, e.escalationSlope.values),
    enumCheck('conflict_severity_personal_ck', t.personalisation, e.personalisation.values),
  ],
);

export type ConflictSeverity = typeof conflictSeverity.$inferSelect;
export type NewConflictSeverity = typeof conflictSeverity.$inferInsert;
