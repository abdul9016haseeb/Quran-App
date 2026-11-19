import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  useAppTheme,
  usePreferences,
  type ThemePreference,
} from '../../app/providers/PreferencesProvider';
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
import type { ReadingMode } from '../../types/content';

const THEME_OPTIONS: readonly SegmentOption<ThemePreference>[] = [
  { value: 'system', label: 'சிஸ்டம்' },
  { value: 'light', label: 'வெளிச்சம்' },
  { value: 'dark', label: 'இருள்' },
];

const READING_OPTIONS: readonly SegmentOption<ReadingMode>[] = [
  { value: 'both', label: 'இரண்டும்' },
  { value: 'arabic', label: 'அரபு' },
  { value: 'tamil', label: 'தமிழ்' },
];

export function AppearanceScreen() {
  const theme = useAppTheme();
  const {
    themePreference,
    setThemePreference,
    arabicFontSize,
    setArabicFontSize,
    tamilFontSize,
    setTamilFontSize,
    readingMode,
    setReadingMode,
  } = usePreferences();

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="தோற்றம் & வாசிப்பு"
        subtitle="மாற்றங்கள் உடனடியாகத் தெரியும்"
        right={<SampleBadge />}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={{ fontSize: 10, letterSpacing: 0.6, marginBottom: 8 }}
        >
          நேரடி முன்னோட்டம்
        </AppText>

        <View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.lg,
            },
            theme.mode === 'light' ? theme.shadows.card : null,
          ]}
        >
          <View style={styles.rowBetween}>
            <AppText variant="caption" style={{ fontSize: 10 }}>
              எழுத்துரு மாதிரி
            </AppText>
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={theme.colors.primary}
            />
          </View>
          <AppText
            variant="arabic"
            align="right"
            style={{
              fontSize: arabicFontSize,
              lineHeight: arabicFontSize * 1.7,
              marginTop: theme.spacing.sm,
            }}
          >
            هَذَا نَصٌّ تَجْرِيبِيٌّ لِعَرْضِ التَّصْمِيمِ
          </AppText>
          <View
            style={{
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: theme.radii.sm,
              padding: theme.spacing.md,
              marginTop: theme.spacing.sm,
            }}
          >
            <AppText
              variant="readerTamil"
              color={theme.colors.textSecondary}
              style={{
                fontSize: tamilFontSize,
                lineHeight: tamilFontSize * 1.7,
              }}
            >
              இது எழுத்துரு அளவைச் சோதிக்கும் மாதிரி உரை. உண்மையான வசனங்கள்
              வாசிப்புத் திரையில் கிடைக்கின்றன.
            </AppText>
          </View>
        </View>

        <Section title="தோற்ற முறை" />
        <SegmentedControl
          options={THEME_OPTIONS}
          value={themePreference}
          onChange={setThemePreference}
        />
        <AppText variant="caption" style={{ fontSize: 9, marginTop: 6 }}>
          சிஸ்டம் தேர்ந்தெடுத்தால் சாதனத்தின் இருள்/வெளிச்ச அமைப்பு பின்பற்றப்படும்.
        </AppText>

        <Section title="அரபு எழுத்துரு அளவு" />
        <Card style={{ paddingVertical: theme.spacing.md }}>
          <View style={styles.rowBetween}>
            <IconButton
              name="remove"
              label="அரபு எழுத்துருவைச் சிறிதாக்கு"
              onPress={() => setArabicFontSize(arabicFontSize - 2)}
              disabled={arabicFontSize <= 22}
              variant="soft"
            />
            <View style={{ alignItems: 'center' }}>
              <AppText variant="heading" style={{ fontSize: 20 }}>
                {arabicFontSize}px
              </AppText>
              <AppText variant="caption" style={{ fontSize: 9 }}>
                22–46 · அமீரி எழுத்துரு
              </AppText>
            </View>
            <IconButton
              name="add"
              label="அரபு எழுத்துருவைப் பெரிதாக்கு"
              onPress={() => setArabicFontSize(arabicFontSize + 2)}
              disabled={arabicFontSize >= 46}
              variant="soft"
            />
          </View>
        </Card>

        <Section title="தமிழ் எழுத்துரு அளவு" />
        <Card style={{ paddingVertical: theme.spacing.md }}>
          <View style={styles.rowBetween}>
            <IconButton
              name="remove"
              label="தமிழ் எழுத்துருவைச் சிறிதாக்கு"
              onPress={() => setTamilFontSize(tamilFontSize - 1)}
              disabled={tamilFontSize <= 13}
              variant="soft"
            />
            <View style={{ alignItems: 'center' }}>
              <AppText variant="heading" style={{ fontSize: 20 }}>
                {tamilFontSize}px
              </AppText>
              <AppText variant="caption" style={{ fontSize: 9 }}>
                13–26 · நோட்டோ சான்ஸ் தமிழ்
              </AppText>
            </View>
            <IconButton
              name="add"
              label="தமிழ் எழுத்துருவைப் பெரிதாக்கு"
              onPress={() => setTamilFontSize(tamilFontSize + 1)}
              disabled={tamilFontSize >= 26}
              variant="soft"
            />
          </View>
        </Card>

        <Section title="வாசிப்பு முறை" />
        <SegmentedControl
          options={READING_OPTIONS}
          value={readingMode}
          onChange={setReadingMode}
        />

        <Card
          tone="gold"
          style={{ marginTop: theme.spacing.xl, flexDirection: 'row' }}
        >
          <Ionicons
            name="information-circle-outline"
            size={17}
            color={theme.colors.goldText}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <AppText
            variant="caption"
            color={theme.colors.goldText}
            style={{ flex: 1, fontSize: 10, lineHeight: 16 }}
          >
            தோற்ற முறை சாதனத்தில் சேமிக்கப்படுகிறது; எழுத்துரு அளவு மற்றும்
            வாசிப்பு முறை அமர்வு நினைவகத்தில் மட்டுமே உள்ளன.
          </AppText>
        </Card>
      </ScrollView>
    </Screen>
  );
}

function Section({ title }: { title: string }) {
  const theme = useAppTheme();

  return (
    <AppText
      variant="heading"
      style={{
        fontSize: 16,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.sm,
      }}
    >
      {title}
    </AppText>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
