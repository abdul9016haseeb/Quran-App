import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';

interface SampleBadgeProps {
  label?: string;
  style?: ViewStyle;
}

/**
 * Visible marker required while the app displays placeholder content.
 * Do not use this badge to decorate real, verified data.
 */
export function SampleBadge({ label = 'மாதிரி', style }: SampleBadgeProps) {
  const theme = useAppTheme();

  return (
    <View
      accessibilityLabel={`${label} தரவு`}
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.goldSoft,
          borderRadius: theme.radii.xs,
        },
        style,
      ]}
    >
      <Ionicons
        name="flask-outline"
        size={11}
        color={theme.colors.goldText}
        style={{ marginRight: 4 }}
      />
      <AppText
        variant="label"
        color={theme.colors.goldText}
        style={{ fontSize: 10, letterSpacing: 0.2 }}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});
