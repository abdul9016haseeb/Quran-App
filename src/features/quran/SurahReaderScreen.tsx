import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import type { ReadingMode } from '../../types/content';
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

  const [activeAyah, setActiveAyah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeBookmarked = isBookmarked(surah.id, activeAyah);

  const handleTogglePlay = (ayahNumber: number) => {
    if (activeAyah === ayahNumber) {
      setIsPlaying((current) => !current);
      return;
    }

    setActiveAyah(ayahNumber);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setActiveAyah((current) => (current >= ayahs.length ? 1 : current + 1));
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setActiveAyah((current) => (current <= 1 ? ayahs.length : current - 1));
    setIsPlaying(true);
  };

  const handleHeaderBookmark = () => {
    toggleBookmark({
      id: `bookmark-${surah.id}-${activeAyah}`,
      surahId: surah.id,
      ayahNumber: activeAyah,
      surahName: surah.nameTamil,
      note: '',
      addedLabel: 'இன்று',
    });
  };

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

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: 136 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
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
              இங்குள்ள அரபு மற்றும் தமிழ் உரை வடிவமைப்புக்கான மாதிரி மட்டுமே;
              சரிபார்க்கப்பட்ட குர்ஆன் உரை மற்றும் உரிமம் பெற்ற மொழிபெயர்ப்பு
              இன்னும் இணைக்கப்படவில்லை.
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

        <View style={{ marginTop: theme.spacing.lg, gap: 12 }}>
          {ayahs.map((ayah) => (
            <AyahCard
              key={ayah.id}
              ayah={ayah}
              readingMode={readingMode}
              arabicFontSize={arabicFontSize}
              tamilFontSize={tamilFontSize}
              bookmarked={isBookmarked(surah.id, ayah.ayahNumber)}
              active={activeAyah === ayah.ayahNumber}
              playing={isPlaying && activeAyah === ayah.ayahNumber}
              onToggleBookmark={() =>
                toggleBookmark({
                  id: `bookmark-${surah.id}-${ayah.ayahNumber}`,
                  surahId: surah.id,
                  ayahNumber: ayah.ayahNumber,
                  surahName: surah.nameTamil,
                  note: '',
                  addedLabel: 'இன்று',
                })
              }
              onTogglePlay={() => handleTogglePlay(ayah.ayahNumber)}
            />
          ))}
        </View>

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
            வாசிப்புப் பயன்முறை, எழுத்துரு அளவு மற்றும் குறிப்புகள் இந்த
            அமர்வில் மட்டுமே நிலைத்திருக்கும்; சேமிப்பு அடுக்கு அடுத்த கட்டத்தில்
            இணைக்கப்படும்.
          </AppText>
        </View>
      </ScrollView>

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
      />
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
