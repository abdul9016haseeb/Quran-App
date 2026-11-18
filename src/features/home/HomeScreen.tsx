import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, usePreferences } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { IconButton, type IoniconName } from '../../components/ui/IconButton';
import { Pill } from '../../components/ui/Pill';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { SectionHeading } from '../../components/ui/SectionHeading';
import {
  APP_NAME_ARABIC,
  APP_NAME_TAMIL,
  APP_TAGLINE,
} from '../../constants/app';
import {
  DEFAULT_LOCATION,
  SAMPLE_NEXT_PRAYER_IN_MINUTES,
  SAMPLE_PRAYER_TIMES,
} from '../../data/mock/prayerTimes';
import type { RootStackParamList } from '../../navigation/types';

const nextPrayer = SAMPLE_PRAYER_TIMES[1];
const continueTarget = { surahId: 2, ayah: 255 };

export function HomeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { resolvedMode, setThemePreference } = usePreferences();
  const [refreshed, setRefreshed] = useState(false);

  const openSettingsTab = () =>
    navigation.navigate('MainTabs', { screen: 'Settings' });
  const openPrayerTab = () =>
    navigation.navigate('MainTabs', { screen: 'Prayer' });
  const openQuranTab = () =>
    navigation.navigate('MainTabs', { screen: 'Quran' });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: theme.colors.header,
            paddingTop: insets.top + 10,
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: 66,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: 'hidden',
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: 'rgba(255,255,255,0.05)',
              right: -70,
              top: -80,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.10)',
              right: 30,
              bottom: -30,
            }}
          />

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText
                  variant="arabicSmall"
                  color={theme.colors.gold}
                  style={{ fontSize: 18, lineHeight: 24 }}
                >
                  {APP_NAME_ARABIC}
                </AppText>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.colors.gold,
                    marginHorizontal: 8,
                  }}
                />
                <AppText
                  variant="caption"
                  color={theme.colors.headerMuted}
                  style={{ letterSpacing: 0.8, fontSize: 10 }}
                >
                  TAMIL QURAN
                </AppText>
              </View>
              <AppText
                variant="title"
                color={theme.colors.headerText}
                style={{ fontSize: 27, lineHeight: 36, marginTop: 2 }}
              >
                {APP_NAME_TAMIL}
              </AppText>
              <AppText
                variant="caption"
                color={theme.colors.headerMuted}
                style={{ marginTop: 1 }}
              >
                {APP_TAGLINE}
              </AppText>
            </View>

            <View style={{ flexDirection: 'row', gap: 6 }}>
              <IconButton
                name="compass-outline"
                label="கிப்லா திசை"
                onPress={() => navigation.navigate('Qibla')}
                variant="onGreen"
              />
              <IconButton
                name={resolvedMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                label="தோற்ற முறையை மாற்று"
                onPress={() =>
                  setThemePreference(resolvedMode === 'dark' ? 'light' : 'dark')
                }
                variant="onGreen"
              />
              <IconButton
                name="settings-outline"
                label="அமைப்புகள்"
                onPress={openSettingsTab}
                variant="onGreen"
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <Card
            elevated
            style={{ marginTop: -52, borderRadius: theme.radii.lg }}
          >
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={theme.colors.textSecondary}
                />
                <AppText
                  variant="caption"
                  color={theme.colors.textSecondary}
                  style={{ marginLeft: 3 }}
                >
                  {DEFAULT_LOCATION.nameTamil}
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="தொழுகை நேரங்களைப் புதுப்பி"
                hitSlop={10}
                onPress={() => setRefreshed(true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Ionicons
                  name="refresh"
                  size={14}
                  color={
                    refreshed ? theme.colors.success : theme.colors.textMuted
                  }
                />
                <AppText
                  variant="caption"
                  color={
                    refreshed ? theme.colors.success : theme.colors.textMuted
                  }
                  style={{ fontSize: 10, marginLeft: 3 }}
                >
                  {refreshed ? 'புதுப்பிக்கப்பட்டது' : 'மாதிரி'}
                </AppText>
              </Pressable>
            </View>

            <View style={[styles.rowBetween, { marginTop: 6 }]}>
              <View>
                <AppText
                  variant="subheading"
                  color={theme.colors.primary}
                  style={{ fontFamily: theme.fonts.serifSemiBold }}
                >
                  {nextPrayer?.nameTamil ?? 'லுஹர்'}
                </AppText>
                <AppText
                  variant="display"
                  style={{
                    fontSize: 30,
                    fontVariant: ['tabular-nums'],
                    marginTop: 1,
                  }}
                >
                  {nextPrayer?.time ?? '12:07 PM'}
                </AppText>
              </View>
              <Pill
                label="தொழுகை நேரம்"
                icon="arrow-forward"
                onPress={openPrayerTab}
              />
            </View>

            <View
              style={[
                styles.rowBetween,
                {
                  marginTop: 8,
                  paddingTop: 10,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: theme.colors.divider,
                },
              ]}
            >
              <AppText variant="caption" style={{ fontSize: 11 }}>
                அடுத்த தொழுகை · இன்னும் {SAMPLE_NEXT_PRAYER_IN_MINUTES} நிமிடம்
              </AppText>
              <SampleBadge />
            </View>
          </Card>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`கடைசியாகப் படித்தது: அல்பகரா, வசனம் ${continueTarget.ayah}`}
            onPress={() =>
              navigation.navigate('SurahReader', {
                surahId: continueTarget.surahId,
              })
            }
            style={({ pressed }) => [
              {
                marginTop: theme.spacing.lg,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: theme.radii.lg,
                padding: theme.spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.colors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}
            >
              <Ionicons
                name="book-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                கடைசியாகப் படித்தது
              </AppText>
              <AppText variant="subheading" style={{ marginTop: 1 }}>
                அல்பகரா · வசனம் {continueTarget.ayah}
              </AppText>
              <AppText variant="caption" style={{ fontSize: 10 }}>
                பாகம் 30 · தமிழ் மொழிபெயர்ப்புடன்
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText
                variant="label"
                color={theme.colors.primary}
                style={{ fontSize: 11 }}
              >
                42%
              </AppText>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.textMuted}
                style={{ marginTop: 4 }}
              />
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="குர்ஆனைப் படிக்கத் தொடங்கு"
            onPress={openQuranTab}
            style={({ pressed }) => [
              {
                marginTop: theme.spacing.lg,
                backgroundColor: theme.colors.header,
                borderRadius: theme.radii.xl,
                padding: theme.spacing.xl,
                overflow: 'hidden',
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: 170,
                height: 170,
                borderRadius: 85,
                backgroundColor: 'rgba(255,255,255,0.05)',
                right: -50,
                top: -50,
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <AppText
                  variant="caption"
                  color={theme.colors.gold}
                  style={{ fontSize: 10, letterSpacing: 1 }}
                >
                  அல் குர்ஆன்
                </AppText>
                <AppText
                  variant="heading"
                  color={theme.colors.headerText}
                  style={{ fontSize: 21, lineHeight: 30, marginTop: 3 }}
                >
                  அமைதியுடன்{'\n'}வாசிக்கத் தொடங்குங்கள்
                </AppText>
                <AppText
                  variant="caption"
                  color={theme.colors.headerMuted}
                  style={{ marginTop: 4 }}
                >
                  114 அத்தியாயங்கள் · தமிழ் விளக்கம்
                </AppText>
                <View
                  style={{
                    marginTop: theme.spacing.md,
                    alignSelf: 'flex-start',
                    backgroundColor: theme.colors.headerText,
                    borderRadius: theme.radii.pill,
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <AppText
                    variant="label"
                    color={theme.colors.headerDeep}
                    style={{ fontSize: 12 }}
                  >
                    படிக்க
                  </AppText>
                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color={theme.colors.headerDeep}
                    style={{ marginLeft: 6 }}
                  />
                </View>
              </View>

              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 1.5,
                  borderColor: theme.colors.gold,
                  backgroundColor: theme.colors.headerDeep,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: 41,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: 'rgba(197,160,89,0.45)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppText
                    variant="arabic"
                    color={theme.colors.gold}
                    style={{ fontSize: 24, lineHeight: 40 }}
                  >
                    القرآن
                  </AppText>
                </View>
              </View>
            </View>
          </Pressable>

          <View
            style={{
              marginTop: theme.spacing.lg,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: theme.radii.pill,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 4,
            }}
          >
            <QuickAction
              icon="search-outline"
              label="தேடல்"
              onPress={() => navigation.navigate('Search')}
            />
            <View
              style={{
                width: StyleSheet.hairlineWidth,
                height: 22,
                backgroundColor: theme.colors.divider,
              }}
            />
            <QuickAction
              icon="compass-outline"
              label="கிப்லா"
              onPress={() => navigation.navigate('Qibla')}
            />
            <View
              style={{
                width: StyleSheet.hairlineWidth,
                height: 22,
                backgroundColor: theme.colors.divider,
              }}
            />
            <QuickAction
              icon="bookmark-outline"
              label="குறிப்புகள்"
              onPress={() => navigation.navigate('Bookmarks')}
            />
          </View>

          <SectionHeading
            title="கூடுதல்"
            style={{ marginTop: theme.spacing.xxl, marginBottom: theme.spacing.md }}
          />

          <View style={styles.grid}>
            <ExploreCard
              icon="options-outline"
              title="வாசிப்பு அனுபவம்"
              caption="எழுத்துரு அளவு, தோற்றம்"
              onPress={() => navigation.navigate('Appearance')}
            />
            <ExploreCard
              icon="mic-outline"
              title="ஓதுபவர் தேர்வு"
              caption="ஒலி அமைப்புகள்"
              onPress={() => navigation.navigate('ReciterPicker')}
            />
            <ExploreCard
              icon="time-outline"
              title="தொழுகை நேரம்"
              caption="இன்றைய அட்டவணை"
              onPress={openPrayerTab}
            />
            <ExploreCard
              icon="information-circle-outline"
              title="செயலி பற்றி"
              caption="தரவு, உரிமங்கள், நிலை"
              onPress={() => navigation.navigate('About')}
            />
          </View>

          <View
            style={{
              marginTop: theme.spacing.xl,
              paddingTop: theme.spacing.md,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: theme.colors.divider,
            }}
          >
            <AppText
              variant="caption"
              align="center"
              style={{ fontSize: 10, lineHeight: 16 }}
            >
              UI மாதிரி · குர்ஆன் உரை, மொழிபெயர்ப்பு மற்றும் ஒலி இன்னும்
              இணைக்கப்படவில்லை.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <Ionicons name={icon} size={17} color={theme.colors.primary} />
      <AppText
        variant="label"
        color={theme.colors.text}
        style={{ fontSize: 11, marginLeft: 5 }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function ExploreCard({
  icon,
  title,
  caption,
  onPress,
}: {
  icon: IoniconName;
  title: string;
  caption: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        width: '48.4%',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.lg,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.goldSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.goldText} />
      </View>
      <AppText variant="subheading" style={{ fontSize: 15 }}>
        {title}
      </AppText>
      <AppText variant="caption" style={{ fontSize: 10, marginTop: 2 }}>
        {caption}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
});
