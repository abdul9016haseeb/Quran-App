import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/PreferencesProvider';
import { AppText } from '../../../components/ui/AppText';
import type { PrayerTime } from '../../../types/content';

interface PrayerRowProps {
  prayer: PrayerTime;
  highlighted?: boolean;
}

export function PrayerRow({ prayer, highlighted = false }: PrayerRowProps) {
  const theme = useAppTheme();

  return (
    <View
      accessibilityLabel={`${prayer.nameTamil}, ${prayer.time}`}
      style={[
        styles.row,
        {
          backgroundColor: highlighted
            ? theme.colors.primarySoft
            : theme.colors.surface,
          borderColor: highlighted ? theme.colors.primary : theme.colors.border,
          borderRadius: theme.radii.md,
          paddingVertical: 12,
          paddingHorizontal: theme.spacing.md,
          marginBottom: 8,
        },
        highlighted && theme.mode === 'light' ? theme.shadows.card : null,
      ]}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: highlighted
            ? theme.colors.primary
            : theme.colors.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}
      >
        <Ionicons
          name={prayer.icon}
          size={18}
          color={
            highlighted ? theme.colors.onPrimary : theme.colors.textSecondary
          }
        />
      </View>

      <View style={{ flex: 1 }}>
        <AppText
          variant="subheading"
          color={highlighted ? theme.colors.onPrimarySoft : undefined}
        >
          {prayer.nameTamil}
        </AppText>
        <AppText
          variant="caption"
          color={highlighted ? theme.colors.onPrimarySoft : theme.colors.textMuted}
          style={{ opacity: highlighted ? 0.75 : 1 }}
        >
          {prayer.nameArabic}
        </AppText>
      </View>

      <AppText
        variant="subheading"
        color={highlighted ? theme.colors.onPrimarySoft : theme.colors.text}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {prayer.time}
      </AppText>

      <Ionicons
        name="notifications-outline"
        size={17}
        color={
          highlighted ? theme.colors.onPrimarySoft : theme.colors.textMuted
        }
        style={{ marginLeft: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
