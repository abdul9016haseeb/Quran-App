import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

interface ScreenProps {
  children: React.ReactNode;
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

/**
 * Safe-area aware page background. Screens that draw a green header behind
 * the status bar pass `edges={[]}` and handle insets themselves.
 */
export function Screen({
  children,
  edges = ['top', 'left', 'right'],
  style,
  backgroundColor,
}: ScreenProps) {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          flex: 1,
          backgroundColor: backgroundColor ?? theme.colors.background,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
