# Development Workflow — Tamil Quran App

**Audience:** humans and AI agents working on this repository.
**Prerequisite reading:** `AGENTS.md`, `requirements.md`, `PROJECT_STATE.md`.

---

## 1. Before you touch code

1. Read `PROJECT_STATE.md` to learn what is real and what is mocked.
2. Check `docs/architecture/DECISIONS.md` for anything that constrains your task.
3. If the task needs backend, storage, audio, sensors, permissions or AI, **stop**
   and confirm with the owner first.
4. Confirm the task is inside the current milestone (see `requirements.md` §2).

### Task sizing

| Size | Examples | Process |
|---|---|---|
| Small | copy fix, spacing bug, icon swap | Edit, typecheck, lint, screenshot |
| Medium | new screen section, component extraction | Plan in the PR/notes, implement, verify both themes |
| Large | new navigator, data layer, new dependency | Write a short proposal in `IMPLEMENTATION_PLAN.md`, get approval |

---

## 2. Environment

```bash
cd Tamil-Quran-App
npm install            # only when package.json changed
npm start              # Metro
npm run android        # open on a connected device/emulator
```

- Node and npm are the package managers in use; there is no bun lockfile.
- Android SDK and an emulator/device are expected for UI verification.
- `npx expo run:android` performs a native prebuild + Gradle build. `android/` is
  generated and git-ignored; never edit it by hand.

### Testing on a physical phone

The dev build is compiled for **one ABI at a time** (`reactNativeArchitectures`
in `android/gradle.properties`, default `x86_64` for the emulator). A phone is
`arm64-v8a`, so it needs one of these routes.

**Route 1 — Expo Go, no native build (fastest, best for UI work).**

```bash
npx expo start --go        # scan the QR code with Expo Go
```

Every native module this project uses (`expo-font`, `expo-status-bar`,
`expo-system-ui`, `react-native-screens`, `react-native-safe-area-context`,
`@expo/vector-icons`) is bundled inside Expo Go. The phone must run the
**SDK 58** build of Expo Go, and both devices must be on the same Wi-Fi (use
`--tunnel` if the network isolates clients). Config plugins such as
`plugins/withBuildPerformance.js` are ignored by Expo Go, and the app runs in
Expo Go's native runtime rather than our APK — so this route cannot verify
native-manifest behaviour (see K-12).

**Route 2 — a real dev build for the phone.**

```bash
npm run android:phone      # arm64-v8a Gradle build + install + adb reverse
npm start                  # Metro
```

- `npm run apk:phone` only builds the APK; `npm run device:install` only
  installs and sets up `adb reverse`; `npm run device:logcat` tails JS logs.
- With **both** the emulator and the phone attached, target the phone
  explicitly: `ADB_SERIAL=<serial> npm run device:install` (`adb devices`).
- Wireless debugging (Android 11+) works: *Developer options → Wireless
  debugging → Pair device with pairing code*, then
  `adb pair <ip>:<port>` and `adb connect <ip>:<port>`. `adb reverse` still works
  over that connection.
- The Gradle `-P` flag overrides `gradle.properties` for that invocation only,
  so nothing has to be edited. It also **overwrites**
  `android/app/build/outputs/apk/debug/app-debug.apk` with an arm64 APK; the
  next `npm run android` rebuilds the x86_64 one.
- Each ABI list gets its own `.cxx` configuration, so the first arm64 build
  recompiles the C++ modules once (~a few minutes). Later switches reuse the
  cached configuration.

Do **not** rely on the `TAMIL_QURAN_ARCHS` environment variable for
`expo run:android`: Expo CLI skips prebuild when `android/` already exists, so
the variable only takes effect with an explicit
`TAMIL_QURAN_ARCHS="x86_64,arm64-v8a" npx expo prebuild --platform android`.
That is the right move only if you want a single APK that works on both targets
and accept the extra C++ compile on every clean build.

### Known environment quirks

- `npx expo lint` fails with an ESLint version complaint in this setup. Use
  `npm run lint`.
- `npm audit` reports transitive advisories from the Expo/RN toolchain. Do not
  run `npm audit fix --force`; it can break SDK compatibility. Assess before
  changing versions.
- Emulator networking: use `10.0.2.2` instead of `localhost` if a future dev
  server needs to be reached from the Android emulator.

---

## 3. The change loop

```text
understand → change one thing → typecheck → lint → run on device → inspect
   → update docs → report
```

1. **Understand** the existing pattern before adding a new one. Reuse
   `components/ui` primitives and theme tokens.
