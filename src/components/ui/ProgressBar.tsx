import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
}

export function ProgressBar({
  value,
  height = 4,
  color,
  trackColor,
}: ProgressBarProps) {
  const theme = useAppTheme();
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor ?? theme.colors.surfaceMuted,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height,
          borderRadius: height / 2,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
}
