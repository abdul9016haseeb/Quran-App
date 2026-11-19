# Tamil Quran App — அல் குர்ஆன்

A Tamil-first Quran app for Android, built with React Native, TypeScript and
Expo.

> **Status: working offline Quran reader (v0.1.0).** The app reads all 114
> surahs (6,236 ayahs) from a bundled SQLite database containing Tanzil Uthmani
> Arabic and the QuranEnc `tamil_omar` Tamil translation, with offline FTS5
> search. There is still no backend, no audio playback, no location/sensors and
> no AI. Prayer times, Qibla and the audio dock are clearly labelled mock UI.

---

## What this milestone is

The purpose of this phase is to settle the visual language and information
architecture, and to prove the offline content pipeline before native features.
It delivers:

- Verified offline Quran text and Tamil translation (114 surahs, 6,236 ayahs)
- Offline full-text search in Tamil and Arabic
- A green/white/gold design system with light, dark and system themes
- Tamil and Arabic typography using bundled Noto and Amiri fonts
- Typed navigation across the full screen set
- Reading controls, bookmarks, prayer-time layouts and a static Qibla compass
- Explicit, in-UI disclosure of every mocked capability

## What this milestone is not

- Not a substitute for a printed mushaf or scholarly review of the translation
- Not usable for prayer times or Qibla direction
- Not connected to any API, account system or AI service; the Quran database is
  bundled and read-only
- Not free of third-party content terms: the MIT licence covers code only
- Not ready for store submission

---

## Screens

| Screen | Purpose | Status |
|---|---|---|
| Home | Dashboard: sample continue-reading, next prayer, quick actions | UI complete |
| Quran | Surah index with local search | 114 surahs, offline |
| Reader | Dual-language reading, modes, bookmarks, audio dock | Real text offline; audio is visual only |
| Search | Surah metadata + ayah full-text search | Offline; Arabic normalisation still limited |
| Bookmarks | In-memory saved places | UI complete, session-only |
| Prayer Times | Today, tomorrow, monthly table | UI complete, illustrative data |
| Qibla | Compass and bearing | UI complete, static |
| Reciter picker | Reciter selection | UI complete, no audio |
| Settings | Preferences and project status | Theme persisted; rest session-only |
| Appearance | Theme, font sizes, reading mode, live preview | Theme persisted; sizes/mode session-only |
| About | Scope, status, licence and attribution | UI complete |

See `docs/development/SCREEN_SPEC.md` for behaviour and limitations.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 58 (React Native 0.88) |
| Language | TypeScript 6 (strict) |
| UI | React 19.3 |
| Navigation | React Navigation v7 |
| Fonts | `expo-font` + Google Fonts (Noto Sans/Serif Tamil, Amiri) |
| Icons | `@expo/vector-icons` (Ionicons) |

The evaluation behind these choices, including rejected alternatives and
licensing findings, is in `docs/architecture/TECHNOLOGY_EVALUATION.md`.

---

## Getting started

Requirements: Node.js, npm, Android Studio/SDK (for Android), and an emulator or
device.

```bash
cd Tamil-Quran-App
npm install
npm start              # Metro bundler
npm run android        # launch on Android
```

Native build (generates `android/`, git-ignored):

```bash
npx expo run:android
```

### Quality checks

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm run doctor         # expo-doctor
npx expo export --platform android
```

`npx expo lint` is not used in this project because of an ESLint version issue in
the current toolchain; `npm run lint` is the supported entry point.

---

## Project structure

```text
App.tsx                     app entry
src/app/                    root composition + preferences provider
src/navigation/             typed routes, tabs, navigation theme
src/theme/tokens.ts         colours, spacing, type scale, shadows
src/components/ui/          shared UI primitives
src/features/               one folder per feature/screen
src/data/mock/              clearly labelled mock data
src/types/                  shared domain types
mockup/                     preserved design references
docs/architecture/          evaluation, decisions, source documents
docs/development/           workflow, plan, testing, screen spec
prompts/                    ready-to-use prompts for AI agents
```

---

## Documentation map

| Document | Read it for |
|---|---|
| `AGENTS.md` | Operating rules for contributors and AI agents |
| `requirements.md` | Scope, functional/non-functional requirements |
| `PROJECT_STATE.md` | What actually works right now |
| `CHANGELOG.md` | Change history |
| `docs/architecture/TECHNOLOGY_EVALUATION.md` | Stack and platform research |
| `docs/architecture/DECISIONS.md` | Approved and pending decisions |
| `docs/development/WORKFLOW.md` | How to make changes safely |
| `docs/development/IMPLEMENTATION_PLAN.md` | Phased roadmap and gates |
| `docs/development/TESTING.md` | QA and release gates |
| `docs/development/SCREEN_SPEC.md` | Screen-by-screen specification |
| `prompts/` | Task prompts for AI-assisted work |

---

## Content and licensing

The app source code is licensed **MIT** (see `LICENSE` on `develop`/`main`).
Quran content and third-party assets keep their own terms:

- **Arabic:** Tanzil Project Uthmani text (v1.1), CC BY 3.0, bundled in
  `assets/quran.db`.
- **Tamil:** Shaykh Omar Sharif ibn Abdussalam's `tamil_omar` translation from
  QuranEnc.com, bundled under QuranEnc's terms. It is not offered as a separate
  redistributable dataset.
- **Fonts:** Amiri and Noto Sans/Serif Tamil, SIL Open Font License.
- The TNTJ Tamil translation is treated as all rights reserved and is **not**
  included.
- No recitation audio is bundled; audio rights and prayer API terms are still
  unresolved.
- `src/data/mock/sampleAyahs.ts` contains non-Quranic fallback copy used only if
  the database cannot be read, and is marked in the UI.

See `docs/architecture/DECISIONS.md` before adding any content or asset.

---

## Roadmap

1. **Phase 0 (review pending)** — UI foundation and review
2. **Phase 1 (content done, persistence partial)** — verified Arabic text +
   licensed Tamil translation + offline SQLite; bookmarks/progress persistence
   and DB provenance still open
3. **Phase 2** — prayer calculation, location, working Qibla
4. **Phase 3** — licensed recitation audio
5. **Phase 4** — measured AI recitation-feedback proof of concept
6. **Phase 5** — optional sync and release

Details and entry criteria: `docs/development/IMPLEMENTATION_PLAN.md`.

---

## Contributing

Read `AGENTS.md` and `requirements.md` first. Do not replace the bundled
scripture or translation, add audio, backend code or permissions without an
owner decision recorded in `docs/architecture/DECISIONS.md`. Do not commit,
merge, rebase or push unless the owner asks.
