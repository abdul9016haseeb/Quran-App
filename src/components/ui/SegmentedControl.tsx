import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useAppTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: theme.radii.pill,
          padding: 4,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected, disabled: option.disabled }}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
            style={[
              styles.item,
              {
                backgroundColor: selected
                  ? theme.colors.primary
                  : 'transparent',
                borderRadius: theme.radii.pill,
                opacity: option.disabled ? 0.45 : 1,
              },
            ]}
          >
            <AppText
              variant="label"
              color={
                selected ? theme.colors.onPrimary : theme.colors.textSecondary
              }
              numberOfLines={1}
              style={{ fontSize: 12 }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    minHeight: 34,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
