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
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { SearchField } from '../../components/ui/SearchField';
import { MOCK_SURAHS } from '../../data/mock/surahs';
import { SurahRow } from '../quran/components/SurahRow';
import type { RootStackParamList } from '../../navigation/types';

const SUGGESTIONS = ['அல்ஃபாத்திஹா', 'அல்பகரா', 'யாசீன்', '2', 'மாடு'];

export function SearchScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
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
        subtitle="அத்தியாயம் மற்றும் வசன எண்"
        right={<SampleBadge />}
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
          placeholder="அத்தியாயம், பொருள் அல்லது எண்…"
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

            <Card tone="gold" style={{ marginTop: theme.spacing.xl }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="flask-outline"
                  size={17}
                  color={theme.colors.goldText}
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="subheading"
                    color={theme.colors.goldText}
                    style={{ fontSize: 13 }}
                  >
                    உரைத் தேடல் இன்னும் இல்லை
                  </AppText>
                  <AppText
                    variant="caption"
                    color={theme.colors.goldText}
                    style={{ marginTop: 3, fontSize: 10, lineHeight: 16 }}
                  >
                    தற்போது சரிபார்க்கப்பட்ட 12 அத்தியாயங்களின் தலைப்புத்
                    தகவல்களில் மட்டுமே தேட முடிகிறது. அரபு மற்றும் தமிழ்
                    வசனத் தேடல் தரவுத்தளத்துடன் இணைக்கப்படும்.
                  </AppText>
                </View>
              </View>
            </Card>
          </>
        ) : (
          <>
            <View
              style={[
                styles.rowBetween,
                { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
              ]}
            >
              <AppText variant="caption">
                {results.length} அத்தியாய முடிவுகள்
              </AppText>
              <AppText variant="caption" style={{ fontSize: 10 }}>
                வசனத் தேடல் விரைவில்
              </AppText>
            </View>

            {results.length > 0 ? (
              <Card padded={false}>
                {results.map((surah, index) => (
                  <SurahRow
                    key={surah.id}
                    surah={surah}
                    showDivider={index !== results.length - 1}
                    onPress={() =>
                      navigation.navigate('SurahReader', {
                        surahId: surah.id,
                      })
                    }
                  />
                ))}
              </Card>
            ) : (
              <Card>
                <EmptyState
                  icon="search-outline"
                  title="முடிவுகள் இல்லை"
                  description="வேறு சொல் அல்லது அத்தியாய எண்ணை முயலுங்கள். உரைத் தேடல் இன்னும் இணைக்கப்படவில்லை."
                />
              </Card>
            )}
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
