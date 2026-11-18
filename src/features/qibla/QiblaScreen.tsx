import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { DEFAULT_LOCATION } from '../../data/mock/prayerTimes';
import { Compass } from './components/Compass';
import type { RootStackParamList } from '../../navigation/types';

export function QiblaScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="கிப்லா திசை"
        subtitle="மக்கா நோக்கிய திசை"
        right={<SampleBadge />}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            padding: theme.spacing.md,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: theme.colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Ionicons name="location" size={18} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="subheading" style={{ fontSize: 15 }}>
              {DEFAULT_LOCATION.nameTamil}
            </AppText>
            <AppText variant="caption" style={{ fontSize: 10 }}>
              {DEFAULT_LOCATION.districtTamil} · {DEFAULT_LOCATION.timezone}
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText
              variant="label"
              color={theme.colors.goldText}
              style={{ fontSize: 10 }}
            >
              கிப்லா கோணம்
            </AppText>
            <AppText variant="subheading" style={{ fontSize: 15 }}>
              {DEFAULT_LOCATION.qiblaBearing.toFixed(1)}°
            </AppText>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
          }}
        >
          <Compass bearing={DEFAULT_LOCATION.qiblaBearing} size={286} />
          <AppText
            variant="heading"
            align="center"
            style={{ marginTop: theme.spacing.lg }}
          >
            {DEFAULT_LOCATION.qiblaBearing.toFixed(1)}° வடமேற்கு
          </AppText>
          <AppText
            variant="caption"
            align="center"
            style={{ fontSize: 10, marginTop: 2 }}
          >
            மக்கத்துல் முகர்ரமா நோக்கிய திசை (மாதிரிக் கோணம்)
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Card
            style={{
              flex: 1,
              padding: theme.spacing.md,
              alignItems: 'center',
            }}
          >
            <AppText variant="caption" style={{ fontSize: 9 }}>
              அளவு
            </AppText>
            <AppText variant="heading" style={{ fontSize: 18 }}>
              294.4°
            </AppText>
          </Card>
          <Card
            style={{
              flex: 1,
              padding: theme.spacing.md,
              alignItems: 'center',
            }}
          >
            <AppText variant="caption" style={{ fontSize: 9 }}>
              திசை
            </AppText>
            <AppText variant="heading" style={{ fontSize: 18 }}>
              WNW
            </AppText>
          </Card>
        </View>

        <Card
          tone="gold"
          style={{ marginTop: theme.spacing.lg, flexDirection: 'row' }}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={theme.colors.goldText}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <View style={{ flex: 1 }}>
            <AppText
              variant="subheading"
              color={theme.colors.goldText}
              style={{ fontSize: 13 }}
            >
              சென்சார் இன்னும் இணைக்கப்படவில்லை
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.goldText}
              style={{ marginTop: 3, fontSize: 10, lineHeight: 16 }}
            >
              இந்தக் கோணம் வடிவமைப்புக்கான மாதிரி. அடுத்த கட்டத்தில்
              இருப்பிட அனுமதி, காந்தமானி (magnetometer) மற்றும் சாதனச்
              சுழற்சி ஆகியவை இணைக்கப்படும். சென்சார் துல்லியம் சாதனத்தைப்
              பொறுத்து மாறுபடும்.
            </AppText>
          </View>
        </Card>

        <View style={{ marginTop: theme.spacing.lg, gap: 10 }}>
          <InfoLine
            icon="navigate-outline"
            text="சாதனத்தைத் தட்டையாகப் பிடித்து, வடக்கு அம்புக்குறியைச் சீரமைக்கவும்."
          />
          <InfoLine
            icon="shield-checkmark-outline"
            text="இருப்பிடம் சாதனத்தில் மட்டுமே பயன்படுத்தப்படும்; சேவையகத்திற்கு அனுப்பப்படாது."
          />
          <InfoLine
            icon="compass-outline"
            text="காந்தப் பொருட்கள் அருகில் இருந்தால் திசை தவறாகக் காட்டலாம்."
          />
        </View>

        <PrimaryButton
          label="தொழுகை நேரங்களுக்குத் திரும்பு"
          variant="soft"
          icon="time-outline"
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'Prayer' })
          }
          style={{ marginTop: theme.spacing.xl }}
        />
      </ScrollView>
    </Screen>
  );
}

function InfoLine({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Ionicons
        name={icon}
        size={15}
        color={theme.colors.textMuted}
        style={{ marginTop: 2, marginRight: 8 }}
      />
      <AppText
        variant="bodySmall"
        color={theme.colors.textSecondary}
        style={{ flex: 1, fontSize: 12, lineHeight: 18 }}
      >
        {text}
      </AppText>
    </View>
  );
}

