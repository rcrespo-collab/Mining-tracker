/**
 * Typographic Text. One component, a role and an optional colour — so type is a
 * system, not ad-hoc styling. Respects OS Dynamic Type via `allowFontScaling`
 * (on by default in RN); body is never below 16pt at the base scale.
 */
import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../design/theme';
import type { TypeRole } from '../design/tokens';

type ColorRole = 'text' | 'textMuted' | 'textFaint' | 'accentText' | 'onAccent' | 'quickExit';

export interface TextProps extends RNTextProps {
  role?: TypeRole;
  color?: ColorRole;
  center?: boolean;
}

export function Text({ role = 'body', color = 'text', center, style, ...rest }: TextProps) {
  const theme = useTheme();
  const t = theme.type[role];
  return (
    <RNText
      {...rest}
      style={[
        {
          fontSize: t.size,
          lineHeight: t.lineHeight,
          fontWeight: t.weight,
          color: theme.colors[color],
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
    />
  );
}

export const textStyles = StyleSheet.create({});
