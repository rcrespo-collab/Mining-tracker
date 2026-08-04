/**
 * S-10 — Cooldown gate / self-soothe timer (rule R-01). The most important
 * friction in the product. The deep log is LOCKED until the 20-minute timer
 * completes or the user taps the single explicit override ("I'm calm enough"),
 * which records logged_while_flooded. Copy is verbatim; the timer breathes.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Screen, Text, Button, BreathingCircle } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';
import { COOLDOWN_MS, deepLogAccess } from '../../../src/lib/cooldown/gate';

const SCRIPT = "I'm too overwhelmed to keep going right now. I need twenty minutes. I will come back.";

function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Cooldown() {
  const theme = useTheme();
  const { conflictId } = useLocalSearchParams<{ conflictId: string }>();
  const startRef = useRef(Date.now());
  const [remaining, setRemaining] = useState(COOLDOWN_MS);
  const [overridden, setOverridden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(Math.max(0, COOLDOWN_MS - (Date.now() - startRef.current)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const timerCompleted = remaining <= 0;
  const access = deepLogAccess({ floodedAtQuickLog: true, timerCompleted, overridden });

  const copyScript = async () => {
    await Clipboard.setStringAsync(SCRIPT);
    setCopied(true);
  };

  const continueToDetails = () => {
    router.replace({
      pathname: '/(tabs)/log/deep',
      params: {
        draftId: conflictId ?? '',
        step: '1',
        floodedOverride: access.loggedWhileFlooded ? '1' : '0',
      },
    });
  };

  return (
    <Screen footer={
      <>
        <Button
          label={timerCompleted ? "I'm back" : 'Continue to details'}
          onPress={continueToDetails}
          disabled={!access.unlocked}
        />
        {!timerCompleted && !overridden ? (
          <Button label="I'm calm enough" variant="ghost" onPress={() => setOverridden(true)} />
        ) : null}
        <Button label="Not now" variant="ghost" onPress={() => router.replace('/(tabs)/log')} />
      </>
    }>
      <BreathingCircle label={formatRemaining(remaining)} />

      <Text role="body" color="textMuted">
        When your heart rate goes past about 100, you can't actually take in what your partner is saying.
        Nothing useful happens until your body settles. Twenty minutes is the minimum.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text role="caption" color="textMuted">
          Say this before you go
        </Text>
        <Text role="body">"{SCRIPT}"</Text>
        <Button label={copied ? 'Copied' : 'Copy'} variant="secondary" onPress={copyScript} />
      </View>

      <Text role="small" color="textMuted">
        Leaving without saying you'll return reads as abandonment. Saying it turns a walk-out into a break.
      </Text>
      <Text role="small" color="textMuted">
        Don't rehearse the argument in your head. That's what keeps you flooded.
      </Text>
    </Screen>
  );
}
