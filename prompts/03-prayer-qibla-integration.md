# Prompt 03 — Prayer Times and Qibla Integration

Use this prompt when the owner has approved the prayer calculation method, Asr
madhab, location strategy and sensor permission approach (decision P-07).

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md` — confirm P-07 and platform scope
5. `docs/architecture/TECHNOLOGY_EVALUATION.md` §9
6. `docs/development/SCREEN_SPEC.md` §6–§7

---

## Your task

Replace the illustrative prayer data and the static compass with real,
configurable behaviour, while keeping Prayer Times and Qibla as **separate
screens**.

### Part A — Prayer times

1. Choose the engine:
   - **preferred:** local calculation (`adhan-js` or a verified equivalent) so
     the app works offline,
   - AlAdhan may be used only for cross-checking unless the owner approved it as
     a runtime dependency.
2. Implement settings for:
   - calculation method,
   - Asr madhab (Shafi/Hanafi),
   - high-latitude rule,
   - manual per-prayer offsets,
   - timezone handling (never rely on device timezone alone if the user selects
     another city).
3. Location strategy:
   - manual city selection must always work,
   - GPS is optional, permission-gated, and explained before requesting,
   - cache the last known location locally.
4. Cache monthly timings; define refresh rules and offline fallback.
5. Replace the monthly table's mock rows with calculated/cached data.
6. Present the active method and madhab in the UI, with a link to change them.
7. Validate against a local mosque timetable for at least one month and against
   a second source; record discrepancies.

### Part B — Qibla

1. Use `expo-location` for coordinates and `expo-sensors` (magnetometer) for
   heading; install with `npx expo install`.
2. Compute bearing to the Kaaba (21.4225°N, 39.8262°E) from the user's position.
3. Smooth heading updates and handle:
   - sensor unavailable,
   - permission denied,
   - low accuracy / calibration needed,
   - device flat vs upright.
4. Provide a fallback: numeric bearing + map/static direction when sensors fail.
5. Make the caveat copy accurate: it must no longer say "sensors are not
   connected" once they are.

### Out of scope

Notifications (requires a separate approval), audio, AI, accounts, sync.

---

## Hard constraints

- Do not request location or motion permission on launch; request in context.
- Do not claim a calculation method is "correct for everyone"; expose settings.
- Do not present cached data as live without a timestamp.
- Keep a manual location path so the app is usable without GPS.
- Do not merge the two screens.
- Do not add analytics or background location.

---

## Verification

1. `npm run typecheck`, `npm run lint`, `npx expo-doctor`.
2. Test with location permission allowed, denied, and revoked.
3. Test with sensors unavailable (emulator) and on a physical device if
   available.
4. Compare a full month of timings against a reference; list differences.
5. Verify timezone and DST behaviour with a non-local city.
6. Verify the compass north reference and calibration guidance.
7. Confirm no permission prompt appears during unrelated flows.

---

## Deliverables

- Prayer engine abstraction + settings UI.
- Location provider with manual fallback.
- Sensor-based Qibla with graceful degradation.
- Updated `SCREEN_SPEC.md`, `PROJECT_STATE.md`, `CHANGELOG.md`.
- A validation table of compared timings and known deviations.
- Explicit statement of what remains unverified.

---

## Definition of done

- Timings are correct for the configured method within an agreed tolerance.
- The app works offline with cached data and manually chosen locations.
- Qibla responds to the device or clearly explains why it cannot.
- Permissions are contextual, revocable, and explained.
- Prayer Times and Qibla remain separate.
