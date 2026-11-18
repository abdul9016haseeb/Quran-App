# Architecture Decision Record — Tamil Quran App

**Last updated:** 18 November 2026
**Format:** lightweight ADR. Each decision records status, whether the owner has
approved it, the context, the choice, and what would reverse it.

> **Approval legend**
> - **user-approved: yes** — the owner explicitly asked for this.
> - **user-approved: partial** — the owner asked for the area; the specific
>   implementation was chosen by the agent and is reversible.
> - **user-approved: no** — agent recommendation only. Not binding. Must be
>   confirmed before it becomes expensive to reverse.
>
> Nothing in this file is a licence grant, a content permission, or a statement
> of legal rights.

---

## ADR-001 — Use Expo (SDK 58) with development builds kept open

- **Status:** Accepted for the UI phase
- **user-approved:** partial (React Native + TypeScript requested; Expo was
  evaluated as instructed)
- **Date:** 18 Nov 2026

**Context.** The brief requires React Native + TypeScript and asks for Expo to be
evaluated before committing. Future phases may need audio, sensors, background
playback, notifications and on-device AI, none of which are safe assumptions for
Expo Go.

**Decision.** Build on Expo SDK 58.0.26 / React Native 0.88.1 / React 19.3.0
using continuous native generation. Do not rely on Expo Go beyond the UI phase;
use `npx expo run:android` / EAS development builds when native modules arrive.

**Consequences.** Fastest safe UI iteration; SDK upgrades are coordinated by
Expo; `android/`/`ios/` remain generated and git-ignored. Exit path to bare React
Native stays open because prebuild is unpinned.

**Revisit if** a required audio/AI module cannot be packaged in a development
build. See `TECHNOLOGY_EVALUATION.md` §4.

---

## ADR-002 — React Navigation v7 instead of Expo Router

- **Status:** Accepted
- **user-approved:** no (agent decision, fully reversible while the app is small)
- **Date:** 18 Nov 2026

**Context.** Expo's template recommends Expo Router (file-based). The app has a
small, explicit screen graph: four tabs plus modal-style stack screens. The brief
asks for a clear, agent-friendly architecture and warns against unnecessary
complexity.

**Decision.** Use `@react-navigation/native` + `native-stack` + `bottom-tabs`,
with route params typed in `src/navigation/types.ts`.

**Consequences.** Navigation is explicit and greppable; no file-routing
conventions to learn; deep linking requires manual configuration later. `src/app/`
is an application folder, **not** a routes folder — do not add Expo Router files.

**Revisit if** deep linking, web URLs, or typed search params become a priority.
Migration is mechanical but touches every screen.

---

## ADR-003 — Strict TypeScript with no escape hatches

- **Status:** Accepted
- **user-approved:** partial (TypeScript requested)
- **Date:** 18 Nov 2026

**Decision.** `strict` via Expo's base tsconfig. No `any`, no suppression
comments for convenience, no non-null assertions to silence errors. Domain types
live in `src/types/content.ts` and are designed to survive the move from mock
data to a real repository.

**Consequences.** Slightly more boilerplate at boundaries; safer refactors and
better agent reliability.

---

## ADR-004 — Token-driven theme with light/dark support

- **Status:** Accepted
- **user-approved:** partial (green/white identity and dark foundation requested)
- **Date:** 18 Nov 2026

**Context.** The mockups use a strong deep-green header, white cards and warm
gold accents. Screens must stay consistent and support dark mode.

**Decision.** All visual constants live in `src/theme/tokens.ts`
(`lightColors`/`darkColors`, spacing, radii, type scale, shadows). Screens read
them through `useAppTheme()`. Theme preference is `system | light | dark`, held
by `PreferencesProvider`.

**Consequences.** No raw hex values in feature code. Adding a colour means adding
it to both palettes. Dark mode is a foundation, not a finished design; it still
needs visual QA.

---

## ADR-005 — Typography: Noto Sans Tamil, Noto Serif Tamil, Amiri

- **Status:** Accepted
- **user-approved:** partial (excellent Tamil/Arabic typography requested)
- **Date:** 18 Nov 2026

**Decision.** Bundle Google Fonts through `@expo-google-fonts/*` and `expo-font`:
Noto Sans Tamil for UI, Noto Serif Tamil for display/headings, Amiri for Arabic.
Fonts are loaded in `AppRoot` before the navigator mounts.

**Consequences.** Consistent rendering across Android/iOS, no system-font
fallback for Tamil. Adds app size; font subsetting is a future optimisation.

**Note.** Font licences (SIL Open Font License) belong to the font projects; this
does not license the app itself or its content.

---

## ADR-006 — Mock content only, explicitly and visibly labelled

- **Status:** Accepted
- **user-approved:** yes (brief: never fabricate Quranic verses/translations)
- **Date:** 18 Nov 2026

**Context.** The UI needs realistic text to design reading rhythm, but presenting
invented Arabic/Tamil as scripture would be unacceptable.

**Decision.** `src/data/mock/sampleAyahs.ts` contains deliberately **non-Quranic**
sample Arabic and Tamil copy. Every ayah has `isPlaceholder: true` and every
reader screen shows the `SampleBadge` and the `SAMPLE_DATA_LONG` disclosure.
Surah metadata is factual and limited to the first 12 surahs, with a visible note
that the verified 114-surah dataset is pending.

