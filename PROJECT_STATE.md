# Project State — Tamil Quran App

**Last updated:** 19 November 2026
**Milestone:** Phase 0 review + Phase 1 content (persistence partial)
**Version:** 0.1.0
**Repository state (19 Nov 2026):** `feature/home-screen` tracking `origin`;
public repo, MIT-licensed, PR #1 open against `develop`

This is the canonical handover document. If it disagrees with the code, the code
is right — fix this file. Do not describe intentions as if they were features.

---

## 1. One-line status

A complete, typed, interactive React Native Tamil Quran app featuring complete
offline Quranic reading: authentic Tanzil Uthmani Arabic text and Shaykh Omar
Sharif ibn Abdussalam's Tamil translation across all 114 Surahs (6,236 Ayahs)
stored in a bundled SQLite database with instant FTS5 offline search.

---

## 2. What actually works

| Capability | Status | Notes |
|---|---|---|
| App launch + font loading | Working | Branded splash, then Home |
| Complete Offline Quran text | Working | Tanzil Uthmani (all 114 Surahs, 6,236 Ayahs) in bundled SQLite |
| Complete Tamil translation | Working | Shaykh Omar Sharif (`tamil_omar`, QuranEnc) in bundled SQLite |
| Offline Quran FTS search | Working, with caveat | SQLite FTS5 over 6,236 ayahs; Tamil is solid, unvocalized Arabic queries currently return nothing (K-14) |
| 114-Surah canonical index | Working | Verified names, transliterations, meanings, counts |
| Tab navigation | Working | Home / Quran / Prayer / Settings |
| Stack navigation | Working | Reader, Qibla, Search, Bookmarks, Appearance, Reciter, About |
| Theme persistence | Working | Persistent across app restarts (system / light / dark via SQLite); zero flash |
| Light + dark palettes | Working | Token-driven |
| Tamil/Arabic typography | Working | Bundled Noto Sans/Serif Tamil + Amiri |
| Reader font sizing | Working | Arabic 22–46, Tamil 13–26 |
| Reading modes | Working | Both / Arabic / Tamil |
| Surah reader | Working | Verified authentic text, Bismillah header, accurate verse numbers |
| Search screen | Working, with caveat | Surah metadata + ayah text offline; see K-14 for Arabic |
| Bookmarks | Working (session) | In-memory; resets on restart |
| Reader audio dock UI | Working (visual) | On-demand visibility, play trigger, cancel/close button, resets session; visual-only shell |
| Prayer times layout | Working (visual) | Illustrative timings only |
| Qibla compass | Working (visual) | Static needle, sample bearing |
| Reciter selection | Working (session) | Persists only in memory |
| Settings reset | Working | Restores in-memory defaults |
| About/status disclosure | Working | Tanzil & QuranEnc attribution documented |
| Native Android build | Working | Built and verified with Expo SDK 58 |
| 100% Offline operation | Working | Zero network calls needed to read or search |

---

## 3. What is mocked (and visibly labelled)

| Mock | Location | Label shown |
|---|---|---|
| Prayer timings | `src/data/mock/prayerTimes.ts` | "மாதிரித் தரவு" / calculation pending |
| Qibla bearing | `src/data/mock/prayerTimes.ts` | Sensor caveat on Qibla screen |
| Reciters / audio playback | `src/data/mock/reciters.ts` | "audio not connected" per row |
| Initial bookmarks | `src/data/mock/bookmarks.ts` | Contextual empty/initial state |

---

## 4. What does not exist

- Backend API client, cloud accounts, or cloud sync
- Audio playback engine, recitation streaming, or audio downloads
- Live GPS location, compass/magnetometer sensor integration, or push notifications
- AI/ML libraries, speech recognition, microphone access, or cloud models
- Persistence for font sizes, reading mode, reciter, bookmarks or reading
  position (only the theme preference is stored)
- Analytics, crash reporting, telemetry
- CI/CD, EAS config, signing, store metadata
- iOS build verification
- Automated tests
- A content manifest/checksum for `assets/quran.db`

---

## 5. Structure and dependencies

```text
App.tsx → src/app/AppRoot.tsx
  SafeAreaProvider → PreferencesProvider → Suspense → SQLiteProvider → RootNavigator
```

The bundled `quran.db` is read by `src/data/quranRepository.ts` (synchronous
queries, in-memory surah cache, FTS5 search). The theme preference is read/written
by `src/services/storage/preferencesStorage.ts` in `user_preferences.db`.

- Entry: `index.ts` registers `App`.
- Navigation: React Navigation v7 (`native`, `native-stack`, `bottom-tabs`),
  route contract in `src/navigation/types.ts`.
- Runtime deps: Expo 58.0.26, React Native 0.88.1, React 19.3.0, navigation v7,
  safe-area-context, screens, expo-font, expo-sqlite, expo-system-ui,
  expo-status-bar, vector-icons, three Google Fonts packages.
