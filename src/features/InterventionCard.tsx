/**
 * Renders an intervention surfacing as a single calm card (§8). Navigates to the
 * relevant screen when there is one, or acts as an inline reframe (R-18) with a
 * dismiss. Never alarming; warm tone, no red.
 */
import React from 'react';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import type { ActiveSurfacing } from './interventionRunner';

export function InterventionCard({
  surfacing,
  onDone,
}: {
  surfacing: ActiveSurfacing;
  onDone: () => void;
}) {
  return (
    <Card tone="surface">
      <Text role="heading">{surfacing.title}</Text>
      <Text role="body" color="textMuted">
        {surfacing.body}
      </Text>
      <Button
        label={surfacing.cta}
        variant={surfacing.route ? 'primary' : 'secondary'}
        onPress={() => {
          if (surfacing.route) router.push(surfacing.route as never);
          onDone();
        }}
      />
    </Card>
  );
}
