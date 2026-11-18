import type { MonthlyPrayerRow, PrayerTime } from '../../types/content';

/**
 * MOCK DATA — prayer timings.
 *
 * These are illustrative values modelled on the supplied mockups. They are
 * not calculated for any real date or location and must be replaced by the
 * AlAdhan (or on-device Adhan) integration plus local caching.
 */
export const DEFAULT_LOCATION = {
  nameTamil: 'கொலச்சல்',
  nameLatin: 'Colachel',
  districtTamil: 'குமரி மாவட்டம், தமிழ்நாடு',
  timezone: 'IST (UTC+05:30)',
  qiblaBearing: 294.4,
} as const;

export const SAMPLE_PRAYER_TIMES: PrayerTime[] = [
  {
    id: 'fajr',
    nameTamil: 'ஃபஜ்ர்',
    nameArabic: 'الفجر',
    time: '05:00 AM',
    icon: 'moon-outline',
  },
  {
    id: 'dhuhr',
    nameTamil: 'லுஹர்',
    nameArabic: 'الظهر',
    time: '12:07 PM',
    icon: 'sunny',
  },
  {
    id: 'asr',
    nameTamil: 'அஸ்ர்',
    nameArabic: 'العصر',
    time: '03:27 PM',
    icon: 'partly-sunny',
  },
  {
    id: 'maghrib',
    nameTamil: 'மக்ரிப்',
    nameArabic: 'المغرب',
    time: '05:58 PM',
    icon: 'cloudy-night',
  },
  {
    id: 'isha',
    nameTamil: 'இஷா',
    nameArabic: 'العشاء',
    time: '07:11 PM',
    icon: 'moon',
  },
];

export const SAMPLE_PRAYER_TIMES_TOMORROW: PrayerTime[] =
  SAMPLE_PRAYER_TIMES.map((prayer) => ({
    ...prayer,
    time: prayer.time.replace('12:07', '12:08').replace('05:58', '05:57'),
  }));

export const SAMPLE_MONTHLY_PRAYERS: MonthlyPrayerRow[] = [
  {
    day: 1,
    weekday: 'SUN',
    fajr: '04:58',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:11',
  },
  {
    day: 2,
    weekday: 'MON',
    fajr: '04:58',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:11',
  },
  {
    day: 3,
    weekday: 'TUE',
    fajr: '04:58',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:11',
  },
  {
    day: 4,
    weekday: 'WED',
    fajr: '04:58',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:11',
  },
  {
    day: 5,
    weekday: 'THU',
    fajr: '04:59',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:10',
  },
  {
    day: 6,
    weekday: 'FRI',
    fajr: '04:59',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:59',
    isha: '07:10',
  },
  {
    day: 7,
    weekday: 'SAT',
    fajr: '04:59',
    dhuhr: '12:06',
    asr: '03:26',
    maghrib: '05:58',
    isha: '07:10',
  },
];

/** Index of the next prayer in SAMPLE_PRAYER_TIMES (1 = Dhuhr, as mocked). */
export const SAMPLE_NEXT_PRAYER_INDEX = 1;

export const SAMPLE_NEXT_PRAYER_IN_MINUTES = 48;
