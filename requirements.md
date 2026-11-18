# Requirements — Tamil Quran App

**Version:** 0.1 (UI foundation milestone)
**Last updated:** 18 November 2026
**Status of this document:** working specification derived from the owner's brief
and the supplied mockups. Where the owner has not decided something, it is listed
as an open question rather than assumed.

Related documents:
- `docs/architecture/DECISIONS.md` — what is approved
- `docs/architecture/TECHNOLOGY_EVALUATION.md` — evidence and alternatives
- `docs/development/SCREEN_SPEC.md` — screen-by-screen behaviour
- `PROJECT_STATE.md` — current implementation truth

---

## 1. Product intent

Build a Tamil-first Quran app that feels calm, premium and trustworthy: readable
Tamil, beautiful Arabic, correct prayer information, and (later) recitation and
recitation feedback. Phase 1 deliberately delivers **only the interface** so the
visual and interaction direction can be reviewed before content licensing,
backend work, or AI are funded.

### 1.1 Audience

- Tamil-speaking Muslims reading Quran with Tamil meaning.
- Users who expect a familiar, reverent visual language similar to existing Tamil
  Quran apps (deep green, white, gold).
- Future users who want recitation playback and pronunciation feedback.

### 1.2 Design identity

- Primary: deep Islamic green `#0B5D3B` with white surfaces and gold accents.
- Clean, generous spacing, rounded cards, strong Tamil hierarchy.
- Light and dark foundations; system theme respected by default.
- Arabic set in Amiri, Tamil UI in Noto Sans Tamil, Tamil display in Noto Serif
  Tamil.
- Must not look like a generic Material template.

---

## 2. Scope of this milestone

### 2.1 In scope

| Area | Requirement |
|---|---|
| Framework | React Native + TypeScript, Expo SDK 58 |
| Screens | Home, Quran index, Reader, Search, Bookmarks, Prayer Times, Qibla, Reciter picker, Settings, Appearance, About |
| Navigation | Typed React Navigation stack + four bottom tabs |
| Theming | Token-based light/dark/system theme |
| Typography | Bundled Tamil + Arabic fonts; adjustable reader font sizes |
| Reading UI | Reading modes (both / Arabic / Tamil), per-ayah actions, audio dock (visual only) |
| Prayer UI | Today view, tomorrow preview, monthly table, location header, calculation note |
| Qibla UI | Static compass, sample bearing, explicit sensor caveat |
| State | In-memory preferences and bookmarks |
| Documentation | Architecture, decisions, workflow, prompts, state tracking |
| Quality | Typecheck, lint, doctor, Android bundle, emulator run |

### 2.2 Explicitly out of scope

- Real Quran text or Tamil translation
- Backend, API, cloud, database, auth, sync
- Audio playback, audio files, downloads, background audio
- Location, compass sensors, notifications, permissions
- AI, speech recognition, Tajweed scoring, microphone
- Store submission, signing, CI/CD, EAS configuration
- Persistence of any kind
- Localisation beyond Tamil-first copy

Adding any of these requires an owner decision recorded in `DECISIONS.md`.

---

## 3. Functional requirements

Numbering is stable; use these IDs in tasks and reviews.

### 3.1 App shell

- **FR-01** The app launches to a branded loading state while fonts load.
- **FR-02** After fonts load, it opens the main tabs with Home selected.
- **FR-03** Four tabs exist: முகப்பு (Home), குர்ஆன் (Quran), தொழுகை (Prayer),
  அமைப்புகள் (Settings).
- **FR-04** Tab icons and labels reflect the active tab.
- **FR-05** Stack screens (Reader, Qibla, Bookmarks, Search, Appearance, Reciter
  Picker, About) push over the tabs and can be dismissed back.
- **FR-06** Android back behaviour follows the navigator; no custom interception.

### 3.2 Home

- **FR-10** Shows a green hero with greeting, app identity and a continue-reading
  card for a sample surah.
