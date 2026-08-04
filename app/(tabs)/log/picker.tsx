/**
 * S-08 — Log picker. "Something good" is listed FIRST and is the lowest-friction
 * path. This ordering is deliberate and is never A/B tested toward conflict-first.
 */
import React from 'react';
import { router } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';

export default function Picker() {
  const theme = useTheme();
  const go = (path: string) => {
    router.back();
    router.push(path as never);
  };
  return (
    <Screen>
      <Text role="title">What do you want to log?</Text>

      <Card tone="accent" onPress={() => go('/(tabs)/log/positive')}>
        <Text role="heading">Something good</Text>
        <Text role="small" color="textMuted">
          15 seconds
        </Text>
      </Card>

      <Card onPress={() => go('/(tabs)/log/quick')}>
        <Text role="heading">A difficult moment</Text>
        <Text role="small" color="textMuted">
          quick now, details later
        </Text>
      </Card>

      <Card onPress={() => go('/(tabs)/log/repair-followup')}>
        <Text role="heading">A repair</Text>
        <Text role="small" color="textMuted">
          something that helped
        </Text>
      </Card>
    </Screen>
  );
}
