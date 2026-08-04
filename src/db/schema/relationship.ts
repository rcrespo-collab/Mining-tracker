import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pk, bool, enumText, enumCheck } from './_common';
import { user } from './user';
import * as e from '../enums';

/**
 * §6.2 `relationship`.
 *
 * `partnerAlias` is a local label only (encrypted at rest) and `partnerUserId`
 * is null in solo mode. Neither describes partner behaviour or character, so
 * both are on the schema-guarantee allowlist.
 */
export const relationship = sqliteTable(
  'relationship',
  {
    id: pk(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    partnerAlias: text('partner_alias'), // str(60), local label only, encrypted
    partnerUserId: text('partner_user_id'), // null in solo mode
    status: enumText('status', e.relationshipStatus.values),
    togetherSince: text('together_since'), // ISO date
    cohabiting: bool('cohabiting'),
    childrenInHome: integer('children_in_home'),
    inCouplesTherapy: bool('in_couples_therapy'),
    therapistShareToken: text('therapist_share_token'),
  },
  (t) => [enumCheck('relationship_status_ck', t.status, e.relationshipStatus.values)],
);

export type Relationship = typeof relationship.$inferSelect;
export type NewRelationship = typeof relationship.$inferInsert;
