/**
 * S-05 — Mode choice. Solo is visually recommended. Linked mode is Phase 3, so
 * it is shown as "coming soon" and disabled; if safety is elevated it is not
 * offered at all (§9).
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, Card } from '../../src/components';
import { useTheme } from '../../src/design/theme';
import { completeOnboardingSolo } from '../../src/db/repositories/onboarding';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function Mode() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const linkedEligible = useSessionStore((s) => s.safetyFlag) !== 'elevated';
  const [busy, setBusy] = useState(false);

  const onContinue = async () => {
    if (!userId) return;
    setBusy(true);
    await completeOnboardingSolo(userId);
    router.replace('/(tabs)/home');
  };

  return (
    <Screen footer={<Button label="Continue" onPress={onContinue} loading={busy} />}>
      <Text role="title">How do you want to use this?</Text>

      <Card tone="accent">
        <Text role="heading">Just me · recommended</Text>
        <Text role="body" color="textMuted">
          Fully private. Nothing is ever visible to anyone. You can link later.
        </Text>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text role="heading" color={linkedEligible ? 'text' : 'textFaint'}>
            Me and my partner
          </Text>
          <Text role="caption" color="textMuted">
            coming soon
          </Text>
        </View>
        <Text role="body" color="textMuted">
          You each keep a private journal. You choose, item by item, what to share.
        </Text>
      </Card>

      <Text role="small" color="textMuted">
        For now, everything stays on this device and is only ever seen by you.
      </Text>
    </Screen>
  );
}
