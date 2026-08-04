/**
 * The cooldown timer's breathing circle (S-10). Slow, calm expansion and
 * contraction — "the cooldown timer should breathe." Respects reduced-motion by
 * holding still. Never bouncy.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, AccessibilityInfo } from 'react-native';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function BreathingCircle({ label }: { label: string }) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled || reduced) return;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: theme.motion.breath,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: theme.motion.breath,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    });
    return () => {
      cancelled = true;
    };
  }, [scale, theme.motion.breath]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.lg }}>
      <Animated.View
        style={{
          width: 220,
          height: 220,
          borderRadius: 999,
          backgroundColor: theme.colors.accentSoft,
          borderWidth: 2,
          borderColor: theme.colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
        }}
      >
        <Text role="display" color="accentText">
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}
