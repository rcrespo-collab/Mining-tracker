import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { bool, enumText, enumCheck, constraints } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/**
 * §6.9 `conflict_attribution` (S-16).
 *
 * Phase 1 captures the two free-text fields (encrypted) but STUBS the
 * classifier: `locus`/`stability`/`globality`/`intentionality`/`attributionIndex`
 * are left null. On-device NLP classification (§7.6) is Phase 2 (decision D4).
 */
export const conflictAttribution = sqliteTable(
  'conflict_attribution',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    initialAttribution: text('initial_attribution'), // encrypted
    reappraisal: text('reappraisal'), // encrypted
    locus: enumText('locus', e.attributionLocus.values), // derived (stubbed null in P1)
    stability: enumText('stability', e.attributionStability.values),
    globality: enumText('globality', e.attributionGlobality.values),
    intentionality: enumText('intentionality', e.attributionIntentionality.values),
    attributionIndex: real('attribution_index'), // −1..+1 (stubbed null in P1)
    reappraisalCompleted: bool('reappraisal_completed'),
  },
  (t) => constraints(
    enumCheck('conflict_attribution_locus_ck', t.locus, e.attributionLocus.values),
    enumCheck('conflict_attribution_stability_ck', t.stability, e.attributionStability.values),
    enumCheck('conflict_attribution_globality_ck', t.globality, e.attributionGlobality.values),
    enumCheck('conflict_attribution_intent_ck', t.intentionality, e.attributionIntentionality.values),
  ),
);

export type ConflictAttribution = typeof conflictAttribution.$inferSelect;
export type NewConflictAttribution = typeof conflictAttribution.$inferInsert;
