# Changelog

All notable changes to this project are recorded here.

This project does **not** yet follow a published release process and has no
licence. Version numbers describe internal milestones, not public releases.

## [Unreleased]

### Added

- Complete offline SQLite database (`assets/quran.db`) bundled into native assets:
  - Complete Tanzil Uthmani Arabic Quran text (all 114 Surahs, 6,236 Ayahs, CC BY 3.0 Tanzil Project).
  - Complete Tamil translation by Shaykh Omar Sharif ibn Abdussalam (`tamil_omar`, QuranEnc.com).
  - SQLite FTS5 full-text search table indexing all 6,236 verses for instant offline search in Tamil and Arabic.
  - Complete 114-Surah canonical metadata index in `src/data/canonicalSurahs.ts` (Arabic names, Tamil names, transliterations, meanings, verse counts, revelation type).
- Integrated `expo-sqlite` (~58.0.18) with `<SQLiteProvider>` and custom `metro.config.js` for `.db` asset bundling.
- Repository layer in `src/data/quranRepository.ts` providing `useSurahAyahs` and `useQuranSearch`.
- Full 114-surah listing in `SurahIndexScreen.tsx` with search and count metrics.
- Authentic verse reader in `SurahReaderScreen.tsx` displaying verified Arabic text, Tamil translation, Bismillah header on Surahs 2..114, and data source disclosures.
- Offline verse and surah search in `SearchScreen.tsx`.
- Automated ingestion and validation pipeline in `scripts/fetch_datasets.py` and `scripts/build_quran_db.py`.

- Initial Expo SDK 58 / React Native 0.88 / TypeScript 6 project for a
  Tamil-first Quran app.
- Physical-device testing scripts: `npm run apk:debug` (two-ABI Debug APK for
  emulator + phone), `apk:release`, `device:install`, `device:install:release`
  and `device:logcat`. Documented in `docs/development/WORKFLOW.md` §2 together
  with the Expo Go route for phones.
- `npm run device:tcpip -- <ip>` for wireless adb, and `device:reverse` /
  `device:list`. Device-targeting scripts now live in `scripts/adb-target.sh`,
  which honours `ADB_SERIAL` **or** adb's standard `ANDROID_SERIAL` and refuses
  to guess when an emulator and a phone are both attached.

### Changed

- Debug builds contain **two ABIs** (`x86_64` + `arm64-v8a`) again, so one APK
  installs on the emulator and on a physical phone. `npm run apk:debug` builds
  it (97 MB, 38 `.so`, 8 s warm) and `npm run device:install` installs it on
  whichever device `ADB_SERIAL` names. `npm run apk:release` pins all four ABIs.
  The single-ABI default was the cause of the install failures and the
  `-P` juggling; the only new cost is one extra C++ pass on a clean build.
- Design system in `src/theme/tokens.ts`: green/white/gold light palette, dark
  palette, spacing, radii, type scale, line heights and shadows.
- Theme provider with `system` / `light` / `dark` preference and resolved theme
  access through `useAppTheme()`.
- Bundled typography: Noto Sans Tamil (UI), Noto Serif Tamil (display), Amiri
  (Arabic), loaded before the navigator mounts.
- Typed React Navigation v7 stack and four-tab bar (Home, Quran, Prayer,
  Settings).
- Shared UI primitives: `AppText`, `Card`, `Divider`, `EmptyState`, `IconButton`,
  `Pill`, `PrimaryButton`, `ProgressBar`, `SampleBadge`, `Screen`,
  `ScreenHeader`, `SearchField`, `SectionHeading`, `SegmentedControl`,
  `SettingRow`.
- Screens: Home, Quran index, Surah reader, Search, Bookmarks, Prayer Times,
  Qibla, Reciter picker, Settings, Appearance and About.
- Reader features: both/Arabic/Tamil reading modes, adjustable Arabic
  (22–46sp) and Tamil (13–26sp) sizes, bookmark toggle, visual audio dock.
- Prayer Times screen with today, tomorrow and monthly-table layouts, kept
  separate from Qibla as required.
- Static Qibla compass with sample bearing and an explicit sensor caveat.
- In-memory preferences provider for theme, font sizes, reading mode, reciter
  and bookmarks.
