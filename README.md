# Tamil Quran App — அல் குர்ஆன்

A Tamil-first Quran app for Android, built with React Native, TypeScript and
Expo.

> **Status: UI foundation (v0.1.0).** This repository contains a complete,
> interactive interface — not a working Quran reader. There is no backend, no
> database, no audio playback, no location/sensors and no AI. All Quran and
> translation text on screen is clearly labelled placeholder copy.

---

## What this milestone is

The purpose of this phase is to settle the visual language and information
architecture before investing in content licensing, data pipelines or native
features. It delivers:

- A green/white/gold design system with light, dark and system themes
- Tamil and Arabic typography using bundled Noto and Amiri fonts
- Typed navigation across the full screen set
- Reading controls, bookmarks, prayer-time layouts and a static Qibla compass
- Explicit, in-UI disclosure of every mocked capability

## What this milestone is not

- Not a source of Quran text or Tamil translation
- Not usable for prayer times or Qibla direction
- Not connected to any API, database, account system or AI service
- Not licensed for redistribution (no licence has been chosen)
- Not ready for store submission

---

## Screens

| Screen | Purpose | Status |
|---|---|---|
| Home | Dashboard: continue reading, next prayer, quick actions | UI complete |
| Quran | Surah index with local search | UI complete, 12 surahs |
| Reader | Dual-language reading, modes, bookmarks, audio dock | UI complete, placeholder text |
| Search | Surah metadata search | UI complete |
| Bookmarks | In-memory saved places | UI complete, session-only |
| Prayer Times | Today, tomorrow, monthly table | UI complete, illustrative data |
| Qibla | Compass and bearing | UI complete, static |
| Reciter picker | Reciter selection | UI complete, no audio |
| Settings | Preferences and project status | UI complete |
| Appearance | Theme, font sizes, reading mode, live preview | UI complete, not persisted |
| About | Scope, status and rights disclosure | UI complete |

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

This repository deliberately contains **no real Quranic text, no Tamil
translation of the Quran, and no recitation audio**.

- Placeholder Arabic and Tamil strings in `src/data/mock/sampleAyahs.ts` are
  non-Quranic sample copy and are marked in the UI.
- Surah metadata is factual and limited to the first 12 surahs; the complete
  verified dataset is pending.
- The TNTJ Tamil translation is treated as all rights reserved until written
  permission is obtained.
- Arabic text sources, audio rights and prayer API terms have not been verified.
- **No licence has been chosen for this repository.** There is intentionally no
  `LICENSE` file and no repository URL is published.

See `docs/architecture/DECISIONS.md` (pending decisions) before adding any
content or asset.

---

## Roadmap

1. **Phase 0 (current)** — UI foundation and review
2. **Phase 1** — verified Arabic text + licensed Tamil translation + offline
   SQLite + persistence
3. **Phase 2** — prayer calculation, location, working Qibla
4. **Phase 3** — licensed recitation audio
5. **Phase 4** — measured AI recitation-feedback proof of concept
6. **Phase 5** — optional sync and release

Details and entry criteria: `docs/development/IMPLEMENTATION_PLAN.md`.

---

## Contributing

Read `AGENTS.md` and `requirements.md` first. Do not add real scripture,
translation, audio, backend code or permissions without an owner decision
recorded in `docs/architecture/DECISIONS.md`. Do not create the initial Git
commit unless the owner asks.
