/**
 * Card surface. Soft, warm, low-contrast container. An optional `tone` gives the
 * calm attention treatment for the unrepaired-rupture card (warm, never red,
 * never alarming).
 */
import React from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import { useTheme } from '../design/theme';

export interface CardProps {
  children: React.ReactNode;
  tone?: 'surface' | 'attention' | 'accent';
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ children, tone = 'surface', onPress, style }: CardProps) {
  const theme = useTheme();
  const bg =
    tone === 'attention'
      ? theme.colors.attentionSoft
      : tone === 'accent'
        ? theme.colors.accentSoft
        : theme.colors.surface;
  const borderColor =
    tone === 'attention' ? theme.colors.attention : theme.colors.border;

  const inner: ViewStyle = {
    backgroundColor: bg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [inner, { opacity: pressed ? 0.9 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[inner, style]}>{children}</View>;
}
