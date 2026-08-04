import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { enumText, enumCheck } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/** §6.4 `conflict_context` (1:1 with conflict_event). */
export const conflictContext = sqliteTable(
  'conflict_context',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    setting: enumText('setting', e.setting.values),
    privacy: enumText('privacy', e.privacy.values),
    // enum[] stored as JSON text; element validation in the repository layer.
    vulnerabilities: text('vulnerabilities'),
    stressOrigin: enumText('stress_origin', e.stressOrigin.values),
    daysSincePositive: integer('days_since_positive'),
    sleepHours: real('sleep_hours'),
    alcoholUnits: integer('alcohol_units'),
  },
  (t) => [
    enumCheck('conflict_context_setting_ck', t.setting, e.setting.values),
    enumCheck('conflict_context_privacy_ck', t.privacy, e.privacy.values),
    enumCheck('conflict_context_stress_ck', t.stressOrigin, e.stressOrigin.values),
  ],
);

export type ConflictContext = typeof conflictContext.$inferSelect;
export type NewConflictContext = typeof conflictContext.$inferInsert;
