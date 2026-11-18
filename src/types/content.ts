/**
 * Content types shared by the UI and the future data layer.
 *
 * The current data layer is mocked. These types intentionally mirror the
 * shape a verified offline dataset (for example a SQLite-backed repository)
 * should expose later, so screens do not need to change when real content
 * replaces the mock repository.
 */

export type RevelationPlace = 'Meccan' | 'Medinan';

export interface Surah {
  /** Surah number, 1–114. */
  id: number;
  nameArabic: string;
  nameTamil: string;
  nameTransliteration: string;
  meaningTamil: string;
  ayahCount: number;
  revelation: RevelationPlace;
}

export interface Ayah {
  id: string;
  surahId: number;
  ayahNumber: number;
  arabic: string;
  tamil: string;
  /**
   * True while the app is displaying layout placeholder text rather than
   * verified Quran text and a licensed Tamil translation.
   */
  isPlaceholder: boolean;
}

export type ReadingMode = 'both' | 'arabic' | 'tamil';

export interface Reciter {
  id: string;
  name: string;
  style: string;
  /** Whether a licensed, verified audio source is connected. */
  audioAvailable: boolean;
}

export interface Bookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  surahName: string;
  note: string;
  addedLabel: string;
}

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  id: PrayerId;
  nameTamil: string;
  nameArabic: string;
  time: string;
  icon: 'moon' | 'sunny' | 'partly-sunny' | 'cloudy-night' | 'moon-outline';
}

export interface MonthlyPrayerRow {
  day: number;
  weekday: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}
