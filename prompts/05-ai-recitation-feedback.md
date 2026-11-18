# Prompt 05 — AI Recitation Feedback (Proof of Concept)

Use this prompt only after the owner has approved an AI execution model and a
candidate model with a clear licence (decision P-10). This is a **measured
experiment**, not a feature promise.

---

## Required reading before you start

1. `AGENTS.md`
2. `requirements.md`
3. `PROJECT_STATE.md`
4. `docs/architecture/DECISIONS.md` — confirm P-10 and the model licence
5. `docs/architecture/TECHNOLOGY_EVALUATION.md` §10
6. `docs/development/IMPLEMENTATION_PLAN.md` Phase 4

If there is no approved candidate or no licence, stop and report the gap. Do not
download models speculatively.

---

## Your task

Build a proof of concept that evaluates how well a chosen model can align Quran
recitation to the expected ayah/word sequence, and report measured results. Do
not polish UI until the measurements justify it.

### Scope

1. **Harness**
   - isolate the experiment from the main UI (a dev build screen or a separate
     branch/module),
   - record audio only with explicit, contextual permission,
   - allow importing pre-recorded clips for repeatable tests.
2. **Pipeline**
   - expected text from the verified content layer (not mock content),
   - audio preprocessing as required by the model,
   - model inference (on-device or server per the approved decision),
   - alignment output: matched words, omissions, substitutions, repetitions.
3. **Evaluation**
   - define a Quran-specific error metric and a small labelled test set
     (multiple reciters, speeds, noise levels, device microphones),
   - measure accuracy, latency, memory, battery and thermal behaviour,
   - record failure cases: similar verses, long pauses, background noise,
     different qira'at.
4. **Reporting**
   - a results table with method and limitations,
   - an explicit statement that general Arabic ASR ≠ Tajweed evaluation,
   - a recommendation: on-device, server, hybrid, or stop.

### Out of scope

Shipping user-facing scoring. Tajweed grading claims. Accounts, sync, analytics.

---

## Hard constraints

- Never fabricate accuracy figures or benchmark results.
- Never upload user audio without explicit, informed consent and a retention
  policy.
- Never request microphone permission at launch.
- Never imply religious authority or correctness beyond measured behaviour.
- Do not commit model weights unless the licence and repository policy allow it.
- Do not block app startup on model loading.

---

## Verification

1. Reproduce the measurement on a clean run and show variance.
2. Test with the microphone denied and revoked.
3. Test offline (if on-device) and with the server unavailable (if remote).
4. Confirm recorded audio is deleted or retained exactly as documented.
5. Confirm the rest of the app still passes typecheck, lint, doctor and launch.

---

## Deliverables

- Harness code and instructions to reproduce the benchmark.
- Test set description and labelling method.
- Results table with device, model, latency, memory and error rates.
- A written recommendation with confidence and caveats.
- Updated `PROJECT_STATE.md` and `CHANGELOG.md`.
- No user-facing feature until the owner approves based on the results.

---

## Definition of done

- Results are measured, reproducible, and honestly bounded.
- Privacy and permission behaviour is explicit.
- The recommendation is evidence-based, including the option to abandon the
  approach.
- The shipped app's UI does not promise capabilities the POC did not demonstrate.
