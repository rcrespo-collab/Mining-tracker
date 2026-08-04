/**
 * Small, calm charts built directly on react-native-svg (offline, reliable).
 * A sparkline for trends (S-07, S-26) and a labelled bar row for breakdowns.
 * Colours are the accent; never red, never severity-coded.
 *
 * (victory-native is available in the stack for richer Phase-2 charts; Phase 1
 * uses these lightweight primitives — decision D15.)
 */
import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Line, Rect } from 'react-native-svg';
import { useTheme } from '../design/theme';
import { Text } from './Text';

export function Sparkline({
  values,
  benchmark,
  height = 64,
  width = 280,
}: {
  values: number[];
  benchmark?: number;
  height?: number;
  width?: number;
}) {
  const theme = useTheme();
  if (values.length < 2) {
    return (
      <Text role="small" color="textMuted">
        Not enough yet to draw a line.
      </Text>
    );
  }
  const max = Math.max(...values, benchmark ?? -Infinity);
  const min = Math.min(...values, benchmark ?? Infinity);
  const span = max - min || 1;
  const x = (i: number) => (i / (values.length - 1)) * width;
  const y = (v: number) => height - ((v - min) / span) * height;
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <Svg width={width} height={height}>
      {benchmark != null ? (
        <Line
          x1={0}
          y1={y(benchmark)}
          x2={width}
          y2={y(benchmark)}
          stroke={theme.colors.border}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      ) : null}
      <Polyline
        points={points}
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const theme = useTheme();
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text role="small">{label}</Text>
        <Text role="small" color="textMuted">
          {value}
        </Text>
      </View>
      <Svg width="100%" height={10}>
        <Rect x={0} y={0} width="100%" height={10} rx={5} fill={theme.colors.surfaceAlt} />
        <Rect x={0} y={0} width={`${pct}%`} height={10} rx={5} fill={theme.colors.accent} />
      </Svg>
    </View>
  );
}
