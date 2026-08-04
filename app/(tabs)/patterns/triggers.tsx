/**
 * S-24 — Trigger insights. Uses computeTriggerAssociations (§7.5): nothing is
 * surfaced below n=8 conflicts, lift 1.5, and 3 occurrences. Every insight
 * carries the association caveat. Ordering is by prevalence, never by severity.
 *
 * Baseline probabilities in v1 are a conservative default estimate per flag
 * (decision D16); ambient day-level check-ins (Phase 2) will replace them.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { BarRow } from '../../../src/components/charts';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { computeTriggerAssociations, type TriggerAssociation } from '../../../src/lib/metrics';
import { getTriggerInputs } from '../../../src/db/repositories/reads';
import { vulnerabilityLabel } from '../../../src/copy/labels';
import type { Vulnerability } from '../../../src/db/enums';

// Conservative v1 baseline: rough share of ordinary days each condition is true.
const DEFAULT_BASELINE: Partial<Record<Vulnerability, number>> = {
  low_sleep: 0.2,
  alcohol: 0.1,
  substance: 0.05,
  work_stress: 0.3,
  money_pressure: 0.2,
  illness_pain: 0.1,
  inlaws_family: 0.1,
  parenting_load: 0.3,
  travel_reentry: 0.05,
  prolonged_distance: 0.1,
  hormonal_cycle: 0.15,
};

export default function Triggers() {
  const userId = useSessionStore((s) => s.userId);
  const [associations, setAssociations] = useState<TriggerAssociation[]>([]);
  const [conflictCount, setConflictCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!userId) return;
        const conflicts = await getTriggerInputs(userId);
        setConflictCount(conflicts.length);
        setAssociations(computeTriggerAssociations(conflicts, DEFAULT_BASELINE));
      })();
    }, [userId]),
  );

  const maxCount = associations.reduce((m, a) => Math.max(m, a.conflictCount), 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'What sets it off' }} />
      <Screen>
        <Text role="caption" color="textMuted">
          Based on {conflictCount} conflicts
        </Text>

        {associations.length === 0 ? (
          <Card>
            <Text role="body" color="textMuted">
              Not enough yet to say anything responsibly. Insights appear once there's a real pattern to
              stand on — not before.
            </Text>
          </Card>
        ) : (
          <>
            <Text role="heading">Strongest signals</Text>
            {associations.map((a) => (
              <View key={a.flag} style={{ gap: 4 }}>
                <BarRow label={vulnerabilityLabel[a.flag]} value={a.conflictCount} max={maxCount} />
                <Text role="caption" color="textMuted">
                  present in {Math.round(a.conflictRate * 100)}% of conflicts
                </Text>
              </View>
            ))}
            <Text role="small" color="textFaint">
              Association, not proof — small sample.
            </Text>
          </>
        )}
      </Screen>
    </>
  );
}
