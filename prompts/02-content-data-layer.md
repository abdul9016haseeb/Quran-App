# Prompt 02 — Verified Content and Data Layer

Use this prompt only **after** the owner has approved the Arabic text edition and
the Tamil translation (decisions P-01 and P-02 in
`docs/architecture/DECISIONS.md`). Until then, this prompt must not be executed.

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md` — confirm P-01/P-02 are resolved, with the
   actual permission/terms documents referenced
5. `docs/architecture/TECHNOLOGY_EVALUATION.md` §6–§7
6. `docs/development/IMPLEMENTATION_PLAN.md` Phase 1

If the decisions are still marked `user-approved: no`, stop and report that the
work is blocked. Do not proceed on assumptions.

---

## Your task

Replace the mock content layer with a **verified, offline, read-only** Quran
dataset and persist user state, without changing the visual design.

### Scope

1. **Content pipeline** (outside the app bundle build, scripted and repeatable):
   - ingest the approved Arabic edition verbatim,
   - ingest the licensed Tamil translation verbatim,
   - never normalise displayed text; build a separate normalised index,
   - validate surah count, ayah counts, `(surah, ayah)` uniqueness, and totals
     against the chosen edition,
   - emit a manifest: edition names, versions, source URLs, checksums, licence
     and attribution text, build date.
2. **Local database** using `expo-sqlite` (install with `npx expo install`):
   - read-only content tables separate from user tables,
   - schema versioning and migrations,
   - full-text search index (test FTS5 availability on device).
3. **Repository boundary**:
   - define `ContentRepository` with `getSurahs`, `getSurah`, `getAyahs`,
     `searchAyahs`, `getManifest`,
   - implement it over SQLite,
   - keep the mock implementation available for tests/dev only,
   - screens must not import the database directly.
4. **User state**: persist theme, font sizes, reading mode, reciter selection,
   bookmarks and last-read position.
5. **Honesty pass**:
   - remove placeholder badges only where real verified content now renders,
   - keep a "content source/version" line in About,
   - show attribution required by the licence.

### Out of scope

Backend, accounts, sync, audio, prayer calculation, AI, store release.

---

## Hard constraints

- Never alter Quranic text to "fix" spelling, diacritics, or spacing.
- Never invent missing ayahs or fall back to generated text.
- Never bundle content whose licence is not on file.
- Never put a server secret in the app.
- Never migrate user data destructively without a backup/rollback path.
- Keep the app fully functional with no network connection.

---

## Verification

1. `npm run typecheck`, `npm run lint`, `npx expo-doctor` all pass.
2. Content validation script fails loudly on any mismatch; include its output.
3. Open a sample of surahs (short, long, Meccan, Medinan) and compare against the
   source by eye and by diff.
4. Confirm bookmarks and reading position survive a restart.
5. Confirm searches return correct ayahs and do not mutate displayed text.
6. Measure database size and cold-start impact; record the numbers.
7. Have a qualified reviewer spot-check a defined sample; record who and what.

---

## Deliverables

- Content pipeline scripts and manifest.
- SQLite schema/migrations and repository implementation.
- Persistence adapter and provider changes.
- Updated `PROJECT_STATE.md`, `CHANGELOG.md`, `SCREEN_SPEC.md`.
- A written note of licences, attribution, checksums, and review status.
- Explicit list of anything still mocked.

---

## Definition of done

- The reader displays verified content with correct attribution.
- Placeholder badges are gone **only** where verified content exists.
- No unlicensed text or audio is included.
- Offline reading and persisted bookmarks work.
- Every validation and QA step is reported with actual output.
