import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { pk, ts, enumText, enumCheck, constraints } from './_common';
import { user } from './user';
import * as e from '../enums';

/**
 * §6.13 `assessment_result`.
 *
 * Never shareable (Share: N throughout), including with a linked partner.
 * `rawResponses` is JSON, encrypted at rest. `band` is internal routing only —
 * scoring is never surfaced as a verdict (S-04, S-26).
 */
export const assessmentResult = sqliteTable(
  'assessment_result',
  {
    id: pk(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    instrument: enumText('instrument', e.instrument.values).notNull(),
    takenAt: ts('taken_at').notNull(),
    rawResponses: text('raw_responses'), // JSON, encrypted
    score: real('score'),
    subscales: text('subscales'), // JSON
    band: enumText('band', e.assessmentBand.values),
  },
  (t) => constraints(
    enumCheck('assessment_instrument_ck', t.instrument, e.instrument.values),
    enumCheck('assessment_band_ck', t.band, e.assessmentBand.values),
  ),
);

export type AssessmentResult = typeof assessmentResult.$inferSelect;
export type NewAssessmentResult = typeof assessmentResult.$inferInsert;
