/**
 * S-06 — Home dashboard.
 *
 * Ratio is the hero (framed positively as "Connection ratio"), the
 * unrepaired-rupture card is the highest-priority slot, and there is NO conflict
 * streak or "days without a fight" anywhere. On focus the intervention evaluator
 * runs (§8) and any surfacing appears as a single calm card.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen, Text, Card, Button } from '../../../src/components';
import { Fab } from '../../../src/features/Fab';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { computeConnectionRatio, type ConnectionRatioResult } from '../../../src/lib/metrics';
import {
  getMetricsInputs,
  getUnrepairedRuptures,
  getRoleTally,
  type UnrepairedRupture,
} from '../../../src/db/repositories/reads';
import { getResumableDraft } from '../../../src/db/repositories/conflicts';
import { runInterventionEvaluation, type ActiveSurfacing } from '../../../src/features/interventionRunner';
import { InterventionCard } from '../../../src/features/InterventionCard';
import { ownRoleLabel } from '../../../src/copy/labels';

export default function Home() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const suppressImprovement = useSessionStore((s) => s.suppressImprovementCopy);

  const [ratio, setRatio] = useState<ConnectionRatioResult | null>(null);
  const [ruptures, setRuptures] = useState<UnrepairedRupture[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftStep, setDraftStep] = useState(0);
  const [pattern, setPattern] = useState<string | null>(null);
  const [surfacing, setSurfacing] = useState<ActiveSurfacing | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const now = new Date();
    const { positives, conflicts } = await getMetricsInputs(userId);
    setRatio(computeConnectionRatio(positives, conflicts, now));
    setRuptures(await getUnrepairedRuptures(userId, now));
    const draft = await getResumableDraft(userId);
    setDraftId(draft?.id ?? null);
    setDraftStep(draft?.completedSteps ?? 0);
    const tally = await getRoleTally(userId);
    const total = tally.reduce((s, t) => s + t.count, 0);
    const top = tally.sort((a, b) => b.count - a.count)[0];
    setPattern(top && total >= 3 ? `${ownRoleLabel[top.role]} in ${top.count} of ${total} conflicts.` : null);
    setSurfacing(await runInterventionEvaluation(userId, now));
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const oldest = ruptures[0];
  const oldestDays = oldest ? Math.floor(oldest.ageHours / 24) : 0;

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text role="caption" color="textMuted">
          {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
        </Text>

        {/* Ratio hero */}
        <Card tone="accent">
          <Text role="caption" color="textMuted">
            Connection ratio · last 14 days
          </Text>
          {ratio ? (
            <>
              <Text role="display" color="accentText">
                {ratio.ratio.toFixed(1)} : 1
              </Text>
              <Text role="small" color="textMuted">
                {ratio.positiveCount} good · {ratio.conflictCount} hard · target 5:1
              </Text>
              <Button label="See the ratio" variant="ghost" onPress={() => router.push('/(tabs)/home/ratio')} />
            </>
          ) : (
            <Text role="body" color="textMuted">
              A little more logging and your ratio will show here. Log good moments too — that's the point.
            </Text>
          )}
        </Card>

        {surfacing ? <InterventionCard surfacing={surfacing} onDone={() => setSurfacing(null)} /> : null}

        {/* Unrepaired rupture — highest priority slot */}
        {oldest ? (
          <Card tone="attention">
            <Text role="caption" color="textMuted">
              Needs attention
            </Text>
            <Text role="body">
              An argument is still unrepaired
              {oldestDays >= 1 ? ` (${oldestDays} ${oldestDays === 1 ? 'day' : 'days'})` : ''}.
            </Text>
            <Button
              label="Where are things now?"
              variant="secondary"
              onPress={() => router.push({ pathname: '/(tabs)/log/repair-followup', params: { id: oldest.conflictId } })}
            />
          </Card>
        ) : null}

        {/* Resume draft */}
        {draftId ? (
          <Card>
            <Text role="body">You have an entry in progress.</Text>
            <Button
              label="Continue your entry"
              variant="secondary"
              onPress={() =>
                router.push({ pathname: '/(tabs)/log/deep', params: { draftId, step: String(draftStep + 1) } })
              }
            />
          </Card>
        ) : null}

        {/* Today */}
        <Text role="heading">Today</Text>
        <Card>
          <Button
            label="Log one appreciation"
            variant="secondary"
            onPress={() => router.push('/(tabs)/log/positive')}
          />
          <Button
            label="Stress-reducing conversation"
            variant="ghost"
            onPress={() => router.push('/(tabs)/tools/rituals')}
          />
        </Card>

        {/* Pattern hint (suppressed when safety elevated) */}
        {pattern && !suppressImprovement ? (
          <Card>
            <Text role="caption" color="textMuted">
              Your pattern lately
            </Text>
            <Text role="body">{pattern}</Text>
          </Card>
        ) : null}
      </Screen>
      <Fab onPress={() => router.push('/(tabs)/log/picker')} />
    </View>
  );
}
