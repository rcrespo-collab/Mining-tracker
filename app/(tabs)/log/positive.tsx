/**
 * S-19 — Positive log. First-class, sub-15-second. "Did you tell them?" converts
 * private noticing into an actual positive interaction — the behaviour the ratio
 * is meant to represent. Note is encrypted at rest.
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, RadioGroup, FieldLabel, TextField } from '../../../src/components';
import { ChipGroup } from '../../../src/components/Chips';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { savePositive } from '../../../src/db/repositories/positives';
import { positiveTypeLabel } from '../../../src/copy/labels';
import type { PositiveType } from '../../../src/db/enums';

const TYPE_CHIPS: { value: PositiveType; label: string }[] = (
  ['appreciation', 'affection', 'turned_toward', 'shared_humour', 'act_of_service', 'felt_close'] as PositiveType[]
).map((v) => ({ value: v, label: positiveTypeLabel[v] }));

export default function PositiveLog() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const [type, setType] = useState<PositiveType | null>(null);
  const [note, setNote] = useState('');
  const [told, setTold] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const onSave = async () => {
    if (!userId || !type) return;
    setBusy(true);
    await savePositive({
      userId,
      occurredAt: new Date(),
      type,
      note: note.trim() || null,
      expressedToPartner: told === true,
      intensity: 2,
    });
    router.replace('/(tabs)/log');
  };

  return (
    <Screen footer={<Button label="Save" onPress={onSave} loading={busy} disabled={!type} />}>
      <Text role="title">Something good</Text>

      <FieldLabel>What kind?</FieldLabel>
      <ChipGroup
        chips={TYPE_CHIPS}
        selected={type ? [type] : []}
        onToggle={(v) => setType(type === v ? null : (v as PositiveType))}
      />

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel>What happened?</FieldLabel>
        <TextField value={note} onChangeText={setNote} placeholder="A sentence is plenty" multiline />
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel>Did you tell them?</FieldLabel>
        <RadioGroup
          value={told === null ? null : told ? 'yes' : 'no'}
          onChange={(v) => setTold(v === 'yes')}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'Not yet' },
          ]}
        />
        {told === false ? (
          <Text role="small" color="textMuted" style={{ marginTop: theme.spacing.xs }}>
            Telling them turns noticing into a moment you both feel. Worth doing when you can.
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
