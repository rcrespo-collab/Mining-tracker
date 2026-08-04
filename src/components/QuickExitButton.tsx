/**
 * Quick-exit control (docs/SPEC.md S-02, §9.2).
 *
 * The ONLY place red is used in the product. Persistent on onboarding and any
 * sensitive surface: clears the view and opens a neutral decoy page so the app
 * looks ordinary to anyone glancing at the phone. Large touch target.
 */
import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function QuickExitButton({ label = 'Leave this app quickly' }: { label?: string }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.replace('/quick-exit')}
      hitSlop={12}
      style={({ pressed }) => ({
        alignSelf: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.quickExit,
        opacity: pressed ? 0.7 : 1,
        minHeight: 44,
        justifyContent: 'center',
      })}
    >
      <Text role="small" color="quickExit" style={{ fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}
