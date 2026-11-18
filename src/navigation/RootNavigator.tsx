import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';

import { useAppTheme } from '../app/providers/PreferencesProvider';
import { AboutScreen } from '../features/about/AboutScreen';
import { ReciterPickerScreen } from '../features/audio/ReciterPickerScreen';
import { BookmarksScreen } from '../features/bookmarks/BookmarksScreen';
import { QiblaScreen } from '../features/qibla/QiblaScreen';
import { SurahReaderScreen } from '../features/quran/SurahReaderScreen';
import { SearchScreen } from '../features/search/SearchScreen';
import { AppearanceScreen } from '../features/settings/AppearanceScreen';
import { createNavigationTheme } from './navigationTheme';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useAppTheme();
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SurahReader" component={SurahReaderScreen} />
        <Stack.Screen name="Qibla" component={QiblaScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Appearance" component={AppearanceScreen} />
        <Stack.Screen name="ReciterPicker" component={ReciterPickerScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
