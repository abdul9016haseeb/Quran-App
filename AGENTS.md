# AGENTS.md — Tamil Quran App

Operating instructions for human and AI contributors.

**Read these first, in order:**

1. `AGENTS.md` (this file)
2. `requirements.md` — scope, non-goals, hard constraints
3. `PROJECT_STATE.md` — what actually exists right now
4. `docs/architecture/DECISIONS.md` — what is approved vs undecided
5. `docs/development/WORKFLOW.md` — how to change the project safely

If a request conflicts with `requirements.md` or an owner decision in
`DECISIONS.md`, stop and ask. Do not silently widen scope.

---

## 1. Project in one paragraph

A Tamil-first Quran mobile app. The current milestone adds **verified offline
reading** on top of the UI foundation: a polished, typed React Native interface
backed by a bundled SQLite database containing Tanzil Uthmani Arabic and the
QuranEnc `tamil_omar` Tamil translation for all 114 surahs (6,236 ayahs), plus
offline FTS5 search. There is still no backend, auth, audio playback, location or
sensor integration and no AI. Prayer times, Qibla and the audio dock remain
explicitly labelled mock UI; the reader falls back to labelled placeholder text
only if the database cannot be read.

**Never invent Quranic verses, Tamil translations, hadith, or scholarly claims.**
Never present mock data as if a service produced it.

---

## 2. Stack (as installed, not aspirational)

| Layer | Choice | Version |
|---|---|---|
| Runtime | Expo SDK | 58.0.26 |
| UI | React Native | 0.88.1 |
| Language | TypeScript (strict) | 6.0.3 |
| UI library | React | 19.3.0 |
| Navigation | React Navigation: `native`, `native-stack`, `bottom-tabs` | v7 |
| Fonts | `expo-font` + `@expo-google-fonts/*` | bundled |
| Icons | `@expo/vector-icons` (Ionicons) | bundled |
| Offline data | `expo-sqlite` + bundled `assets/quran.db` | 58.0.18 |

Rationale and alternatives: `docs/architecture/TECHNOLOGY_EVALUATION.md`.
This is a **React Navigation** project, not Expo Router. `src/app/` is an
application-layer folder (providers, root composition), **not** a file-router
directory. Do not add `_layout.tsx` or `expo-router` imports.

### SDK discipline

Expo breaks APIs between SDK releases. Before using an Expo or React Native API:

1. Confirm the SDK major in `package.json`.
2. Check `https://docs.expo.dev/versions/v58.0.0/` or the relevant RN docs.
3. Prefer an installed module over a new dependency.

Install packages with `npx expo install <package>` so versions stay SDK-compatible.
Do not run plain `npm install` for Expo/RN packages.

---

## 3. Commands

```bash
npm run typecheck     # tsc --noEmit  (must pass)
npm run lint          # eslint .      (must pass with 0 warnings)
npm run doctor        # npx expo-doctor
npm start             # Metro dev server
npm run android       # open on Android emulator/device
npx expo run:android  # native build (generates android/, currently git-ignored)
npx expo export --platform android   # bundle smoke test
```

`npx expo lint` is broken in this environment (it demands an older ESLint).
Use `npm run lint` instead. Do not "fix" this by downgrading ESLint.

**Definition of done for any code change:** `npm run typecheck` passes,
`npm run lint` passes with zero warnings, and any affected screen has been
launched and inspected on a device or emulator (or the limitation is stated
explicitly).

---

## 4. Hard rules

### 4.1 Content integrity

- Displayed Quran text and Tamil translation come from the bundled
  `assets/quran.db` (Tanzil Uthmani + QuranEnc `tamil_omar`). Treat that file as
  the single source of truth: never retype, "fix" or paraphrase its text in code.
- `src/data/mock/sampleAyahs.ts` is a **fallback only**, used when the database
  cannot be read. Every placeholder ayah carries `isPlaceholder: true` and must
  render the `SampleBadge` / `SAMPLE_DATA_LONG` disclosure.
- `src/data/canonicalSurahs.ts` contains factual metadata for all 114 surahs.
  Never extend or edit it from memory; corrections need a cited source and a
  database validation pass.
- Never remove or weaken a placeholder badge to make a screen look "finished".
- Rebuild `assets/quran.db` through `scripts/` (see `WORKFLOW.md`), never by
  hand-editing the binary. Record source, version, checksum and attribution.
- Do not add audio URLs, a different translation, or other scripture without an
  owner decision recorded in `docs/architecture/DECISIONS.md`.

### 4.2 Licensing

- The repository is licensed **MIT** (owner decision, 19 Nov 2026). The `LICENSE`
  file lives on `develop`/`main`; the canonical URL is
  `https://github.com/abdul9016haseeb/Quran-App`. Do not change it or claim a
  different licence without an owner instruction.
- The MIT licence covers the app's source code only. Quran text, translation,
  fonts and any future audio keep their own third-party terms.
- Tanzil Uthmani Arabic is used under **CC BY 3.0** and must stay attributed in
  the UI and docs. The QuranEnc `tamil_omar` Tamil translation is used under
  QuranEnc's terms; do not redistribute it separately from the app.
