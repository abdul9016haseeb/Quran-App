import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { SearchField } from '../../components/ui/SearchField';
import { findSurah, MOCK_SURAHS } from '../../data/mock/surahs';
import { useQuranSearch } from '../../data/quranRepository';
import { SurahRow } from '../quran/components/SurahRow';
import type { RootStackParamList } from '../../navigation/types';

const SUGGESTIONS = ['அல்ஃபாத்திஹா', 'அல்பகரா', 'யாஸீன்', 'முஹம்மத்', 'அல்லாஹ்'];

export function SearchScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const { results: ayahResults, searching } = useQuranSearch(query);

  const surahResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return [];
    }

    return MOCK_SURAHS.filter((surah) => {
      return (
        surah.nameTamil.toLowerCase().includes(needle) ||
        surah.nameTransliteration.toLowerCase().includes(needle) ||
        surah.meaningTamil.toLowerCase().includes(needle) ||
        surah.nameArabic.includes(needle) ||
        String(surah.id) === needle
      );
    });
  }, [query]);

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="தேடல்"
        subtitle="114 அத்தியாயங்கள் மற்றும் 6,236 வசனங்கள்"
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="அத்தியாயம், வசனம் அல்லது பொருள்…"
        />

        {query.trim().length === 0 ? (
          <>
            <AppText
              variant="heading"
              style={{ fontSize: 16, marginTop: theme.spacing.xl }}
            >
              பரிந்துரைகள்
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: theme.spacing.md,
              }}
            >
              {SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  accessibilityRole="button"
                  accessibilityLabel={`தேடு: ${suggestion}`}
                  onPress={() => setQuery(suggestion)}
                  style={({ pressed }) => ({
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radii.pill,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <AppText variant="label" style={{ fontSize: 11 }}>
                    {suggestion}
                  </AppText>
                </Pressable>
              ))}
            </View>

            <Card tone="primary" style={{ marginTop: theme.spacing.xl }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={theme.colors.primary}
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="subheading"
                    color={theme.colors.primary}
                    style={{ fontSize: 13 }}
                  >
                    முழுமையான ஆஃப்லைன் தேடல்
                  </AppText>
                  <AppText
                    variant="caption"
                    color={theme.colors.textSecondary}
                    style={{ marginTop: 3, fontSize: 11, lineHeight: 16 }}
                  >
                    114 அத்தியாயங்களின் பெயர்கள், உத்மானி அரபு உரை மற்றும் ஷேக்
                    உமர் ஷரீஃப் அவர்களின் தமிழ் மொழிபெயர்ப்பில் உடனடி தேடல்.
                  </AppText>
                </View>
              </View>
            </Card>
          </>
        ) : (
          <>
            {/* Surah Matches */}
            {surahResults.length > 0 ? (
              <View style={{ marginTop: theme.spacing.lg }}>
                <View style={[styles.rowBetween, { marginBottom: theme.spacing.sm }]}>
                  <AppText variant="caption">
                    {surahResults.length} அத்தியாய முடிவுகள்
                  </AppText>
                </View>
                <Card padded={false}>
                  {surahResults.map((surah, index) => (
                    <SurahRow
                      key={surah.id}
                      surah={surah}
                      showDivider={index !== surahResults.length - 1}
                      onPress={() =>
                        navigation.navigate('SurahReader', {
                          surahId: surah.id,
                        })
                      }
                    />
                  ))}
                </Card>
              </View>
            ) : null}

            {/* Ayah Verse Matches */}
            {ayahResults.length > 0 ? (
              <View style={{ marginTop: theme.spacing.lg }}>
                <View style={[styles.rowBetween, { marginBottom: theme.spacing.sm }]}>
                  <AppText variant="caption">
                    {ayahResults.length} வசன முடிவுகள்
                  </AppText>
                </View>
                <View style={{ gap: 8 }}>
                  {ayahResults.map((ayah) => {
                    const surah = findSurah(ayah.surahId);
                    return (
                      <Pressable
                        key={ayah.id}
                        onPress={() =>
                          navigation.navigate('SurahReader', {
                            surahId: ayah.surahId,
                          })
                        }
                        style={({ pressed }) => ({
                          backgroundColor: theme.colors.surface,
                          borderRadius: theme.radii.lg,
                          padding: theme.spacing.md,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          opacity: pressed ? 0.75 : 1,
                        })}
                      >
                        <View style={styles.rowBetween}>
                          <AppText
                            variant="label"
                            color={theme.colors.primary}
                            style={{ fontSize: 12 }}
                          >
                            {surah ? surah.nameTamil : `அத்தியாயம் ${ayah.surahId}`} : வசனம் {ayah.ayahNumber}
                          </AppText>
                          <Ionicons
                            name="chevron-forward"
                            size={14}
                            color={theme.colors.textMuted}
                          />
                        </View>
                        <AppText
                          variant="body"
                          style={{
                            marginTop: 6,
                            fontSize: 13,
                            lineHeight: 20,
                            color: theme.colors.text,
                          }}
                          numberOfLines={3}
                        >
                          {ayah.tamil}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {surahResults.length === 0 && ayahResults.length === 0 && !searching ? (
              <Card style={{ marginTop: theme.spacing.lg }}>
                <EmptyState
                  icon="search-outline"
                  title="முடிவுகள் இல்லை"
                  description="வேறு சொல் அல்லது அத்தியாய எண்ணை முயலுங்கள்."
                />
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
