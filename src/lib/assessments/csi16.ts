/**
 * CSI-16 baseline instrument (docs/SPEC.md S-04, §14).
 *
 * ⚠️ LICENSING (spec §14). The CSI-16 (Funk & Rogge, 2007) is freely available
 * for research and generally permissive, but COMMERCIAL use requires confirming
 * terms with the authors. Item 1 (shown verbatim in the S-04 wireframe) is
 * reproduced here; the remaining item stems are marked as placeholders that MUST
 * be replaced with the licensed CSI-16 wording before any commercial release.
 * The response-scale mechanics and scoring below are correct and complete.
 *
 * Scoring is stored but NEVER surfaced as a verdict (no "42/81" moment) — only
 * as a trend later (S-26), and not until two administrations exist.
 */

export interface AssessmentItem {
  id: string;
  prompt: string;
  /** Option labels, lowest score first. */
  options: string[];
  /** Score for each option (index-aligned with `options`). */
  scores: number[];
  /** True where the stem needs licensed wording before commercial release. */
  needsLicensedWording?: boolean;
}

const SIX_POINT = ['0', '1', '2', '3', '4', '5'].map(Number);

// Item 1 — 7-point happiness scale (verbatim from the S-04 wireframe).
const item1: AssessmentItem = {
  id: 'csi1',
  prompt:
    'Please indicate the degree of happiness, all things considered, of your relationship.',
  options: [
    'Extremely unhappy',
    'Fairly unhappy',
    'A little unhappy',
    'Happy',
    'Very happy',
    'Extremely happy',
    'Perfect',
  ],
  scores: [0, 1, 2, 3, 4, 5, 6],
};

// Items 2–16 — 6-point (0–5). Stems are placeholders pending licensed wording.
function placeholder(n: number, prompt: string, anchors: [string, string]): AssessmentItem {
  return {
    id: `csi${n}`,
    prompt,
    options: [anchors[0], '', '', '', '', anchors[1]],
    scores: SIX_POINT,
    needsLicensedWording: true,
  };
}

export const CSI16_ITEMS: AssessmentItem[] = [
  item1,
  placeholder(2, 'Things between us are going well.', ['Not at all', 'Completely']),
  placeholder(3, 'Our relationship is strong.', ['Not at all', 'Completely']),
  placeholder(4, 'My relationship with my partner makes me happy.', ['Not at all', 'Completely']),
  placeholder(5, 'I have a warm and comfortable relationship.', ['Not at all', 'Completely']),
  placeholder(6, 'I feel like part of a team with my partner.', ['Not at all', 'Completely']),
  placeholder(7, 'How rewarding is your relationship?', ['Not at all', 'Completely']),
  placeholder(8, 'How well does your partner meet your needs?', ['Not at all', 'Completely']),
  placeholder(9, 'How much do you love your partner?', ['Not at all', 'Completely']),
  placeholder(10, 'In general, how satisfied are you?', ['Not at all', 'Completely']),
  placeholder(11, 'I still feel a strong connection.', ['Not at all', 'Completely']),
  placeholder(12, 'Our relationship makes me content.', ['Not at all', 'Completely']),
  placeholder(13, 'I feel understood by my partner.', ['Not at all', 'Completely']),
  placeholder(14, 'We handle differences well.', ['Not at all', 'Completely']),
  placeholder(15, 'I look forward to time with my partner.', ['Not at all', 'Completely']),
  placeholder(16, 'Our relationship is close.', ['Not at all', 'Completely']),
];

export const CSI16_MAX_SCORE = 81; // 6 + 15 × 5

/** Sum item scores. Higher = more satisfied. Never shown as a verdict. */
export function scoreCsi16(responses: Record<string, number>): number {
  return CSI16_ITEMS.reduce((sum, item) => sum + (responses[item.id] ?? 0), 0);
}
