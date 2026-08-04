/**
 * S-01 — Onboarding welcome & framing. Sets the anti-scorekeeping frame before
 * any data is entered. Copy is verbatim from the spec wireframe; it is doing
 * clinical work, not placeholder text.
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button } from '../../src/components';
import { useTheme } from '../../src/design/theme';
import { startOnboarding } from '../../src/db/repositories/onboarding';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function Welcome() {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);
  const setIdentity = useSessionStore((s) => s.setIdentity);

  const onContinue = async () => {
    setBusy(true);
    const id = await startOnboarding();
    setIdentity(id);
    router.push('/onboarding/safety');
  };

  return (
    <Screen
      footer={
        <Button label="Continue" onPress={onContinue} loading={busy} />
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.lg }}>
        <Text role="display">This is not a record of who was right.</Text>
        <Text role="body" color="textMuted">
          It's a way to see the pattern you both get caught in — and get out of it faster.
        </Text>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
          <Text role="body">· Private by default</Text>
          <Text role="body">· You only ever describe your own behaviour</Text>
          <Text role="body">· You'll log good moments too — that's the point</Text>
        </View>
      </View>
    </Screen>
  );
}
