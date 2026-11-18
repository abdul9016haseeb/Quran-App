import type { Bookmark } from '../../types/content';

/**
 * MOCK DATA — bookmarks.
 *
 * Seeded locally so the bookmarks UI can be exercised. Persistence arrives
 * with the offline storage layer; these reset when the app reloads.
 */
export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bookmark-1-1',
    surahId: 1,
    ayahNumber: 1,
    surahName: 'அல்ஃபாத்திஹா',
    note: 'தினசரி வாசிப்பு',
    addedLabel: 'இன்று',
  },
  {
    id: 'bookmark-2-255',
    surahId: 2,
    ayahNumber: 255,
    surahName: 'அல்பகரா',
    note: 'ஆயத்துல் குர்ஸி',
    addedLabel: 'நேற்று',
  },
  {
    id: 'bookmark-3-8',
    surahId: 3,
    ayahNumber: 8,
    surahName: 'ஆலு இம்ரான்',
    note: 'நினைவூட்டல்',
    addedLabel: '3 நாட்களுக்கு முன்',
  },
];
