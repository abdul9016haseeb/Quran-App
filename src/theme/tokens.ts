/**
 * Design tokens for the Tamil Quran app.
 *
 * These values are the single source of truth for colour, type, spacing,
 * radius and elevation. Screens must consume them through `useAppTheme()`
 * rather than hard-coding raw values.
 */

export const fonts = {
  arabic: 'Amiri_400Regular',
  arabicBold: 'Amiri_700Bold',
  tamilRegular: 'NotoSansTamil_400Regular',
  tamilMedium: 'NotoSansTamil_500Medium',
  tamilSemiBold: 'NotoSansTamil_600SemiBold',
  tamilBold: 'NotoSansTamil_700Bold',
  serifRegular: 'NotoSerifTamil_400Regular',
  serifSemiBold: 'NotoSerifTamil_600SemiBold',
  serifBold: 'NotoSerifTamil_700Bold',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 30,
  pill: 999,
} as const;

export const fontSize = {
  display: 28,
  title: 23,
  heading: 19,
  subheading: 16,
  body: 15,
  bodySmall: 13,
  caption: 12,
  label: 11,
} as const;

export const lineHeight = {
  display: 37,
  title: 31,
  heading: 27,
  subheading: 24,
  body: 24,
  bodySmall: 20,
  caption: 18,
  label: 15,
} as const;

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceAccent: string;
  surfaceElevated: string;
  header: string;
  headerDeep: string;
  headerText: string;
  headerMuted: string;
  headerAction: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  primarySoft: string;
  onPrimarySoft: string;
  gold: string;
  goldSoft: string;
  goldText: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnDark: string;
  border: string;
  borderStrong: string;
  divider: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
  shadow: string;
  overlay: string;
  success: string;
  warning: string;
  danger: string;
  dangerSoft: string;
}

const lightColors: ColorTokens = {
  background: '#F6F9F5',
  surface: '#FFFFFF',
  surfaceMuted: '#EFF5F0',
  surfaceAccent: '#E4F1E8',
  surfaceElevated: '#FFFFFF',
  header: '#0B5D3B',
  headerDeep: '#073F28',
  headerText: '#FFFFFF',
  headerMuted: '#C6E2D2',
  headerAction: 'rgba(255, 255, 255, 0.13)',
  primary: '#0B5D3B',
  primaryPressed: '#073F28',
  onPrimary: '#FFFFFF',
  primarySoft: '#E4F1E8',
  onPrimarySoft: '#0B5D3B',
  gold: '#B08A47',
  goldSoft: '#F6EDDA',
  goldText: '#7A5A21',
  text: '#14201A',
  textSecondary: '#55655B',
  textMuted: '#7B8A80',
  textOnDark: '#F3F8F4',
  border: '#DFE9E1',
  borderStrong: '#C9D8CD',
  divider: '#EAF0EB',
  tabBar: '#FFFFFF',
  tabActive: '#0B5D3B',
  tabInactive: '#84938A',
  shadow: '#0A2418',
  overlay: 'rgba(6, 32, 22, 0.48)',
  success: '#2E7D52',
  warning: '#A86E1F',
  danger: '#B3261E',
  dangerSoft: '#FBEAE8',
};

const darkColors: ColorTokens = {
  background: '#0A120E',
  surface: '#111D16',
  surfaceMuted: '#16251C',
  surfaceAccent: '#1A3125',
  surfaceElevated: '#14221A',
  header: '#0A3324',
  headerDeep: '#062117',
  headerText: '#F3F8F4',
  headerMuted: '#9CC4AD',
  headerAction: 'rgba(255, 255, 255, 0.09)',
  primary: '#3E9E72',
  primaryPressed: '#31855F',
  onPrimary: '#04140C',
  primarySoft: '#16301F',
  onPrimarySoft: '#B9E4CB',
  gold: '#D6B274',
  goldSoft: '#2A2416',
  goldText: '#E8CF9C',
  text: '#EDF4EF',
  textSecondary: '#A9B8AE',
  textMuted: '#7F9186',
  textOnDark: '#F3F8F4',
  border: '#24362B',
  borderStrong: '#31483A',
  divider: '#1A2A20',
  tabBar: '#0F1A13',
  tabActive: '#8FD3AE',
  tabInactive: '#7A8B80',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.62)',
  success: '#7AC79A',
  warning: '#E2B36A',
  danger: '#F2B8B5',
  dangerSoft: '#3A1A17',
};

export type ResolvedThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ResolvedThemeMode;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  fonts: typeof fonts;
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  shadows: {
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    floating: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export function createTheme(mode: ResolvedThemeMode): AppTheme {
  const colors = mode === 'dark' ? darkColors : lightColors;

  return {
    mode,
    colors,
    spacing,
    radii,
    fonts,
    fontSize,
    lineHeight,
    shadows: {
      card: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: mode === 'dark' ? 0.24 : 0.05,
        shadowRadius: 16,
        elevation: mode === 'dark' ? 0 : 2,
      },
      floating: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: mode === 'dark' ? 0.34 : 0.12,
        shadowRadius: 24,
        elevation: 9,
      },
    },
  };
}
