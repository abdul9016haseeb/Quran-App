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
import { IconButton } from '../../components/ui/IconButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { SearchField } from '../../components/ui/SearchField';
import {
  SegmentedControl,
  type SegmentOption,
} from '../../components/ui/SegmentedControl';
import { MOCK_SURAHS, TOTAL_SURAH_COUNT } from '../../data/mock/surahs';
import { SurahRow } from './components/SurahRow';
import type { RootStackParamList } from '../../navigation/types';

type ListMode = 'surah' | 'juz' | 'page';

const MODES: readonly SegmentOption<ListMode>[] = [
  { value: 'surah', label: 'அத்தியாயம்' },
  { value: 'juz', label: 'ஜுஸ்' },
  { value: 'page', label: 'பக்கம்' },
];

export function SurahIndexScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<ListMode>('surah');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return MOCK_SURAHS;
    }

    return MOCK_SURAHS.filter((surah) => {
      return (
        surah.nameTamil.toLowerCase().includes(needle) ||
        surah.nameTransliteration.toLowerCase().includes(needle) ||
        surah.nameArabic.includes(needle) ||
        String(surah.id) === needle
      );
    });
  }, [query]);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 6,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText variant="title">குர்ஆன்</AppText>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
          >
            <AppText variant="caption">
              {TOTAL_SURAH_COUNT} அத்தியாயங்கள் · தமிழ்
            </AppText>
            <SampleBadge style={{ marginLeft: 8 }} />
          </View>
        </View>
        <IconButton
          name="search-outline"
          label="தேடல்"
          onPress={() => navigation.navigate('Search')}
        />
        <IconButton
          name="settings-outline"
          label="அமைப்புகள்"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Settings' })}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="அத்தியாயம் அல்லது வசனம் தேடுங்கள்…"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="கடைசியாக ஓதியது: அல்பகரா, வசனம் 255"
          onPress={() => navigation.navigate('SurahReader', { surahId: 2 })}
          style={({ pressed }) => [
            {
              marginTop: theme.spacing.md,
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primarySoft,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.78 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Ionicons
              name="bookmark-outline"
              size={17}
              color={theme.colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText
              variant="caption"
              color={theme.colors.onPrimarySoft}
              style={{ fontSize: 10 }}
            >
              கடைசியாக ஓதியது
            </AppText>
            <AppText
              variant="subheading"
              color={theme.colors.onPrimarySoft}
              style={{ fontSize: 15 }}
            >
              அல்பகரா : வசனம் 255
            </AppText>
          </View>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={theme.colors.onPrimarySoft}
          />
        </Pressable>

        <View style={{ marginTop: theme.spacing.lg }}>
          <SegmentedControl options={MODES} value={mode} onChange={setMode} />
        </View>

        {mode === 'surah' ? (
          <>
            <View style={[styles.rowBetween, { marginTop: theme.spacing.lg }]}>
              <AppText variant="caption">
                {query
                  ? `${filtered.length} முடிவுகள்`
                  : `${MOCK_SURAHS.length} மாதிரி அத்தியாயங்கள்`}
              </AppText>
              <AppText variant="caption" style={{ fontSize: 10 }}>
                முழுப் பட்டியல் விரைவில்
              </AppText>
            </View>

            <Card padded={false} style={{ marginTop: theme.spacing.sm }}>
              {filtered.length > 0 ? (
                filtered.map((surah, index) => (
                  <SurahRow
                    key={surah.id}
                    surah={surah}
                    showDivider={index !== filtered.length - 1}
                    onPress={() =>
                      navigation.navigate('SurahReader', {
                        surahId: surah.id,
                      })
                    }
                  />
                ))
              ) : (
                <EmptyState
                  icon="search-outline"
                  title="முடிவுகள் இல்லை"
                  description="வேறு அத்தியாயப் பெயர் அல்லது எண்ணை முயலுங்கள்."
                />
              )}
            </Card>

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
                இங்கு முதல் 12 அத்தியாயங்களின் சரிபார்க்கப்பட்ட பெயர் மற்றும்
                வசன எண்ணிக்கை மட்டும் காட்டப்படுகிறது. முழு 114 அத்தியாயங்களும்
                தரவுத்தளம் இணைக்கப்பட்ட பிறகு வரும்.
              </AppText>
            </View>
          </>
        ) : (
          <Card style={{ marginTop: theme.spacing.lg }}>
            <EmptyState
              icon={mode === 'juz' ? 'albums-outline' : 'document-outline'}
              title={mode === 'juz' ? 'ஜுஸ் பிரிவு' : 'பக்கம் பிரிவு'}
              description="இந்த வழிசெலுத்தல் முறை அடுத்த கட்டத்தில் இணைக்கப்படும். தற்போது அத்தியாய வரிசையைப் பயன்படுத்துங்கள்."
              actionLabel="அத்தியாயங்களுக்குத் திரும்பு"
              onAction={() => setMode('surah')}
            />
          </Card>
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
