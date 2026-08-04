/**
 * Labelled text input and a section label. Body ≥16pt, calm focus ring in the
 * accent colour (never red).
 */
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function FieldLabel({ children, help }: { children: string; help?: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 2, marginBottom: theme.spacing.xs }}>
      <Text role="heading">{children}</Text>
      {help ? (
        <Text role="small" color="textMuted">
          {help}
        </Text>
      ) : null}
    </View>
  );
}

export function TextField({
  value,
  onChangeText,
  placeholder,
  multiline,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textFaint}
      multiline={multiline}
      accessibilityLabel={accessibilityLabel ?? placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        minHeight: multiline ? 96 : 52,
        borderWidth: 1.5,
        borderColor: focused ? theme.colors.accent : theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        color: theme.colors.text,
        fontSize: theme.type.body.size,
        lineHeight: theme.type.body.lineHeight,
        textAlignVertical: multiline ? 'top' : 'center',
        backgroundColor: theme.colors.surface,
      }}
    />
  );
}
