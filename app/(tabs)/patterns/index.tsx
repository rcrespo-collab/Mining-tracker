/**
 * Patterns tab landing (§4.1). In Phase 1: what sets it off (S-24) and trends
 * over time (S-26). The cycle map (S-23) and perpetual issues (S-25) are Phase 2.
 */
import React from 'react';
import { router } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';

export default function Patterns() {
  return (
    <Screen>
      <Text role="title">Patterns</Text>

      <Card onPress={() => router.push('/(tabs)/patterns/triggers')}>
        <Text role="heading">What sets it off</Text>
        <Text role="small" color="textMuted">
          The conditions that show up around hard moments
        </Text>
      </Card>

      <Card onPress={() => router.push('/(tabs)/patterns/trends')}>
        <Text role="heading">Over time</Text>
        <Text role="small" color="textMuted">
          Time to repair, connection, and repair landing
        </Text>
      </Card>

      <Text role="small" color="textFaint">
        More — your cycle and recurring themes — is coming.
      </Text>
    </Screen>
  );
}
