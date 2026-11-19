import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, usePreferences } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { IconButton } from '../../components/ui/IconButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import {
  SegmentedControl,
  type SegmentOption,
} from '../../components/ui/SegmentedControl';
import { MOCK_RECITERS } from '../../data/mock/reciters';
import { getPlaceholderAyahs } from '../../data/mock/sampleAyahs';
import {
  findSurah,
  getRevelationLabel,
  MOCK_SURAHS,
} from '../../data/mock/surahs';
import { useSurahAyahs } from '../../data/quranRepository';
import { AudioDock } from '../audio/components/AudioDock';
import { AyahCard } from './components/AyahCard';
import type { Ayah, ReadingMode } from '../../types/content';
import type { RootStackParamList } from '../../navigation/types';

const READING_MODES: readonly SegmentOption<ReadingMode>[] = [
  { value: 'both', label: 'இரண்டும்' },
  { value: 'arabic', label: 'அரபு' },
  { value: 'tamil', label: 'தமிழ்' },
];

export function SurahReaderScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SurahReader'>>();
  const {
    readingMode,
    setReadingMode,
    arabicFontSize,
    tamilFontSize,
    reciterId,
    isBookmarked,
    toggleBookmark,
  } = usePreferences();

  const surah = findSurah(route.params.surahId) ?? MOCK_SURAHS[0]!;
  const { ayahs: dbAyahs } = useSurahAyahs(surah.id);
  const placeholderAyahs = useMemo(() => getPlaceholderAyahs(surah), [surah]);
  const ayahs = dbAyahs.length > 0 ? dbAyahs : placeholderAyahs;
  const isPlaceholder = ayahs.length === 0 || ayahs[0]?.isPlaceholder;
  const reciter =
    MOCK_RECITERS.find((item) => item.id === reciterId) ?? MOCK_RECITERS[0]!;

  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);

  const activeBookmarked =
    activeAyah != null ? isBookmarked(surah.id, activeAyah) : false;

  const handleTogglePlay = useCallback((ayahNumber: number) => {
    setActiveAyah((prev) => {
      if (prev === ayahNumber) {
        setIsPlaying((current) => !current);
        return prev;
      }
      setIsPlaying(true);
      return ayahNumber;
    });
    setIsAudioPlayerVisible(true);
  }, []);

  const handleCloseAudio = useCallback(() => {
    setIsPlaying(false);
    setActiveAyah(null);
    setIsAudioPlayerVisible(false);
  }, []);

  const handleNext = useCallback(() => {
    setActiveAyah((current) => {
      const curr = current ?? 1;
      return curr >= ayahs.length ? 1 : curr + 1;
    });
    setIsPlaying(true);
  }, [ayahs.length]);

  const handlePrevious = useCallback(() => {
    setActiveAyah((current) => {
      const curr = current ?? 1;
      return curr <= 1 ? ayahs.length : curr - 1;
    });
    setIsPlaying(true);
  }, [ayahs.length]);

  const handleHeaderBookmark = useCallback(() => {
    const targetAyah = activeAyah ?? 1;
    toggleBookmark({
      id: `bookmark-${surah.id}-${targetAyah}`,
      surahId: surah.id,
      ayahNumber: targetAyah,
      surahName: surah.nameTamil,
      note: '',
      addedLabel: 'இன்று',
    });
  }, [surah.id, surah.nameTamil, activeAyah, toggleBookmark]);

  const renderHeader = useMemo(
    () => (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <View style={[styles.metaRow, { marginBottom: theme.spacing.md }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <AppText
              variant="arabicSmall"
              color={theme.colors.textSecondary}
              style={{ fontSize: 18, lineHeight: 26 }}
            >
              {surah.nameArabic}
            </AppText>
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: theme.colors.textMuted,
                marginHorizontal: 8,
              }}
            />
            <AppText variant="caption" numberOfLines={1}>
              {surah.nameTransliteration}
            </AppText>
          </View>
          {isPlaceholder ? <SampleBadge /> : null}
        </View>

        <SegmentedControl
          options={READING_MODES}
          value={readingMode}
          onChange={setReadingMode}
        />

        <View
          style={{
            marginTop: theme.spacing.lg,
            borderRadius: theme.radii.xl,
            borderWidth: 1,
            borderColor: theme.colors.goldSoft,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 28,
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.colors.gold,
              }}
            />
            <Ionicons
              name="star-outline"
              size={14}
              color={theme.colors.gold}
              style={{ marginHorizontal: 8 }}
            />
            <View
              style={{
                width: 28,
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.colors.gold,
              }}
            />
          </View>

          <AppText
            variant="arabic"
            align="center"
            style={{ fontSize: 30, lineHeight: 48 }}
          >
            {surah.nameArabic}
          </AppText>
          <AppText
            variant="heading"
            align="center"
            style={{ marginTop: 2, fontSize: 18 }}
          >
            {surah.nameTamil}
          </AppText>
          <AppText
            variant="caption"
            align="center"
            style={{ marginTop: 4, fontSize: 11 }}
          >
            {surah.meaningTamil} · {getRevelationLabel(surah.revelation)} ·{' '}
            {surah.ayahCount} வசனங்கள்
          </AppText>

          {surah.id !== 1 && surah.id !== 9 ? (
            <View
              style={{
                marginTop: theme.spacing.md,
                paddingTop: theme.spacing.md,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: theme.colors.goldSoft,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <AppText
                variant="arabic"
                align="center"
                style={{
                  fontSize: 22,
                  lineHeight: 36,
                  color: theme.colors.goldText,
                }}
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </AppText>
              <AppText
                variant="caption"
                align="center"
                color={theme.colors.textSecondary}
                style={{ marginTop: 2, fontSize: 11 }}
              >
                பேரருளாளன் பேரன்பாளன் அல்லாஹ்வின் பெயரால்
              </AppText>
            </View>
          ) : null}
        </View>

        {isPlaceholder ? (
          <Card
            tone="gold"
            style={{
              marginTop: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Ionicons
              name="flask-outline"
              size={17}
              color={theme.colors.goldText}
              style={{ marginTop: 1, marginRight: 8 }}
            />
            <AppText
              variant="caption"
              color={theme.colors.goldText}
              style={{ flex: 1, fontSize: 10, lineHeight: 16 }}
            >
              ஆஃப்லைன் தரவுத்தளத்தைப் படிக்க முடியாததால், இந்தத் திரையில்
              வடிவமைப்புக்கான மாதிரி உரை காட்டப்படுகிறது; இது குர்ஆன் வசனம்
              அல்ல.
            </AppText>
          </Card>
        ) : (
          <View
            style={{
              marginTop: theme.spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={13}
              color={theme.colors.primary}
            />
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={{ fontSize: 10 }}
            >
              உத்மானி அரபு: Tanzil · தமிழாக்கம்: ஷேக் உமர் ஷரீஃப் (QuranEnc)
            </AppText>
          </View>
        )}
      </View>
    ),
    [theme, surah, isPlaceholder, readingMode, setReadingMode]
  );

  const renderFooter = useMemo(
    () => (
      <View
        style={{
          marginTop: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 4,
        }}
      >
        <Ionicons
          name="information-circle-outline"
          size={15}
          color={theme.colors.textMuted}
          style={{ marginTop: 1, marginRight: 6 }}
        />
        <AppText
          variant="caption"
          style={{ flex: 1, fontSize: 10, lineHeight: 16 }}
        >
          தோற்றம் சாதனத்தில் சேமிக்கப்படுகிறது; வாசிப்புப் பயன்முறை,
          எழுத்துரு அளவு, ஓதுபவர் மற்றும் குறிப்புகள் இந்த அமர்வில் மட்டுமே
          நிலைத்திருக்கும்.
        </AppText>
      </View>
    ),
    [theme]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Ayah>) => (
      <AyahCard
        ayah={item}
        readingMode={readingMode}
        arabicFontSize={arabicFontSize}
        tamilFontSize={tamilFontSize}
        bookmarked={isBookmarked(surah.id, item.ayahNumber)}
        active={activeAyah === item.ayahNumber}
        playing={isPlaying && activeAyah === item.ayahNumber}
        onToggleBookmark={() =>
          toggleBookmark({
            id: `bookmark-${surah.id}-${item.ayahNumber}`,
            surahId: surah.id,
            ayahNumber: item.ayahNumber,
            surahName: surah.nameTamil,
            note: '',
            addedLabel: 'இன்று',
          })
        }
        onTogglePlay={() => handleTogglePlay(item.ayahNumber)}
      />
    ),
    [
      readingMode,
      arabicFontSize,
      tamilFontSize,
      isBookmarked,
      surah.id,
      surah.nameTamil,
      activeAyah,
      isPlaying,
      toggleBookmark,
      handleTogglePlay,
    ]
  );

  const keyExtractor = useCallback((item: Ayah) => item.id, []);

  const renderSeparator = useCallback(
    () => (
      <View
        style={{
          height: StyleSheet.hairlineWidth * 2,
          backgroundColor: theme.colors.textMuted,
          opacity: 0.35,
          marginVertical: theme.spacing.lg,
        }}
      />
    ),
    [theme.colors.textMuted, theme.spacing.lg]
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title={`${surah.id}. ${surah.nameTamil}`}
        subtitle={`${surah.ayahCount} வசனங்கள் · ${getRevelationLabel(surah.revelation)}`}
        right={
          <>
            <IconButton
              name={activeBookmarked ? 'bookmark' : 'bookmark-outline'}
              label="குறிப்பை மாற்று"
              onPress={handleHeaderBookmark}
              variant={activeBookmarked ? 'gold' : 'plain'}
            />
            <IconButton
              name="text-outline"
              label="வாசிப்பு அமைப்புகள்"
              onPress={() => navigation.navigate('Appearance')}
            />
          </>
        }
      />

      <FlatList<Ayah>
        data={ayahs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: isAudioPlayerVisible
            ? 136 + insets.bottom
            : theme.spacing.xl + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />

      {isAudioPlayerVisible && activeAyah != null ? (
        <AudioDock
          reciterName={reciter.name}
          activeLabel={`${surah.nameTamil} · வசனம் ${activeAyah}`}
          isPlaying={isPlaying}
          progress={0.36}
          bottomInset={insets.bottom}
          onTogglePlay={() => setIsPlaying((current) => !current)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onOpenReciters={() => navigation.navigate('ReciterPicker')}
          onClose={handleCloseAudio}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
