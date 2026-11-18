import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type IconButtonVariant = 'plain' | 'soft' | 'onGreen' | 'gold' | 'danger';

interface IconButtonProps {
  name: IoniconName;
  label: string;
  onPress: () => void;
  size?: number;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizes = {
  sm: 34,
  md: 40,
  lg: 46,
} as const;

export function IconButton({
  name,
  label,
  onPress,
  size = 20,
  variant = 'plain',
  disabled = false,
  style,
}: IconButtonProps) {
  const theme = useAppTheme();
  const dimension = size >= 22 ? sizes.lg : sizes.md;

  const palette = {
    plain: {
      background: 'transparent',
      color: theme.colors.textSecondary,
    },
    soft: {
      background: theme.colors.surfaceMuted,
      color: theme.colors.text,
    },
    onGreen: {
      background: theme.colors.headerAction,
      color: theme.colors.headerText,
    },
    gold: {
      background: theme.colors.goldSoft,
      color: theme.colors.goldText,
    },
    danger: {
      background: theme.colors.dangerSoft,
      color: theme.colors.danger,
    },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: palette.background,
          opacity: disabled ? 0.4 : pressed ? 0.68 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={palette.color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
