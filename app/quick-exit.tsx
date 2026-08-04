/**
 * Neutral decoy page (S-02 quick-exit, §9.2). Tapping "Leave this app quickly"
 * clears the current view and lands here — an innocuous, ordinary-looking screen
 * so the app reveals nothing to anyone glancing at the phone. There is no visible
 * way back to sensitive content from here except the small, unlabelled control.
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/design/theme';
import { Text } from '../src/components/Text';

export default function QuickExit() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text role="title">Notes</Text>
        <Text role="body" color="textMuted">
          Milk, eggs, bread. Call the plumber back. Dentist Thursday at 3.
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityLabel="Return"
          onPress={() => router.replace('/(tabs)/home')}
          hitSlop={16}
          style={{ alignSelf: 'flex-end', padding: theme.spacing.md }}
        >
          <Text role="caption" color="textFaint">
            ·
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
