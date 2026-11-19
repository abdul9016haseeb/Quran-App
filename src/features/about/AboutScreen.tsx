import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { Divider } from '../../components/ui/Divider';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import {
  APP_NAME_ARABIC,
  APP_NAME_TAMIL,
  APP_VERSION,
  CONTENT_STATUS_NOTE,
  LICENCE_STATUS,
  REPOSITORY_URL,
} from '../../constants/app';

export function AboutScreen() {
  const theme = useAppTheme();

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader title="செயலி பற்றி" subtitle="நிலை மற்றும் உரிமங்கள்" />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginVertical: theme.spacing.lg }}>
          <View
            style={{
              width: 82,
              height: 82,
              borderRadius: 22,
              backgroundColor: theme.colors.header,
              borderWidth: 1,
              borderColor: theme.colors.gold,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText
              variant="arabic"
              color={theme.colors.gold}
              style={{ fontSize: 25, lineHeight: 40 }}
            >
              {APP_NAME_ARABIC}
            </AppText>
          </View>
          <AppText variant="title" style={{ marginTop: theme.spacing.md }}>
            {APP_NAME_TAMIL}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 2 }}>
            தமிழ் குர்ஆன் செயலி · பதிப்பு {APP_VERSION}
          </AppText>
        </View>

        <Card>
          <AppText variant="subheading" style={{ fontSize: 15 }}>
            இந்தச் செயலி என்ன?
          </AppText>
          <AppText
            variant="bodySmall"
            color={theme.colors.textSecondary}
            style={{ marginTop: 6, fontSize: 12, lineHeight: 19 }}
          >
            தமிழ் வாசிப்பவர்களுக்கான குர்ஆன் செயலி. அரபு உரை, தமிழ்
            மொழிபெயர்ப்பு, வசன வாரியான ஓதுதல், தொழுகை நேரங்கள், கிப்லா மற்றும்
            எதிர்கால ஓதுதல் பயிற்சியை ஒரே அமைதியான இடைமுகத்தில் கொண்டு வருவதே
            நோக்கம். தற்போது ஆஃப்லைன் குர்ஆன் வாசிப்பும் தேடலும் செயல்படுகின்றன;
            ஒலி, தொழுகைக் கணக்கீடு, கிப்லா சென்சார் மற்றும் AI இன்னும் இல்லை.
          </AppText>
        </Card>

        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={{
            fontSize: 10,
            letterSpacing: 0.7,
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.sm,
            marginLeft: 4,
          }}
        >
          தற்போதைய நிலை
        </AppText>

        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <StatusRow
            label="வடிவமைப்பு அடித்தளம்"
            value="முடிந்தது"
            positive
          />
          <Divider />
          <StatusRow label="குர்ஆன் உரை (உத்மானி)" value="இணைக்கப்பட்டது" positive />
          <Divider />
          <StatusRow label="தமிழ் மொழிபெயர்ப்பு" value="இணைக்கப்பட்டது" positive />
          <Divider />
          <StatusRow label="ஆஃப்லைன் வாசிப்பு & தேடல்" value="செயல்படுகிறது" positive />
          <Divider />
          <StatusRow label="ஒலி" value="சரிபார்ப்பு நிலுவையில்" />
          <Divider />
          <StatusRow label="பின்னணிச் சேவை" value="தேவையில்லை (இப்போது)" />
        </Card>

        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={{
            fontSize: 10,
            letterSpacing: 0.7,
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.sm,
            marginLeft: 4,
          }}
        >
          உரிமங்கள் & தகவல்
        </AppText>

        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <InfoRow
            icon="book-outline"
            label="எழுத்துருக்கள்"
            value="Amiri & Noto Tamil · SIL OFL"
          />
          <Divider />
          <InfoRow
            icon="code-slash-outline"
            label="செயலி உரிமம்"
            value={LICENCE_STATUS}
          />
          <Divider />
          <InfoRow
            icon="link-outline"
            label="மூலக் களஞ்சியம்"
            value={REPOSITORY_URL ?? 'இன்னும் வெளியிடப்படவில்லை'}
          />
        </Card>

        <Card
          tone="gold"
          style={{ marginTop: theme.spacing.lg, flexDirection: 'row' }}
        >
          <Ionicons
            name="alert-circle-outline"
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
              தரவு உரிமை எச்சரிக்கை
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.goldText}
              style={{ marginTop: 3, fontSize: 10, lineHeight: 16 }}
            >
              {CONTENT_STATUS_NOTE}. அரபு உரை Tanzil Project-இன் CC BY 3.0
              உரிமத்தின் கீழ் பயன்படுத்தப்படுகிறது; தமிழாக்கம் QuranEnc
              விதிமுறைகளுக்கு உட்பட்டது. ஒலி இன்னும் சேர்க்கப்படவில்லை.
              செயலி மூலக்குறியீடு {LICENCE_STATUS}.
            </AppText>
          </View>
        </Card>

        <AppText
          variant="caption"
          align="center"
          style={{ marginTop: theme.spacing.xl, fontSize: 10, lineHeight: 16 }}
        >
          React Native · Expo · TypeScript{'\n'}
          நன்றி: Amiri மற்றும் Noto எழுத்துரு திட்டங்கள், Expo, React Navigation.
        </AppText>
      </ScrollView>
    </Screen>
  );
}

function StatusRow({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={[styles.row, { paddingVertical: 11, paddingHorizontal: 4 }]}
    >
      <AppText variant="bodySmall" style={{ flex: 1, fontSize: 12 }}>
        {label}
      </AppText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: theme.radii.xs,
          backgroundColor: positive
            ? theme.colors.primarySoft
            : theme.colors.surfaceMuted,
        }}
      >
        <Ionicons
          name={positive ? 'checkmark-circle' : 'time-outline'}
          size={11}
          color={positive ? theme.colors.success : theme.colors.textMuted}
          style={{ marginRight: 4 }}
        />
        <AppText
          variant="caption"
          color={positive ? theme.colors.success : theme.colors.textSecondary}
          style={{ fontSize: 9 }}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.row, { paddingVertical: 11, paddingHorizontal: 4 }]}>
      <Ionicons
        name={icon}
        size={16}
        color={theme.colors.primary}
        style={{ marginRight: 8 }}
      />
      <AppText variant="bodySmall" style={{ flex: 1, fontSize: 12 }}>
        {label}
      </AppText>
      <AppText
        variant="caption"
        style={{ fontSize: 9, maxWidth: 170, textAlign: 'right' }}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
