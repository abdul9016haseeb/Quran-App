import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

export function Divider({ style }: { style?: ViewStyle }) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: theme.colors.divider },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
