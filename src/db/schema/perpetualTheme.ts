import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pk, bool, enumText, enumCheck } from './_common';
import { relationship } from './relationship';
import * as e from '../enums';

/**
 * §6.12 `perpetual_theme`.
 *
 * The clustering/classification that populates this (§7.4) and the perpetual
 * issues screen (S-25) are Phase 2. The table exists so schema and migrations
 * are complete; Phase 1 does not write to it.
 */
export const perpetualTheme = sqliteTable(
  'perpetual_theme',
  {
    id: pk(),
    relationshipId: text('relationship_id')
      .notNull()
      .references(() => relationship.id),
    label: text('label'),
    dominantHiddenIssue: enumText('dominant_hidden_issue', e.hiddenIssue.values),
    conflictCount: integer('conflict_count'),
    firstSeen: text('first_seen'), // ISO date
    lastSeen: text('last_seen'),
    classification: enumText('classification', e.perpetualClassification.values),
    intensityTrend: enumText('intensity_trend', e.intensityTrend.values),
    dreamsExplored: bool('dreams_explored'),
    ownDream: text('own_dream'),
    ownCoreNeed: text('own_core_need'),
    acceptanceTrackActive: bool('acceptance_track_active'),
  },
  (t) => [
    enumCheck('perpetual_theme_hidden_ck', t.dominantHiddenIssue, e.hiddenIssue.values),
    enumCheck('perpetual_theme_class_ck', t.classification, e.perpetualClassification.values),
    enumCheck('perpetual_theme_trend_ck', t.intensityTrend, e.intensityTrend.values),
  ],
);

export type PerpetualTheme = typeof perpetualTheme.$inferSelect;
export type NewPerpetualTheme = typeof perpetualTheme.$inferInsert;
