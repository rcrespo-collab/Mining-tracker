/**
 * Session store (Zustand): app-unlock state, the current user/relationship ids,
 * the safety flag, and the per-session intervention counter used by the rules
 * engine's rate limiting (§8: one intervention per session).
 */
import { create } from 'zustand';
import type { SafetyFlag } from '../db/enums';

interface SessionState {
  unlocked: boolean; // passed the PIN/biometric gate this launch
  userId: string | null;
  relationshipId: string | null;
  safetyFlag: SafetyFlag;
  /** Suppress "strengthen your relationship" copy when safety is elevated (§9.3). */
  suppressImprovementCopy: boolean;
  interventionsThisSession: number;

  setUnlocked: (v: boolean) => void;
  setIdentity: (v: { userId: string; relationshipId: string }) => void;
  setSafety: (v: { flag: SafetyFlag; suppressImprovementCopy: boolean }) => void;
  noteInterventionSurfaced: () => void;
  resetSessionCounters: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  unlocked: false,
  userId: null,
  relationshipId: null,
  safetyFlag: 'clear',
  suppressImprovementCopy: false,
  interventionsThisSession: 0,

  setUnlocked: (unlocked) => set({ unlocked }),
  setIdentity: ({ userId, relationshipId }) => set({ userId, relationshipId }),
  setSafety: ({ flag, suppressImprovementCopy }) =>
    set({ safetyFlag: flag, suppressImprovementCopy }),
  noteInterventionSurfaced: () =>
    set((s) => ({ interventionsThisSession: s.interventionsThisSession + 1 })),
  resetSessionCounters: () => set({ interventionsThisSession: 0 }),
}));
