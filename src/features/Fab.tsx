/**
 * The log FAB (+). Opens the log picker (S-08). Calm, accent-filled, large
 * target — the primary way to add anything.
 */
import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from '../components/Text';

export function Fab({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log something"
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute',
        right: theme.spacing.lg,
        bottom: theme.spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.9 : 1,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      })}
    >
      <Text role="title" color="onAccent" style={{ lineHeight: 30 }}>
        +
      </Text>
    </Pressable>
  );
}
