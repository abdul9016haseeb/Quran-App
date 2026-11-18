import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';
import { type IoniconName } from './IconButton';

type ButtonVariant = 'solid' | 'outline' | 'soft';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IoniconName;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'solid',
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const theme = useAppTheme();

  const appearance = {
    solid: {
      background: theme.colors.primary,
      border: theme.colors.primary,
      color: theme.colors.onPrimary,
    },
    outline: {
      background: 'transparent',
      border: theme.colors.borderStrong,
      color: theme.colors.text,
    },
    soft: {
      background: theme.colors.primarySoft,
      border: theme.colors.primarySoft,
      color: theme.colors.onPrimarySoft,
    },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: appearance.background,
          borderColor: appearance.border,
          borderRadius: theme.radii.md,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
        },
        style,
      ]}
    >
      <AppText
        variant="label"
        color={appearance.color}
        style={{ fontSize: 13, marginRight: icon ? 8 : 0 }}
      >
        {label}
      </AppText>
      {icon ? <Ionicons name={icon} size={17} color={appearance.color} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