**Consequences.** Screens look complete but honestly read as prototypes. The
placeholder badge must not be removed to make a screenshot look better.

**Revisit only** when a verified Arabic edition and a licensed Tamil translation
are recorded as approved decisions. See pending decisions P-01 and P-02.

---

## ADR-007 — Preferences and bookmarks live in memory only

- **Status:** Accepted (current milestone)
- **user-approved:** partial (UI-first, no database)
- **Date:** 18 Nov 2026

**Decision.** `PreferencesProvider` holds theme, font sizes, reading mode,
reciter selection and bookmarks in React state. Nothing is persisted. Restarting
the app resets everything.

**Consequences.** Zero storage dependencies and no migration burden. The provider
API is intentionally shaped so a storage adapter can be added behind it later
without changing screens.

**Revisit when** the owner approves a persistence scope (P-08).

---

## ADR-008 — No backend, database, auth, audio engine, sensors or AI in this phase

- **Status:** Accepted
- **user-approved:** yes (brief: UI-first; no backend/database/auth/audio/AI)
- **Date:** 18 Nov 2026

**Decision.** The app makes no network calls and requests no permissions. Mock
data supplies every screen. The Qibla compass is a static drawing with a sample
bearing; prayer times are illustrative strings; the audio dock is non-functional
by design.

**Consequences.** The prototype is fully offline and private. Every one of these
areas is an explicit pending decision below.

---

## ADR-009 — Preserve mockups; original TNTJ-style design is primary

- **Status:** Accepted
- **user-approved:** yes (preserve reference folders; original mockups primary)
- **Date:** 18 Nov 2026

**Decision.** Source mockups were copied — not moved or edited — into
`mockup/original/`, `mockup/stitch_redesign/` and `mockup/legacy_reference/`.
Source documents were copied into `docs/architecture/sources/`.

The green/white `mockup/original/` screens drive layout and information
architecture. The cream/gold Stitch direction informs secondary details only.

**Consequences.** Design provenance is auditable. Do not "clean up" these
folders. If a mockup is annotated, write a new file beside it.

---

## ADR-010 — Feature-first source layout

- **Status:** Accepted
- **user-approved:** no (agent decision)
- **Date:** 18 Nov 2026

**Decision.**

```text
src/app/            root composition + providers
src/components/ui/  shared primitives
src/features/<f>/   screens + feature components
src/data/mock/      labelled mock repositories
src/navigation/     typed route contracts
src/theme/          tokens
src/types/          shared domain types
```

**Consequences.** Clear ownership per screen area; imports stay shallow; a future
data layer can replace `src/data/mock` without touching feature folders.

---

## ADR-011 — Placeholder app identifiers, no repository or licence claim

- **Status:** Accepted provisionally
- **user-approved:** no
- **Date:** 18 Nov 2026

**Decision.** `app.json` uses `com.tamilquran.app` for Android and iOS, slug
`tamil-quran`, scheme `tamilquran`. `src/constants/app.ts` sets
`REPOSITORY_URL = null` and states the licence is undecided.

**Consequences.** Identifiers are easy to change now and expensive after store
submission. No `LICENSE` file exists. Do not publish or claim open source.

---

## Pending owner decisions

These are **not decided** and must not be treated as settled by any document or
UI copy. `user-approved: no` applies to all rows.

| ID | Decision | Why it is blocked | What unblocks it |
|---|---|---|---|
| P-01 | Arabic Quran text edition and source | Redistribution terms and exact edition not verified | Written terms review; pin edition/version; checksum plan |
| P-02 | Tamil translation edition | TNTJ permission absent; other editions unverified | Written permission or a verified licensed edition |
| P-03 | Recitation audio provider and rights | EveryAyah/Quran Foundation terms unverified; download rights unknown | Documented licence + coverage test |
| P-04 | Backend: none vs Supabase vs Supabase + Node | No sync/accounts requirement confirmed; Quran Foundation OAuth needs a confidential client | Owner product decision |
| P-05 | Accounts and cross-device sync | Not requested | Owner decision |
| P-06 | Offline scope (reader / + audio / + AI) | Depends on P-01…P-03, P-10 | Content and audio decisions |
| P-07 | Prayer calculation method and Asr madhab | Local mosque practice varies | Owner/locale decision; comparison with AlAdhan |
| P-08 | Persistence for bookmarks/progress | Not in UI milestone | Owner approves storage scope |
| P-09 | App licence and public repository | Owner has not chosen | Explicit owner instruction |
| P-10 | AI execution model (on-device/server/hybrid) | No measured POC | Benchmark on target hardware |
| P-11 | Platform scope (Android only vs Android + iOS) | Not stated | Owner decision |
| P-12 | Commercial vs non-commercial intent | Changes Tanzil and translation options | Owner decision |
| P-13 | Branding assets and final app name | Current name/icon are placeholders | Owner supplies or approves assets |

---

## Decision hygiene

- One decision per ADR; append rather than rewrite history.
- When a pending decision resolves, add a new ADR that supersedes the row and
  mark the row resolved with a date.
- Never record a licence or permission as approved without the actual document
  on file.