- **FR-11** Shows a next-prayer card with countdown-style information and a link
  to Prayer Times.
- **FR-12** Quick actions open Search, Qibla and Bookmarks.
- **FR-13** A surah shortcut list opens the Reader with the correct `surahId`.
- **FR-14** Secondary rows open Appearance, Reciter Picker, Prayer Times and
  About.
- **FR-15** Mock/sample status is disclosed where data could be mistaken for
  live content.

### 3.3 Quran index

- **FR-20** Lists the available surahs (currently 12) with number, Tamil name,
  Arabic name, transliteration, meaning, ayah count and revelation place.
- **FR-21** A search field filters the list locally by name/number.
- **FR-22** Tapping a surah opens the Reader.
- **FR-23** An inline note states that the complete verified 114-surah dataset is
  pending.
- **FR-24** Juz/Page segmented views may show an explanatory empty state rather
  than fabricated data.

### 3.4 Reader

- **FR-30** Header shows surah number, Tamil name, ayah count and revelation
  place.
- **FR-31** Each ayah displays Arabic and/or Tamil according to reading mode.
- **FR-32** Placeholder ayahs render a visible sample badge; the disclosure must
  not be dismissible into a misleading state.
- **FR-33** Per-ayah actions include bookmark toggle and a share/copy affordance
  that does not claim to copy real scripture.
- **FR-34** A bottom audio dock shows reciter and playback controls but performs
  no playback and says so.
- **FR-35** Enough ayahs render to demonstrate scroll behaviour; currently three
  per surah.
- **FR-36** Opening the reader with an unknown surah id fails gracefully.

### 3.5 Search

- **FR-40** Search accepts surah name, transliteration, Tamil name or number.
- **FR-41** Results are grouped or labelled clearly and open the Reader.
- **FR-42** Ayah-text search must not be implied while content is placeholder.
- **FR-43** Empty and no-result states are distinct.

### 3.6 Bookmarks

- **FR-50** Lists bookmarks from the in-memory provider with surah name, ayah
  number, note and added label.
- **FR-51** Tapping a bookmark opens the Reader.
- **FR-52** Removing a bookmark updates the list immediately.
- **FR-53** Empty state explains that bookmarks are session-only.

### 3.7 Prayer Times (separate screen)

- **FR-60** Prayer Times is its own tab and is not merged with Qibla.
- **FR-61** Shows location, date, timezone and the five prayers for "today".
- **FR-62** Indicates the next prayer and a countdown/progress treatment.
- **FR-63** Provides a tomorrow preview and a monthly table.
- **FR-64** States that timings are illustrative and that calculation method and
  location integration are pending.
- **FR-65** Notification settings appear only as disabled/placeholder controls.

### 3.8 Qibla (separate screen)

- **FR-70** Dedicated screen reachable from Home and from stack navigation.
- **FR-71** Draws a compass with a needle at a sample bearing.
- **FR-72** Shows the numeric bearing and device-orientation caveat.
- **FR-73** Explains that live sensors and location permission are not connected.
- **FR-74** Does not request permissions.

### 3.9 Reciter picker

- **FR-80** Lists reciters with name and style.
- **FR-81** Selecting a reciter updates the in-memory preference.
- **FR-82** Every entry is visibly marked as having no connected audio.

### 3.10 Settings

- **FR-90** Appearance row opens the Appearance screen.
- **FR-91** Reciter row opens the picker.
- **FR-92** Language, notifications, about and reset rows behave honestly:
  either navigate, change in-memory state, or explain that they are pending.
- **FR-93** Reset restores theme, font sizes, reading mode, reciter and initial
  bookmarks.
- **FR-94** No row pretends to persist or sync.

### 3.11 Appearance

