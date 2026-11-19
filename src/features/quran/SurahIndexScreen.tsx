import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItemInfo, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IconButton } from '../../components/ui/IconButton';
import { Screen } from '../../components/ui/Screen';
import { SearchField } from '../../components/ui/SearchField';
import {
  SegmentedControl,
  type SegmentOption,
} from '../../components/ui/SegmentedControl';
import { MOCK_SURAHS, TOTAL_SURAH_COUNT } from '../../data/mock/surahs';
import { SurahRow } from './components/SurahRow';
import type { Surah } from '../../types/content';
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

  const renderHeader = useMemo(
    () => (
      <View style={{ marginBottom: theme.spacing.sm }}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="அத்தியாயம் அல்லது எண் தேடுங்கள்…"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="மாதிரித் தொடர் வாசிப்பு: அல்பகரா, வசனம் 255"
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
              தொடர் வாசிப்பு · மாதிரி
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
          <View style={[styles.rowBetween, { marginTop: theme.spacing.lg, marginBottom: 4 }]}>
            <AppText variant="caption">
              {query
                ? `${filtered.length} முடிவுகள்`
                : `${TOTAL_SURAH_COUNT} அத்தியாயங்கள்`}
            </AppText>
            <AppText variant="caption" style={{ fontSize: 10 }}>
              அனைத்தும் (114)
            </AppText>
          </View>
        ) : null}
      </View>
    ),
    [query, navigation, mode, filtered.length, theme]
  );

  const renderFooter = useMemo(
    () => (
      <View
        style={{
          marginTop: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 4,
          paddingBottom: theme.spacing.xxxl,
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
          அனைத்து 114 அத்தியாயங்களும் உத்மானி அரபு மூலத்துடனும் ஷேக் உமர்
          ஷரீஃப் அவர்களின் தமிழாக்கத்துடனும் ஆஃப்லைனில் வாசிக்கக் கிடைக்கின்றன.
        </AppText>
      </View>
    ),
    [theme]
  );

  const renderSurahItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Surah>) => (
      <View style={{ backgroundColor: theme.colors.surface }}>
        <SurahRow
          surah={item}
          showDivider={index !== filtered.length - 1}
          onPress={() =>
            navigation.navigate('SurahReader', {
              surahId: item.id,
            })
          }
        />
      </View>
    ),
    [theme.colors.surface, filtered.length, navigation]
  );

  const keyExtractor = useCallback((item: Surah) => String(item.id), []);

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

      {mode === 'surah' ? (
        <FlatList<Surah>
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderSurahItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Card style={{ marginTop: theme.spacing.md }}>
              <EmptyState
                icon="search-outline"
                title="முடிவுகள் இல்லை"
                description="வேறு அத்தியாயப் பெயர் அல்லது எண்ணை முயலுங்கள்."
              />
            </Card>
          }
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews
        />
      ) : (
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          {renderHeader}
          <Card style={{ marginTop: theme.spacing.lg }}>
            <EmptyState
              icon={mode === 'juz' ? 'albums-outline' : 'document-outline'}
              title={mode === 'juz' ? 'ஜுஸ் பிரிவு' : 'பக்கம் பிரிவு'}
              description="இந்த வழிசெலுத்தல் முறை அடுத்த கட்டத்தில் இணைக்கப்படும். தற்போது அத்தியாய வரிசையைப் பயன்படுத்துங்கள்."
              actionLabel="அத்தியாயங்களுக்குத் திரும்பு"
              onAction={() => setMode('surah')}
            />
          </Card>
        </View>
      )}
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
