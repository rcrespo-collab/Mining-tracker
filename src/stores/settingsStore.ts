/**
 * UI settings store (Zustand). Theme preference, PIN, and discreet mode.
 *
 * The durable copies of `pinEnabled` and `discreetMode` live on the `user` row;
 * this store mirrors them for synchronous UI reads and holds the theme
 * preference (not part of the clinical schema).
 */
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  themePreference: ThemePreference;
  pinEnabled: boolean;
  discreetMode: boolean;
  setThemePreference: (p: ThemePreference) => void;
  setPinEnabled: (v: boolean) => void;
  setDiscreetMode: (v: boolean) => void;
  hydrate: (v: { pinEnabled: boolean; discreetMode: boolean }) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themePreference: 'system',
  pinEnabled: false,
  discreetMode: false,
  setThemePreference: (themePreference) => set({ themePreference }),
  setPinEnabled: (pinEnabled) => set({ pinEnabled }),
  setDiscreetMode: (discreetMode) => set({ discreetMode }),
  hydrate: ({ pinEnabled, discreetMode }) => set({ pinEnabled, discreetMode }),
}));
