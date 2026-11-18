# Testing and QA — Tamil Quran App

**Last updated:** 18 November 2026
**Applies to:** Phase 0 (UI foundation)

There is no automated test suite yet. This document defines the manual and
tooling checks that gate a change, plus the future test plan once real content
and data layers exist.

---

## 1. Automated checks

| Check | Command | Pass condition |
|---|---|---|
| TypeScript | `npm run typecheck` | exit 0, no errors |
| ESLint | `npm run lint` | exit 0, 0 warnings |
| Dependency/config health | `npm run doctor` | all checks pass |
| Android bundle | `npx expo export --platform android` | export completes |
| Native build (when native deps change) | `npx expo run:android` | installs and launches |

Notes

- `npx expo lint` is unreliable in this environment; always use `npm run lint`.
- `expo export` is a bundling smoke test, not a runtime test.
- `npm audit` advisories are transitive toolchain issues; do not force-fix.

---

## 2. Device / emulator matrix

Phase 0 minimum:

| Dimension | Values |
|---|---|
| Platform | Android (primary) |
| Theme | light, dark, system-follow |
| Width | ~320 dp (small), ~393 dp (typical), tablet if available |
| Font scale | default, large (system accessibility) |
| Reader sizes | Arabic 22 / 30 / 46, Tamil 13 / 17 / 26 |
| Orientation | portrait (locked in `app.json`) |

iOS is not verified in this environment; state that explicitly in reports.

---

## 3. Screen-by-screen smoke test

Run after any navigation, theme or component change.

| # | Step | Expected |
|---|---|---|
| 1 | Cold launch | Branded splash, then Home; no white flash after fonts load |
| 2 | Home | Hero, continue card, next prayer, quick actions visible |
| 3 | Theme toggle from Home | Light/dark switches without restart; contrast holds |
| 4 | Quick action: Search | Search screen opens, back returns to Home |
| 5 | Quick action: Qibla | Separate Qibla screen + caveat copy |
| 6 | Quick action: Bookmarks | List or empty state; back works |
| 7 | Quran tab | 12 surah rows, notice about full dataset |
| 8 | Search "பகரா" / "2" | Al-Baqarah row appears; tap opens reader |
| 9 | Reader | Header, reading modes, 3 ayahs, sample badges |
| 10 | Reader mode Arabic-only | Tamil hidden, Arabic RTL, no layout jump |
| 11 | Reader mode Tamil-only | Arabic hidden, line height intact |
| 12 | Reader bookmark | Icon fills; entry appears in Bookmarks |
| 13 | Reader audio dock | Controls update state; "not connected" copy present |
| 14 | Prayer tab | Location, five prayers, tomorrow, monthly table |
| 15 | Prayer → Qibla shortcut | Separate screen, same caveat |
| 16 | Settings | All rows navigate or explain; reset works |
| 17 | Appearance | Theme, sizes, mode, live preview |
| 18 | Reciter picker | Selection reflected in reader dock |
| 19 | About | Milestone status, licence undecided, no fake links |
| 20 | Android back | Predictable at every level; no empty stack |

---

## 4. Layout and typography checks

- Tamil ascenders/descenders are not clipped at every font size.
- Arabic diacritics render correctly and text is right-aligned.
- No horizontal scrolling except the monthly table, which must remain usable.
- Cards do not overflow at 320 dp.
- Safe areas respected on notch/punch-hole devices and gesture navigation.
- Bottom tab bar does not cover list content.
- Reader audio dock does not hide the last ayah.
- Long Tamil labels wrap instead of truncating mid-word where meaning matters.
- Gold on white (`goldText` vs `gold`) meets contrast for small text.

---

## 5. Accessibility checks

- TalkBack: every icon button announces a meaningful Tamil label.
- The sample-data badge is reachable and announced near the content.
- Touch targets are at least 44×44 dp.
- Colour is never the only signal for selection (check marks + text also used).
- System font scaling does not break the tab bar or setting rows.
- Reduce-motion: navigation animations remain acceptable (default OS behaviour).

---

## 6. Content integrity checks

These are release blockers once real content exists; in Phase 0 they verify that
nothing *pretends* to be real.

- [ ] Every ayah on screen carries `isPlaceholder: true`.
- [ ] The sample badge and long disclosure are visible in the reader.
- [ ] No surah beyond the documented 12 appears.
- [ ] Prayer times are described as illustrative.
- [ ] Qibla bearing is described as a sample.
- [ ] Reciter rows state that audio is unavailable.
- [ ] About states that the licence is undecided.
- [ ] No network request is made (verify with device network inspector).

---

## 7. Performance checks (manual baseline)

- Cold start to Home: measure on the emulator; record seconds.
- Reader scroll with 3 ayahs and both fonts at maximum size: no visible jank.
- Surah list scroll: stable frame rate.
- Theme toggle: no full-screen remount flash.
- Memory: no unbounded growth after visiting all screens repeatedly.

Record numbers in `PROJECT_STATE.md` when measured. Do not claim 60 fps without
measurement.

---

## 8. Future automated test plan

When Phase 1 begins:

1. **Unit tests** (Jest + React Native Testing Library)
   - repository mapping and validation,
   - surah/ayah lookup,
   - bookmark reducer logic,
   - prayer-time formatting,
   - qibla bearing maths.
2. **Content validation tests**
   - 114 surahs, expected ayah totals, unique keys,
   - checksum match against the manifest,
   - no empty Arabic or Tamil fields.
3. **Component tests**
   - reader renders both scripts and respects mode/size props,
   - placeholder badge appears when `isPlaceholder`,
   - empty states.
4. **E2E** (Maestro or Detox) for the 20-step smoke test above.
5. **Accessibility** checks in CI where tooling permits.

Testing libraries must be added with owner approval and SDK-compatible versions.

---

## 9. Bug report template

```text
Title:
Build/commit:
Device + Android version:
Theme + font scale:
Screen:
Steps:
Expected:
Actual:
Screenshot/recording:
Is content mock or real?
```

---

## 10. Release gate (future)

A build is not releasable until:

- typecheck, lint, doctor, and tests pass,
- the content manifest validates,
- licences for text, translation and audio are on file,
- attribution is visible,
- accessibility and small-screen checks pass,
- the app makes no unlicensed network call,
- `PROJECT_STATE.md` and `CHANGELOG.md` match the build.
