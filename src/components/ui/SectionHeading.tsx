import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';

interface SectionHeadingProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export function SectionHeading({
  title,
  actionLabel,
  onActionPress,
  style,
}: SectionHeadingProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          hitSlop={8}
        >
          <AppText
            variant="label"
            color={theme.colors.primary}
            style={{ fontSize: 12 }}
          >
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
});
