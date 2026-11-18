import type { Ayah, Surah } from '../../types/content';

/**
 * MOCK DATA — layout placeholders only.
 *
 * These Arabic and Tamil strings are deliberately NON-QURANIC sample copy.
 * They exist so the reader layout can be designed and reviewed without
 * pretending unverified text is scripture. Never replace these with
 * generated verses or translations. Replace them with a verified Quran text
 * edition and a licensed Tamil translation, then remove `isPlaceholder`.
 */
const ARABIC_PLACEHOLDERS = [
  'هَذَا نَصٌّ تَجْرِيبِيٌّ لِعَرْضِ تَصْمِيمِ الْقُرْآنِ',
  'هَذِهِ مُعَايَنَةٌ لِتَرْتِيبِ النَّصِّ وَالْمَسَافَاتِ',
  'سَيُسْتَبْدَلُ هَذَا النَّصُّ بِالنَّصِّ الْقُرْآنِيِّ الْمُوَثَّقِ',
];

const TAMIL_PLACEHOLDERS = [
  'இது வடிவமைப்பு மாதிரிக்கான உரை. சரிபார்க்கப்பட்ட குர்ஆன் உரை இன்னும் இணைக்கப்படவில்லை.',
  'எழுத்துரு அளவு, இடைவெளி மற்றும் வாசிப்பு அனுபவத்தைச் சோதிக்கும் மாதிரி உள்ளடக்கம்.',
  'தரவுத்தளம் இணைக்கப்பட்ட பிறகு இந்த இடத்தில் அதிகாரப்பூர்வ அரபு வசனமும் தமிழ் மொழிபெயர்ப்பும் காட்சிப்படுத்தப்படும்.',
];

/** Three clearly-labelled placeholder ayahs for any surah. */
export function getPlaceholderAyahs(surah: Surah): Ayah[] {
  return [0, 1, 2].map((offset) => {
    const ayahNumber = offset + 1;
    const index = (surah.id + offset) % ARABIC_PLACEHOLDERS.length;

    return {
      id: `${surah.id}:${ayahNumber}`,
      surahId: surah.id,
      ayahNumber,
      arabic: ARABIC_PLACEHOLDERS[index] ?? ARABIC_PLACEHOLDERS[0],
      tamil: TAMIL_PLACEHOLDERS[index] ?? TAMIL_PLACEHOLDERS[0],
      isPlaceholder: true,
    };
  });
}
