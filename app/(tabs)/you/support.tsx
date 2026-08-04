/**
 * S-35 — Support & crisis resources. Reachable from the You tab and auto-surfaced
 * by the safety protocol (§9). Non-directive, non-labelling — never uses the word
 * "abuse" and never labels the user's situation. Not listed by default on other
 * screens so the app looks ordinary.
 *
 * ⚠️ The specific hotline numbers/links are intentionally left as clearly-marked
 * placeholders (see PLAN.md §12). They MUST be populated with verified,
 * region-correct resources before release — Claude will not hard-code emergency
 * numbers it cannot verify.
 */
import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';

export default function Support() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Getting more help' }} />
      <Screen>
        <Text role="body" color="textMuted">
          This app can help you notice patterns. It can't do what a person can.
        </Text>

        <Card>
          <Text role="heading">Worth talking to someone if</Text>
          <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
            <Text role="body" color="textMuted">· contempt keeps showing up</Text>
            <Text role="body" color="textMuted">· the same fight for months</Text>
            <Text role="body" color="textMuted">· you feel afraid</Text>
            <Text role="body" color="textMuted">· one of you has checked out</Text>
          </View>
        </Card>

        <Card>
          <Text role="heading">Talk to someone</Text>
          <Text role="body" color="textMuted">
            A couples therapist, or a therapist just for you, can help with things an app can't.
          </Text>
          {/* PLACEHOLDER — replace with verified, region-appropriate directories. */}
          <Text role="small" color="textFaint">
            [ Add verified local therapist directories here before release. ]
          </Text>
        </Card>

        <Card tone="attention">
          <Text role="heading">If you're in danger or in crisis right now</Text>
          <Text role="body" color="textMuted">
            There are people who work specifically with this, any time.
          </Text>
          {/* PLACEHOLDER — must be verified, region-correct emergency & support lines. */}
          <Text role="small" color="textFaint">
            [ Add verified local emergency numbers and domestic-support lines here before release. ]
          </Text>
        </Card>

        <Text role="small" color="textFaint">
          We don't list these by default on other screens, so the app looks ordinary to anyone glancing at
          your phone.
        </Text>
      </Screen>
    </>
  );
}
