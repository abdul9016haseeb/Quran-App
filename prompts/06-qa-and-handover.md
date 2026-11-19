# Prompt 06 — QA, Review and Handover

Use this prompt at the end of any work session, before handing the project to
another person or agent.

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md`
5. `docs/development/TESTING.md`
6. `docs/development/SCREEN_SPEC.md`

---

## Your task

Audit the current state of the app, verify it against the documented
requirements, and produce an honest handover. Do not add features during this
task unless a defect fix is trivial and in scope.

### Step 1 — Static verification

Run and record the exact output:

```bash
npm run typecheck
npm run lint
npm run doctor
npx expo export --platform android
```

If a command fails, fix only what is necessary to restore a green baseline, or
report it as a blocker with the failing output.

### Step 2 — Runtime verification

Launch on Android (`npx expo run:android` or an already-installed build) and walk
the 20-step smoke test in `docs/development/TESTING.md` §3. For each screen note:

- does it open and render,
- light and dark mode,
- narrow width (~320 dp),
- any clipping, overlap, or wrong copy,
- whether placeholder disclosures are intact.

### Step 3 — Content and scope audit

Confirm:

- [ ] Quran text and translation come from the bundled database and match the
      documented sources.
- [ ] No backend, audio, sensors, permissions or AI code exists; only the approved
      Quran database and theme storage are present.
- [ ] Prayer Times and Qibla are separate.
- [ ] No `LICENSE` file or repository URL was invented.
- [ ] No sample badge was removed.
- [ ] Surah metadata is still limited to the documented set.
- [ ] `mockup/` and `docs/architecture/sources/` are unmodified.

### Step 4 — Documentation audit

- Update `PROJECT_STATE.md` with the verified state, commands and dates.
- Update `CHANGELOG.md` under `[Unreleased]`.
- Update `SCREEN_SPEC.md` if behaviour changed.
- Ensure `AGENTS.md` still describes the actual architecture (React Navigation,
  not Expo Router).
- Ensure every pending decision in `DECISIONS.md` is still accurate and none has
  been silently "resolved".

### Step 5 — Report

Produce a concise handover with these sections:

```text
## Summary
## What is real
## What is mocked
## What is blocked (with decision IDs)
## Verification (commands + results + screens inspected)
## Known issues (with reproduction)
## Next step (one concrete action)
## Open questions for the owner
```

---

## Hard constraints

- Do not claim a screen was verified if it was not launched.
- Do not claim performance numbers without measurement.
- Do not "fix" a failing check by weakening it (disabling lint rules, loosening
  TypeScript, removing tests).
- Do not commit unless asked.
- Do not mark an owner decision as resolved without the owner's instruction.

---

## Definition of done

- All automated checks pass or are reported with exact failures.
- Every screen has been visited and its state recorded.
- Documentation matches the code.
- The report distinguishes real, mocked and blocked work.
- A single, concrete next action is stated.
