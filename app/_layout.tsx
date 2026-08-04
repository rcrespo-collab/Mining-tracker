/**
 * Root layout: initialise the local database, apply the theme, run the
 * PIN/biometric gate, and route to onboarding until it is complete.
 *
 * Nothing here touches the network — the app is fully offline.
 */
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/design/theme';
import { initDatabase } from '../src/db/client';
import { getCurrentUser, getCurrentRelationship } from '../src/db/repositories/onboarding';
import { useSessionStore } from '../src/stores/sessionStore';
import { useSettingsStore } from '../src/stores/settingsStore';
import { AppLock } from '../src/features/AppLock';

function Boot({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const setIdentity = useSessionStore((s) => s.setIdentity);
  const setSafety = useSessionStore((s) => s.setSafety);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    let active = true;
    (async () => {
      await initDatabase();
      const user = await getCurrentUser();
      if (user) {
        const rel = await getCurrentRelationship(user.id);
        if (rel) setIdentity({ userId: user.id, relationshipId: rel.id });
        setSafety({
          flag: user.safetyFlag,
          suppressImprovementCopy: user.safetyFlag === 'elevated',
        });
        hydrateSettings({ pinEnabled: user.pinEnabled, discreetMode: user.discreetMode });
      }
      if (!active) return;
      setReady(true);
      if (!user || user.onboardingStage !== 'complete') {
        router.replace('/onboarding/welcome');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Boot>
            <AppLock>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="quick-exit" options={{ animation: 'fade' }} />
              </Stack>
            </AppLock>
          </Boot>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
