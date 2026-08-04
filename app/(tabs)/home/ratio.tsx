/**
 * S-07 — Ratio detail. The "why 5 to 1" explanation (framed as aggregate
 * research, not a prediction about this user) and the breakdown of positives by
 * type. No severity, no conflict ranking.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { BarRow } from '../../../src/components/charts';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { listPositives } from '../../../src/db/repositories/positives';
import { computeConnectionRatio, type ConnectionRatioResult } from '../../../src/lib/metrics';
import { getMetricsInputs } from '../../../src/db/repositories/reads';
import { positiveTypeLabel } from '../../../src/copy/labels';
import type { PositiveType } from '../../../src/db/enums';

export default function RatioDetail() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const [ratio, setRatio] = useState<ConnectionRatioResult | null>(null);
  const [byType, setByType] = useState<{ type: PositiveType; count: number }[]>([]);

  const load = useCallback(async () => {
    if (!userId) return;
    const now = new Date();
    const { positives, conflicts } = await getMetricsInputs(userId);
    setRatio(computeConnectionRatio(positives, conflicts, now));
    const list = await listPositives(userId);
    const counts = new Map<PositiveType, number>();
    for (const p of list) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
    setByType([...counts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count));
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const maxCount = byType.reduce((m, b) => Math.max(m, b.count), 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Connection ratio' }} />
      <Screen>
        {ratio ? (
          <Text role="display" color="accentText">
            {ratio.ratio.toFixed(1)} : 1
          </Text>
        ) : (
          <Text role="body" color="textMuted">
            Not enough logged yet.
          </Text>
        )}

        <Card>
          <Text role="heading">Why 5 to 1?</Text>
          <Text role="body" color="textMuted">
            In observational research, stable couples produced about five positive interactions for every
            negative one during conflict. Below that, decline becomes more predictable. This is a research
            finding about groups, not a prediction about you.
          </Text>
        </Card>

        {byType.length > 0 ? (
          <View style={{ gap: theme.spacing.sm }}>
            <Text role="heading">Your positives are mostly</Text>
            {byType.map((b) => (
              <BarRow key={b.type} label={positiveTypeLabel[b.type]} value={b.count} max={maxCount} />
            ))}
          </View>
        ) : null}
      </Screen>
    </>
  );
}
