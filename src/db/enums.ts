/**
 * Enum vocabularies from docs/SPEC.md §6, defined once.
 *
 * Each enum is a `readonly` tuple (the single source of truth), a derived
 * TypeScript union type, and a Zod schema for runtime validation. The tuples
 * are also fed to SQLite `CHECK` constraints in the schema files, so an invalid
 * value cannot reach the database from any path.
 *
 * Field and enum *names* here are load-bearing: the schema-guarantee test walks
 * them to prove no value describes a partner's behaviour, fault, or character.
 */
import { z } from 'zod';

/** Build a Zod enum + value tuple from a readonly string tuple. */
function makeEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return { values, schema: z.enum(values) };
}

// ── user (§6.1) ──────────────────────────────────────────────────────────────
export const gender = makeEnum(['female', 'male', 'non_binary', 'other', 'undisclosed']);
export const onboardingStage = makeEnum([
  'welcome',
  'safety',
  'basics',
  'baseline',
  'mode',
  'complete',
]);
export const userMode = makeEnum(['solo', 'linked']);
export const safetyFlag = makeEnum(['clear', 'caution', 'elevated']);

// ── relationship (§6.2) ──────────────────────────────────────────────────────
export const relationshipStatus = makeEnum([
  'dating',
  'engaged',
  'cohabiting',
  'married',
  'civil_union',
  'separated',
]);

// ── conflict_event (§6.3) ────────────────────────────────────────────────────
export const entryDepth = makeEnum(['quick', 'deep']);

// ── conflict_context (§6.4) ──────────────────────────────────────────────────
export const setting = makeEnum(['home', 'car', 'phone', 'text', 'work', 'in_public', 'travel', 'other']);
export const privacy = makeEnum(['alone', 'children_present', 'others_present', 'public']);
export const vulnerability = makeEnum([
  'low_sleep',
  'alcohol',
  'substance',
  'work_stress',
  'money_pressure',
  'illness_pain',
  'inlaws_family',
  'parenting_load',
  'travel_reentry',
  'prolonged_distance',
  'hormonal_cycle',
  'none',
]);
export const stressOrigin = makeEnum(['internal', 'external_spillover', 'both', 'unclear']);

// ── conflict_content (§6.5) ──────────────────────────────────────────────────
export const surfaceTopic = makeEnum([
  'money',
  'chores_division',
  'sex_intimacy',
  'time_together',
  'phones_screens',
  'in_laws',
  'parenting',
  'work_hours',
  'jealousy_trust',
  'communication',
  'plans_future',
  'health_habits',
  'pets',
  'mess_order',
  'punctuality',
  'friends_social',
  'alcohol',
  'driving',
  'other',
]);
export const hiddenIssue = makeEnum([
  'power_control',
  'caring',
  'recognition',
  'commitment',
  'trust_integrity',
  'acceptance',
  'autonomy_freedom',
  'closeness_distance',
  'unclear',
]);

// ── conflict_severity (§6.6) ─────────────────────────────────────────────────
export const escalationSlope = makeEnum(['slow', 'gradual', 'rapid']);
export const personalisation = makeEnum(['issue_focused', 'drifted', 'personal']);
export const floodingSign = makeEnum(['heart_racing', 'mind_blank', 'urge_to_flee', 'couldnt_hear', 'none']);

// ── conflict_behaviour (§6.7) — self-report only ─────────────────────────────
// The Four Horsemen describe the *user's own* conduct. There is deliberately no
// counterpart enum describing the partner's conduct (see the schema-guarantee test).
export const horseman = makeEnum(['criticism', 'contempt', 'defensiveness', 'stonewalling', 'none']);
export const antidote = makeEnum([
  'gentle_startup',
  'took_responsibility',
  'stated_need',
  'self_soothed_properly',
  'accepted_influence',
  'none',
]);

// ── conflict_cycle (§6.8) — EFT core ─────────────────────────────────────────
export const ownRole = makeEnum(['pursue', 'withdraw', 'alternating', 'unclear']);
// `partnerRole` is the single permitted partner-position field. It is a
// *position in the interaction cycle*, always labelled in UI as the user's
// perception — never a judgement of character. It is on the allowlist.
export const partnerRole = makeEnum(['pursue', 'withdraw', 'alternating', 'unclear']);
export const cycleType = makeEnum([
  'pursue_withdraw',
  'withdraw_pursue',
  'attack_attack',
  'withdraw_withdraw',
  'mixed',
]);
export const secondaryEmotion = makeEnum([
  'anger',
  'irritation',
  'frustration',
  'coldness',
  'contempt',
  'indifference',
  'anxiety',
]);
export const primaryEmotion = makeEnum([
  'hurt',
  'fear',
  'loneliness',
  'shame',
  'rejection',
  'inadequacy',
  'helplessness',
  'feeling_unimportant',
  'feeling_trapped',
]);
export const attachmentNeed = makeEnum([
  'are_you_there_for_me',
  'do_i_matter',
  'do_you_respect_me',
  'can_i_trust_you',
  'do_i_get_to_be_me',
]);

// ── conflict_attribution (§6.9) ──────────────────────────────────────────────
export const attributionLocus = makeEnum(['partner', 'self', 'situation', 'both']);
export const attributionStability = makeEnum(['stable', 'unstable']);
export const attributionGlobality = makeEnum(['global', 'specific']);
export const attributionIntentionality = makeEnum(['intentional', 'unintentional']);

