import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  useAppTheme,
  usePreferences,
} from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { MOCK_RECITERS } from '../../data/mock/reciters';
import type { RootStackParamList } from '../../navigation/types';

export function ReciterPickerScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reciterId, setReciterId } = usePreferences();

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="ஓதுபவர் தேர்வு"
        subtitle="வசன வாரியான ஒலி"
        right={<SampleBadge />}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card padded={false} style={{ overflow: 'hidden' }}>
          {MOCK_RECITERS.map((reciter, index) => {
            const selected = reciter.id === reciterId;
            return (
              <Pressable
                key={reciter.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={reciter.name}
                onPress={() => setReciterId(reciter.id)}
                style={({ pressed }) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 13,
                    paddingHorizontal: theme.spacing.lg,
                    borderTopWidth:
                      index === 0 ? 0 : StyleSheet.hairlineWidth,
                    borderTopColor: theme.colors.divider,
                    backgroundColor: selected
                      ? theme.colors.primarySoft
                      : pressed
                        ? theme.colors.surfaceMuted
                        : 'transparent',
                  },
                ]}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: selected
                      ? theme.colors.primary
                      : theme.colors.surfaceMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: theme.spacing.md,
                  }}
                >
                  <Ionicons
                    name="mic-outline"
                    size={17}
                    color={
                      selected
                        ? theme.colors.onPrimary
                        : theme.colors.textSecondary
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <AppText
                    variant="subheading"
                    color={
                      selected ? theme.colors.onPrimarySoft : theme.colors.text
                    }
                    style={{ fontSize: 14 }}
                  >
                    {reciter.name}
                  </AppText>
                  <AppText
                    variant="caption"
                    style={{ fontSize: 9, marginTop: 1 }}
                  >
                    {reciter.style} · ஒலி இன்னும் இணைக்கப்படவில்லை
                  </AppText>
                </View>

                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 1.5,
                    borderColor: selected
                      ? theme.colors.primary
                      : theme.colors.borderStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selected ? (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: theme.colors.primary,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </Card>

        <Card
          tone="gold"
          style={{ marginTop: theme.spacing.lg, flexDirection: 'row' }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={17}
            color={theme.colors.goldText}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <AppText
            variant="caption"
            color={theme.colors.goldText}
            style={{ flex: 1, fontSize: 10, lineHeight: 16 }}
          >
            ஓதுபவர் பெயர்கள் மட்டுமே மாதிரித் தரவு. ஒலிக் கோப்புகளின் முழுமை,
            ஒலி உரிமம் மற்றும் மறுவிநியோக அனுமதி சரிபார்க்கப்பட்ட பிறகே
            இயக்கி இணைக்கப்படும்.
          </AppText>
        </Card>

        <PrimaryButton
          label="சரி"
          onPress={() => navigation.goBack()}
          style={{ marginTop: theme.spacing.xl }}
        />
      </ScrollView>
    </Screen>
  );
}
