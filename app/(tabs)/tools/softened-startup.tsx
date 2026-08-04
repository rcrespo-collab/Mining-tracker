/**
 * S-29 — Softened start-up rewriter. Builds "I feel ___ about ___ and I need
 * ___." from three fields and copies it to the clipboard (the clipboard is one
 * of the only two outbound paths in Phase 1). Describe, don't judge; situation,
 * not character; ask for what you want.
 */
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Screen, Text, Button, FieldLabel, TextField } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';

export default function SoftenedStartup() {
  const theme = useTheme();
  const [feel, setFeel] = useState('');
  const [about, setAbout] = useState('');
  const [need, setNeed] = useState('');
  const [copied, setCopied] = useState(false);

  const sentence = useMemo(
    () => `I feel ${feel.trim() || '___'} about ${about.trim() || '___'} and I need ${need.trim() || '___'}.`,
    [feel, about, need],
  );
  const ready = feel.trim() && about.trim() && need.trim();

  const copy = async () => {
    await Clipboard.setStringAsync(sentence);
    setCopied(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Say it so it can be heard' }} />
      <Screen footer={<Button label={copied ? 'Copied' : 'Copy'} onPress={copy} disabled={!ready} />}>
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel>I feel</FieldLabel>
          <TextField value={feel} onChangeText={setFeel} placeholder="overwhelmed" />
          <FieldLabel>about</FieldLabel>
          <TextField value={about} onChangeText={setAbout} placeholder="how the evening jobs are landing on me" multiline />
          <FieldLabel>and I need</FieldLabel>
          <TextField value={need} onChangeText={setNeed} placeholder="us to split bedtime this week" multiline />
        </View>

        <View
          style={{
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.accentSoft,
          }}
        >
          <Text role="body" color="accentText">
            {sentence}
          </Text>
        </View>

        <Text role="small" color="textMuted">
          Three rules: describe, don't judge. Talk about the situation, not their character. Ask for what
          you want, not what you don't.
        </Text>
        <Text role="small" color="textFaint">
          Conversations tend to end the way they start.
        </Text>
      </Screen>
    </>
  );
}
