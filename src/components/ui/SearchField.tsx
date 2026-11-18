import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

interface SearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'தேடுங்கள்…',
  autoFocus = false,
}: SearchFieldProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={19}
        color={theme.colors.primary}
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontFamily: theme.fonts.tamilRegular,
          },
        ]}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="தேடலை அழி"
          hitSlop={8}
          onPress={() => onChangeText('')}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={theme.colors.textMuted}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
});
