/**
 * S-34 — Privacy & data. States the Phase-1 guarantees plainly, and offers
 * immediate, complete deletion. There is NO export in any format (non-negotiable
 * #2): the app exposes deletion, never extraction.
 */
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Screen, Text, Card, Button } from '../../../src/components';
import { useTheme } from '../../../src/design/theme';
import { deleteAllData } from '../../../src/db/repositories/data';

export default function Privacy() {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);

  const confirmDelete = () => {
    Alert.alert(
      'Delete everything?',
      'This removes all of your entries from this device, right away. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            await deleteAllData();
            router.replace('/onboarding/welcome');
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Privacy & data' }} />
      <Screen>
        <Card>
          <Text role="heading">Where your data lives</Text>
          <Text role="body" color="textMuted">
            Everything stays on this device. This app makes no network connections and has no account.
            Your entries are encrypted on the device.
          </Text>
        </Card>

        <Card>
          <Text role="heading">What this app will never do</Text>
          <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
            <Text role="body" color="textMuted">· Sell your data. Ever.</Text>
            <Text role="body" color="textMuted">· Export a record of your entries.</Text>
            <Text role="body" color="textMuted">· Rate or score your partner.</Text>
            <Text role="body" color="textMuted">· Count conflict-free days or nudge you with guilt.</Text>
          </View>
        </Card>

        <Card>
          <Text role="heading">Delete everything</Text>
          <Text role="body" color="textMuted">
            You can remove all of your data at any time. It's immediate and complete.
          </Text>
          <Button label="Delete all my data" variant="secondary" onPress={confirmDelete} loading={busy} />
        </Card>
      </Screen>
    </>
  );
}