- TNTJ Tamil translation is treated as **all rights reserved** until written
  permission exists. Do not scrape, bundle, or "temporarily" include it.
- Audio rights and prayer API terms are unresolved. Do not imply otherwise in UI
  copy, README, or commit messages.
- Do not invent a maintainer identity, pricing, API limits or permission claims.

### 4.3 Scope

Do not add, without an explicit owner request:

- backend services, auth, cloud sync
- databases beyond the bundled read-only `assets/quran.db`, or new persisted
  state (only the theme preference is stored, in `user_preferences.db`)
- audio playback, downloads, or reciter audio
- `expo-location`, `expo-sensors`, notifications, or permissions
- AI/ML libraries, models, or microphone access

If a task seems to need one of these, write the proposal in
`docs/development/IMPLEMENTATION_PLAN.md` and ask first.

### 4.4 UI and design

- Colours, spacing, radii, typography come from `src/theme/tokens.ts` via
  `useAppTheme()`. No raw hex values or ad-hoc font sizes in screens.
- Keep the green/white identity and gold accent. The TNTJ-style mockups in
  `mockup/original/` are the **primary** reference; `mockup/stitch_redesign/`
  is secondary.
- Prayer Times and Qibla are **separate screens**. Do not merge them.
- Support light and dark modes through the existing provider; check both.
- Tamil and Arabic must render with the bundled fonts (`Noto Sans Tamil`,
  `Noto Serif Tamil`, `Amiri`). Do not rely on system fallback.
- Every interactive element needs an accessibility label/role and a touch
  target of at least 44×44 dp where practical.

### 4.5 Code conventions

- Feature-first folders: `src/features/<feature>/`, shared primitives in
  `src/components/ui/`.
- Screens are named exports (`export function HomeScreen()`), not default exports.
- Route params are typed in `src/navigation/types.ts`; add new routes there
  first, then to `RootNavigator`.
- Use `type` imports for types. No `any`. No non-null assertions to silence
  the compiler.
- Relative imports use the depth of the file. Components inside
  `src/features/*/components/` import shared code via `../../../`.
- Keep user-facing copy in Tamil where the mockups do; status/disclosure copy
  lives in `src/constants/app.ts`.
- Prefer small, focused components. Avoid premature abstraction.

---

## 5. Repository map

```text
App.tsx                     entry → AppRoot
index.ts                    Expo registerRootComponent
src/app/                    root composition + global providers
src/navigation/             typed routes, tabs, theme bridge
src/theme/tokens.ts         colours, spacing, type scale
src/components/ui/          reusable primitives (AppText, Card, …)
src/features/<feature>/     screens and feature components
src/data/canonicalSurahs.ts 114-surah canonical metadata
src/data/quranRepository.ts SQLite reader + offline FTS search
src/data/mock/              labelled mock data and DB fallback
src/services/storage/       theme preference storage
src/types/content.ts        shared domain types
assets/quran.db             bundled offline Quran dataset (14 MB)
scripts/                    dataset fetch + database build/validation
mockup/                     preserved visual references and our own captures
mockup/development_screenshots/  real app captures (latest/, history/)
docs/architecture/          evaluation, decisions, source material
docs/development/           workflow, plan, testing, screen spec
prompts/                    task prompts for AI agents
```

`mockup/` and `docs/architecture/sources/` are archival. Never modify or delete
them; copy if you need to annotate.

---

## 6. Git

### 6.1 No git changes without the owner's permission

**Never run a command that writes to git history or refs unless the owner has
explicitly asked for it in this conversation.** Permission for one action is
not permission for the next one.

Ask first, every time, before:

- `git commit` (including `--amend`), `git merge`, `git rebase`, `git revert`,
  `git cherry-pick`, `git tag`, `git push`, `git reset --hard`, `git stash`,
  `git clean`
- creating or deleting branches (`git branch`, `git switch -c`,
  `git checkout -b`, `git branch -d/-D`)
- anything that rewrites, discards or removes work

Allowed without asking: read-only inspection (`git status`, `git diff`,
`git log`, `git show`, `git branch`, `git remote -v`) and simply editing files
in the working tree.

When a task is finished, **stop and report** what changed; let the owner decide
whether and how to commit. If a commit is wanted, state the exact subject and
body you propose before running it.

### 6.2 Repository facts and conventions

- The repository tracks `origin` (`github.com/abdul9016haseeb/Quran-App`) and is
  licensed MIT. Work happens on `feature/*` branches; do not create a branch
  unless asked.
- `android/` and `ios/` are generated by prebuild and are git-ignored. Never
  hand-edit them; change `app.json` or config plugins instead.
- Commit messages must be accurate about what works. Do not claim "audio added"
  when only UI exists, and keep placeholder content labelled.

---

## 7. UI Visual Verification

UI changes are judged against two sources: the preserved design references in
`mockup/` and real captures of the running app in
`mockup/development_screenshots/`. Neither replaces actually running the app.

