# Prompt 01 — UI Refinement

Use this prompt when the goal is to improve the look, feel, responsiveness or
accessibility of the existing interface **without adding new capabilities**.

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md`
5. `docs/development/SCREEN_SPEC.md`
6. `mockup/original/` (primary visual reference)

Do not skip these. They define what is real, what is mocked, and what you may not
change.

---

## Your task

Refine the UI of the Tamil Quran app in `Tamil-Quran-App/`.

Focus areas, in order:

1. **Visual fidelity** to `mockup/original/` — green/white identity, gold accent,
   spacing rhythm, card elevation, header composition.
2. **Typography** — Tamil line height and clipping at all supported sizes,
   Arabic RTL layout, hierarchy consistency.
3. **Dark mode** — every surface, border, badge and icon must be legible.
4. **Responsiveness** — 320 dp through tablet; safe areas; no clipped content.
5. **Accessibility** — labels, roles, 44 dp touch targets, contrast.
6. **Micro-interactions** — press states, transitions already available in React
   Native; do not add animation libraries.

---

## Hard constraints

- Do **not** add dependencies.
- Do **not** add backend, storage, audio, sensors, permissions or AI.
- Do **not** replace placeholder Qur'an/Tamil content with real or generated
  scripture.
- Do **not** remove `SampleBadge`, `SAMPLE_DATA_LONG`, or pending-data notices.
- Do **not** merge Prayer Times and Qibla.
- Do **not** introduce raw colour or font values in feature files; extend
  `src/theme/tokens.ts` instead.
- Do **not** rewrite navigation or move files without a reason stated in your
  report.
- Preserve `mockup/` and `docs/architecture/sources/` untouched.

---

## Method

1. Run the app and capture the current state of the screens you will touch.
2. List concrete defects (not vague "make it nicer"), each with screen and cause.
3. Fix one screen or shared primitive at a time.
4. Re-run `npm run typecheck` and `npm run lint` after each meaningful change.
5. Verify light mode, dark mode, and a narrow viewport.
6. Update `docs/development/SCREEN_SPEC.md` only if behaviour changed.
7. Update `CHANGELOG.md` under `[Unreleased]`.

---

## Deliverables

- A short defect list with before/after reasoning.
- The code changes, scoped and readable.
- Verification output for typecheck, lint, and the screens inspected.
- Any remaining visual mismatch with the mockups, stated honestly.
- No claims of functionality that does not exist.

---

## Definition of done

- `npm run typecheck` passes.
- `npm run lint` passes with zero warnings.
- Every touched screen verified in light and dark mode.
- Placeholder disclosures are intact.
- `CHANGELOG.md` updated.
- The report separates "changed", "verified", and "still mocked".