- Dev deps: TypeScript 6.0.3, ESLint 9 + `eslint-config-expo`, `@types/react`.
- No state library, UI kit, animation library or HTTP client.

Full rationale: `docs/architecture/TECHNOLOGY_EVALUATION.md`.

---

## 6. Verification record

### Static checks

| Check | Command | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | **Pass** |
| ESLint | `npm run lint` | **Pass, 0 warnings** |
| Expo doctor | `npm run doctor` | **Pass (20/20)** |
| Android bundle | `npx expo export --platform android` | **Pass** |
| Handover re-check (19 Nov 2026) | typecheck / lint / doctor / export | **Pass** — export produced an 18 MB directory including the exact 14,192,640-byte DB asset |

### Native runtime

> The runtime results below were observed on 18 Nov 2026. No emulator or phone
> was attached on 19 Nov 2026, so they have not been re-confirmed against the
> latest commit.

| Check | Result |
|---|---|
| `npx expo run:android` | **Pass** — three Gradle builds completed; final APK installed on `Medium_Phone` (Android 14, 1080×2400, 420 dpi) |
| Cold launch | **Pass** — splash then Home, no crash |
| Home | **Pass** — light mode |
| Quran index | **Pass** — light mode |
| Reader | **Pass** — both, Arabic-only and Tamil-only modes |
| Appearance | **Pass** — light and dark mode |
| Settings | **Pass** — light mode |
| Prayer Times | **Pass** — today list and notification card (dark not yet checked) |
| Search / Bookmarks / Qibla / Reciter / About | Not yet inspected |
| Monthly prayer table | Not yet inspected |
| Dark mode on all screens | Partially verified (Appearance only) |

Any screen not explicitly listed as inspected should be treated as unverified.
This section is updated only with results that were actually observed.

### Environment notes

- `npx expo lint` fails with an ESLint version complaint; use `npm run lint`.
- `npm audit` reports 35 advisories (2 moderate, 33 high), mostly transitive in
  the Expo/RN toolchain. Not triaged; do not force-fix.
- Prebuild reported: `userInterfaceStyle` requires `expo-system-ui`. Dark-mode
  surfaces still work through app state, but installing `expo-system-ui` is the
  correct follow-up for native system UI / splash theming.

### Build performance (measured 18 Nov 2026)

Full analysis: `docs/performance/BUILD_PERFORMANCE_ANALYSIS.md`.

| Measurement | Value |
|---|---|
| Warm `./gradlew :app:assembleDebug` | **22 s**, 13 of 223 tasks executed, 1.3 GB peak RSS |
| Warm `npm run apk:debug` (two ABIs) | **8 s**, 184 MB peak, 97 MB APK / 38 `.so` (`arm64-v8a` + `x86_64`) |
| `npx expo export --platform android` | **~13 s**, 2.3 MB Hermes bundle + 14.2 MB `quran.db` asset (18 MB total; the DB dominates) |
| Metro dev-server start | ~3.5 s |
| First-ever native build (previous session) | 33 m 46 s — included 4 ABIs, Gradle 9.4.1 download, emulator running, zram swapping |
| Files from `mockup/` in the bundle | **0** (imported nowhere; MD5-compared against the export) |

Why the first build was slow, in short: RN 0.88 is New-Architecture-only, so
Fabric/TurboModule C++ for the app, `react-native-screens`,
`react-native-safe-area-context` and `expo-modules-core` is compiled locally
(570 objects vs 252 in the Old-Architecture comparison project), it was
compiled for four ABIs at once, and the emulator plus 16 parallel compiler jobs
exhausted 13 GB of RAM into zram.

Current dev configuration is applied by `plugins/withBuildPerformance.js`
(re-applied on every `expo prebuild`): `reactNativeArchitectures=x86_64,arm64-v8a`,
`org.gradle.workers.max=6`, `org.gradle.caching=true`,
`org.gradle.jvmargs=-Xmx3072m`, R8 and PNG crunching disabled.

Two ABIs are built on purpose: one Debug APK then installs on the emulator and
on the phone. `npm run apk:debug` produces it (97 MB, 38 `.so`, 8 s warm);
`npm run android` still narrows to the attached device's ABI for a faster
one-target build.

Font and icon imports use package sub-paths
(`@expo-google-fonts/<family>/<weight>`, `@expo/vector-icons/Ionicons`) so only
the 10 TTFs actually used are bundled instead of all 47 shipped by the barrels.
`.easignore` keeps `mockup/`, `docs/` and `prompts/` out of EAS uploads; it has
no effect on Metro or Gradle.

Two operational rules matter more than any config value:

1. Use Metro for JS-only changes; do not rebuild native for them.
2. Do not run `npm install` unless dependencies change — it deletes
   `node_modules/expo-modules-core/android/build` (313 MB of C++) and the next
   build recompiles it.

