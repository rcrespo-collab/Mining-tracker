/**
 * S-09 — Quick conflict log. Under 30 seconds. When, intensity, a feelings
 * check (including "Flooded / overwhelmed"), and a one-word topic. If Flooded is
 * checked, saving routes straight to the cooldown gate (S-10 / R-01) before any
 * deep log is possible.
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, IntensityScale, Checklist } from '../../../src/components';
import { ChipGroup } from '../../../src/components/Chips';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { saveQuickConflict } from '../../../src/db/repositories/conflicts';
import { surfaceTopicLabel } from '../../../src/copy/labels';
import type { SurfaceTopic } from '../../../src/db/enums';

type When = 'now' | 'earlier';
type Feeling = 'flooded' | 'angry' | 'hurt' | 'numb' | 'scared' | 'ashamed' | 'lonely';

const TOPIC_CHIPS: { value: SurfaceTopic; label: string }[] = (
  ['money', 'chores_division', 'time_together', 'in_laws', 'phones_screens', 'parenting'] as SurfaceTopic[]
).map((v) => ({ value: v, label: surfaceTopicLabel[v] }));

export default function QuickLog() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const relationshipId = useSessionStore((s) => s.relationshipId);

  const [when, setWhen] = useState<When>('now');
  const [intensity, setIntensity] = useState<number | null>(null);
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [topic, setTopic] = useState<SurfaceTopic | null>(null);
  const [busy, setBusy] = useState(false);

  const flooded = feelings.includes('flooded');

  const onSave = async () => {
    if (!userId || !relationshipId) return;
    setBusy(true);
    const occurredAt = when === 'now' ? new Date() : new Date(Date.now() - 6 * 3600 * 1000);
    const id = await saveQuickConflict({
      userId,
      relationshipId,
      occurredAt,
      peakIntensity: intensity ?? 3,
      flooded,
      surfaceTopic: topic,
    });
    if (flooded) {
      router.replace({ pathname: '/(tabs)/log/cooldown', params: { conflictId: id } });
    } else {
      router.replace('/(tabs)/log');
    }
  };

  return (
    <Screen footer={<Button label="Save — add details later" onPress={onSave} loading={busy} />}>
      <Text role="title">A difficult moment</Text>

      <View style={{ gap: theme.spacing.xs }}>
        <Text role="heading">When</Text>
        <ChipGroup
          chips={[
            { value: 'now', label: 'Now' },
            { value: 'earlier', label: 'Earlier today' },
          ]}
          selected={[when]}
          onToggle={(v) => setWhen(v as When)}
        />
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <Text role="heading">How intense did it get?</Text>
        <IntensityScale value={intensity} onChange={setIntensity} lowLabel="tense" highLabel="explosive" />
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <Text role="heading">Right now I feel</Text>
        <Checklist
          values={feelings}
          onChange={(v) => setFeelings(v as Feeling[])}
          options={[
            { value: 'flooded', label: 'Flooded / overwhelmed' },
            { value: 'angry', label: 'Angry' },
            { value: 'hurt', label: 'Hurt' },
            { value: 'numb', label: 'Numb' },
            { value: 'scared', label: 'Scared' },
            { value: 'ashamed', label: 'Ashamed' },
            { value: 'lonely', label: 'Lonely' },
          ]}
        />
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <Text role="heading">In a word, what was it about?</Text>
        <ChipGroup
          chips={TOPIC_CHIPS}
          selected={topic ? [topic] : []}
          onToggle={(v) => setTopic(topic === v ? null : (v as SurfaceTopic))}
        />
      </View>
    </Screen>
  );
}
