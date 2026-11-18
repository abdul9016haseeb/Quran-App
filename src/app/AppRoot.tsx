import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Amiri_700Bold } from '@expo-google-fonts/amiri/700Bold';
import { NotoSansTamil_400Regular } from '@expo-google-fonts/noto-sans-tamil/400Regular';
import { NotoSansTamil_500Medium } from '@expo-google-fonts/noto-sans-tamil/500Medium';
import { NotoSansTamil_600SemiBold } from '@expo-google-fonts/noto-sans-tamil/600SemiBold';
import { NotoSansTamil_700Bold } from '@expo-google-fonts/noto-sans-tamil/700Bold';
import { NotoSerifTamil_400Regular } from '@expo-google-fonts/noto-serif-tamil/400Regular';
import { NotoSerifTamil_600SemiBold } from '@expo-google-fonts/noto-serif-tamil/600SemiBold';
import { NotoSerifTamil_700Bold } from '@expo-google-fonts/noto-serif-tamil/700Bold';
import { useFonts } from 'expo-font';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '../navigation/RootNavigator';
import { PreferencesProvider } from './providers/PreferencesProvider';

export function AppRoot() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    NotoSansTamil_400Regular,
    NotoSansTamil_500Medium,
    NotoSansTamil_600SemiBold,
    NotoSansTamil_700Bold,
    NotoSerifTamil_400Regular,
    NotoSerifTamil_600SemiBold,
    NotoSerifTamil_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingMark}>
          <Text style={styles.loadingArabic}>القرآن</Text>
        </View>
        <Text style={styles.loadingTitle}>அல் குர்ஆன்</Text>
        <ActivityIndicator
          color="#C5A059"
          size="small"
          style={{ marginTop: 18 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <RootNavigator />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0B5D3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMark: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: '#C5A059',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  loadingArabic: {
    color: '#C5A059',
    fontSize: 24,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    letterSpacing: 0.3,
  },
});
