import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { INITIAL_BOOKMARKS } from '../../data/mock/bookmarks';
import { DEFAULT_RECITER_ID } from '../../data/mock/reciters';
import {
  clearStoredThemePreference,
  loadStoredThemePreference,
  saveStoredThemePreference,
} from '../../services/storage/preferencesStorage';
import type { Bookmark, ReadingMode } from '../../types/content';
import {
  createTheme,
  type AppTheme,
  type ResolvedThemeMode,
} from '../../theme/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

interface Preferences {
  themePreference: ThemePreference;
  resolvedMode: ResolvedThemeMode;
  theme: AppTheme;
  arabicFontSize: number;
  tamilFontSize: number;
  readingMode: ReadingMode;
  reciterId: string;
  bookmarks: Bookmark[];
  setThemePreference: (value: ThemePreference) => void;
  setArabicFontSize: (value: number) => void;
  setTamilFontSize: (value: number) => void;
  setReadingMode: (value: ReadingMode) => void;
  setReciterId: (value: string) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  toggleBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  resetPreferences: () => void;
}

const ARABIC_MIN = 22;
const ARABIC_MAX = 46;
const TAMIL_MIN = 13;
const TAMIL_MAX = 26;

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(
    () => loadStoredThemePreference(),
  );
  const [arabicFontSize, setArabicFontSizeState] = useState(30);
  const [tamilFontSize, setTamilFontSizeState] = useState(17);
  const [readingMode, setReadingMode] = useState<ReadingMode>('both');
  const [reciterId, setReciterId] = useState(DEFAULT_RECITER_ID);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(INITIAL_BOOKMARKS);

  const resolvedMode: ResolvedThemeMode =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  const theme = useMemo(() => createTheme(resolvedMode), [resolvedMode]);

  const setThemePreference = useCallback((value: ThemePreference) => {
    setThemePreferenceState(value);
    saveStoredThemePreference(value);
  }, []);

  const setArabicFontSize = useCallback((value: number) => {
    setArabicFontSizeState(Math.min(ARABIC_MAX, Math.max(ARABIC_MIN, value)));
  }, []);

  const setTamilFontSize = useCallback((value: number) => {
    setTamilFontSizeState(Math.min(TAMIL_MAX, Math.max(TAMIL_MIN, value)));
  }, []);

  const isBookmarked = useCallback(
    (surahId: number, ayahNumber: number) =>
      bookmarks.some(
        (bookmark) =>
          bookmark.surahId === surahId && bookmark.ayahNumber === ayahNumber,
      ),
    [bookmarks],
  );

  const toggleBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks((current) => {
      const exists = current.some((item) => item.id === bookmark.id);
      return exists
        ? current.filter((item) => item.id !== bookmark.id)
        : [bookmark, ...current];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((current) => current.filter((item) => item.id !== id));
  }, []);

  const resetPreferences = useCallback(() => {
    setThemePreferenceState('system');
    clearStoredThemePreference();
    setArabicFontSizeState(30);
    setTamilFontSizeState(17);
    setReadingMode('both');
    setReciterId(DEFAULT_RECITER_ID);
    setBookmarks(INITIAL_BOOKMARKS);
  }, []);

  const value = useMemo<Preferences>(
    () => ({
      themePreference,
      resolvedMode,
      theme,
      arabicFontSize,
      tamilFontSize,
      readingMode,
      reciterId,
      bookmarks,
      setThemePreference,
      setArabicFontSize,
      setTamilFontSize,
      setReadingMode,
      setReciterId,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      resetPreferences,
    }),
    [
      themePreference,
      resolvedMode,
      theme,
      arabicFontSize,
      tamilFontSize,
      readingMode,
      reciterId,
      bookmarks,
      setThemePreference,
      setArabicFontSize,
      setTamilFontSize,
      setReadingMode,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      resetPreferences,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return context;
}

export function useAppTheme(): AppTheme {
  return usePreferences().theme;
}
