import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';
import { type IoniconName } from './IconButton';

interface EmptyStateProps {
  icon: IoniconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xxxl }]}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: theme.colors.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
        }}
      >
        <Ionicons name={icon} size={32} color={theme.colors.textMuted} />
      </View>
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      <AppText
        variant="bodySmall"
        align="center"
        color={theme.colors.textSecondary}
        style={{ marginTop: theme.spacing.sm, maxWidth: 300 }}
      >
        {description}
      </AppText>
      {actionLabel && onAction ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          variant="soft"
          style={{ marginTop: theme.spacing.xl, alignSelf: 'stretch' }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
