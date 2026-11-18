#!/usr/bin/env python3
"""
scripts/build_quran_db.py

Builds the offline SQLite database (assets/quran.db) containing:
1. Authentic Tanzil Uthmani Arabic Quran text (all 114 Surahs, 6,236 Ayahs).
2. Authentic Tamil Translation by Shaykh Omar Sharif ibn Abdussalam (QuranEnc).
3. Canonical metadata (Juz, Page, Revelation, Surah names in Arabic, Transliteration, and Tamil).
4. FTS5 full-text search table for instant offline search.

Performs strict verification before writing.
"""

import json
import os
import sqlite3
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "scripts", "data")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
OUTPUT_DB = os.path.join(ASSETS_DIR, "quran.db")

TANZIL_FILE = os.path.join(DATA_DIR, "quran-uthmani.txt")
QURANENC_FILE = os.path.join(DATA_DIR, "tamil_omar.json")
INFO_FILE = os.path.join(DATA_DIR, "quran_info.json")

# Verified Tamil transliteration and meanings for all 114 Surahs
TAMIL_SURAHS = [
    (1, "அல்ஃபாத்திஹா", "தோற்றுவாய்"),
    (2, "அல்பகரா", "பசு மாடு"),
    (3, "ஆலு இம்ரான்", "இம்ரானின் குடும்பத்தார்"),
    (4, "அந்நிஸா", "பெண்கள்"),
    (5, "அல்மாயிதா", "உணவுத் தட்டு"),
    (6, "அல்அன்ஆம்", "கால்நடைகள்"),
    (7, "அல்அஃராஃப்", "உயர்ந்த சிகரங்கள்"),
    (8, "அல்அன்ஃபால்", "போரில் கிடைத்த வெற்றிப்பொருட்கள்"),
    (9, "அத்தவ்பா", "பாவமன்னிப்பு"),
    (10, "யூனுஸ்", "நபி யூனுஸ்"),
    (11, "ஹூத்", "நபி ஹூத்"),
    (12, "யூஸுஃப்", "நபி யூஸுஃப்"),
    (13, "அர்ரஃத்", "இடி"),
    (14, "இப்ராஹீம்", "நபி இப்ராஹீம்"),
    (15, "அல்ஹிஜ்ர்", "பாறை மலை"),
    (16, "அந்நஹ்ல்", "தேனீ"),
    (17, "அல்இஸ்ரா", "இரவுப் பயணம்"),
    (18, "அல்கஹ்ஃப்", "குகை"),
    (19, "மர்யம்", "மர்யம்"),
    (20, "தாஹா", "தாஹா"),
    (21, "அல்அன்பியா", "நபிமார்கள்"),
    (22, "அல்ஹஜ்", "ஹஜ்"),
    (23, "அல்முஃமினூன்", "நம்பிக்கையாளர்கள்"),
    (24, "அந்நூர்", "பேரொளி"),
    (25, "அல்ஃபுர்கான்", "சத்தியத்தை அசத்தியத்திலிருந்து பிரிப்பது"),
    (26, "அஷ்ஷுஅரா", "கவிஞர்கள்"),
    (27, "அந்நம்ல்", "எறும்புகள்"),
    (28, "அல்கஸஸ்", "வரலாறுகள்"),
    (29, "அல்அன்கபூத்", "சிலந்திப் பூச்சி"),
    (30, "அர்ரூம்", "ரோமர்கள்"),
    (31, "லுக்மான்", "லுக்மான் ஞானி"),
    (32, "அஸ்ஸஜ்தா", "சிரம் பணிதல்"),
    (33, "அல்அஹ்ஸாப்", "கூட்டணிகள்"),
    (34, "ஸபா", "ஸபா தேசம்"),
    (35, "ஃபாதிர்", "படைப்பவன்"),
    (36, "யாஸீன்", "யாஸீன்"),
    (37, "அஸ்ஸாஃப்பாத்", "அணிவகுத்து நிற்பவர்கள்"),
    (38, "ஸாத்", "ஸாத்"),
    (39, "அஸ்ஸுமர்", "கூட்டங்கள்"),
    (40, "காஃபிர்", "மன்னிப்பவன்"),
    (41, "ஃபுஸ்ஸிலத்", "விளக்கிக் கூறப்பட்டவை"),
    (42, "அஷ்ஷூரா", "கலந்தாலோசித்தல்"),
    (43, "அஸ்ஸுக்ருஃப்", "பொன் அலங்காரம்"),
    (44, "அத்துகான்", "புகை"),
    (45, "அல்ஜாஸியா", "முழந்தாளிடுதல்"),
    (46, "அல்அஹ்காஃப்", "மணல் குன்றுகள்"),
    (47, "முஹம்மத்", "நபி முஹம்மத்"),
    (48, "அல்ஃபத்ஹ்", "வெற்றி"),
    (49, "அல்ஹுஜுராத்", "அறைகள்"),
    (50, "காஃப்", "காஃப்"),
    (51, "அத்தாரியாத்", "புழுதியைக் கிளப்பும் காற்றுகள்"),
    (52, "அத்தூர்", "தூர் சினாய் மலை"),
    (53, "அந்நஜ்ம்", "நட்சத்திரம்"),
    (54, "அல்கமர்", "சந்திரன்"),
    (55, "அர்ரஹ்மான்", "அளவற்ற அருளாளன்"),
    (56, "அல்வாகிஆ", "மாபெரும் நிகழ்வு"),
    (57, "அல்ஹதீத்", "இரும்பு"),
    (58, "அல்முஜாதலா", "வாதாடுதல்"),
    (59, "அல்ஹஷ்ர்", "ஒன்று திரட்டுதல்"),
    (60, "அல்மும்தஹினா", "பரிசோதிக்கப்படும் பெண்"),
    (61, "அஸ்ஸஃப்", "அணிவகுப்பு"),
    (62, "அல்ஜுமுஆ", "வெள்ளிக்கிழமை"),
    (63, "அல்முனாஃபிகூன்", "நயவஞ்சகர்கள்"),
    (64, "அத்தகாபுன்", "இலாப நஷ்டம்"),
    (65, "அத்தலாக்", "விவாகரத்து"),
    (66, "அத்தஹ்ரீம்", "தடுத்துக் கொள்ளுதல்"),
    (67, "அல்முல்க்", "ஆட்சி"),
    (68, "அல்கலம்", "எழுதுகோல்"),
    (69, "அல்ஹாக்கா", "உறுதியான நிகழ்வு"),
    (70, "அல்மஆரிஜ்", "உயர்வழிகள்"),
    (71, "நூஹ்", "நபி நூஹ்"),
    (72, "அல்ஜின்", "ஜின்கள்"),
    (73, "அல்முஸ்ஸம்மில்", "போர்வை போர்த்தியவர்"),
    (74, "அல்முத்தஸ்ஸிர்", "ஆடை போர்த்தியவர்"),
    (75, "அல்கியாமா", "மறுமை நாள்"),
    (76, "அல்இன்ஸான்", "மனிதன்"),
    (77, "அல்முர்ஸலாத்", "அனுப்பப்படுபவை"),
    (78, "அந்நபஃ", "பெரும் செய்தி"),
    (79, "அந்நாஸிஆத்", "பறிப்பவர்கள்"),
    (80, "அபஸ", "கடுகடுத்தார்"),
    (81, "அத்தக்வீர்", "சுருட்டுதல்"),
    (82, "அல்இன்ஃபிதார்", "பிளந்து போதல்"),
    (83, "அல்முத்தஃப்பிஃபீன்", "அளவையில் மோசடி செய்பவர்கள்"),
    (84, "அல்இன்ஷிகாக்", "பிளபடுதல்"),
    (85, "அல்புரூஜ்", "விண்மீன் மண்டலங்கள்"),
    (86, "அத்தாரிக்", "விடிவெள்ளி"),
    (87, "அல்அஃலா", "மிக உயர்ந்தவன்"),
    (88, "அல்காஷியா", "மூடிக்கொள்ளும் பேராபத்து"),
    (89, "அல்ஃபஜ்ர்", "விடியற்காலை"),
    (90, "அல்பலத்", "நகரம்"),
    (91, "அஷ்ஷம்ஸ்", "சூரியன்"),
    (92, "அல்லைல்", "இரவு"),
    (93, "அள்ளுஹா", "முற்பகல்"),
    (94, "அல்இன்ஷிராஹ்", "நெஞ்சை விரிவாக்குதல்"),
    (95, "அத்தீன்", "அத்தி"),
    (96, "அல்அலக்", "கருவறை உறை இரத்தக்கட்டி"),
    (97, "அல்கத்ர்", "கண்ணியமிக்க இரவு"),
    (98, "அல்பய்யினா", "தெளிவான ஆதாரம்"),
    (99, "அஸ்ஸல்ஸலா", "நிலநடுக்கம்"),
    (100, "அல்ஆதியாத்", "விரைந்து பாயும் குதிரைகள்"),
    (101, "அல்காரிஆ", "திடுக்கிடச் செய்யும் மறுமை நிகழ்வு"),
    (102, "அத்தகாஸுர்", "பேராசை"),
    (103, "அல்அஸ்ர்", "காலம்"),
    (104, "அல்ஹுமஸா", "குறை கூறிப் புறம்பேசுபவர்கள்"),
    (105, "அல்ஃபீல்", "யானை"),
    (106, "குறைஷ்", "குறைஷியர்"),
    (107, "அல்மாஊன்", "அற்ப உதவி"),
    (108, "அல்கவ்ஸர்", "அளவற்ற நன்மைகள்"),
    (109, "அல்காஃபிரூன்", "இறைமறுப்பாளர்கள்"),
    (110, "அந்நஸ்ர்", "உதவி"),
    (111, "அல்மஸத்", "ஈச்ச நார்ப்பயிறு"),
    (112, "அல்இக்லாஸ்", "தூய ஏகத்துவம்"),
    (113, "அல்ஃபparameters", "அதிகாலை"),
    (114, "அந்நாஸ்", "மனிதர்கள்"),
]
# Fix 113 Tamil name
TAMIL_SURAHS[112] = (113, "அல்ஃபலாக்", "அதிகாலை")


