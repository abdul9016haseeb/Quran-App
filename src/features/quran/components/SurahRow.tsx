import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/PreferencesProvider';
import { AppText } from '../../../components/ui/AppText';
import { getRevelationLabel } from '../../../data/mock/surahs';
import type { Surah } from '../../../types/content';

interface SurahRowProps {
  surah: Surah;
  onPress: () => void;
  showDivider?: boolean;
}

export function SurahRow({ surah, onPress, showDivider = true }: SurahRowProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${surah.nameTamil}, ${surah.ayahCount} வசனங்கள்`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          paddingVertical: 13,
          paddingHorizontal: theme.spacing.lg,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: theme.colors.divider,
          backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
        },
      ]}
    >
      <View style={styles.badgeWrap}>
        <View
          style={{
            position: 'absolute',
            width: 34,
            height: 34,
            borderRadius: 7,
            backgroundColor: theme.colors.primarySoft,
            transform: [{ rotate: '45deg' }],
          }}
        />
        <AppText
          variant="label"
          color={theme.colors.onPrimarySoft}
          style={{ fontSize: 12, letterSpacing: 0 }}
        >
          {surah.id}
        </AppText>
      </View>

      <View style={styles.textBlock}>
        <AppText variant="subheading" numberOfLines={1}>
          {surah.nameTamil}
        </AppText>
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          numberOfLines={1}
          style={{ marginTop: 1 }}
        >
          {surah.meaningTamil} · {surah.ayahCount} வசனங்கள் ·{' '}
          {getRevelationLabel(surah.revelation)}
        </AppText>
      </View>

      <AppText
        variant="arabicSmall"
        color={theme.colors.textSecondary}
        style={{ marginLeft: theme.spacing.sm }}
      >
        {surah.nameArabic}
      </AppText>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.colors.textMuted}
        style={{ marginLeft: 6 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textBlock: {
    flex: 1,
  },
});