- Mock data modules with `MOCK DATA` documentation: surah metadata (first 12
  surahs), non-Quranic placeholder ayahs, prayer times, reciters and bookmarks.
- Visible placeholder disclosures (`மாதிரித் தரவு`) wherever mock content could
  be mistaken for live data.
- Preserved design references under `mockup/original/`,
  `mockup/stitch_redesign/` and `mockup/legacy_reference/`; source documents
  copied to `docs/architecture/sources/`.
- Documentation: `AGENTS.md`, `requirements.md`, `PROJECT_STATE.md`, `README.md`,
  `docs/architecture/DECISIONS.md`,
  `docs/architecture/TECHNOLOGY_EVALUATION.md`,
  `docs/development/WORKFLOW.md`, `docs/development/IMPLEMENTATION_PLAN.md`,
  `docs/development/TESTING.md`, `docs/development/SCREEN_SPEC.md`,
  `docs/performance/BUILD_PERFORMANCE_ANALYSIS.md`.
- Six AI-agent prompts under `prompts/`.
- `<code>expo-font</code>` config plugin and placeholder app identifiers
  (`com.tamilquran.app`).
- `.easignore` so design references (`mockup/`), docs and agent prompts are not
  uploaded to EAS builds. It does not affect Metro, Gradle or local builds.

### Changed

- Replaced the generated Expo template screen with the project navigator.
- Limited surah metadata to the first 12 surahs instead of extending it from
  memory; the UI states that the verified dataset is pending.
- Prayer notification card now shows a disabled toggle with
  "இன்னும் இயக்கப்படவில்லை" and states that sound, alarms and battery
  permissions are mock-only. Removed the misleading "enabled/alarm" status.
- Disabled Android predictive back in `app.json` while the native back issue is
  investigated.
- Font and icon imports now use package sub-paths
  (`@expo-google-fonts/<family>/<weight>`, `@expo/vector-icons/Ionicons`)
  instead of package barrels. Only the 10 TTFs actually used are bundled, which
  cuts export assets from 7.9 MB to 1.9 MB (11 MB → 3.9 MB total). No visual
  change; `npm run typecheck` and `npm run lint` pass.

### Fixed

- Added `expo-system-ui` to clear the prebuild `userInterfaceStyle` warning and
  enable native theme handling.

### Removed

- Generated template example content and the template `LICENSE` file. No
  licence has been chosen; see `docs/architecture/DECISIONS.md`.
- The auto-generated template commit; the repository currently has no commits.

### Verified

- `npm run typecheck` passes.
- `npm run lint` passes with zero warnings.
- `npx expo export --platform android` bundles successfully.
- `npx expo-doctor` reports all checks passing.
- Warm Android Debug build completes in 22 s (`BUILD SUCCESSFUL`, 13 of 223
  tasks executed); see `docs/performance/BUILD_PERFORMANCE_ANALYSIS.md`.
- Native Android build installed and launched on an Android 14 emulator.
- Home, Quran index, Reader (all three modes), Appearance (light/dark),
  Settings and Prayer Times render without crashing.
- Screenshots captured under `/tmp/opencode/qa/` for the inspected screens.

### Known limitations

- No real Quran text or Tamil translation; all ayah content is labelled
  placeholder copy.
- No persistence: preferences and bookmarks reset when the app restarts.
- No network, backend, accounts, sync or database.
- No audio playback, downloads or background audio.
- No location, compass sensors, notifications or permissions.
- Prayer times and Qibla bearing are illustrative values, not valid guidance.
- Hardware/system back currently exits the app instead of returning to the
  previous screen; header back works. Under investigation (K-12).
- Search, Bookmarks, Qibla, Reciter picker and About screens were not yet
  inspected at runtime; dark mode is only verified on Appearance.
- Dark mode is a functional foundation, not a final art-directed theme.
- iOS has not been built or verified in this environment.
- `npm audit` reports transitive advisories in the Expo/React Native toolchain;
  not yet triaged.

## Format

Sections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`,
`Verified`, `Known limitations`.

Rules:

- Record what is true at the time of writing.
- Never describe mocked UI as a working feature.
- Never record a licence or permission as granted without the document on file.