def load_tanzil():
    print("Loading Tanzil Uthmani text...")
    tanzil_ayahs = {}
    with open(TANZIL_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split("|")
            if len(parts) == 3:
                s, a, text = int(parts[0]), int(parts[1]), parts[2].strip()
                tanzil_ayahs[(s, a)] = text
    print(f"Loaded {len(tanzil_ayahs)} ayahs from Tanzil.")
    return tanzil_ayahs


def load_quranenc():
    print("Loading QuranEnc Tamil translation...")
    with open(QURANENC_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    enc_ayahs = {}
    for s_obj in data["surahs"]:
        s_num = int(s_obj["sura"])
        for a_obj in s_obj["ayas"]:
            a_num = int(a_obj["aya"])
            translation = a_obj["translation"].strip()
            footnotes = a_obj.get("footnotes", "").strip()
            enc_ayahs[(s_num, a_num)] = {
                "translation": translation,
                "footnotes": footnotes,
            }
    print(f"Loaded {len(enc_ayahs)} ayahs from QuranEnc.")
    return enc_ayahs


def load_info():
    print("Loading ayah metadata (juz, page)...")
    with open(INFO_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    ayah_meta = {}
    chapters_meta = {}
    for ch in data.get("chapters", []):
        ch_num = int(ch["chapter"])
        chapters_meta[ch_num] = {
            "name_arabic": ch.get("arabicname", "").replace("سُوْرَةُ ", "").strip(),
            "name_transliteration": ch.get("name", "").strip(),
            "revelation": "Meccan" if ch.get("revelation") == "Mecca" else "Medinan",
        }
        for v in ch.get("verses", []):
            v_num = int(v["verse"])
            ayah_meta[(ch_num, v_num)] = {
                "juz": int(v.get("juz", 1)),
                "page": int(v.get("page", 1)),
            }
    print(f"Loaded metadata for {len(chapters_meta)} chapters and {len(ayah_meta)} ayahs.")
    return chapters_meta, ayah_meta


def validate_and_clean_ayah(s, a, raw_tanzil, quranenc):
    # Ayah 1 Bismillah handling:
    # In Tanzil, Ayah 1 of Surahs 2..114 (except 9) includes the Bismillah prefix.
    # In authentic Quran presentation & recitation, Bismillah is the header for the surah,
    # and Ayah 1 is the actual first verse.
    # We clean this so that Ayah 1 is purely the verse (matching its translation).
    uthmani = raw_tanzil
    if a == 1 and s not in (1, 9):
        bismillah_variants = [
            "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ",
            "بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ",
        ]
        for b in bismillah_variants:
            if uthmani.startswith(b):
                uthmani = uthmani[len(b):].strip()
                break

    translation = quranenc["translation"]
    footnotes = quranenc["footnotes"]

    assert uthmani, f"Empty Arabic for {s}:{a}"
    assert translation, f"Empty Tamil translation for {s}:{a}"

    return uthmani, translation, footnotes


def build_database(tanzil, quranenc, chapters_meta, ayah_meta):
    print(f"Creating SQLite database at {OUTPUT_DB}...")
    if os.path.exists(OUTPUT_DB):
        os.remove(OUTPUT_DB)

    os.makedirs(ASSETS_DIR, exist_ok=True)
    conn = sqlite3.connect(OUTPUT_DB)
    cur = conn.cursor()

    # Enable WAL mode for high read performance
    cur.execute("PRAGMA journal_mode = WAL;")
    cur.execute("PRAGMA synchronous = NORMAL;")

    # Schema
    cur.execute("""
        CREATE TABLE surahs (
            id INTEGER PRIMARY KEY,
            name_arabic TEXT NOT NULL,
            name_tamil TEXT NOT NULL,
            name_transliteration TEXT NOT NULL,
            meaning_tamil TEXT NOT NULL,
            ayah_count INTEGER NOT NULL,
            revelation TEXT NOT NULL
        );
    """)

    cur.execute("""
        CREATE TABLE ayahs (
            id TEXT PRIMARY KEY,
            surah_id INTEGER NOT NULL,
            ayah_number INTEGER NOT NULL,
            arabic_uthmani TEXT NOT NULL,
            tamil_translation TEXT NOT NULL,
            footnotes TEXT,
            juz INTEGER NOT NULL,
            page INTEGER NOT NULL,
            FOREIGN KEY (surah_id) REFERENCES surahs(id)
        );
    """)

    # Indexes
    cur.execute("CREATE INDEX idx_ayahs_surah ON ayahs(surah_id, ayah_number);")
    cur.execute("CREATE INDEX idx_ayahs_juz ON ayahs(juz);")
    cur.execute("CREATE INDEX idx_ayahs_page ON ayahs(page);")

    # FTS5 search table
    cur.execute("""
        CREATE VIRTUAL TABLE ayahs_search USING fts5(
            ayah_id UNINDEXED,
            surah_id UNINDEXED,
            ayah_number UNINDEXED,
            arabic_uthmani,
            tamil_translation,
            tokenize = 'unicode61'
        );
    """)

    # Populate Surahs
    tamil_lookup = {item[0]: (item[1], item[2]) for item in TAMIL_SURAHS}
    surah_verse_counts = {}

    for s in range(1, 115):
        # Count verses
        count = sum(1 for (s_num, _) in tanzil.keys() if s_num == s)
        surah_verse_counts[s] = count
        ch_info = chapters_meta[s]
        name_tamil, meaning_tamil = tamil_lookup[s]

        # Use canonical clean Arabic name
        canonical_arabic = ch_info["name_arabic"]

        cur.execute("""
            INSERT INTO surahs (id, name_arabic, name_tamil, name_transliteration, meaning_tamil, ayah_count, revelation)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            s,
            canonical_arabic,
            name_tamil,
            ch_info["name_transliteration"],
            meaning_tamil,
            count,
            ch_info["revelation"],
        ))

    print("Inserted 114 surahs.")

    # Populate Ayahs
    total_ayahs = 0
    for s in range(1, 115):
        count = surah_verse_counts[s]
        for a in range(1, count + 1):
            raw_tanzil = tanzil.get((s, a))
            enc = quranenc.get((s, a))
            meta = ayah_meta.get((s, a), {"juz": 1, "page": 1})

            assert raw_tanzil is not None, f"Missing Tanzil ayah {s}:{a}"
            assert enc is not None, f"Missing QuranEnc ayah {s}:{a}"

            uthmani, translation, footnotes = validate_and_clean_ayah(s, a, raw_tanzil, enc)
            ayah_id = f"{s}:{a}"

            cur.execute("""
                INSERT INTO ayahs (id, surah_id, ayah_number, arabic_uthmani, tamil_translation, footnotes, juz, page)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (ayah_id, s, a, uthmani, translation, footnotes, meta["juz"], meta["page"]))

            cur.execute("""
                INSERT INTO ayahs_search (ayah_id, surah_id, ayah_number, arabic_uthmani, tamil_translation)
                VALUES (?, ?, ?, ?, ?);
            """, (ayah_id, s, a, uthmani, translation))

            total_ayahs += 1

    conn.commit()

    # Integrity verification
    cur.execute("PRAGMA integrity_check;")
    integrity = cur.fetchone()[0]
    assert integrity == "ok", f"SQLite integrity check failed: {integrity}"

    cur.execute("SELECT COUNT(*) FROM surahs;")
    surah_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM ayahs;")
    inserted_ayahs = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM ayahs_search;")
    fts_count = cur.fetchone()[0]

    conn.close()

    db_size = os.path.getsize(OUTPUT_DB)
    print("\n=== DATABASE BUILD REPORT ===")
    print(f"Output DB: {OUTPUT_DB}")
    print(f"Database Size: {db_size / (1024 * 1024):.2f} MB ({db_size:,} bytes)")
    print(f"Surahs count: {surah_count} (Expected: 114)")
    print(f"Ayahs count: {inserted_ayahs} (Expected: 6,236)")
    print(f"FTS search count: {fts_count} (Expected: 6,236)")
    print(f"Integrity check: {integrity}")
    print("=============================\n")

    assert surah_count == 114, f"Expected 114 surahs, found {surah_count}"
    assert inserted_ayahs == 6236, f"Expected 6236 ayahs, found {inserted_ayahs}"
    assert fts_count == 6236, f"Expected 6236 search entries, found {fts_count}"


def generate_typescript_metadata(chapters_meta, surah_counts):
    """
    Generates a typed TypeScript metadata module so the app can synchronously access
    the complete 114 Surah list for navigation and indexing without waiting for async SQLite.
    """
    ts_file = os.path.join(BASE_DIR, "src", "data", "canonicalSurahs.ts")
    tamil_lookup = {item[0]: (item[1], item[2]) for item in TAMIL_SURAHS}

    lines = [
        "// Generated by scripts/build_quran_db.py — DO NOT HAND EDIT",
        "import type { Surah } from '../types/content';",
        "",
        "export const CANONICAL_SURAHS: readonly Surah[] = [",
    ]

    for s in range(1, 115):
        ch = chapters_meta[s]
        name_tamil, meaning_tamil = tamil_lookup[s]
        count = surah_counts[s]
        lines.append("  {")
        lines.append(f"    id: {s},")
        lines.append(f"    nameArabic: {json.dumps(ch["name_arabic"], ensure_ascii=False)},")
        lines.append(f"    nameTamil: {json.dumps(name_tamil, ensure_ascii=False)},")
        lines.append(f"    nameTransliteration: {json.dumps(ch["name_transliteration"], ensure_ascii=False)},")
        lines.append(f"    meaningTamil: {json.dumps(meaning_tamil, ensure_ascii=False)},")
        lines.append(f"    ayahCount: {count},")
        lines.append(f"    revelation: {json.dumps(ch["revelation"], ensure_ascii=False)},")
        lines.append("  },")

    lines.append("];")
    lines.append("")
    lines.append("export function findCanonicalSurah(surahId: number): Surah | undefined {")
    lines.append("  return CANONICAL_SURAHS.find((s) => s.id === surahId);")
    lines.append("}")
    lines.append("")

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated TypeScript metadata at {ts_file}")


def main():
    tanzil = load_tanzil()
    quranenc = load_quranenc()
    chapters_meta, ayah_meta = load_info()

    # Pre-calculate counts
    surah_counts = {}
    for s in range(1, 115):
        surah_counts[s] = sum(1 for (s_num, _) in tanzil.keys() if s_num == s)

    build_database(tanzil, quranenc, chapters_meta, ayah_meta)
    generate_typescript_metadata(chapters_meta, surah_counts)
    print("Database and metadata generated successfully.")


if __name__ == "__main__":
    main()
