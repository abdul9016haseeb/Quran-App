import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import type { RootStackParamList } from '../../navigation/types';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** White detail header used by every non-home screen. */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  showBack = true,
  style,
}: ScreenHeaderProps) {
  const theme = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.divider,
          paddingHorizontal: theme.spacing.lg,
        },
        style,
      ]}
    >
      {showBack ? (
        <IconButton
          name="chevron-back"
          label="பின்செல்"
          onPress={() => {
            if (onBack) {
              onBack();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={{ marginRight: theme.spacing.sm }}
        />
      ) : null}

      <View style={styles.titleBlock}>
        <AppText variant="heading" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            numberOfLines={1}
            style={{ marginTop: 1 }}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
