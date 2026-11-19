import type { Surah } from '../../types/content';
import { CANONICAL_SURAHS, findCanonicalSurah } from '../canonicalSurahs';

/**
 * Complete 114-Surah canonical index.
 * Factual surah identifiers, Arabic names, Tamil display names, transliterations,
 * meanings, and verse counts verified against Tanzil Project and standard Mushaf metadata.
 */
export const MOCK_SURAHS: readonly Surah[] = CANONICAL_SURAHS;

export const TOTAL_SURAH_COUNT = 114;

export function findSurah(surahId: number): Surah | undefined {
  return findCanonicalSurah(surahId);
}

export function getRevelationLabel(revelation: Surah['revelation']): string {
  return revelation === 'Meccan' ? 'மக்கீ' : 'மதீனா';
}
