# Implementation Plan — Tamil Quran App

**Current milestone:** 0 — UI foundation (**in progress / near complete**)
**Last updated:** 18 November 2026

Plans are ordered by dependency, not enthusiasm. A phase does not start until its
entry criteria are met and its blocking owner decisions are recorded in
`docs/architecture/DECISIONS.md`.

---

## Phase 0 — UI foundation (current)

**Goal:** a complete, honest, typed interface that can be reviewed on a device.

**Entry criteria:** owner brief, mockups, evaluated stack. ✅

**Deliverables**

- [x] Expo + TypeScript project with pinned SDK 58 dependencies
- [x] Design tokens, light/dark themes, Tamil/Arabic fonts
- [x] Typed navigation (stack + four tabs)
- [x] Shared UI primitives
- [x] Home, Quran index, Reader, Search, Bookmarks
- [x] Prayer Times (separate), Qibla (separate)
- [x] Reciter picker, Settings, Appearance, About
- [x] Mock data, explicitly labelled
- [x] Architecture evaluation + decisions
- [x] Requirements, workflow, screen spec, prompts
- [ ] Device screenshot QA and final state report
- [ ] Owner review of visual direction

**Exit criteria**

- All acceptance criteria in `requirements.md` §6 pass.
- Owner approves the visual direction or supplies concrete changes.
- No hidden mock data is mistaken for live functionality.

**Explicit non-goals:** real content, persistence, network, audio, sensors, AI.

---

## Phase 1 — Verified content and local persistence

**Goal:** real Quran reading, offline, with user state that survives restarts.

**Blocked by:** P-01 (Arabic edition), P-02 (Tamil translation), P-08
(persistence scope).

**Work**

1. Obtain written terms for the Arabic edition and Tamil translation; record in
   `DECISIONS.md`.
2. Build a content pipeline outside the app:
   - normalise only for indexing, never for display,
   - validate 114 surahs / 6,236 ayahs (confirm against the chosen edition),
   - unique `(surah, ayah)`,
   - produce a manifest with source, version, checksum and attribution.
3. Package a read-only database or JSON seed.
4. Add `expo-sqlite` and a repository interface:
   - `getSurahs()`, `getSurah(id)`, `getAyahs(surahId)`, `search(query)`.
5. Replace `src/data/mock` behind the repository; keep mock as a test fixture.
6. Persist preferences, bookmarks and last-read position.
7. Add Arabic/Tamil full-text search with a normalised index.
8. QA with a qualified reviewer for a sample of surahs.
9. Surface attribution in About.

**Exit criteria**

- Real content renders verbatim; no placeholder badges remain on scripture.
- Offline reading works with the network disabled.
- Bookmarks and reading position survive restart.
- Content manifest and attribution are visible.

**Risks:** licensing delays, text corruption, database size, Tamil font
shaping at large sizes.

---

## Phase 2 — Prayer times and Qibla

**Goal:** correct, configurable prayer information and a working compass.

**Blocked by:** P-07 (method/madhab), platform/sensor decisions.

**Work**

1. Choose local calculation (`adhan-js` or equivalent) vs API-first.
2. Implement calculation with explicit settings: method, Asr madhab,
   high-latitude rule, manual offset.
3. Location strategy: GPS with permission, manual city, or both; cache the last
   known location.
4. Monthly cache with a documented refresh policy.
5. Replace the static Qibla compass with `expo-location` + `expo-sensors`,
   including calibration guidance and a fallback bearing.
6. Optional: prayer notifications — separate approval required.
7. Validate against local mosque timetables and AlAdhan for a sample month.

**Exit criteria**

- Timings match a reference for the chosen method within an agreed tolerance.
- Qibla responds to device orientation and degrades gracefully without sensors.
- No permission is requested without context.

---

## Phase 3 — Recitation audio

**Goal:** verse-by-verse playback with reciter selection and offline option.

**Blocked by:** P-03 (audio rights), P-06 (offline scope).

**Work**

1. Document the audio licence, attribution and download permissions.
2. Choose the player (`expo-audio` or equivalent) after checking SDK 58 docs.
3. Implement per-ayah playback, continuous play and active-ayah highlight.
4. Add background playback and lock-screen controls only if approved.
5. Download manager with size limits, progress and deletion.
6. Handle missing files, offline state and errors.
7. Measure app size and storage impact.

**Exit criteria**

- Playback works for the licensed set, online and (if approved) offline.
- Reciter switching is reliable.
- No unlicensed file is bundled or hotlinked.

---

## Phase 4 — Recitation feedback (AI)

**Goal:** a measured, honest proof of concept, not a promise.

**Blocked by:** P-10 (execution model), model licensing, device targets.

**Work**

1. Select one candidate with a clear licence.
2. Build a native harness in a development build.
3. Benchmark on the target Android device:
   - verse identification,
   - word alignment,
   - omissions/substitutions/repetitions,
   - noise and multiple reciters,
   - memory, battery, thermals.
4. Define a Quran-specific error metric and publish measured results.
5. Decide on-device, server-side, or hybrid based on evidence.
6. Only then design UI for feedback.

**Exit criteria**

- Measured accuracy and cost are documented.
- The UI never implies Tajweed mastery beyond measured capability.

---

## Phase 5 — Optional sync and release

**Goal:** ship a store-ready app if the owner chooses.

**Blocked by:** P-04, P-05, P-09, P-11, P-12, P-13.

**Work**

1. Decide sync; if yes, add Supabase behind a repository/sync boundary.
2. Release signing, store listings, privacy policy.
3. Licence decision and third-party notices.
4. Accessibility audit and performance profiling.
5. Crash reporting and analytics — only with explicit consent and disclosure.

---

## Sequencing summary

```text
Phase 0  UI foundation           ← now
Phase 1  Verified content + SQLite
Phase 2  Prayer + Qibla
Phase 3  Audio
Phase 4  AI proof of concept
Phase 5  Sync + release
```

Phases 1 and 2 can run partly in parallel once their decisions are made. Phase 3
must not precede Phase 1. Phase 4 must not precede measured evidence.

---

## Things deliberately deferred

- Dark-mode art direction beyond the token foundation
- Tablet-specific layouts
- Onboarding carousel
- Localisation infrastructure (English/Arabic UI)
- Deep links and universal links
- Widgets, shortcuts, watch apps
- Word-by-word translation
- Tafsir
- Hifz/ memorisation plans

Each needs an owner request before work begins.
