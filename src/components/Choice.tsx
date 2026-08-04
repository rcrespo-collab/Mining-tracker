/**
 * Single-select radio group and multi-select checklist, sharing one calm row
 * style with large touch targets. Options carry a value, a label, and optional
 * helper text. The selection indicator uses the accent, never red.
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export interface Option<T extends string> {
  value: T;
  label: string;
  help?: string;
}

function Row({
  selected,
  multi,
  label,
  help,
  onPress,
}: {
  selected: boolean;
  multi: boolean;
  label: string;
  help?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
        minHeight: 48,
        paddingVertical: theme.spacing.sm,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 24,
          height: 24,
          marginTop: 2,
          borderRadius: multi ? theme.radius.sm : 999,
          borderWidth: 2,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          backgroundColor: selected ? theme.colors.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: multi ? 10 : 8,
              height: multi ? 6 : 8,
              borderRadius: multi ? 1 : 999,
              backgroundColor: theme.colors.onAccent,
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text role="body">{label}</Text>
        {help ? (
          <Text role="small" color="textMuted">
            {help}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <View>
      {options.map((o) => (
        <Row
          key={o.value}
          multi={false}
          selected={value === o.value}
          label={o.label}
          help={o.help}
          onPress={() => onChange(o.value)}
        />
      ))}
    </View>
  );
}

export function Checklist<T extends string>({
  options,
  values,
  onChange,
  exclusive,
}: {
  options: Option<T>[];
  values: T[];
  onChange: (v: T[]) => void;
  /** A value (e.g. "none") that clears all others when selected. */
  exclusive?: T;
}) {
  const toggle = (v: T) => {
    if (exclusive && v === exclusive) {
      onChange(values.includes(v) ? [] : [v]);
      return;
    }
    const next = values.includes(v) ? values.filter((x) => x !== v) : [...values, v];
    onChange(exclusive ? next.filter((x) => x !== exclusive) : next);
  };
  return (
    <View>
      {options.map((o) => (
        <Row
          key={o.value}
          multi
          selected={values.includes(o.value)}
          label={o.label}
          help={o.help}
          onPress={() => toggle(o.value)}
        />
      ))}
    </View>
  );
}
