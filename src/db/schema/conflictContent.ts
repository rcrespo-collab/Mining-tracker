import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { enumText, enumCheck, constraints } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/**
 * §6.5 `conflict_content` (1:1).
 *
 * `surfaceTopicDetail` and `narrative` are free text and are encrypted at rest
 * (the repository layer transparently encrypts/decrypts them).
 */
export const conflictContent = sqliteTable(
  'conflict_content',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    surfaceTopic: enumText('surface_topic', e.surfaceTopic.values),
    surfaceTopicDetail: text('surface_topic_detail'), // encrypted
    hiddenIssue: enumText('hidden_issue', e.hiddenIssue.values),
    perpetualThemeId: text('perpetual_theme_id'),
    narrative: text('narrative'), // encrypted
  },
  (t) => constraints(
    enumCheck('conflict_content_topic_ck', t.surfaceTopic, e.surfaceTopic.values),
    enumCheck('conflict_content_hidden_ck', t.hiddenIssue, e.hiddenIssue.values),
  ),
);

export type ConflictContent = typeof conflictContent.$inferSelect;
export type NewConflictContent = typeof conflictContent.$inferInsert;
