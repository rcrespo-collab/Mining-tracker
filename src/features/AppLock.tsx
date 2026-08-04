/**
 * PIN/biometric gate (§9.2, §11 auth). When the user has enabled the lock, the
 * app content stays hidden behind a neutral screen until device authentication
 * succeeds. No content appears on the lock screen — the app looks ordinary.
 */
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSettingsStore } from '../stores/settingsStore';
import { useSessionStore } from '../stores/sessionStore';
import { useTheme } from '../design/theme';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

export function AppLock({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const pinEnabled = useSettingsStore((s) => s.pinEnabled);
  const unlocked = useSessionStore((s) => s.unlocked);
  const setUnlocked = useSessionStore((s) => s.setUnlocked);

  const authenticate = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !enrolled) {
      // No device authentication available — fail open so the user is not locked
      // out of their own private data. (Production may require a fallback PIN.)
      setUnlocked(true);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock',
      fallbackLabel: 'Use passcode',
    });
    if (result.success) setUnlocked(true);
  }, [setUnlocked]);

  useEffect(() => {
    if (pinEnabled && !unlocked) authenticate();
  }, [pinEnabled, unlocked, authenticate]);

  if (pinEnabled && !unlocked) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <Screen scroll={false}>
          <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.lg }}>
            <Text role="title" center>
              Locked
            </Text>
            <Button label="Unlock" onPress={authenticate} />
          </View>
        </Screen>
      </View>
    );
  }

  return <>{children}</>;
}
