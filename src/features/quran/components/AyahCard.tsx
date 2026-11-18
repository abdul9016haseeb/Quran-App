import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/PreferencesProvider';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { SampleBadge } from '../../../components/ui/SampleBadge';
import type { Ayah, ReadingMode } from '../../../types/content';

interface AyahCardProps {
  ayah: Ayah;
  readingMode: ReadingMode;
  arabicFontSize: number;
  tamilFontSize: number;
  bookmarked: boolean;
  active: boolean;
  playing: boolean;
  onToggleBookmark: () => void;
  onTogglePlay: () => void;
}

export function AyahCard({
  ayah,
  readingMode,
  arabicFontSize,
  tamilFontSize,
  bookmarked,
  active,
  playing,
  onToggleBookmark,
  onTogglePlay,
}: AyahCardProps) {
  const theme = useAppTheme();

  const showArabic = readingMode === 'both' || readingMode === 'arabic';
  const showTamil = readingMode === 'both' || readingMode === 'tamil';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: active
            ? theme.colors.surfaceAccent
            : theme.colors.surface,
          borderColor: active ? theme.colors.gold : theme.colors.border,
          borderLeftWidth: active ? 3 : 1,
          borderLeftColor: active ? theme.colors.gold : theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
        },
        theme.mode === 'dark' ? null : theme.shadows.card,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={{
            minWidth: 32,
            height: 30,
            paddingHorizontal: 8,
            borderRadius: theme.radii.xs,
            backgroundColor: theme.colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText
            variant="label"
            color={theme.colors.onPrimarySoft}
            style={{ fontSize: 12 }}
          >
            {ayah.ayahNumber}
          </AppText>
        </View>

        {ayah.isPlaceholder ? <SampleBadge style={{ marginLeft: 8 }} /> : null}

        <View style={{ flex: 1 }} />

        <IconButton
          name={bookmarked ? 'bookmark' : 'bookmark-outline'}
          label={bookmarked ? 'குறிப்பை நீக்கு' : 'குறிப்பில் சேர்'}
          onPress={onToggleBookmark}
          variant={bookmarked ? 'gold' : 'plain'}
          size={19}
        />
        <IconButton
          name={playing ? 'pause-circle' : 'play-circle'}
          label={playing ? 'இடைநிறுத்து' : 'வசனத்தை இயக்கு'}
          onPress={onTogglePlay}
          variant="plain"
          size={24}
        />
      </View>

      {showArabic ? (
        <AppText
          variant="arabic"
          align="right"
          style={{
            fontSize: arabicFontSize,
            lineHeight: arabicFontSize * 1.75,
            marginTop: theme.spacing.md,
          }}
        >
          {ayah.arabic}
        </AppText>
      ) : null}

      {showTamil ? (
        <View
          style={{
            marginTop: showArabic ? theme.spacing.md : theme.spacing.sm,
            backgroundColor: active
              ? theme.colors.surface
              : theme.colors.surfaceMuted,
            borderRadius: theme.radii.sm,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          }}
        >
          <AppText
            variant="readerTamil"
            color={theme.colors.textSecondary}
            style={{ fontSize: tamilFontSize, lineHeight: tamilFontSize * 1.75 }}
          >
            {ayah.tamil}
          </AppText>
        </View>
      ) : null}

      {ayah.isPlaceholder ? (
        <AppText
          variant="caption"
          color={theme.colors.goldText}
          style={{ marginTop: theme.spacing.sm, fontSize: 10 }}
        >
          இந்த உரை பாட வடிவமைப்புக்கான மாதிரி; குர்ஆன் வசனம் அல்ல.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
