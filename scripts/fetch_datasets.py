#!/usr/bin/env python3
"""
Fetch authentic Quran datasets:
1. Tanzil Uthmani text (Arabic)
2. QuranEnc Omar Sharif translation (Tamil)
"""

import os
import sys
import json
import urllib.request
import urllib.error
import time

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

TANZIL_URL = "https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&agree=true"
QURANENC_LIST_URL = "https://quranenc.com/api/v1/translations/list/ta"

HEADERS = {
    "User-Agent": "Tamil-Quran-App/0.1.0 (Educational open-source research; contact: abdul2002haseeb@gmail.com)"
}

def fetch_url(url, dest_path=None):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        if dest_path:
            with open(dest_path, "wb") as f:
                f.write(data)
        return data

def main():
    print("1. Fetching Tanzil Uthmani Arabic Quran text...")
    tanzil_dest = os.path.join(DATA_DIR, "quran-uthmani.txt")
    if not os.path.exists(tanzil_dest):
        try:
            fetch_url(TANZIL_URL, tanzil_dest)
            print(f"   Saved to {tanzil_dest} ({os.path.getsize(tanzil_dest)} bytes)")
        except Exception as e:
            print(f"   Failed to fetch Tanzil text: {e}")
            return 1
    else:
        print(f"   Already exists: {tanzil_dest}")

    print("\n2. Checking QuranEnc Tamil translations list...")
    try:
        list_json_raw = fetch_url(QURANENC_LIST_URL)
        list_data = json.loads(list_json_raw.decode("utf-8"))
        print("   Available Tamil translations on QuranEnc:")
        translations = list_data.get("translations", [])
        omar_info = None
        for t in translations:
            print(f"   - Key: {t.get('key')} | Title: {t.get('title')}")
            if t.get("key") == "tamil_omar":
                omar_info = t

        omar_dest = os.path.join(DATA_DIR, "tamil_omar.json")
        if not os.path.exists(omar_dest):
            print("\n3. Fetching full tamil_omar translation from QuranEnc (114 Surahs)...")
            all_surahs = []
            for s in range(1, 115):
                sura_url = f"https://quranenc.com/api/v1/translation/sura/tamil_omar/{s}"
                for attempt in range(3):
                    try:
                        sura_raw = fetch_url(sura_url)
                        sura_json = json.loads(sura_raw.decode("utf-8"))
                        result = sura_json.get("result", [])
                        all_surahs.append({
                            "sura": s,
                            "count": len(result),
                            "ayas": result
                        })
                        break
                    except Exception as err:
                        if attempt == 2:
                            raise err
                        time.sleep(1)
                if s % 20 == 0 or s == 114:
                    print(f"   Fetched {s}/114 Surahs...")
                time.sleep(0.05) # gentle rate limiting

            with open(omar_dest, "w", encoding="utf-8") as f:
                json.dump({"translation_info": omar_info, "surahs": all_surahs}, f, ensure_ascii=False, indent=2)
            print(f"   Saved tamil_omar to {omar_dest} ({os.path.getsize(omar_dest)} bytes)")
        else:
            print(f"   Already exists: {omar_dest}")

    except Exception as e:
        print(f"   Failed to fetch QuranEnc: {e}")
        return 1

    print("\nFetch completed successfully.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
