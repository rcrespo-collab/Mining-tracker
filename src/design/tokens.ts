/**
 * Design tokens (build brief "Design direction").
 *
 * Warm and calm, not clinical, not cute. Muted, low-saturation palette; warm
 * neutrals as the base; a single restrained sage accent. RED IS RESERVED
 * EXCLUSIVELY for the quick-exit control — never for conflict severity, never
 * for a "bad" metric. Body text never below 16pt. WCAG AA contrast.
 *
 * The accent is a muted sage/eucalyptus rather than the terracotta that AI
 * design tends to default to — steady and quiet, the feeling of a calm room.
 */

export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  accentText: string;
  /** Reserved for the quick-exit control ONLY. */
  quickExit: string;
  onQuickExit: string;
  /** Neutral attention tint for the unrepaired-rupture card — warm, not alarming. */
  attention: string;
  attentionSoft: string;
}

export const lightPalette: Palette = {
  bg: '#F4F0E9',
  surface: '#FBF8F2',
  surfaceAlt: '#ECE6DB',
  border: '#DAD1C1',
  text: '#2C2926',
  textMuted: '#6E675E',
  textFaint: '#938B7F',
  accent: '#5E7A63',
  accentSoft: '#DEE7DD',
  onAccent: '#FBF8F2',
  accentText: '#3B5040',
  quickExit: '#A64B41',
  onQuickExit: '#FBF8F2',
  attention: '#8A7A53',
  attentionSoft: '#EDE5CF',
};

export const darkPalette: Palette = {
  bg: '#1B1A18',
  surface: '#262421',
  surfaceAlt: '#201E1C',
  border: '#39342E',
  text: '#ECE6DC',
  textMuted: '#A79E90',
  textFaint: '#7C7264',
  accent: '#8CAA90',
  accentSoft: '#2C382E',
  onAccent: '#1B1A18',
  accentText: '#C7D8C9',
  quickExit: '#CE6E62',
  onQuickExit: '#1B1A18',
  attention: '#C7B183',
  attentionSoft: '#302B20',
};

/** 4pt spacing scale — generous whitespace. */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/**
 * Type scale. `size` in pt; body never below 16. `scale` multiplies with the
 * OS Dynamic Type setting at render time (see Text component).
 */
export const type = {
  display: { size: 30, lineHeight: 38, weight: '600' as const },
  title: { size: 24, lineHeight: 32, weight: '600' as const },
  heading: { size: 19, lineHeight: 26, weight: '600' as const },
  body: { size: 17, lineHeight: 26, weight: '400' as const },
  bodyStrong: { size: 17, lineHeight: 26, weight: '600' as const },
  small: { size: 15, lineHeight: 22, weight: '400' as const },
  caption: { size: 13, lineHeight: 18, weight: '500' as const },
} as const;

export type TypeRole = keyof typeof type;

/** Motion is slow and few. Nothing bouncy. */
export const motion = {
  fast: 180,
  base: 320,
  slow: 560,
  /** One breath of the cooldown timer (inhale or exhale). */
  breath: 4000,
} as const;

/** Minimum touch target (pt). */
export const HIT_SLOP = 44;