- **FR-100** Theme selector: system / light / dark, applied immediately.
- **FR-101** Arabic font size slider within 22–46.
- **FR-102** Tamil font size slider within 13–26.
- **FR-103** Reading mode selector: both / Arabic only / Tamil only.
- **FR-104** A live preview reflects all four settings.
- **FR-105** Changes do not survive an app restart (documented).

### 3.12 About

- **FR-110** States the current milestone and what is not implemented.
- **FR-111** States that the app licence is undecided and that no repository URL
  is published.
- **FR-112** Distinguishes app code, fonts, Quran text, translation and audio as
  separate rights questions.
- **FR-113** Provides no invented credits, publisher names or permissions.

---

## 4. Non-functional requirements

- **NFR-01 Accessibility:** readable contrast in both themes; accessible
  labels/roles on interactive elements; support dynamic type where practical;
  no text embedded in images.
- **NFR-02 Performance:** 60 fps scrolling on mid-range Android for the reader
  and lists; no unnecessary re-renders from the preferences provider.
- **NFR-03 Responsiveness:** works from 320 dp width to tablet widths; safe-area
  insets respected on all edges.
- **NFR-04 Typography:** Tamil glyphs must not clip; line heights accommodate
  ascenders/descenders; Arabic must render right-to-left correctly.
- **NFR-05 Offline:** the app performs no network requests in this milestone.
- **NFR-06 Privacy:** no analytics, no permissions, no identifiers collected.
- **NFR-07 Maintainability:** feature-first structure, typed routes, tokens, no
  dead code, no `any`.
- **NFR-08 Honesty:** every unimplemented capability is labelled in the UI, not
  only in documentation.
- **NFR-09 Reversibility:** no choice in this milestone may make content,
  backend or AI integration expensive to add later.
- **NFR-10 Build health:** `npm run typecheck`, `npm run lint`, `npx expo-doctor`
  and `npx expo export --platform android` pass.

---

## 5. Content and legal constraints

- **CR-01** Never generate or paraphrase Quranic verses or translations.
- **CR-02** Placeholder Arabic/Tamil must be clearly non-scriptural and marked.
- **CR-03** Surah metadata may be factual but must be complete and sourced
  before release; the current 12-surah subset is a UI convenience.
- **CR-04** TNTJ Tamil translation is all rights reserved until written
  permission is on file.
- **CR-05** No audio is bundled or linked until rights are documented.
- **CR-06** Prayer times must not be presented as authoritative until a method
  and location strategy are approved.
- **CR-07** Do not add a repository licence, copyright line, or open-source badge
  without owner instruction.
- **CR-08** Attribution requirements of any future source must be visible in
  About and in the content manifest.

---

## 6. Acceptance criteria for this milestone

The milestone is complete when all of the following are true:

1. All screens in §2.1 exist, are reachable, and match the green/white direction.
2. Light, dark and system themes all render correctly.
3. Tamil and Arabic text render with bundled fonts at small and large sizes.
4. Placeholder content is visibly labelled everywhere it appears.
5. Prayer Times and Qibla are separate screens.
6. Typecheck and lint pass with zero warnings.
7. `npx expo-doctor` passes.
8. An Android build launches and every screen can be visited without a crash.
9. `PROJECT_STATE.md`, `CHANGELOG.md` and this document reflect reality.
10. No backend, persistence, audio, sensor or AI code has been added.

---

## 7. Open questions for the owner

These mirror `DECISIONS.md` pending items and must be answered before the next
milestone:

1. Which Arabic text edition/source, and under what terms?
2. Which Tamil translation, and is written permission obtained?
3. Is the app commercial or non-commercial?
4. Android only, or Android + iOS?
5. Is cross-device sync wanted, and are accounts acceptable?
6. Which prayer calculation method and Asr madhab?
7. Is offline audio required, streamed audio acceptable, or neither yet?
8. On-device AI, server AI, or defer?
9. Final app name, identifiers, icon and licence.
10. Who reviews Quran/translation accuracy before release?
