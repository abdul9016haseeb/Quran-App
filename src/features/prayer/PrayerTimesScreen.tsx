import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { IconButton } from '../../components/ui/IconButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import {
  SegmentedControl,
  type SegmentOption,
} from '../../components/ui/SegmentedControl';
import { useLiveClock } from '../../hooks/useLiveClock';
import {
  DEFAULT_LOCATION,
  SAMPLE_MONTHLY_PRAYERS,
  SAMPLE_NEXT_PRAYER_INDEX,
  SAMPLE_PRAYER_TIMES,
  SAMPLE_PRAYER_TIMES_TOMORROW,
} from '../../data/mock/prayerTimes';
import { PrayerRow } from './components/PrayerRow';
import type { RootStackParamList } from '../../navigation/types';

type PrayerView = 'today' | 'tomorrow' | 'month';

const VIEWS: readonly SegmentOption<PrayerView>[] = [
  { value: 'today', label: 'இன்று' },
  { value: 'tomorrow', label: 'நாளை' },
  { value: 'month', label: 'மாதவாரி' },
];

export function PrayerTimesScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const now = useLiveClock();
  const [view, setView] = useState<PrayerView>('today');
  const [refreshed, setRefreshed] = useState(false);

  const hours = now.getHours();
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const meridiem = hours < 12 ? 'AM' : 'PM';

  const todayRows =
    view === 'tomorrow' ? SAMPLE_PRAYER_TIMES_TOMORROW : SAMPLE_PRAYER_TIMES;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 6,
          paddingBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText variant="title">தொழுகை நேரங்கள்</AppText>
          <AppText variant="caption" style={{ marginTop: 2 }}>
            {DEFAULT_LOCATION.districtTamil}
          </AppText>
        </View>
        <SampleBadge />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: 10,
          }}
        >
          <View
            accessible
            accessibilityLabel={`இருப்பிடம்: ${DEFAULT_LOCATION.nameTamil}`}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: theme.colors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Ionicons
                name="location"
                size={15}
                color={theme.colors.primary}
              />
            </View>
            <View>
              <AppText variant="label" style={{ fontSize: 12 }}>
                {DEFAULT_LOCATION.nameTamil}
              </AppText>
              <AppText variant="caption" style={{ fontSize: 9 }}>
                {DEFAULT_LOCATION.timezone}
              </AppText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText
              variant="caption"
              color={
                refreshed ? theme.colors.success : theme.colors.textMuted
              }
              style={{ fontSize: 9, marginRight: 2 }}
            >
              {refreshed ? 'புதுப்பிக்கப்பட்டது' : 'மாதிரி இருப்பிடம்'}
            </AppText>
            <IconButton
              name="refresh"
              label="தொழுகை நேரங்களைப் புதுப்பி"
              onPress={() => setRefreshed(true)}
              size={16}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: theme.spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <AppText
              variant="display"
              style={{
                fontSize: 52,
                lineHeight: 60,
                fontVariant: ['tabular-nums'],
              }}
            >
              {displayHour}:{minutes}
            </AppText>
            <AppText
              variant="label"
              color={theme.colors.textSecondary}
              style={{ fontSize: 14, marginBottom: 8, marginLeft: 4 }}
            >
              {meridiem}
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={{ marginBottom: 10, marginLeft: 4 }}
            >
              {seconds}
            </AppText>
          </View>
          <AppText variant="caption" style={{ fontSize: 10 }}>
            சாதனத்தின் உள்ளூர் நேரம்
          </AppText>
        </View>

        <Card style={{ marginTop: theme.spacing.lg, padding: theme.spacing.md }}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: theme.colors.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={17}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <AppText variant="subheading" style={{ fontSize: 14 }}>
                  தொழுகை அறிவிப்புகள்
                </AppText>
                <AppText variant="caption" style={{ fontSize: 9 }}>
                  இன்னும் இயக்கப்படவில்லை
                </AppText>
              </View>
            </View>
            <Switch
              value={false}
              disabled
              accessibilityLabel="தொழுகை அறிவிப்புகள் இன்னும் இயக்கப்படவில்லை"
              trackColor={{
                false: theme.colors.surfaceMuted,
                true: theme.colors.surfaceMuted,
              }}
              thumbColor={theme.colors.textMuted}
            />
          </View>

          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: theme.colors.divider,
              marginVertical: 10,
            }}
          />

          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="volume-medium-outline"
                size={17}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <AppText variant="bodySmall">அறிவிப்பு ஒலி</AppText>
            </View>
            <AppText variant="caption" style={{ fontSize: 10 }}>
              இன்னும் இல்லை
            </AppText>
          </View>

          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={{ fontSize: 9, lineHeight: 15, marginTop: 10 }}
          >
            அறிவிப்பு ஒலி, அலாரம் மற்றும் பேட்டரி அனுமதி ஆகியவை மாதிரிக்
            காட்சிகள் மட்டுமே; எந்த அமைப்பும் இன்னும் இணைக்கப்படவில்லை.
          </AppText>
        </Card>

        <View style={{ marginTop: theme.spacing.lg }}>
          <SegmentedControl options={VIEWS} value={view} onChange={setView} />
        </View>

        {view === 'month' ? (
          <Card
            padded={false}
            style={{ marginTop: theme.spacing.md, overflow: 'hidden' }}
          >
            <View
              style={{
                backgroundColor: theme.colors.primarySoft,
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: 'row',
              }}
            >
              <AppText
                variant="label"
                color={theme.colors.onPrimarySoft}
                style={{ width: 42, fontSize: 9 }}
              >
                தேதி
              </AppText>
              {['பஜர்', 'லுஹர்', 'அஸ்ர்', 'மக்ரிப்', 'இஷா'].map((label) => (
                <AppText
                  key={label}
                  variant="label"
                  color={theme.colors.onPrimarySoft}
                  align="center"
                  style={{ flex: 1, fontSize: 9 }}
                >
                  {label}
                </AppText>
              ))}
            </View>
            {SAMPLE_MONTHLY_PRAYERS.map((row, index) => (
              <View
                key={row.day}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 9,
                  borderTopWidth:
                    index === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: theme.colors.divider,
                }}
              >
                <View style={{ width: 42 }}>
                  <AppText variant="label" style={{ fontSize: 11 }}>
                    {row.day}
                  </AppText>
                  <AppText variant="caption" style={{ fontSize: 7 }}>
                    {row.weekday}
                  </AppText>
                </View>
                {[row.fajr, row.dhuhr, row.asr, row.maghrib, row.isha].map(
                  (time, timeIndex) => (
                    <AppText
                      key={`${row.day}-${timeIndex}`}
                      variant="caption"
                      align="center"
                      style={{ flex: 1, fontSize: 9 }}
                    >
                      {time}
                    </AppText>
                  ),
                )}
              </View>
            ))}
            <View
              style={{
                padding: 10,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: theme.colors.divider,
              }}
            >
              <AppText variant="caption" style={{ fontSize: 9 }}>
                மாதிரி அட்டவணை · நவம்பர் 2026 · AlAdhan ஒருங்கிணைப்பு
                இன்னும் இல்லை
              </AppText>
            </View>
          </Card>
        ) : (
          <View style={{ marginTop: theme.spacing.md }}>
            {view === 'tomorrow' ? (
              <AppText
                variant="caption"
                style={{ fontSize: 10, marginBottom: 8, marginLeft: 4 }}
              >
                நாளைக்கான மாதிரி நேரங்கள்
              </AppText>
            ) : null}
            {todayRows.map((prayer, index) => (
              <PrayerRow
                key={prayer.id}
                prayer={prayer}
                highlighted={view === 'today' && index === SAMPLE_NEXT_PRAYER_INDEX}
              />
            ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="கிப்லா திசையைத் திற"
          onPress={() => navigation.navigate('Qibla')}
          style={({ pressed }) => [
            {
              marginTop: theme.spacing.md,
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.header,
              padding: theme.spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              borderWidth: 1,
              borderColor: theme.colors.gold,
              backgroundColor: theme.colors.headerDeep,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}
          >
            <Ionicons
              name="compass-outline"
              size={20}
              color={theme.colors.gold}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText
              variant="subheading"
              color={theme.colors.headerText}
              style={{ fontSize: 15 }}
            >
              கிப்லா திசை
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.headerMuted}
              style={{ fontSize: 10 }}
            >
              {DEFAULT_LOCATION.qiblaBearing.toFixed(1)}° ·{' '}
              {DEFAULT_LOCATION.nameTamil}
            </AppText>
          </View>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={theme.colors.headerMuted}
          />
        </Pressable>

        <AppText
          variant="caption"
          align="center"
          style={{ fontSize: 10, lineHeight: 16, marginTop: theme.spacing.lg }}
        >
          நேரங்கள் வடிவமைப்புக்கான மாதிரி. AlAdhan API, இருப்பிட அனுமதி மற்றும்
          அறிவிப்பு திட்டமிடல் இன்னும் இணைக்கப்படவில்லை.
        </AppText>
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
