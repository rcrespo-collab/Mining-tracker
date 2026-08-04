/**
 * S-21 — Timeline. Chronological ONLY. No sort-by-severity, no "worst fights",
 * no partner-behaviour filter — by design. Conflicts show topic → hidden issue
 * and whether they were repaired; positives show their note.
 */
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Screen, Text, Card } from '../../../src/components';
import { Fab } from '../../../src/features/Fab';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import { getTimeline, type TimelineItem } from '../../../src/db/repositories/reads';
import { surfaceTopicLabel, hiddenIssueLabel, positiveTypeLabel } from '../../../src/copy/labels';

function ConflictRow({ item }: { item: Extract<TimelineItem, { kind: 'conflict' }> }) {
  const theme = useTheme();
  const topic = item.surfaceTopic ? surfaceTopicLabel[item.surfaceTopic] : 'A difficult moment';
  const hidden = item.hiddenIssue ? ` → ${hiddenIssueLabel[item.hiddenIssue].split(' —')[0]}` : '';
  return (
    <Card onPress={() => router.push({ pathname: '/(tabs)/log/entry/[id]', params: { id: item.id } })}>
      <Text role="body">
        {topic}
        {hidden}
      </Text>
      <Text role="small" color="textMuted">
        {item.occurredAt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
        {' · '}
        {item.reconnected ? 'repaired' : 'unrepaired'}
      </Text>
    </Card>
  );
}

function PositiveRow({ item }: { item: Extract<TimelineItem, { kind: 'positive' }> }) {
  return (
    <Card tone="accent">
      <Text role="body">{item.note?.trim() || positiveTypeLabel[item.type]}</Text>
      <Text role="small" color="textMuted">
        {positiveTypeLabel[item.type]} ·{' '}
        {item.occurredAt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
      </Text>
    </Card>
  );
}

export default function Timeline() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const [items, setItems] = useState<TimelineItem[]>([]);

  const load = useCallback(async () => {
    if (userId) setItems(await getTimeline(userId));
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text role="title">Timeline</Text>
        {items.length === 0 ? (
          <Card>
            <Text role="body" color="textMuted">
              Nothing here yet. Tap the plus to log something — good moments count too.
            </Text>
          </Card>
        ) : (
          items.map((item) =>
            item.kind === 'conflict' ? (
              <ConflictRow key={item.id} item={item} />
            ) : (
              <PositiveRow key={item.id} item={item} />
            ),
          )
        )}
        <Text role="small" color="textFaint" style={{ marginTop: theme.spacing.md }}>
          Timeline is chronological only. There's no "worst fights" view, by design.
        </Text>
      </Screen>
      <Fab onPress={() => router.push('/(tabs)/log/picker')} />
    </View>
  );
}
