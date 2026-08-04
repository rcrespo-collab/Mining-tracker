/**
 * A standalone self-soothe timer, available any time from Tools (not gated to a
 * conflict). The breathing circle and the same twenty-minute rhythm as S-10,
 * without any logging.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Stack, router } from 'expo-router';
import { Screen, Text, Button, BreathingCircle } from '../../../src/components';
import { COOLDOWN_MS } from '../../../src/lib/cooldown/gate';

function fmt(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function SelfSoothe() {
  const start = useRef(Date.now());
  const [remaining, setRemaining] = useState(COOLDOWN_MS);

  useEffect(() => {
    const t = setInterval(() => setRemaining(Math.max(0, COOLDOWN_MS - (Date.now() - start.current))), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Self-soothe' }} />
      <Screen footer={<Button label="Done" variant="secondary" onPress={() => router.back()} />}>
        <BreathingCircle label={fmt(remaining)} />
        <Text role="body" color="textMuted">
          Slow, even breaths. Nothing to fix right now. Let your body settle first.
        </Text>
      </Screen>
    </>
  );
}