`mockup/development_screenshots/latest/` holds current captures;
`history/` holds dated captures kept for an intentional before/after comparison.
These directories are for our own screenshots only — never put mockups,
generated images or placeholders in them.

### 7.1 Before changing UI

1. Inspect the matching reference screen in `mockup/stitch_redesign/<screen>/`
   (`screen.png`; read `code.html` for exact sizing and colour values). The
   `mockup/original/` TNTJ-style screenshots remain the primary identity
   reference per §4.4; `mockup/stitch_redesign/` is secondary.
2. Inspect the latest real capture in
   `mockup/development_screenshots/latest/`, when one exists for that screen.
3. Compare the implementation, the reference and the latest capture across:
   typography (family, size, weight, line height, Tamil/Arabic shaping), spacing,
   alignment, component sizing, colours (tokens vs rendered), visual hierarchy,
   scrolling, clipping/overflow, and responsiveness (320 dp and the target
   device).
4. A reference is never permission to remove or weaken functionality, labels,
   disclosures, accessibility behaviour or placeholder badges. If a mockup lacks
   a real feature, keep the feature and adapt its visual treatment.

### 7.2 After changing UI

5. Run the app (`npm start` plus `npm run android`, or an installed debug build)
   and inspect the affected screens in light and dark mode, including a narrow
   (~320 dp) layout.
6. Capture updated screenshots into `latest/` using the naming convention in
   §7.4.
7. Before replacing a capture you care about, copy the old file into `history/`
   with a dated, labelled name — only when the before/after comparison is
   meaningful.
8. Never invent screenshot results, claim a screen was inspected when it was
   not, or alter a capture to make the UI look better.
9. If screenshots cannot be captured (no device/emulator, app crash, Expo Go or
   environment limitation), state the limitation explicitly and give the exact
   manual capture steps you would use.

### 7.3 Which reference belongs to which screen

Reference directories that actually exist:

| App screen | Route | Reference(s) |
|---|---|---|
| Home | `Home` tab | `home_dashboard/screen.png` |
| Quran / Surah index | `Quran` tab | `surah_index/screen.png` |
| Surah reader | `SurahReader` | `arabic_typography/screen.png` — typography only; there is no full reader-layout reference |
| Prayer times | `Prayer` tab | `prayer_times/screen.png`; also `prayer_times_qibla/screen.png` |
| Qibla | `Qibla` | `qibla_compass/screen.png`; also `prayer_times_qibla/screen.png` |
| Settings | `Settings` tab | `settings/screen.png` |
| Appearance & reading | `Appearance` | `appearance_themes/screen.png` and `reading_preferences/screen.png` |

`serene_devotional_manuscript/DESIGN.md` is a style brief, not a screen.
`mockup/original/`, `mockup/legacy_reference/` and `Mock_ui_20.zip` are archival.

There is **no** matching reference for Search, Bookmarks, the Reciter picker or
About. For those, verify against the design tokens, the nearest existing screen
and the rules above, and say "no reference exists" instead of inventing one. Do
not assume every screen has a reference.

### 7.4 Capturing screenshots

Automatic capture works on the Android emulator with `adb`:

```bash
adb devices -l                    # confirm the target is attached
adb shell wm size                 # capture size, e.g. Physical size: 1080x2400
adb exec-out screencap -p > mockup/development_screenshots/latest/home__light__1080x2400__2026-11-19.png
```

When an emulator and a phone are attached, target one explicitly with
`adb -s "$ADB_SERIAL"`; the project scripts also honour `ADB_SERIAL` or adb's
`ANDROID_SERIAL`. Capture a full-resolution PNG; do not crop, scale or annotate.
If the app is not running, start it first (`npm run android`, or install an APK
with `npm run apk:debug && npm run device:install`).

Manual fallback: navigate the app on the device, then use the emulator's camera
button or `adb exec-out screencap -p > <file>.png`. Record device model, Android
version, theme and screen in the report.

Naming:

- Current: `<screen>__<theme>__<W>x<H>__<YYYY-MM-DD>.png` —
  e.g. `home__light__1080x2400__2026-11-19.png`
- History: `<YYYY-MM-DD>__<screen>__<theme>__<W>x<H>__<label>.png` —
  e.g. `2026-11-19__home__light__1080x2400__before-header-spacing.png`

`<screen>` uses lowercase ASCII tokens: `home`, `surah_index`, `surah_reader`,
`search`, `bookmarks`, `prayer_times`, `qibla`, `settings`, `appearance`,
`reciter_picker`, `about`. `<theme>` is `light` or `dark` (the resolved theme,
not `system`). `<W>x<H>` is the pixel size reported by the capture. Use `__`
between fields and `-` inside a field; avoid spaces and non-ASCII characters.

---

## 8. When you finish a task

1. Run typecheck and lint.
2. Launch the affected screens and check light/dark plus a small-screen layout;
   capture them per §7.
3. Update `PROJECT_STATE.md` if capabilities changed.
4. Update `CHANGELOG.md` under `[Unreleased]`.
5. Report what is real, what is mocked, and what is still blocked.
