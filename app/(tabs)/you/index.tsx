/**
 * You tab landing. Appearance (theme), the device lock, discreet mode, and
 * routes to privacy & data (S-34) and support (S-35). No account, no sign-in —
 * everything is local.
 */
import React from 'react';
import { View, Switch } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { ChipGroup } from '../../../src/components/Chips';
import { useTheme } from '../../../src/design/theme';
import { useSettingsStore, type ThemePreference } from '../../../src/stores/settingsStore';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { setUserFlags } from '../../../src/db/repositories/onboarding';

export default function You() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const themePref = useSettingsStore((s) => s.themePreference);
  const setThemePref = useSettingsStore((s) => s.setThemePreference);
  const pinEnabled = useSettingsStore((s) => s.pinEnabled);
  const setPinEnabled = useSettingsStore((s) => s.setPinEnabled);
  const discreet = useSettingsStore((s) => s.discreetMode);
  const setDiscreet = useSettingsStore((s) => s.setDiscreetMode);

  const togglePin = async (v: boolean) => {
    setPinEnabled(v);
    if (userId) await setUserFlags(userId, { pinEnabled: v });
  };
  const toggleDiscreet = async (v: boolean) => {
    setDiscreet(v);
    if (userId) await setUserFlags(userId, { discreetMode: v });
  };

  return (
    <Screen>
      <Text role="title">You</Text>

      <Card>
        <Text role="heading">Appearance</Text>
        <ChipGroup
          chips={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          selected={[themePref]}
          onToggle={(v) => setThemePref(v as ThemePreference)}
        />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
            <Text role="heading">Lock with Face ID / passcode</Text>
            <Text role="small" color="textMuted">
              Keep your journal behind your device lock. Nothing shows on the lock screen.
            </Text>
          </View>
          <Switch value={pinEnabled} onValueChange={togglePin} />
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
            <Text role="heading">Discreet mode</Text>
            <Text role="small" color="textMuted">
              Keep the app plain and quiet. Full neutral name and icon are coming.
            </Text>
          </View>
          <Switch value={discreet} onValueChange={toggleDiscreet} />
        </View>
      </Card>

      <Card onPress={() => router.push('/(tabs)/you/privacy')}>
        <Text role="heading">Privacy & data</Text>
        <Text role="small" color="textMuted">
          Where your data lives, and how to delete it
        </Text>
      </Card>

      <Card onPress={() => router.push('/(tabs)/you/support')}>
        <Text role="heading">Getting more help</Text>
        <Text role="small" color="textMuted">
          Therapists and, if you need them, crisis resources
        </Text>
      </Card>
    </Screen>
  );
}
