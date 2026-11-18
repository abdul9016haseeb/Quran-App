import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  useAppTheme,
  usePreferences,
} from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { Divider } from '../../components/ui/Divider';
import { Screen } from '../../components/ui/Screen';
import { SettingRow } from '../../components/ui/SettingRow';
import { APP_VERSION, LICENCE_STATUS } from '../../constants/app';
import { MOCK_RECITERS } from '../../data/mock/reciters';
import type { RootStackParamList } from '../../navigation/types';

export function SettingsScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reciterId, resolvedMode, resetPreferences } = usePreferences();

  const reciter =
    MOCK_RECITERS.find((item) => item.id === reciterId) ?? MOCK_RECITERS[0]!;

  const confirmReset = () => {
    Alert.alert(
      'விருப்பங்களை மீட்டமைக்கவா?',
      'தோற்றம், எழுத்துரு அளவு, ஓதுபவர் மற்றும் குறிப்புகள் தொடக்க நிலைக்குத் திரும்பும்.',
      [
        { text: 'ரத்து', style: 'cancel' },
        {
          text: 'மீட்டமை',
          style: 'destructive',
          onPress: resetPreferences,
        },
      ],
    );
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 6,
          paddingBottom: 10,
        }}
      >
        <AppText variant="title">அமைப்புகள்</AppText>
        <AppText variant="caption" style={{ marginTop: 2 }}>
          தமிழ் · {resolvedMode === 'dark' ? 'இருள் தோற்றம்' : 'வெளிச்சத் தோற்றம்'}
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card
          tone="muted"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: theme.spacing.md,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Ionicons
              name="construct-outline"
              size={17}
              color={theme.colors.onPrimary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="subheading" style={{ fontSize: 13 }}>
              UI முதல் கட்டம்
            </AppText>
            <AppText variant="caption" style={{ fontSize: 9 }}>
              பின்னணி, கணக்கு மற்றும் சேமிப்பு இன்னும் இல்லை
            </AppText>
          </View>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: theme.radii.xs,
              backgroundColor: theme.colors.goldSoft,
            }}
          >
            <AppText
              variant="label"
              color={theme.colors.goldText}
              style={{ fontSize: 9 }}
            >
              v{APP_VERSION}
            </AppText>
          </View>
        </Card>

        <SectionLabel text="தோற்றம் & வாசிப்பு" />
        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <SettingRow
            icon="color-palette-outline"
            title="தோற்றம் & தீம்"
            subtitle="வெளிச்சம், இருள், சிஸ்டம்"
            value={resolvedMode === 'dark' ? 'இருள்' : 'வெளிச்சம்'}
            onPress={() => navigation.navigate('Appearance')}
          />
          <Divider />
          <SettingRow
            icon="text-outline"
            title="எழுத்துரு & வாசிப்பு"
            subtitle="அரபு, தமிழ் அளவுகள்"
            onPress={() => navigation.navigate('Appearance')}
          />
          <Divider />
          <SettingRow
            icon="language-outline"
            title="மொழி"
            subtitle="தமிழ் முதன்மை மொழி"
            value="தமிழ்"
            showChevron={false}
          />
        </Card>

        <SectionLabel text="ஒலி & ஓதுபவர்" />
        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <SettingRow
            icon="mic-outline"
            title="ஓதுபவர்"
            subtitle="வசன வாரியான ஒலி (இன்னும் இல்லை)"
            value={reciter.name}
            onPress={() => navigation.navigate('ReciterPicker')}
          />
          <Divider />
          <SettingRow
            icon="volume-medium-outline"
            title="ஒலி அமைப்புகள்"
            subtitle="பின்னணி இயக்கம், பதிவிறக்கம்"
            showChevron={false}
            right={
              <AppText variant="caption" style={{ fontSize: 9 }}>
                விரைவில்
              </AppText>
            }
          />
        </Card>

        <SectionLabel text="தொழுகை & கிப்லா" />
        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <SettingRow
            icon="time-outline"
            title="தொழுகை நேரங்கள்"
            subtitle="கொலச்சல் · மாதிரித் தரவு"
            onPress={() =>
              navigation.navigate('MainTabs', { screen: 'Prayer' })
            }
          />
          <Divider />
          <SettingRow
            icon="compass-outline"
            title="கிப்லா திசை"
            subtitle="சென்சார் இணைப்பு நிலுவையில்"
            onPress={() => navigation.navigate('Qibla')}
          />
          <Divider />
          <SettingRow
            icon="calculator-outline"
            title="கணக்கீட்டு முறை"
            subtitle="பள்ளிவாசல் அட்டவணை ஒப்பீடு தேவை"
            value="MWL"
            showChevron={false}
          />
        </Card>

        <SectionLabel text="தரவு & தனியுரிமை" />
        <Card padded={false} style={{ paddingHorizontal: theme.spacing.md }}>
          <SettingRow
            icon="server-outline"
            title="ஆஃப்லைன் தரவு"
            subtitle="குர்ஆன் உரை, மொழிபெயர்ப்பு"
            value="இன்னும் இல்லை"
            showChevron={false}
          />
          <Divider />
          <SettingRow
            icon="shield-checkmark-outline"
            title="தனியுரிமை"
            subtitle="இப்போது எந்தத் தரவும் வெளியே அனுப்பப்படவில்லை"
            showChevron={false}
          />
          <Divider />
          <SettingRow
            icon="information-circle-outline"
            title="செயலி பற்றி & உரிமம்"
            subtitle={LICENCE_STATUS}
            onPress={() => navigation.navigate('About')}
          />
        </Card>

        <Card padded={false} style={{ marginTop: theme.spacing.lg }}>
          <SettingRow
            icon="refresh-outline"
            title="விருப்பங்களை மீட்டமை"
            subtitle="தோற்றம், அளவு, ஓதுபவர், குறிப்புகள்"
            tone="danger"
            onPress={confirmReset}
          />
        </Card>

        <AppText
          variant="caption"
          align="center"
          style={{ marginTop: theme.spacing.xl, fontSize: 10, lineHeight: 16 }}
        >
          அமைப்புகள் இந்த அமர்வில் மட்டுமே நிலைத்திருக்கும். சாதனச் சேமிப்பு
          அடுத்த கட்டத்தில் இணைக்கப்படும்.
        </AppText>
      </ScrollView>
    </Screen>
  );
}

function SectionLabel({ text }: { text: string }) {
  const theme = useAppTheme();

  return (
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
      {text.toUpperCase()}
    </AppText>
  );
}

