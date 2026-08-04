/**
 * Theme provider and hook. Full light/dark support; the active palette follows
 * the OS appearance unless the user has set an explicit override (You → theme).
 */
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightPalette, darkPalette, spacing, radius, type, motion, type Palette } from './tokens';
import { useSettingsStore } from '../stores/settingsStore';

export interface Theme {
  scheme: 'light' | 'dark';
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
  motion: typeof motion;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const override = useSettingsStore((s) => s.themePreference);

  const theme = useMemo<Theme>(() => {
    const scheme: 'light' | 'dark' =
      override === 'system' ? (system === 'dark' ? 'dark' : 'light') : override;
    return {
      scheme,
      colors: scheme === 'dark' ? darkPalette : lightPalette,
      spacing,
      radius,
      type,
      motion,
    };
  }, [system, override]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider.');
  return ctx;
}
