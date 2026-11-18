import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme, usePreferences } from '../../app/providers/PreferencesProvider';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { IconButton } from '../../components/ui/IconButton';
import { SampleBadge } from '../../components/ui/SampleBadge';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import type { RootStackParamList } from '../../navigation/types';

export function BookmarksScreen() {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookmarks, removeBookmark } = usePreferences();

  return (
    <Screen>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="குறிப்புகள்"
        subtitle={`${bookmarks.length} சேமிக்கப்பட்ட இடங்கள்`}
        right={<SampleBadge />}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xxxl,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {bookmarks.length === 0 ? (
          <EmptyState
            icon="bookmark-outline"
            title="குறிப்புகள் எதுவும் இல்லை"
            description="வசனங்களைச் சேமிக்க வாசிப்புத் திரையில் உள்ள குறிப்பு குறியீட்டை அழுத்தவும்."
            actionLabel="குர்ஆனைத் திற"
            onAction={() =>
              navigation.navigate('MainTabs', { screen: 'Quran' })
            }
          />
        ) : (
          <>
            {bookmarks.map((bookmark) => (
              <Pressable
                key={bookmark.id}
                accessibilityRole="button"
                accessibilityLabel={`${bookmark.surahName}, வசனம் ${bookmark.ayahNumber}`}
                onPress={() =>
                  navigation.navigate('SurahReader', {
                    surahId: bookmark.surahId,
                  })
                }
                style={({ pressed }) => [
                  {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radii.lg,
                    padding: theme.spacing.lg,
                    marginBottom: theme.spacing.md,
                    opacity: pressed ? 0.82 : 1,
                  },
                  theme.mode === 'light' ? theme.shadows.card : null,
                ]}
              >
                <View style={styles.row}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: theme.radii.sm,
                      backgroundColor: theme.colors.goldSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: theme.spacing.md,
                    }}
                  >
                    <AppText
                      variant="label"
                      color={theme.colors.goldText}
                      style={{ fontSize: 12 }}
                    >
                      {bookmark.ayahNumber}
                    </AppText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <AppText variant="subheading" style={{ fontSize: 15 }}>
                      {bookmark.surahName}
                    </AppText>
                    <AppText variant="caption" style={{ fontSize: 10 }}>
                      வசனம் {bookmark.ayahNumber}
                      {bookmark.note ? ` · ${bookmark.note}` : ''}
                    </AppText>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <AppText variant="caption" style={{ fontSize: 9 }}>
                      {bookmark.addedLabel}
                    </AppText>
                    <IconButton
                      name="trash-outline"
                      label="குறிப்பை நீக்கு"
                      onPress={() => removeBookmark(bookmark.id)}
                      size={16}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                </View>

                <View
                  style={{
                    marginTop: theme.spacing.md,
                    paddingTop: theme.spacing.md,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: theme.colors.divider,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name="book-outline"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <AppText
                    variant="caption"
                    color={theme.colors.primary}
                    style={{ fontSize: 10, marginLeft: 5 }}
                  >
                    வாசிப்பைத் தொடர
                  </AppText>
                  <View style={{ flex: 1 }} />
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={theme.colors.textMuted}
                  />
                </View>
              </Pressable>
            ))}

            <Card
              tone="muted"
              style={{ marginTop: theme.spacing.sm, flexDirection: 'row' }}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={theme.colors.textMuted}
                style={{ marginRight: 8, marginTop: 1 }}
              />
              <AppText
                variant="caption"
                style={{ flex: 1, fontSize: 10, lineHeight: 16 }}
              >
                குறிப்புகள் இந்த அமர்வில் மட்டுமே நிலைத்திருக்கும். SQLite
                சேமிப்பு அடுக்கு அடுத்த கட்டத்தில் இணைக்கப்படும்.
              </AppText>
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
