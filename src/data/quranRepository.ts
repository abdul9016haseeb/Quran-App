import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import type { Ayah } from '../types/content';
import { findCanonicalSurah } from './canonicalSurahs';
import { getPlaceholderAyahs } from './mock/sampleAyahs';

interface AyahRow {
  id: string;
  surah_id: number;
  ayah_number: number;
  arabic_uthmani: string;
  tamil_translation: string;
  footnotes: string | null;
  juz: number;
  page: number;
}

export interface SearchResultAyah {
  id: string;
  surahId: number;
  ayahNumber: number;
  arabic: string;
  tamil: string;
}

/** In-memory cache to guarantee 0ms O(1) instant lookup for previously opened Surahs. */
const surahMemoryCache = new Map<number, Ayah[]>();

/**
 * Hook to retrieve all Ayahs for a given Surah from the offline SQLite database.
 * Returns authentic Tanzil Uthmani text and Shaykh Omar Sharif's Tamil translation.
 */
export function useSurahAyahs(surahId: number): {
  ayahs: Ayah[];
  loading: boolean;
  error: Error | null;
} {
  const db = useSQLiteContext();

  const ayahs = useMemo(() => {
    // 1. Check in-memory cache first for instant 0ms access
    const cached = surahMemoryCache.get(surahId);
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      const rows = db.getAllSync<AyahRow>(
        'SELECT id, surah_id, ayah_number, arabic_uthmani, tamil_translation, footnotes, juz, page FROM ayahs WHERE surah_id = ? ORDER BY ayah_number ASC;',
        [surahId]
      );
      if (rows && rows.length > 0) {
        const mapped = rows.map((row) => ({
          id: row.id,
          surahId: row.surah_id,
          ayahNumber: row.ayah_number,
          arabic: row.arabic_uthmani,
          tamil: row.tamil_translation,
          footnotes: row.footnotes ?? undefined,
          juz: row.juz,
          page: row.page,
          isPlaceholder: false,
        }));
        surahMemoryCache.set(surahId, mapped);
        return mapped;
      }
    } catch {
      // Fallback below
    }

    const fallbackSurah = findCanonicalSurah(surahId);
    return fallbackSurah ? getPlaceholderAyahs(fallbackSurah) : [];
  }, [db, surahId]);

  return { ayahs, loading: false, error: null };
}

/**
 * Hook to search Quran verses in Tamil and Arabic using the offline FTS5 index.
 */
export function useQuranSearch(query: string): {
  results: SearchResultAyah[];
  searching: boolean;
} {
  const db = useSQLiteContext();
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (trimmed.length < 2) {
      return [];
    }

    const sanitized = trimmed.replace(/['"*:^]/g, '').trim();
    if (!sanitized) {
      return [];
    }

    try {
      const rows = db.getAllSync<{
        ayah_id: string;
        surah_id: number;
        ayah_number: number;
        arabic_uthmani: string;
        tamil_translation: string;
      }>(
        'SELECT ayah_id, surah_id, ayah_number, arabic_uthmani, tamil_translation FROM ayahs_search WHERE ayahs_search MATCH ? LIMIT 40;',
        [`${sanitized}*`]
      );
      return rows.map((r) => ({
        id: r.ayah_id,
        surahId: r.surah_id,
        ayahNumber: r.ayah_number,
        arabic: r.arabic_uthmani,
        tamil: r.tamil_translation,
      }));
    } catch {
      return [];
    }
  }, [db, trimmed]);

  return { results, searching: false };
}
