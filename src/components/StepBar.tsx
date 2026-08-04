/**
 * Deep-log step progress (Step N of 7). A quiet filled bar plus a text label —
 * no numbers-as-score, just orientation through the flow.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function StepBar({ step, total, title }: { step: number; total: number; title: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text role="caption" color="textMuted">
          {title}
        </Text>
        <Text role="caption" color="textMuted">
          Step {step} of {total}
        </Text>
      </View>
      <View
        style={{
          height: 6,
          borderRadius: 999,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${Math.round((step / total) * 100)}%`,
            height: '100%',
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>
    </View>
  );
}
