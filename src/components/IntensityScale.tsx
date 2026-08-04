/**
 * A row of selectable dots for capturing per-entry intensity (S-09/S-13 peak
 * intensity 1–5; positive intensity 1–3). This is entry input, not a ranking of
 * conflicts — the timeline never sorts by it, and composite severity is never
 * shown. Colour is the calm accent, never red.
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function IntensityScale({
  count = 5,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  count?: number;
  value: number | null;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
          const on = value != null && n <= value;
          return (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Intensity ${n} of ${count}`}
              onPress={() => onChange(n)}
              hitSlop={10}
              style={{ padding: theme.spacing.xs }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: on ? theme.colors.accent : theme.colors.border,
                  backgroundColor: on ? theme.colors.accent : 'transparent',
                }}
              />
            </Pressable>
          );
        })}
      </View>
      {lowLabel || highLabel ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text role="caption" color="textMuted">
            {lowLabel ?? ''}
          </Text>
          <Text role="caption" color="textMuted">
            {highLabel ?? ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
