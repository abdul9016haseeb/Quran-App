# Development Screenshots

Real captures of the running Tamil Quran app, used for visual verification and
before/after comparison. Read `AGENTS.md` §7 for the full workflow.

These are **not** design mockups. Do not add generated, edited, upscaled or
placeholder images here, and never treat a capture as proof that a screen was
inspected unless it came from a run of the app.

```text
development_screenshots/
├── latest/    current captures (stable reference for the next change)
└── history/   dated captures kept for an intentional comparison
```

## Current contents

All captures are from the Android emulator `sdk_gphone64_x86_64` (Android 14,
1080×2400 @ 420 dpi; the 840×1800 file is the same device at 320 dp width).

- `latest/home__light__1080x2400__2026-11-19.png` — Home tab, light mode.
- `latest/surah_reader__light__1080x2400__2026-11-19.png` — Al-Baqarah reader
  after the continuous-verse experiment and the verse-divider visibility
  refinement, light mode.
- `latest/surah_reader__dark__1080x2400__2026-11-19.png` — the same screen in
  dark mode.
- `latest/surah_reader__light__840x1800__2026-11-19.png` — the same screen at
  320 dp width.
- `history/2026-11-19__surah_reader__light__1080x2400__before-verse-cards-removed.png`
  — the previous per-verse card layout, kept for comparison.
- `history/2026-11-19__surah_reader__light__1080x2400__before-divider-visibility.png`
  and `history/2026-11-19__surah_reader__dark__1080x2400__before-divider-visibility.png`
  — the thin `divider`-token line before the visibility refinement, kept for
  before/after comparison.
- `latest/Screenshot_1795076852.png` — an unclassified pre-change capture added
  outside the naming convention; preserved as-is.

## Naming

- Current: `<screen>__<theme>__<W>x<H>__<YYYY-MM-DD>.png`
- History: `<YYYY-MM-DD>__<screen>__<theme>__<W>x<H>__<label>.png`

Examples:

```text
latest/home__light__1080x2400__2026-11-19.png
latest/surah_index__dark__1080x2400__2026-11-19.png
history/2026-11-19__home__light__1080x2400__before-header-spacing.png
```

Use lowercase ASCII screen tokens (`home`, `surah_index`, `surah_reader`,
`search`, `bookmarks`, `prayer_times`, `qibla`, `settings`, `appearance`,
`reciter_picker`, `about`), `light`/`dark` for the resolved theme, and the pixel
size reported by the capture. `__` separates fields; `-` joins words inside a
field.

## Capturing

```bash
adb devices -l
adb shell wm size
adb exec-out screencap -p > mockup/development_screenshots/latest/home__light__1080x2400__2026-11-19.png
```

Target a specific device with `adb -s "$ADB_SERIAL"` when more than one is
attached. Capture full-resolution PNG; do not crop, scale or annotate. If no
emulator/device or automatic capture is available, follow the manual fallback in
`AGENTS.md` §7.4 and state the limitation in the report.

## Reference screens

Design references live in `../stitch_redesign/`; the screen-to-reference mapping
is in `AGENTS.md` §7.3. Search, Bookmarks, Reciter picker and About have no
reference screen, and the Surah reader only has typography guidance.
