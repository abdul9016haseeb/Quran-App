import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/PreferencesProvider';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { ProgressBar } from '../../../components/ui/ProgressBar';

interface AudioDockProps {
  reciterName: string;
  activeLabel: string;
  isPlaying: boolean;
  progress: number;
  bottomInset: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onOpenReciters: () => void;
  onClose?: () => void;
}

/**
 * Reader audio controls. This is a UI shell: no audio source or player is
 * connected, and the "sample" caption must stay until licensed audio is wired.
 */
export function AudioDock({
  reciterName,
  activeLabel,
  isPlaying,
  progress,
  bottomInset,
  onTogglePlay,
  onNext,
  onPrevious,
  onOpenReciters,
  onClose,
}: AudioDockProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.dock,
        {
          bottom: bottomInset + 10,
          left: theme.spacing.md,
          right: theme.spacing.md,
          backgroundColor:
            theme.mode === 'dark' ? theme.colors.surfaceElevated : '#FFFFFF',
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: 10,
        },
        theme.shadows.floating,
      ]}
    >
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="ஓதுபவரை மாற்று"
          onPress={onOpenReciters}
          style={[
            styles.artwork,
            {
              backgroundColor: theme.colors.header,
              borderRadius: theme.radii.sm,
            },
          ]}
        >
          <AppText
            variant="arabicSmall"
            color={theme.colors.gold}
            style={{ fontSize: 18, lineHeight: 26 }}
          >
            ق
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${reciterName}, ${activeLabel}`}
          onPress={onOpenReciters}
          style={styles.info}
        >
          <AppText variant="label" numberOfLines={1} style={{ fontSize: 12 }}>
            {activeLabel}
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            numberOfLines={1}
            style={{ fontSize: 10, marginTop: 1 }}
          >
            {reciterName} · மாதிரி ஒலி
          </AppText>
        </Pressable>

        <IconButton
          name="play-skip-back"
          label="முந்தைய வசனம்"
          onPress={onPrevious}
          size={17}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'இடைநிறுத்து' : 'இயக்கு'}
          onPress={onTogglePlay}
          style={({ pressed }) => ({
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 2,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={theme.colors.onPrimary}
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </Pressable>
        <IconButton
          name="play-skip-forward"
          label="அடுத்த வசனம்"
          onPress={onNext}
          size={17}
        />

        {onClose ? (
          <IconButton
            name="close"
            label="இயக்கியை மூடு"
            onPress={onClose}
            size={16}
            variant="soft"
            style={{ marginLeft: 4 }}
          />
        ) : null}
      </View>

      <View style={{ marginTop: 8 }}>
        <ProgressBar value={progress} height={3} color={theme.colors.gold} />
        <View style={styles.metaRow}>
          <AppText variant="caption" style={{ fontSize: 9 }}>
            மாதிரிக் காட்சி
          </AppText>
          <AppText variant="caption" style={{ fontSize: 9 }}>
            0:18 / 0:48
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    borderWidth: 1,
    zIndex: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  info: {
    flex: 1,
    marginRight: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
