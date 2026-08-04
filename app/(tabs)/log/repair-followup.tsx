/**
 * S-20 — Repair follow-up. Reached from the home rupture card, the timeline, or
 * rule R-03/R-04. Records where things landed. In Phase 1 this is surfaced in-app
 * and via local notifications (no network / no push server).
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Text, Button, RadioGroup } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';
import { updateRepairFollowup } from '../../../src/db/repositories/conflicts';
import type { Resolution } from '../../../src/db/enums';

type Where = 'okay' | 'surface' | 'cold' | 'blew_up';

const RESOLUTION_FOR: Record<Where, { reconnected: boolean; resolution: Resolution }> = {
  okay: { reconnected: true, resolution: 'resolved' },
  surface: { reconnected: false, resolution: 'de_escalated' },
  cold: { reconnected: false, resolution: 'open' },
  blew_up: { reconnected: false, resolution: 'open' },
};

export default function RepairFollowup() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [where, setWhere] = useState<Where | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!where) return;
    setBusy(true);
    if (id) await updateRepairFollowup(id, RESOLUTION_FOR[where]);
    router.replace('/(tabs)/log');
  };

  return (
    <Screen footer={<Button label="Save" onPress={save} disabled={!where} loading={busy} />}>
      <Text role="title">Where are things now?</Text>
      <Text role="body" color="textMuted">
        Time apart doesn't repair. Ruptures that aren't addressed don't fade — they accumulate.
      </Text>

      <View style={{ marginTop: theme.spacing.md }}>
        <RadioGroup
          value={where}
          onChange={setWhere}
          options={[
            { value: 'okay', label: "We're okay now" },
            { value: 'surface', label: 'Surface okay, not really' },
            { value: 'cold', label: 'Still cold' },
            { value: 'blew_up', label: 'It blew up again' },
          ]}
        />
      </View>

      <Button
        label="Do the aftermath together"
        variant="ghost"
        onPress={() => router.push('/(tabs)/tools')}
      />
    </Screen>
  );
}
