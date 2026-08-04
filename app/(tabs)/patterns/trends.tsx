/**
 * S-26 — Trends. Time to repair is the headline (the number that matters most).
 * Then connection ratio, repair-attempt landing, and Horsemen counts. Conflict
 * frequency is shown LAST and de-emphasised, with the explicit note that
 * frequency is not the target. CSI trend is skipped until two administrations
 * exist (Phase 1 partial per §12).
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { Sparkline } from '../../../src/components/charts';
import { useSessionStore } from '../../../src/stores/sessionStore';
import {
  computeConnectionRatio,
  computeTimeToRepair,
  computeRepairEfficacy,
} from '../../../src/lib/metrics';
import { getMetricsInputs, getRepairInputs, getHorsemanCounts } from '../../../src/db/repositories/reads';

export default function Trends() {
  const userId = useSessionStore((s) => s.userId);
  const [medianHours, setMedianHours] = useState<number | null>(null);
  const [unrepaired, setUnrepaired] = useState(0);
  const [repairSeries, setRepairSeries] = useState<number[]>([]);
  const [ratio, setRatio] = useState<number | null>(null);
  const [landing, setLanding] = useState<number | null>(null);
  const [horsemen, setHorsemen] = useState({ contempt: 0, defensiveness: 0, criticism: 0, stonewalling: 0 });
  const [frequencyPerMonth, setFrequencyPerMonth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!userId) return;
        const now = new Date();
        const { positives, conflicts } = await getMetricsInputs(userId);
        const ttr = computeTimeToRepair(conflicts, now);
        setMedianHours(ttr.medianHours);
        setUnrepaired(ttr.unrepairedCount);
        setRepairSeries(
          conflicts
            .filter((c) => c.reconnected && c.timeToRepairHours != null)
            .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
            .map((c) => c.timeToRepairHours as number),
        );
        const r = computeConnectionRatio(positives, conflicts, now);
        setRatio(r ? r.ratio : null);
        const eff = computeRepairEfficacy(await getRepairInputs(userId));
        setLanding(eff.ownRepairLandingRate);
        setHorsemen(await getHorsemanCounts(userId, now, 60));
        const ninetyDaysAgo = now.getTime() - 90 * 24 * 3600 * 1000;
        const recent = conflicts.filter((c) => c.occurredAt.getTime() >= ninetyDaysAgo).length;
        setFrequencyPerMonth(Math.round((recent / 3) * 10) / 10);
      })();
    }, [userId]),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Over time' }} />
      <Screen>
        <Card>
          <Text role="heading">Time to repair</Text>
          {medianHours != null ? (
            <>
              <Text role="title" color="accentText">
                {medianHours < 24 ? `${Math.round(medianHours)}h` : `${Math.round(medianHours / 24)}d`}
              </Text>
              <Sparkline values={repairSeries} />
            </>
          ) : (
            <Text role="body" color="textMuted">
              Once you've repaired a few, the median shows here.
            </Text>
          )}
          <Text role="small" color="textMuted">
            This is the number that matters most.{unrepaired > 0 ? ` ${unrepaired} still open.` : ''}
          </Text>
        </Card>

        <Card>
          <Text role="heading">Connection ratio</Text>
          <Text role="body">{ratio != null ? `${ratio.toFixed(1)} : 1` : 'Not enough yet'}</Text>
        </Card>

        <Card>
          <Text role="heading">Repair attempts landing</Text>
          <Text role="body">
            {landing != null ? `${Math.round(landing * 100)}%` : 'Not enough yet'}
          </Text>
        </Card>

        <Card>
          <Text role="heading">The Four Horsemen · last 60 days</Text>
          <Text role="body" color="textMuted">
            Contempt {horsemen.contempt} · Defensiveness {horsemen.defensiveness} · Criticism{' '}
            {horsemen.criticism} · Stonewalling {horsemen.stonewalling}
          </Text>
        </Card>

        {/* Frequency last, de-emphasised (§S-26). */}
        <View style={{ marginTop: 8 }}>
          <Text role="small" color="textFaint">
            Conflict frequency: about {frequencyPerMonth}/month. Frequency isn't the target — recovery is.
          </Text>
        </View>
      </Screen>
    </>
  );
}
