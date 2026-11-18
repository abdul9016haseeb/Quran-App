import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '../../app/providers/PreferencesProvider';

export type AppTextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'arabic'
  | 'arabicSmall'
  | 'readerTamil';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children?: React.ReactNode;
}

/**
 * Typography primitive. All text should go through this component so the
 * Arabic/Tamil families, line heights and accessibility limits stay
 * consistent. Font weight is expressed by selecting a family, never by
 * setting fontWeight on a custom-loaded font.
 */
export function AppText({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const theme = useAppTheme();

  const variantStyle = getVariantStyle(variant, theme);

  return (
    <Text
      maxFontSizeMultiplier={1.8}
      {...rest}
      style={[
        variantStyle,
        { color: color ?? theme.colors.text },
        align ? { textAlign: align } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function getVariantStyle(
  variant: AppTextVariant,
  theme: ReturnType<typeof useAppTheme>,
): TextStyle {
  const { colors, fonts, fontSize, lineHeight } = theme;

  switch (variant) {
    case 'display':
      return {
        fontFamily: fonts.serifBold,
        fontSize: fontSize.display,
        lineHeight: lineHeight.display,
      };
    case 'title':
      return {
        fontFamily: fonts.serifBold,
        fontSize: fontSize.title,
        lineHeight: lineHeight.title,
      };
    case 'heading':
      return {
        fontFamily: fonts.serifSemiBold,
        fontSize: fontSize.heading,
        lineHeight: lineHeight.heading,
      };
    case 'subheading':
      return {
        fontFamily: fonts.tamilSemiBold,
        fontSize: fontSize.subheading,
        lineHeight: lineHeight.subheading,
      };
    case 'body':
      return {
        fontFamily: fonts.tamilRegular,
        fontSize: fontSize.body,
        lineHeight: lineHeight.body,
      };
    case 'bodySmall':
      return {
        fontFamily: fonts.tamilRegular,
        fontSize: fontSize.bodySmall,
        lineHeight: lineHeight.bodySmall,
      };
    case 'caption':
      return {
        fontFamily: fonts.tamilRegular,
        fontSize: fontSize.caption,
        lineHeight: lineHeight.caption,
        color: colors.textMuted,
      };
    case 'label':
      return {
        fontFamily: fonts.tamilSemiBold,
        fontSize: fontSize.label,
        lineHeight: lineHeight.label,
        letterSpacing: 0.3,
      };
    case 'arabic':
      return {
        fontFamily: fonts.arabic,
        fontSize: 30,
        lineHeight: 52,
        writingDirection: 'rtl',
      };
    case 'arabicSmall':
      return {
        fontFamily: fonts.arabic,
        fontSize: 20,
        lineHeight: 34,
        writingDirection: 'rtl',
      };
    case 'readerTamil':
      return {
        fontFamily: fonts.tamilRegular,
        fontSize: 17,
        lineHeight: 30,
      };
    default:
      return {
        fontFamily: fonts.tamilRegular,
        fontSize: fontSize.body,
        lineHeight: lineHeight.body,
      };
  }
}
