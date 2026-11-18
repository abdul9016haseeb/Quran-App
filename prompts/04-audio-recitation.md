# Prompt 04 — Recitation Audio

Use this prompt only after the owner has approved an audio source, its
redistribution terms, and whether offline downloads are permitted (decision
P-03 / P-06).

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md` — confirm P-03 is resolved with the actual
   licence/attribution text
5. `docs/architecture/TECHNOLOGY_EVALUATION.md` §8
6. `docs/development/SCREEN_SPEC.md` §3 and §8

If the audio licence is not documented, stop. Do not add "temporary" URLs.

---

## Your task

Turn the visual audio dock and reciter list into real verse-by-verse playback,
using only the approved source.

### Scope

1. **Source integration**
   - map each reciter to the approved, licensed audio set,
   - store URLs/templates in one module; no URLs scattered in components,
   - handle missing files explicitly.
2. **Playback engine**
   - choose the SDK 58-compatible audio module (check current Expo docs before
     installing),
   - per-ayah play/pause, next/previous, continuous play,
   - active-ayah highlight synced to playback,
   - seek/restart behaviour,
   - error and buffering states.
3. **Background behaviour** (only if approved)
   - background audio session,
   - lock-screen/notification controls,
   - interruption handling (calls, other apps).
4. **Downloads** (only if the licence permits)
   - per-surah or per-ayah download,
   - progress, cancel, delete, storage usage,
   - offline playback fallback,
   - cache eviction policy.
5. **UI truthfulness**
   - remove "audio not connected" copy where playback now works,
   - show attribution required by the licence,
   - mark reciters whose sets are incomplete.
6. **Reader integration**
   - tapping an ayah plays that ayah,
   - dock reflects the current surah and reciter,
   - navigating away stops or continues according to an explicit rule you
     document.

### Out of scope

Word-by-word timing unless verified timing data exists. AI, accounts, sync.

---

## Hard constraints

- Do not bundle or hotlink audio without documented rights.
- Do not claim gapless or word-level sync unless measured.
- Do not add background modes without platform configuration and QA.
- Do not request microphone permission; playback needs none.
- Do not leave the "sample" labels on anything that is now real, and do not
  remove them from anything still mocked.

---

## Verification

1. `npm run typecheck`, `npm run lint`, `npx expo-doctor`.
2. Build a development build (`npx expo run:android`) — Expo Go is not enough
   for background/audio-native behaviour.
3. Test: play, pause, next, previous, rapid switching, end of surah, network
   loss, app backgrounding, audio focus loss, headphone unplug.
4. Test download and offline playback if implemented.
5. Measure app size impact and cache size.
6. Verify attribution appears where required.

---

## Deliverables

- Audio source module with licence/attribution reference.
- Playback provider/hook and UI integration.
- Download manager (if approved).
- Updated `SCREEN_SPEC.md`, `PROJECT_STATE.md`, `CHANGELOG.md`.
- A test log covering the scenarios above and any failures.

---

## Definition of done

- Only licensed audio is used.
- Playback is reliable across the tested scenarios.
- The UI accurately reflects availability, buffering and offline state.
- No unlicensed asset is committed.
- Background behaviour, if enabled, is configured and verified on a device.
