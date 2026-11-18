import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';
import { type IoniconName } from './IconButton';

interface SettingRowProps {
  icon: IoniconName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showChevron?: boolean;
  tone?: 'default' | 'danger';
}

export function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  right,
  showChevron = true,
  tone = 'default',
}: SettingRowProps) {
  const theme = useAppTheme();
  const danger = tone === 'danger';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          paddingVertical: 13,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: theme.radii.sm,
          backgroundColor: danger
            ? theme.colors.dangerSoft
            : theme.colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? theme.colors.danger : theme.colors.onPrimarySoft}
        />
      </View>

      <View style={styles.textBlock}>
        <AppText variant="subheading" color={danger ? theme.colors.danger : undefined}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            numberOfLines={1}
            style={{ marginTop: 1 }}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {value ? (
        <AppText
          variant="caption"
          color={theme.colors.textSecondary}
          numberOfLines={1}
          style={{ marginLeft: 8, maxWidth: 110 }}
        >
          {value}
        </AppText>
      ) : null}

      {right}

      {showChevron && onPress ? (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={theme.colors.textMuted}
          style={{ marginLeft: 4 }}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
});