// ── conflict_repair (§6.10) ──────────────────────────────────────────────────
export const repairType = makeEnum([
  'humour',
  'physical_touch',
  'apology',
  'i_take_responsibility',
  'lets_start_over',
  'expressed_appreciation',
  'asked_for_break',
  'expressed_affection',
  'agreed_to_disagree',
]);
export const resolution = makeEnum(['resolved', 'de_escalated', 'parked', 'open', 'perpetual']);

// ── positive_event (§6.11) ───────────────────────────────────────────────────
export const positiveType = makeEnum([
  'appreciation',
  'affection',
  'turned_toward',
  'shared_humour',
  'act_of_service',
  'felt_close',
  'shared_meaning',
  'sexual_intimacy',
  'support_received',
  'support_given',
]);

// ── perpetual_theme (§6.12) ──────────────────────────────────────────────────
export const perpetualClassification = makeEnum(['solvable', 'perpetual_dialogue', 'gridlocked']);
export const intensityTrend = makeEnum(['rising', 'flat', 'falling']);

// ── assessment_result (§6.13) ────────────────────────────────────────────────
export const instrument = makeEnum(['csi16', 'ecr_s', 'safety_screen', 'custom']);
export const assessmentBand = makeEnum(['low', 'moderate', 'high']);

// ── ritual_instance (§6.14) ──────────────────────────────────────────────────
export const ritualType = makeEnum([
  'stress_reducing_conversation',
  'state_of_union',
  'six_second_kiss',
  'departure_ritual',
  'reunion_ritual',
  'weekly_date',
  'appreciation_daily',
]);
export const completedBy = makeEnum(['me', 'both', 'neither']);

// ── shared_item (§6.15) ──────────────────────────────────────────────────────
export const sharedSourceType = makeEnum([
  'conflict_disclosure',
  'cycle_map',
  'positive_event',
  'appreciation',
  'ritual',
  'dream',
]);

// ── intervention_log (§6.16) ─────────────────────────────────────────────────
// The base catalogue from §6.16, plus four buckets that §8 requires logging but
// §6.16 does not enumerate (repair follow-up R-03/R-04 surfaces to S-20, trigger
// insight R-13, re-engagement R-17, perpetual reframe R-18). Extending the enum
// keeps intervention_log honest — see PLAN.md decision D12.
export const interventionKind = makeEnum([
  'self_soothe',
  'softened_startup',
  'aftermath',
  'dreams',
  'acceptance_track',
  'ratio_nudge',
  'contempt_alert',
  'professional_referral',
  'crisis_resources',
  'repair_followup',
  'trigger_insight',
  'reengagement',
  'perpetual_reframe',
]);
export const interventionOutcome = makeEnum(['completed', 'dismissed', 'snoozed']);

// ── Derived TypeScript unions ────────────────────────────────────────────────
export type Gender = z.infer<typeof gender.schema>;
export type OnboardingStage = z.infer<typeof onboardingStage.schema>;
export type UserMode = z.infer<typeof userMode.schema>;
export type SafetyFlag = z.infer<typeof safetyFlag.schema>;
export type RelationshipStatus = z.infer<typeof relationshipStatus.schema>;
export type EntryDepth = z.infer<typeof entryDepth.schema>;
export type Setting = z.infer<typeof setting.schema>;
export type Privacy = z.infer<typeof privacy.schema>;
export type Vulnerability = z.infer<typeof vulnerability.schema>;
export type StressOrigin = z.infer<typeof stressOrigin.schema>;
export type SurfaceTopic = z.infer<typeof surfaceTopic.schema>;
export type HiddenIssue = z.infer<typeof hiddenIssue.schema>;
export type EscalationSlope = z.infer<typeof escalationSlope.schema>;
export type Personalisation = z.infer<typeof personalisation.schema>;
export type FloodingSign = z.infer<typeof floodingSign.schema>;
export type Horseman = z.infer<typeof horseman.schema>;
export type Antidote = z.infer<typeof antidote.schema>;
export type OwnRole = z.infer<typeof ownRole.schema>;
export type PartnerRole = z.infer<typeof partnerRole.schema>;
export type CycleType = z.infer<typeof cycleType.schema>;
export type SecondaryEmotion = z.infer<typeof secondaryEmotion.schema>;
export type PrimaryEmotion = z.infer<typeof primaryEmotion.schema>;
export type AttachmentNeed = z.infer<typeof attachmentNeed.schema>;
export type AttributionLocus = z.infer<typeof attributionLocus.schema>;
export type AttributionStability = z.infer<typeof attributionStability.schema>;
export type AttributionGlobality = z.infer<typeof attributionGlobality.schema>;
export type AttributionIntentionality = z.infer<typeof attributionIntentionality.schema>;
export type RepairType = z.infer<typeof repairType.schema>;
export type Resolution = z.infer<typeof resolution.schema>;
export type PositiveType = z.infer<typeof positiveType.schema>;
export type PerpetualClassification = z.infer<typeof perpetualClassification.schema>;
export type IntensityTrend = z.infer<typeof intensityTrend.schema>;
export type Instrument = z.infer<typeof instrument.schema>;
export type AssessmentBand = z.infer<typeof assessmentBand.schema>;
export type RitualType = z.infer<typeof ritualType.schema>;
export type CompletedBy = z.infer<typeof completedBy.schema>;
export type SharedSourceType = z.infer<typeof sharedSourceType.schema>;
export type InterventionKind = z.infer<typeof interventionKind.schema>;
export type InterventionOutcome = z.infer<typeof interventionOutcome.schema>;
