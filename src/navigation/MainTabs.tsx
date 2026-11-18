import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../app/providers/PreferencesProvider';
import { HomeScreen } from '../features/home/HomeScreen';
import { PrayerTimesScreen } from '../features/prayer/PrayerTimesScreen';
import { SurahIndexScreen } from '../features/quran/SurahIndexScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_META: Record<
  keyof MainTabParamList,
  { label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }
> = {
  Home: { label: 'முகப்பு', icon: 'home-outline', activeIcon: 'home' },
  Quran: { label: 'குர்ஆன்', icon: 'book-outline', activeIcon: 'book' },
  Prayer: { label: 'தொழுகை', icon: 'time-outline', activeIcon: 'time' },
  Settings: {
    label: 'அமைப்புகள்',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
};

export function MainTabs() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const meta = TAB_META[route.name];

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          tabBarLabel: meta.label,
          tabBarLabelStyle: {
            fontFamily: theme.fonts.tamilMedium,
            fontSize: 10,
            marginTop: 1,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            height: 62 + insets.bottom,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 6),
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarItemStyle: {
            paddingVertical: Platform.OS === 'android' ? 2 : 0,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? meta.activeIcon : meta.icon}
              size={Math.min(size, 23)}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quran" component={SurahIndexScreen} />
      <Tab.Screen name="Prayer" component={PrayerTimesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
