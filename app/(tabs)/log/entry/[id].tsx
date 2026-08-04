/**
 * S-22 — Entry detail. Shows the decrypted entry: topic → hidden issue, own
 * behaviour and antidotes, the cycle (own role, primary emotion, attachment
 * need), and repair status. Never shows severity. If the entry was logged while
 * flooded (R-14), a gentle revisit note appears.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Screen, Text, Card, Button } from '../../../../src/components';
import { useTheme } from '../../../../src/design/theme';
import { getConflictDetail, type ConflictDetail } from '../../../../src/db/repositories/conflicts';
import {
  surfaceTopicLabel,
  hiddenIssueLabel,
  horsemanLabel,
  antidoteLabel,
  ownRoleLabel,
  primaryEmotionLabel,
  attachmentNeedLabel,
  resolutionLabel,
} from '../../../../src/copy/labels';

export default function EntryDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [detail, setDetail] = useState<ConflictDetail | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (id) setDetail(await getConflictDetail(id));
      })();
    }, [id]),
  );

  if (!detail) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: 'Entry' }} />
        <Screen>
          <Text role="body" color="textMuted">
            Loading…
          </Text>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Entry' }} />
      <Screen>
        <Text role="caption" color="textMuted">
          {detail.occurredAt.toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>

        {detail.loggedWhileFlooded ? (
          <Card tone="attention">
            <Text role="body">
              You logged this while overwhelmed. It can help to look again now, with fresh eyes.
            </Text>
          </Card>
        ) : null}

        {detail.surfaceTopic ? (
          <Text role="title">
            {surfaceTopicLabel[detail.surfaceTopic]}
            {detail.hiddenIssue ? ` → ${hiddenIssueLabel[detail.hiddenIssue].split(' —')[0]}` : ''}
          </Text>
        ) : (
          <Text role="title">A difficult moment</Text>
        )}

        {detail.ownRole || detail.primaryEmotion || detail.attachmentNeed ? (
          <Card>
            {detail.ownRole ? <Text role="body">{ownRoleLabel[detail.ownRole]}</Text> : null}
            {detail.primaryEmotion ? (
              <Text role="body" color="textMuted">
                Underneath, you felt {primaryEmotionLabel[detail.primaryEmotion].toLowerCase()}.
              </Text>
            ) : null}
            {detail.attachmentNeed ? (
              <Text role="body" color="textMuted">
                You needed to know: {attachmentNeedLabel[detail.attachmentNeed].toLowerCase()}
              </Text>
            ) : null}
          </Card>
        ) : null}

        {detail.horsemen.filter((h) => h !== 'none').length > 0 ? (
          <Card>
            <Text role="caption" color="textMuted">
              What showed up in how I handled it
            </Text>
            {detail.horsemen
              .filter((h) => h !== 'none')
              .map((h) => (
                <Text key={h} role="body">
                  {horsemanLabel[h].label}
                </Text>
              ))}
          </Card>
        ) : null}

        {detail.antidotes.filter((a) => a !== 'none').length > 0 ? (
          <Card tone="accent">
            <Text role="caption" color="textMuted">
              What helped
            </Text>
            {detail.antidotes
              .filter((a) => a !== 'none')
              .map((a) => (
                <Text key={a} role="body">
                  {antidoteLabel[a]}
                </Text>
              ))}
          </Card>
        ) : null}

        {detail.ownContribution ? (
          <Card>
            <Text role="caption" color="textMuted">
              My share of it
            </Text>
            <Text role="body">{detail.ownContribution}</Text>
          </Card>
        ) : null}

        <Text role="body" color="textMuted">
          {detail.resolution ? resolutionLabel[detail.resolution] : detail.reconnected ? 'Reconnected.' : 'Still open.'}
        </Text>

        {!detail.reconnected ? (
          <Button
            label="Where are things now?"
            variant="secondary"
            onPress={() => router.push({ pathname: '/(tabs)/log/repair-followup', params: { id: detail.id } })}
          />
        ) : null}
      </Screen>
    </>
  );
}
