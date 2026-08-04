/**
 * Chip toggles for low-friction tagging (surface topic in S-09, positive type
 * in S-19). Single- or multi-select. Selected chips fill with the soft accent.
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export interface Chip<T extends string> {
  value: T;
  label: string;
}

export function ChipGroup<T extends string>({
  chips,
  selected,
  onToggle,
  multi = false,
}: {
  chips: Chip<T>[];
  selected: T[];
  onToggle: (v: T) => void;
  multi?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
      {chips.map((c) => {
        const isOn = selected.includes(c.value);
        return (
          <Pressable
            key={c.value}
            accessibilityRole={multi ? 'checkbox' : 'radio'}
            accessibilityState={{ selected: isOn }}
            accessibilityLabel={c.label}
            onPress={() => onToggle(c.value)}
            style={({ pressed }) => ({
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.pill,
              borderWidth: 1,
              minHeight: 44,
              justifyContent: 'center',
              borderColor: isOn ? theme.colors.accent : theme.colors.border,
              backgroundColor: isOn ? theme.colors.accentSoft : theme.colors.surface,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text role="small" color={isOn ? 'accentText' : 'text'}>
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
