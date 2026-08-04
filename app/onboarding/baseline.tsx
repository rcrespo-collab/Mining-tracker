/**
 * S-04 — Baseline assessment (CSI-16). One item per screen; a quiet progress
 * dot row; a skip option. Scoring is stored but NEVER shown as a verdict.
 */
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, RadioGroup } from '../../src/components';
import { useTheme } from '../../src/design/theme';
import { CSI16_ITEMS, scoreCsi16 } from '../../src/lib/assessments/csi16';
import { saveAssessment } from '../../src/db/repositories/assessments';
import { completeOnboardingSolo, setOnboardingStage } from '../../src/db/repositories/onboarding';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function Baseline() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const item = CSI16_ITEMS[index]!;
  const options = useMemo(
    () =>
      item.options.map((label, i) => ({
        value: String(item.scores[i]),
        label: label || `${item.scores[i]}`,
      })),
    [item],
  );
  const selected = responses[item.id] != null ? String(responses[item.id]) : null;

  const advance = async () => {
    if (index < CSI16_ITEMS.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (userId) {
      await saveAssessment({
        userId,
        instrument: 'csi16',
        rawResponses: responses,
        score: scoreCsi16(responses),
        band: null, // never a verdict
      });
      await setOnboardingStage(userId, 'mode');
    }
    router.push('/onboarding/mode');
  };

  const skip = async () => {
    if (userId) await setOnboardingStage(userId, 'mode');
    router.push('/onboarding/mode');
  };

  return (
    <Screen
      footer={
        <Button
          label={index < CSI16_ITEMS.length - 1 ? 'Next' : 'Done'}
          onPress={advance}
          disabled={selected === null}
        />
      }
    >
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        {CSI16_ITEMS.map((_, i) => (
          <View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              backgroundColor: i <= index ? theme.colors.accent : theme.colors.surfaceAlt,
            }}
          />
        ))}
      </View>
      <Text role="caption" color="textMuted">
        Baseline · {index + 1} of {CSI16_ITEMS.length}
      </Text>

      <Text role="title" style={{ marginTop: theme.spacing.md }}>
        {item.prompt}
      </Text>

      <View style={{ marginTop: theme.spacing.md }}>
        <RadioGroup
          value={selected}
          onChange={(v) => setResponses((r) => ({ ...r, [item.id]: Number(v) }))}
          options={options}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
        <Button label="Skip assessment" variant="ghost" onPress={skip} />
      </View>
    </Screen>
  );
}