2. **Change one thing** per iteration. Keep the diff reviewable.
3. **Typecheck:** `npm run typecheck`.
4. **Lint:** `npm run lint`. Zero warnings is the bar.
5. **Run** on Android; visit every screen you touched.
6. **Inspect** light mode, dark mode, and a narrow width (≈320 dp).
7. **Update docs:** `PROJECT_STATE.md` if capability changed, `CHANGELOG.md`
   always, `SCREEN_SPEC.md` if behaviour changed.
8. **Report**: what is real, what is mocked, what is still blocked.

---

## 4. Adding UI

### New shared primitive

Only if it is used (or clearly will be used) by two or more features.

1. Add `src/components/ui/MyComponent.tsx`.
2. Props are explicit and typed; no `any`.
3. Read colours/spacing/fonts from `useAppTheme()`.
4. Accept `style` where composition is expected.
5. Add accessibility props for interactive variants.
6. Verify in both themes.

### New screen

1. Add the route to `RootStackParamList` in `src/navigation/types.ts`.
2. Create `src/features/<feature>/<Name>Screen.tsx` (named export).
3. Register it in `src/navigation/RootNavigator.tsx` (or `MainTabs.tsx` for a
   tab).
4. Use `Screen` + `ScreenHeader` for consistent insets and back behaviour.
5. Add the screen to `docs/development/SCREEN_SPEC.md`.
6. If it introduces mock data, put it in `src/data/mock/` with a leading
   `MOCK DATA` comment and user-visible disclosure.

### Reader-specific rules

- Arabic text node: `writingDirection: 'rtl'`, `textAlign: 'right'`.
- Never merge Arabic and Tamil into one text node.
- Font sizes come from preferences; do not hard-code them in the reader.
- Placeholder ayahs must keep `isPlaceholder` and the sample badge.

---

## 5. Adding a dependency

Ask first if it has native code or adds a service.

```bash
npx expo install <package>     # Expo/RN-compatible versions
```

Then:

1. Confirm the version is SDK 58-compatible (`npx expo-doctor`).
2. Check the licence and record it in `DECISIONS.md` if it is non-trivial.
3. Explain why an existing module cannot do the job.
4. Update `package.json` scripts only if needed.

Never add: backend SDKs, ORMs, state libraries, UI kits, icon packs, animation
libraries, or AI runtimes without approval. The project deliberately keeps a
small dependency surface.

---

## 6. Content changes

| Change | Allowed now? | Rule |
|---|---|---|
| Fix a Tamil UI label | Yes | Keep meaning; check rendering |
| Add factual surah metadata | Only with a cited source | Never from memory; update the count note |
| Add a real ayah | No | Blocked on P-01/P-02 |
| Add a Tamil translation | No | Blocked on P-02 |
| Add audio URL | No | Blocked on P-03 |
| Change placeholder copy | Yes | Must remain clearly non-Quranic |
| Remove a sample badge | No | Never |

When verified content arrives, it must include a manifest (edition, version,
source URL, checksum, licence/attribution) and a validation step.

---

## 7. Git

- The repository has one commit (`Initial commit: Tamil Quran UI foundation`)
  and no remote. Do not rewrite or force-push it; add new commits unless the
  owner explicitly asks for an amend.
- `android/`, `ios/`, `node_modules/`, `.expo/` are ignored.
- Use imperative subjects that state reality, for example:
  - `Add prayer monthly table layout`
  - `Fix Tamil line height in reader`
  - not `Implement prayer API` when only the UI exists.

Suggested future branch names: `ui/<area>`, `docs/<area>`, `fix/<area>`.

---

## 8. Review checklist

Copy this into a review or task report:

```text
[ ] Scope matches requirements.md
[ ] No backend/storage/audio/AI/sensors added
[ ] No real scripture or translation introduced
[ ] Placeholder disclosures intact
[ ] Tokens used (no raw colours/font sizes)
[ ] Light + dark verified
[ ] 320 dp width verified
[ ] Accessibility labels present
[ ] npm run typecheck passes
[ ] npm run lint passes (0 warnings)
[ ] npx expo-doctor passes
[ ] Docs updated (PROJECT_STATE, CHANGELOG, SCREEN_SPEC)
[ ] Report distinguishes real vs mocked vs blocked
```

---

## 9. Handover format

When ending a session, leave:

1. **What changed** — files and behaviour.
2. **Verification** — commands run and their result; screens inspected.
3. **Known issues** — with reproduction steps.
4. **Next step** — one concrete action, not a vague direction.
5. **Open decisions** — anything that now needs the owner.

This mirrors `PROJECT_STATE.md`, which is the canonical handover document.
