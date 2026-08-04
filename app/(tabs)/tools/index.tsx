/**
 * S-27 — Tools home. Phase 1: softened start-up rewriter (S-29), rituals (S-31),
 * a self-soothe timer, and a route to support (S-35). Aftermath (S-28) and
 * Dreams (S-30) are Phase 2.
 */
import React from 'react';
import { router } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';

export default function Tools() {
  return (
    <Screen>
      <Text role="title">Tools</Text>

      <Card onPress={() => router.push('/(tabs)/tools/softened-startup')}>
        <Text role="heading">Say it so it can be heard</Text>
        <Text role="small" color="textMuted">
          Turn a hard opener into something that can land
        </Text>
      </Card>

      <Card onPress={() => router.push('/(tabs)/tools/rituals')}>
        <Text role="heading">Rituals</Text>
        <Text role="small" color="textMuted">
          Small, repeatable ways to stay connected
        </Text>
      </Card>

      <Card onPress={() => router.push('/(tabs)/tools/self-soothe')}>
        <Text role="heading">Self-soothe</Text>
        <Text role="small" color="textMuted">
          A few slow minutes when things get heated
        </Text>
      </Card>

      <Card onPress={() => router.push('/(tabs)/you/support')}>
        <Text role="heading">Getting more help</Text>
        <Text role="small" color="textMuted">
          When it's bigger than an app
        </Text>
      </Card>
    </Screen>
  );
}
