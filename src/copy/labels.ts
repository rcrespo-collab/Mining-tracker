/**
 * Human-facing labels for enum values (docs/SPEC.md §5 wireframes).
 *
 * Plain, second person, no jargon, no exclamation marks. Centralised so the
 * clinical wording is auditable in one place. Partner-position labels are always
 * phrased as the user's perception, never as fact about the partner.
 */
import type {
  SurfaceTopic,
  HiddenIssue,
  PrimaryEmotion,
  SecondaryEmotion,
  AttachmentNeed,
  Horseman,
  Antidote,
  PositiveType,
  RepairType,
  Resolution,
  OwnRole,
  EscalationSlope,
  Personalisation,
  FloodingSign,
  StressOrigin,
  Vulnerability,
  Setting,
  Privacy,
} from '../db/enums';

export const surfaceTopicLabel: Record<SurfaceTopic, string> = {
  money: 'Money',
  chores_division: 'Chores',
  sex_intimacy: 'Sex and intimacy',
  time_together: 'Time together',
  phones_screens: 'Phones and screens',
  in_laws: 'In-laws',
  parenting: 'Parenting',
  work_hours: 'Work hours',
  jealousy_trust: 'Jealousy and trust',
  communication: 'Communication',
  plans_future: 'Plans and the future',
  health_habits: 'Health and habits',
  pets: 'Pets',
  mess_order: 'Mess and order',
  punctuality: 'Punctuality',
  friends_social: 'Friends',
  alcohol: 'Alcohol',
  driving: 'Driving',
  other: 'Something else',
};

export const hiddenIssueLabel: Record<HiddenIssue, string> = {
  power_control: 'Power — who decides',
  caring: 'Caring — do you have my back',
  recognition: 'Recognition — does what I do register',
  commitment: 'Commitment — are we in this for good',
  trust_integrity: 'Trust — can I rely on you',
  acceptance: 'Acceptance — can I be who I am here',
  autonomy_freedom: 'Freedom — do I get to have a self',
  closeness_distance: 'Closeness — how near we are',
  unclear: 'Not sure',
};

export const primaryEmotionLabel: Record<PrimaryEmotion, string> = {
  hurt: 'Hurt',
  fear: 'Afraid',
  loneliness: 'Lonely',
  shame: 'Ashamed',
  rejection: 'Rejected',
  inadequacy: 'Not good enough',
  helplessness: 'Helpless',
  feeling_unimportant: 'Unimportant',
  feeling_trapped: 'Trapped',
};

export const secondaryEmotionLabel: Record<SecondaryEmotion, string> = {
  anger: 'Anger',
  irritation: 'Irritation',
  frustration: 'Frustration',
  coldness: 'Coldness',
  contempt: 'Contempt',
  indifference: 'Indifference',
  anxiety: 'Anxiety',
};

export const attachmentNeedLabel: Record<AttachmentNeed, string> = {
  are_you_there_for_me: 'Are you there for me?',
  do_i_matter: 'Do I matter to you?',
  do_you_respect_me: 'Do you respect me?',
  can_i_trust_you: 'Can I trust you?',
  do_i_get_to_be_me: 'Do I still get to be me?',
};

export const horsemanLabel: Record<Horseman, { label: string; help: string }> = {
  criticism: { label: 'Criticism', help: '"you always", "you never", attacking who they are' },
  contempt: { label: 'Contempt', help: 'eye-roll, sarcasm, mockery, talking down' },
  defensiveness: { label: 'Defensiveness', help: 'counter-attack, "not my fault", innocent victim' },
  stonewalling: { label: 'Stonewalling', help: 'shut down, walked off, went silent' },
  none: { label: 'None of these', help: '' },
};

export const antidoteLabel: Record<Antidote, string> = {
  gentle_startup: 'Started gently',
  took_responsibility: 'Owned my part',
  stated_need: 'Said what I needed clearly',
  self_soothed_properly: 'Took a break properly',
  accepted_influence: 'Softened when they softened',
  none: 'None of these',
};

export const positiveTypeLabel: Record<PositiveType, string> = {
  appreciation: 'Appreciation',
  affection: 'Affection',
  turned_toward: 'They turned toward me',
  shared_humour: 'Laughed together',
  act_of_service: 'They did something for me',
  felt_close: 'Felt close',
  shared_meaning: 'Shared meaning',
  sexual_intimacy: 'Intimacy',
  support_received: 'They supported me',
  support_given: 'I supported them',
};

export const repairTypeLabel: Record<RepairType, string> = {
  humour: 'A joke',
  physical_touch: 'A touch',
  apology: 'An apology',
  i_take_responsibility: 'Taking responsibility',
  lets_start_over: '"Let me start again"',
  expressed_appreciation: 'Appreciation',
  asked_for_break: 'Asking for a break',
  expressed_affection: 'Affection',
  agreed_to_disagree: 'Agreeing to disagree',
};

export const resolutionLabel: Record<Resolution, string> = {
  resolved: 'Resolved',
  de_escalated: 'Calmed down, not resolved',
  parked: 'Parked for later',
  open: 'Still open',
  perpetual: 'This one never resolves',
};

export const ownRoleLabel: Record<OwnRole, string> = {
  pursue: 'Pushing for a response — pursuing, insisting',
  withdraw: 'Pulling back — shutting down, leaving',
  alternating: 'Both, in turns',
  unclear: 'Not sure',
};

export const escalationLabel: Record<EscalationSlope, string> = {
  slow: 'Slow burn',
  gradual: 'Gradual',
  rapid: 'Zero to sixty',
};

export const personalisationLabel: Record<Personalisation, string> = {
  issue_focused: 'No — stayed on the issue',
  drifted: 'Drifted into character',
  personal: 'Yes — it got personal',
};

export const floodingSignLabel: Record<FloodingSign, string> = {
  heart_racing: 'Heart racing',
  mind_blank: 'Mind went blank',
  urge_to_flee: 'Wanted to escape',
  couldnt_hear: "Couldn't hear them anymore",
  none: 'None of these',
};

export const stressOriginLabel: Record<StressOrigin, string> = {
  internal: 'Between us',
  external_spillover: 'Outside — spilled in',
  both: 'Both',
  unclear: 'Not sure',
};

export const vulnerabilityLabel: Record<Vulnerability, string> = {
  low_sleep: 'Short on sleep',
  alcohol: 'Drinking involved',
  substance: 'Substances involved',
  work_stress: 'Work stress',
  money_pressure: 'Money pressure',
  illness_pain: 'Illness or pain',
  inlaws_family: 'Family or in-laws',
  parenting_load: 'Parenting load',
  travel_reentry: 'Travel / just got back',
  prolonged_distance: "We'd been distant for days",
  hormonal_cycle: 'Hormonal cycle',
  none: 'Nothing unusual',
};

export const settingLabel: Record<Setting, string> = {
  home: 'Home',
  car: 'Car',
  phone: 'Phone',
  text: 'Text',
  work: 'Work',
  in_public: 'In public',
  travel: 'Travelling',
  other: 'Somewhere else',
};

export const privacyLabel: Record<Privacy, string> = {
  alone: 'Just us',
  children_present: 'Kids present',
  others_present: 'Others',
  public: 'In public',
};

/** Turn a record into the {value,label} option array the controls expect. */
export function toOptions<T extends string>(record: Record<T, string>): { value: T; label: string }[] {
  return (Object.keys(record) as T[]).map((value) => ({ value, label: record[value] }));
}
