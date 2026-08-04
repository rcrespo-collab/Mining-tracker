import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { pk, ts, bool, enumText, enumCheck, constraints } from './_common';
import * as e from '../enums';

/**
 * §6.15 `shared_item`.
 *
 * Linked mode is Phase 3 — this table exists so the schema and migrations are
 * complete, but Phase 1 never writes to it (no linking UI). `payload` will hold
 * only whitelisted fields, enforced server-side against §3.2, when linked mode
 * ships. `viewed` is never exposed to the sender.
 */
export const sharedItem = sqliteTable(
  'shared_item',
  {
    id: pk(),
    fromUserId: text('from_user_id').notNull(),
    toUserId: text('to_user_id').notNull(),
    sourceType: enumText('source_type', e.sharedSourceType.values).notNull(),
    sourceId: text('source_id').notNull(),
    payload: text('payload'), // JSON, whitelisted fields only
    sharedAt: ts('shared_at'),
    withdrawnAt: ts('withdrawn_at'),
    viewed: bool('viewed'), // not exposed to sender
  },
  (t) => constraints(enumCheck('shared_item_source_ck', t.sourceType, e.sharedSourceType.values)),
);

export type SharedItem = typeof sharedItem.$inferSelect;
export type NewSharedItem = typeof sharedItem.$inferInsert;
