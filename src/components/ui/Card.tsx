import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
  tone?: 'default' | 'muted' | 'accent' | 'gold' | 'primary';
}

/** Base surface used by nearly every grouping in the app. */
export function Card({
  children,
  style,
  padded = true,
  elevated = false,
  tone = 'default',
}: CardProps) {
  const theme = useAppTheme();

  const backgroundColor = {
    default: theme.colors.surface,
    muted: theme.colors.surfaceMuted,
    accent: theme.colors.surfaceAccent,
    gold: theme.colors.goldSoft,
    primary: theme.colors.primary,
  }[tone];

  const borderColor =
    tone === 'default' ? theme.colors.border : 'transparent';

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: theme.radii.lg,
          borderWidth: tone === 'default' ? 1 : 0,
          borderColor,
          padding: padded ? theme.spacing.lg : 0,
        },
        elevated ? theme.shadows.card : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