**Physical phone:** `npm run apk:debug` builds one APK for both the emulator and
the phone, and `npm run device:install` installs it on whichever device
`ADB_SERIAL` names. `npm run device:tcpip -- <ip>` sets up wireless adb, and
`npx expo start --go` needs no build at all. Emulator and phone attached at once
is ambiguous, so the scripts honour `ADB_SERIAL` or adb's `ANDROID_SERIAL` and
refuse to guess. Recipes are in `docs/development/WORKFLOW.md` §2.

---

## 7. Known issues

| ID | Issue | Severity | Notes |
|---|---|---|---|
| K-01 | Non-theme preferences reset on restart | Medium | Theme persists in SQLite; font size, reading mode, reciter, bookmarks and reading position still reset (P-08) |
| K-02 | Surah dataset was limited to 12 | Resolved | Canonical index now covers all 114 surahs; the DB holds 6,236 ayahs |
| K-03 | Prayer data is not valid for any date/location | High if trusted | Clearly labelled in UI |
| K-04 | Qibla is static | High if trusted | Sensor integration pending (P-07) |
| K-05 | Audio dock is non-functional | Low | Labelled |
| K-06 | Dark mode not art-directed | Low | Functional tokens only |
| K-07 | `expo-system-ui` installed to resolve native theme handling | Resolved | Added `~58.0.7`; rebuild applied |
| K-08 | No automated tests | Medium | Plan in `TESTING.md` |
| K-09 | iOS unverified | Medium | Environment limitation |
| K-10 | `npm audit` advisories untriaged | Medium | Toolchain transitive |
| K-11 | `android/` generated during build | Info | Git-ignored; do not edit by hand |
| K-12 | Hardware/system back exits the app from pushed screens | High | Manifest has `enableOnBackInvokedCallback="false"`, but a `BackHandler` listener never receives the event; Android finishes the activity. Header back works. Suspect target SDK 36 / Android 14 predictive-back dispatch. Needs verification with a real gesture and a native back-handling fix. |
| K-13 | First Gradle build took ~34 min on this machine | Resolved | Cold-build one-time costs (4 ABIs + Gradle 9.4.1 download + emulator + zram swap). Warm builds are now 22 s. Single-ABI dev builds and capped workers are applied via `plugins/withBuildPerformance.js`; see `docs/performance/BUILD_PERFORMANCE_ANALYSIS.md`. |
| K-14 | Unvocalized Arabic search returns no rows | High | The FTS index keeps diacritics (`unicode61`); `نعبد*` returns 0 rows while `نَعْبُدُ*` returns 10. Requires index or query normalisation. |
| K-15 | Search and bookmark open the reader at ayah 1 | High | `SurahReader` only receives `surahId`; there is no target-ayah parameter or scroll-to-index. |
| K-16 | An updated `quran.db` may not replace the installed copy | High | `SQLiteProvider` defaults to `forceOverwrite=false`, so dataset changes can be silently ignored after an app update. Needs an explicit version/checksum strategy. |
| K-17 | Database provenance is not reproducible | Medium | `scripts/data/quran_info.json` is git-ignored (2.3 MB), the Tanzil copyright comment is discarded, there is no manifest/checksum, and the build script deletes the old DB before validating the new one. |

---

## 8. Blocking decisions

Resolved: P-01 (Tanzil Uthmani), P-02 (QuranEnc `tamil_omar`), P-06 (offline
reading scope), P-09 (MIT licence + public repository).

Still open (`user-approved: no` in `docs/architecture/DECISIONS.md`):

- P-03 Audio provider and rights
- P-04 Backend choice
- P-05 Accounts/sync
- P-07 Prayer method/madhab and location strategy
- P-08 Persistence scope (theme only so far)
- P-10 AI execution model
- P-11 Platform scope
- P-12 Commercial vs non-commercial
- P-13 Branding and final name

---

## 9. Next step

1. Re-run the runtime checks on a device/emulator; no device was attached on
   19 Nov 2026, so every screen remains unverified against the latest commit.
2. Fix the reader deep-link so search, bookmarks and "continue reading" open the
   target ayah (K-15).
3. Fix Arabic search normalisation (K-14) and decide the query strategy for
   diacritics.
4. Decide the DB update strategy (`forceOverwrite`/version/checksum, K-16) and
   make the build pipeline reproducible with a manifest (K-17).
5. **Owner manual test:** verify hardware/system back from Reader, Appearance and
   Qibla (K-12).
6. Triage `npm audit` without breaking SDK compatibility.
7. Add a minimal automated test setup now that the repository layer has logic
   worth testing.

Do not start backend, audio or AI work before the corresponding decisions are
recorded.

---

## 10. How to resume

```bash
cd Tamil-Quran-App
npm install
npm run typecheck && npm run lint && npm run doctor
npm start                 # or: npx expo run:android
```

Then read `AGENTS.md`, `requirements.md`, this file, and
`docs/development/IMPLEMENTATION_PLAN.md` before changing anything.
