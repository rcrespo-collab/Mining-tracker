/**
 * S-02 — Safety screen. Runs BEFORE any relationship content. An elevated result
 * routes to S-35, disables linked mode, and suppresses improvement copy (§9).
 * The word "abuse" never appears; the user's situation is never labelled. A
 * persistent quick-exit control is present.
 *
 * ⚠️ The thresholds are provisional and require clinical sign-off (see
 * src/lib/safety/screen.ts and PLAN.md §12).
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, RadioGroup } from '../../src/components';
import { useTheme } from '../../src/design/theme';
import {
  evaluateSafetyScreen,
  type AfraidAnswer,
  type HarmAnswer,
  type ControlAnswer,
} from '../../src/lib/safety/screen';
import { setSafetyResult } from '../../src/db/repositories/onboarding';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function Safety() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const setSafety = useSessionStore((s) => s.setSafety);

  const [afraid, setAfraid] = useState<AfraidAnswer | null>(null);
  const [harm, setHarm] = useState<HarmAnswer | null>(null);
  const [control, setControl] = useState<ControlAnswer | null>(null);

  const complete = afraid && harm && control;

  const onContinue = async () => {
    if (!complete || !userId) return;
    const outcome = evaluateSafetyScreen({ afraid, physicalHarm: harm, control });
    await setSafetyResult(userId, outcome);
    setSafety({ flag: outcome.flag, suppressImprovementCopy: outcome.suppressImprovementCopy });
    if (outcome.routeToSupport) {
      router.replace('/(tabs)/you/support');
    } else {
      router.push('/onboarding/basics');
    }
  };

  return (
    <Screen
      quickExit
      footer={<Button label="Continue" onPress={onContinue} disabled={!complete} />}
    >
      <Text role="title">Before we start</Text>
      <Text role="body" color="textMuted">
        A few questions. Your answers are private and never shared.
      </Text>

      <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
        <Text role="heading">In your relationship, do you ever feel afraid of your partner?</Text>
        <RadioGroup
          value={afraid}
          onChange={setAfraid}
          options={[
            { value: 'never', label: 'Never' },
            { value: 'rarely', label: 'Rarely' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'often', label: 'Often' },
          ]}
        />
      </View>

      <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
        <Text role="heading">Has your partner ever physically hurt or threatened you?</Text>
        <RadioGroup
          value={harm}
          onChange={setHarm}
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
            { value: 'prefer_not', label: 'Prefer not to say' },
          ]}
        />
      </View>

      <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
        <Text role="heading">Does your partner control your money, movements, or who you see?</Text>
        <RadioGroup
          value={control}
          onChange={setControl}
          options={[
            { value: 'no', label: 'No' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'yes', label: 'Yes' },
          ]}
        />
      </View>
    </Screen>
  );
}
