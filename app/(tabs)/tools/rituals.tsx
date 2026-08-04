/**
 * S-31 — Rituals. Daily, weekly, and micro. Weekly counts are a gentle,
 * non-punitive progress indicator — never a streak. Marking one done records a
 * ritual_instance.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Screen, Text, Card, Button } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { completeRitual, ritualWeeklyCounts } from '../../../src/db/repositories/rituals';
import type { RitualType } from '../../../src/db/enums';

const RITUALS: { type: RitualType; title: string; detail: string; cadence: string }[] = [
  {
    type: 'stress_reducing_conversation',
    title: 'Stress-reducing conversation',
    detail: 'Talk about anything except the two of you. Listen. Take their side. Don\'t problem-solve.',
    cadence: 'Daily · 20 min',
  },
  {
    type: 'state_of_union',
    title: 'State of the Union',
    detail: "What went well · what's unfinished · one issue, properly.",
    cadence: 'Weekly · 45 min',
  },
  {
    type: 'six_second_kiss',
    title: 'Six-second kiss',
    detail: 'Long enough to feel like something.',
    cadence: 'Micro',
  },
  {
    type: 'reunion_ritual',
    title: 'Reunion before logistics',
    detail: 'Say hello to each other before the to-do list.',
    cadence: 'Micro',
  },
];

export default function Rituals() {
  const theme = useTheme();
  const relationshipId = useSessionStore((s) => s.relationshipId);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    if (relationshipId) setCounts(await ritualWeeklyCounts(relationshipId, new Date()));
  }, [relationshipId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const done = async (type: RitualType) => {
    if (!relationshipId) return;
    await completeRitual(relationshipId, type);
    load();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Rituals' }} />
      <Screen>
        {RITUALS.map((r) => (
          <Card key={r.type}>
            <Text role="caption" color="textMuted">
              {r.cadence}
            </Text>
            <Text role="heading">{r.title}</Text>
            <Text role="body" color="textMuted">
              {r.detail}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="small" color="textMuted">
                {counts[r.type] ?? 0} this week
              </Text>
              <Button label="Mark done" variant="secondary" onPress={() => done(r.type)} />
            </View>
          </Card>
        ))}
      </Screen>
    </>
  );
}
