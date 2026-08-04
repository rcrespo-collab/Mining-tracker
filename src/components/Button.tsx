/**
 * Button. Variants: primary (sage accent), secondary (outlined), ghost (text).
 * Large touch target, calm press feedback (no bounce). Copy uses active verbs
 * that name exactly what happens.
 */
import React from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  accessibilityHint,
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled || !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isPrimary ? theme.colors.accent : 'transparent',
        borderWidth: isSecondary ? 1 : 0,
        borderColor: theme.colors.border,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? theme.colors.onAccent : theme.colors.accent} />
      ) : (
        <View>
          <Text
            role="bodyStrong"
            color={isPrimary ? 'onAccent' : 'accentText'}
            style={!isPrimary && !isSecondary ? { color: theme.colors.accentText } : undefined}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
