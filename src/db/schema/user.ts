import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pk, ts, bool, enumText, enumCheck } from './_common';
import * as e from '../enums';

/** §6.1 `user` — one row in solo mode. */
export const user = sqliteTable(
  'user',
  {
    id: pk(),
    createdAt: ts('created_at').notNull(),
    displayName: text('display_name'), // str(60), share: A
    dobYear: integer('dob_year'), // age band only, share: N
    gender: enumText('gender', e.gender.values),
    locale: text('locale'),
    timezone: text('timezone'),
    onboardingStage: enumText('onboarding_stage', e.onboardingStage.values).notNull(),
    mode: enumText('mode', e.userMode.values).notNull(),
    safetyFlag: enumText('safety_flag', e.safetyFlag.values).notNull(),
    safetyScreenedAt: ts('safety_screened_at'),
    linkedModeEligible: bool('linked_mode_eligible').notNull(),
    pinEnabled: bool('pin_enabled').notNull(),
    discreetMode: bool('discreet_mode').notNull(),
    ageConfirmed18: bool('age_confirmed_18').notNull(), // §9.5 age gate (D9)
  },
  (t) => [
    enumCheck('user_gender_ck', t.gender, e.gender.values),
    enumCheck('user_onboarding_ck', t.onboardingStage, e.onboardingStage.values),
    enumCheck('user_mode_ck', t.mode, e.userMode.values),
    enumCheck('user_safety_flag_ck', t.safetyFlag, e.safetyFlag.values),
  ],
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
