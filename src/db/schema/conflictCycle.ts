import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { bool, enumText, enumCheck } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/**
 * §6.8 `conflict_cycle` — EFT core, the highest-value data in the product.
 *
 * `partnerRole` is the ONE permitted partner-position field: a descriptive
 * position in the interaction cycle (pursue/withdraw), always labelled in UI as
 * the user's *perception*, never a judgement. It is on the schema-guarantee
 * allowlist.
 *
 * `primaryEmotion` and `attachmentNeed` are the two fields designed to be
 * shared (Share: O) — they are the disclosures that de-escalate. All emotion
 * and role fields are encrypted at rest.
 */
export const conflictCycle = sqliteTable(
  'conflict_cycle',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    ownRole: enumText('own_role', e.ownRole.values),
    partnerRole: enumText('partner_role', e.partnerRole.values), // perceived; allowlisted
    cycleType: enumText('cycle_type', e.cycleType.values),
    secondaryEmotion: enumText('secondary_emotion', e.secondaryEmotion.values),
    primaryEmotion: enumText('primary_emotion', e.primaryEmotion.values), // Share: O
    attachmentNeed: enumText('attachment_need', e.attachmentNeed.values), // Share: O
    needVoiced: bool('need_voiced'),
  },
  (t) => [
    enumCheck('conflict_cycle_own_role_ck', t.ownRole, e.ownRole.values),
    enumCheck('conflict_cycle_partner_role_ck', t.partnerRole, e.partnerRole.values),
    enumCheck('conflict_cycle_type_ck', t.cycleType, e.cycleType.values),
    enumCheck('conflict_cycle_secondary_ck', t.secondaryEmotion, e.secondaryEmotion.values),
    enumCheck('conflict_cycle_primary_ck', t.primaryEmotion, e.primaryEmotion.values),
    enumCheck('conflict_cycle_need_ck', t.attachmentNeed, e.attachmentNeed.values),
  ],
);

export type ConflictCycle = typeof conflictCycle.$inferSelect;
export type NewConflictCycle = typeof conflictCycle.$inferInsert;
