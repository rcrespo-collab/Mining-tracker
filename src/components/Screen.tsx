/**
 * Screen scaffold: safe-area, warm background, generous single-column padding,
 * optional scroll, and an optional persistent quick-exit control at the foot.
 * One decision per screen — content stays in a single narrow column.
 */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../design/theme';
import { QuickExitButton } from './QuickExitButton';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  quickExit?: boolean;
  /** Footer pinned below the content (e.g. primary action). */
  footer?: React.ReactNode;
}

export function Screen({ children, scroll = true, quickExit = false, footer }: ScreenProps) {
  const theme = useTheme();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: { padding: theme.spacing.lg, gap: theme.spacing.md, flexGrow: 1 } }
    : { style: { flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md } };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <Body {...(bodyProps as object)}>{children}</Body>
      {footer ? (
        <View style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm, gap: theme.spacing.sm }}>
          {footer}
        </View>
      ) : null}
      {quickExit ? (
        <View style={{ paddingBottom: theme.spacing.md }}>
          <QuickExitButton />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
