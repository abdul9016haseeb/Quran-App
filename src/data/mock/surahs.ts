import type { Surah } from '../../types/content';

/**
 * MOCK DATA — Surah metadata only.
 *
 * These are factual surah identifiers, Tamil display names and verse counts
 * for the first twelve surahs, used to build the UI. They are not Quranic
 * text or translations.
 *
 * The complete 114-surah index must be loaded from a verified dataset before
 * release. Do not extend this list from memory: replace it with a checked
 * source and record the source/version in docs/architecture/.
 */
export const MOCK_SURAHS: Surah[] = [
  {
    id: 1,
    nameArabic: 'الفاتحة',
    nameTamil: 'அல்ஃபாத்திஹா',
    nameTransliteration: 'Al-Fatihah',
    meaningTamil: 'தோற்றுவாய்',
    ayahCount: 7,
    revelation: 'Meccan',
  },
  {
    id: 2,
    nameArabic: 'البقرة',
    nameTamil: 'அல்பகரா',
    nameTransliteration: 'Al-Baqarah',
    meaningTamil: 'மாடு',
    ayahCount: 286,
    revelation: 'Medinan',
  },
  {
    id: 3,
    nameArabic: 'آل عمران',
    nameTamil: 'ஆலு இம்ரான்',
    nameTransliteration: "Ali 'Imran",
    meaningTamil: 'இம்ரானின் குடும்பத்தார்',
    ayahCount: 200,
    revelation: 'Medinan',
  },
  {
    id: 4,
    nameArabic: 'النساء',
    nameTamil: 'அந்நிஸா',
    nameTransliteration: 'An-Nisa',
    meaningTamil: 'பெண்கள்',
    ayahCount: 176,
    revelation: 'Medinan',
  },
  {
    id: 5,
    nameArabic: 'المائدة',
    nameTamil: 'அல்மாயிதா',
    nameTransliteration: "Al-Ma'idah",
    meaningTamil: 'உணவுத் தட்டு',
    ayahCount: 120,
    revelation: 'Medinan',
  },
  {
    id: 6,
    nameArabic: 'الأنعام',
    nameTamil: 'அல்அன்ஆம்',
    nameTransliteration: "Al-An'am",
    meaningTamil: 'ஆடு, மாடு, ஒட்டகம்',
    ayahCount: 165,
    revelation: 'Meccan',
  },
  {
    id: 7,
    nameArabic: 'الأعراف',
    nameTamil: 'அல்அஃராஃப்',
    nameTransliteration: "Al-A'raf",
    meaningTamil: 'உயர்ந்த இடங்கள்',
    ayahCount: 206,
    revelation: 'Meccan',
  },
  {
    id: 8,
    nameArabic: 'الأنفال',
    nameTamil: 'அல்அன்ஃபால்',
    nameTransliteration: 'Al-Anfal',
    meaningTamil: 'போரில் கிடைத்த செல்வம்',
    ayahCount: 75,
    revelation: 'Medinan',
  },
  {
    id: 9,
    nameArabic: 'التوبة',
    nameTamil: 'அத்தவ்பா',
    nameTransliteration: 'At-Tawbah',
    meaningTamil: 'மன்னிப்பு',
    ayahCount: 129,
    revelation: 'Medinan',
  },
  {
    id: 10,
    nameArabic: 'يونس',
    nameTamil: 'யூனுஸ்',
    nameTransliteration: 'Yunus',
    meaningTamil: 'யூனுஸ் நபி',
    ayahCount: 109,
    revelation: 'Meccan',
  },
  {
    id: 11,
    nameArabic: 'هود',
    nameTamil: 'ஹூத்',
    nameTransliteration: 'Hud',
    meaningTamil: 'ஹூத் நபி',
    ayahCount: 123,
    revelation: 'Meccan',
  },
  {
    id: 12,
    nameArabic: 'يوسف',
    nameTamil: 'யூசுஃப்',
    nameTransliteration: 'Yusuf',
    meaningTamil: 'யூசுஃப் நபி',
    ayahCount: 111,
    revelation: 'Meccan',
  },
];

export const TOTAL_SURAH_COUNT = 114;

export function findSurah(surahId: number): Surah | undefined {
  return MOCK_SURAHS.find((surah) => surah.id === surahId);
}

export function getRevelationLabel(revelation: Surah['revelation']): string {
  return revelation === 'Meccan' ? 'மக்கீ' : 'மதீனா';
}
