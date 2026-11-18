import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';
import { type IoniconName } from './IconButton';

interface PillProps {
  label: string;
  onPress?: () => void;
  icon?: IoniconName;
  selected?: boolean;
  disabled?: boolean;
  tone?: 'neutral' | 'primary' | 'gold';
  style?: ViewStyle;
}

export function Pill({
  label,
  onPress,
  icon,
  selected = false,
  disabled = false,
  tone = 'neutral',
  style,
}: PillProps) {
  const theme = useAppTheme();

  const baseTone = tone === 'gold' ? theme.colors.goldSoft : theme.colors.surface;
  const activeTone = tone === 'gold' ? theme.colors.gold : theme.colors.primary;

  const backgroundColor = selected ? activeTone : baseTone;
  const borderColor = selected
    ? activeTone
    : tone === 'gold'
      ? theme.colors.goldSoft
      : theme.colors.border;
  const contentColor = selected
    ? tone === 'gold'
      ? theme.colors.text
      : theme.colors.onPrimary
    : tone === 'gold'
      ? theme.colors.goldText
      : theme.colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderRadius: theme.radii.pill,
          opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
        },
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={contentColor}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <AppText variant="label" color={contentColor} style={{ fontSize: 12 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
