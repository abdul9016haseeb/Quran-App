# Project State — Tamil Quran App

**Last updated:** 18 November 2026
**Milestone:** 0 — UI foundation
**Version:** 0.1.0
**Repository state:** no commits, no remote, no licence chosen

This is the canonical handover document. If it disagrees with the code, the code
is right — fix this file. Do not describe intentions as if they were features.

---

## 1. One-line status

A complete, typed, interactive React Native UI for a Tamil-first Quran app, with
all Quranic/translation content and every live capability explicitly and visibly
mocked. No backend, storage, audio, sensors or AI.

---

## 2. What actually works

| Capability | Status | Notes |
|---|---|---|
| App launch + font loading | Working | Branded splash, then Home |
| Tab navigation | Working | Home / Quran / Prayer / Settings |
| Stack navigation | Working | Reader, Qibla, Search, Bookmarks, Appearance, Reciter, About |
| Theme switching | Working | system / light / dark, instant |
| Light + dark palettes | Working | Token-driven; dark needs design review |
| Tamil/Arabic typography | Working | Bundled Noto Sans/Serif Tamil + Amiri |
| Reader font sizing | Working | Arabic 22–46, Tamil 13–26 |
| Reading modes | Working | Both / Arabic / Tamil |
| Surah metadata | Working (partial) | First 12 surahs only, factual |
| Surah index filtering | Working | Local, by name/number |
| Search | Working (partial) | Surah metadata only |
| Bookmarks | Working (session) | In-memory; resets on restart |
| Reader audio dock UI | Working (visual) | Controls update state; no sound |
| Prayer times layout | Working (visual) | Illustrative timings only |
| Qibla compass | Working (visual) | Static needle, sample bearing |
| Reciter selection | Working (session) | Persists only in memory |
| Settings reset | Working | Restores in-memory defaults |
| About/status disclosure | Working | Licence and scope stated |
| Native Android build | Working | Built and installed on the emulator; see §6 |
| Offline operation | Working | No network code exists |

---

## 3. What is mocked (and visibly labelled)

| Mock | Location | Label shown |
|---|---|---|
| Arabic + Tamil ayah text | `src/data/mock/sampleAyahs.ts` | `SampleBadge` + long disclosure |
| Surah metadata | `src/data/mock/surahs.ts` | Inline note on index screen |
| Prayer timings | `src/data/mock/prayerTimes.ts` | "மாதிரித் தரவு" / calculation pending |
| Qibla bearing | `src/data/mock/prayerTimes.ts` | Sensor caveat on Qibla screen |
| Reciters / audio | `src/data/mock/reciters.ts` | "audio not connected" per row |
| Initial bookmarks | `src/data/mock/bookmarks.ts` | Contextual empty/initial state |
| Continue-reading target | `src/features/home/HomeScreen.tsx` | Part of sample hero content |

The Arabic/Tamil placeholder strings are deliberately **non-Quranic**. They must
not be replaced with generated scripture.

---

## 4. What does not exist

- Real Quran text or any Tamil translation of the Quran
- Backend, API client, database, SQLite, AsyncStorage, accounts, sync
- Audio files, URLs, streaming, downloads, background audio
- Location, compass/magnetometer, notifications, any runtime permission
- AI, speech recognition, microphone access, models
- Persistence of any preference or bookmark
- Analytics, crash reporting, telemetry
- CI/CD, EAS config, signing, store metadata
- iOS build verification
- Automated tests
- A repository licence or public URL

---

## 5. Structure and dependencies

```text
App.tsx → src/app/AppRoot.tsx
  SafeAreaProvider → PreferencesProvider → RootNavigator
```

- Entry: `index.ts` registers `App`.
- Navigation: React Navigation v7 (`native`, `native-stack`, `bottom-tabs`),
  route contract in `src/navigation/types.ts`.
- Runtime deps: Expo 58.0.26, React Native 0.88.1, React 19.3.0, navigation v7,
  safe-area-context, screens, expo-font, expo-status-bar, vector-icons, three
  Google Fonts packages.
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

### Native runtime

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
| `npx expo export --platform android` | **12–13 s**, 2.5 MB Hermes bundle + **1.9 MB** assets (was 11 MB total / 7.9 MB assets) |
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
(re-applied on every `expo prebuild`): `reactNativeArchitectures=x86_64`,
`org.gradle.workers.max=6`, `org.gradle.caching=true`,
`org.gradle.jvmargs=-Xmx3072m`, R8 and PNG crunching disabled.

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

**Physical phone:** the dev build is x86_64-only, so the phone needs either
Expo Go (`npx expo start --go`, no build) or `npm run android:phone`, which
builds `arm64-v8a` and installs over adb. Recipes and caveats are in
`docs/development/WORKFLOW.md` §2.

---

## 7. Known issues

| ID | Issue | Severity | Notes |
|---|---|---|---|
| K-01 | Preferences/bookmarks reset on restart | Medium | Expected for this milestone; persistence is pending (P-08) |
| K-02 | Surah dataset limited to 12 | Medium | Deliberate; do not extend from memory |
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

---

## 8. Blocking decisions

All `user-approved: no` in `docs/architecture/DECISIONS.md`:

- P-01 Arabic text edition/source
- P-02 Tamil translation and permission
- P-03 Audio provider and rights
- P-04 Backend choice
- P-05 Accounts/sync
- P-06 Offline scope
- P-07 Prayer method/madhab and location strategy
- P-08 Persistence scope
- P-09 App licence/public repository
- P-10 AI execution model
- P-11 Platform scope
- P-12 Commercial vs non-commercial
- P-13 Branding and final name

---

## 9. Next step

1. **Owner manual test:** verify hardware/system back from Reader, Appearance and
   Qibla. If it still exits, the fix is native back dispatch (see K-12), not a JS
   navigation change.
2. Owner reviews the UI on a device and approves or lists visual changes.
3. Finish inspecting Search, Bookmarks, Qibla, Reciter picker, About and dark mode.
4. Decide P-01 and P-02 so Phase 1 (verified content + SQLite) can start.
5. Triages `npm audit` without breaking SDK compatibility.
6. Add a minimal automated test setup once Phase 1 introduces logic worth
   testing.

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
