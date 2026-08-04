/**
 * The five-tab bar (§4.1): Home · Log · Patterns · Tools · You. Calm, label-led,
 * with a small accent dot marking the active tab. No badges, no counts.
 */
import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/design/theme';

function Dot({ active }: { active: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        marginBottom: 2,
        backgroundColor: active ? theme.colors.accent : 'transparent',
      }}
    />
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accentText,
        tabBarInactiveTintColor: theme.colors.textFaint,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <Dot active={focused} /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Log', tabBarIcon: ({ focused }) => <Dot active={focused} /> }}
      />
      <Tabs.Screen
        name="patterns"
        options={{ title: 'Patterns', tabBarIcon: ({ focused }) => <Dot active={focused} /> }}
      />
      <Tabs.Screen
        name="tools"
        options={{ title: 'Tools', tabBarIcon: ({ focused }) => <Dot active={focused} /> }}
      />
      <Tabs.Screen
        name="you"
        options={{ title: 'You', tabBarIcon: ({ focused }) => <Dot active={focused} /> }}
      />
    </Tabs>
  );
}
