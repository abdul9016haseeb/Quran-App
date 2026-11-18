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

A Debug build defaults to **two ABIs**, `x86_64` (emulator) and `arm64-v8a`
(phone), so **one APK installs on either target**:

```bash
npm run apk:debug          # one 97 MB APK, native-code: arm64-v8a, x86_64
npm run device:install     # install it on whichever device ADB_SERIAL names
npm start                  # Metro; JS changes do not need a rebuild
```

`plugins/withBuildPerformance.js` records the same list for `expo prebuild`,
and `npm run apk:debug` also passes it on the command line, so the script works
against the current `android/` folder too. If your generated
`android/gradle.properties` still says `x86_64` (it predates this change), the
scripts are unaffected — only a bare `./gradlew :app:assembleDebug` would build
one ABI until the next prebuild.

The cost of the second ABI is paid only when the native C++ cache is cold (a
clean build, or after `npm install`). Once both ABIs are compiled the warm build
is unchanged — measured at 8 s / 184 MB.

`npm run android` is the fast one-target path: Expo CLI reads
`ro.product.cpu.abilist` from the attached device, passes
`-PreactNativeArchitectures=<abi>` to Gradle, and **replaces** the universal APK
with a single-ABI one. That is fine when you only care about the device in front
of you, but re-run `npm run apk:debug` before installing on the other target.
The React Native Gradle plugin itself does no detection; plain
`./gradlew :app:assembleDebug` always uses `reactNativeArchitectures` from
`android/gradle.properties`.

#### Device selection and the scripts

An emulator and a phone attached at the same time is the normal setup, and it
is where plain `adb` fails: `adb install` / `adb logcat` / `adb shell` print
`more than one device/emulator` and stop. Every script below resolves the
target once, in this order:

1. `$ADB_SERIAL`
2. `$ANDROID_SERIAL` (adb's own standard variable — use either)
3. the only authorised device, when exactly one is attached

If two devices are attached and neither variable is set, the script lists them
and exits instead of guessing. `offline` and `unauthorized` devices are
ignored when counting.

| Script | Does |
|---|---|
| `npm run device:list` | `adb devices -l` |
| `npm run apk:debug` | two-ABI Debug APK for emulator + phone, no device needed |
| `npm run apk:release` | Release APK, all four ABIs, minification still off |
| `npm run device:tcpip -- <ip>` | `adb tcpip 5555` on the phone, then `adb connect <ip>:5555` |
| `npm run device:reverse` | `adb reverse tcp:8081 tcp:8081` on the target |
| `npm run device:install` | install the Debug APK, then set up reverse |
| `npm run device:install:release` | install the Release APK (no reverse; release bundles JS) |
| `npm run device:logcat` | tail `ReactNativeJS` and `ReactNative` logs |

`TAMIL_QURAN_ARCHS` overrides the Debug ABI list for one command, for example
`TAMIL_QURAN_ARCHS=arm64-v8a npm run apk:debug` for a smaller phone-only APK.

#### Route 1 — Expo Go, no native build (fastest, best for UI work)

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

#### Route 2 — wireless adb (`adb tcpip`)

The usual manual sequence is:

```bash
adb tcpip 5555 && adb connect <phone-ip>:5555
adb -s <phone-ip>:5555 reverse tcp:8081 tcp:8081
scrcpy -s <phone-ip>:5555 --max-size=1024 --video-bit-rate=4M --turn-screen-off
```

Two things in it interact with this project:

- **`adb tcpip` fails while the emulator is running** (`more than one
  device/emulator`) because it must be addressed to the phone over USB.
  `npm run device:tcpip -- <phone-ip>` targets the non-emulator device
  explicitly and then connects.
- **The serial changes.** It is `<ip>:<port>` and the IP comes from DHCP
  (hotspot gateways are often `192.168.43.1`), so a hard-coded serial stops
  working after reconnecting. Re-run `adb devices` and pass the current one.

After `adb connect`, both the emulator and the phone are attached, so set
`ADB_SERIAL` (or `ANDROID_SERIAL`) for the scripts:

```bash
export ADB_SERIAL=<phone-ip>:5555
npm run apk:debug && npm run device:install
npm start
```

`adb reverse` works over TCP and is what lets the phone reach Metro on
`localhost:8081`. `scrcpy` is independent of the build scripts; nothing here
conflicts with it, and `--turn-screen-off` only affects the phone's display.

Wireless debugging (Android 11+, *Developer options → Wireless debugging →
Pair device with pairing code*) is an alternative to `adb tcpip`: `adb pair
<ip>:<port>`, then `adb connect <ip>:<port>`; `adb reverse` works there too.

#### Route 3 — USB

With USB debugging on, install the universal APK over USB with
`npm run apk:debug && npm run device:install`, or let Expo CLI pick the device:
`npm run android -- -d <serial>`. Installing the 97 MB universal APK takes
longer over Wi-Fi than over USB, which is the only real cost of shipping both
ABIs in one file.

#### ABI caveats

- Changing the ABI list makes Gradle create a separate `.cxx` configuration and
  recompile the C++ modules for any ABI it has not built yet (a few minutes the
  first time). Reusing a list that has been built before is cached.
- The default list lives in `plugins/withBuildPerformance.js`, so
  `expo prebuild` keeps it. `npm run apk:debug` passes it on the command line
  too, which means it works against the existing `android/` folder without
  running prebuild again.
- `npm run apk:release` pins all four ABIs on purpose: a release must never
  inherit a two-ABI dev list. Re-enable minification before publishing.

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

- **No git write without the owner's explicit permission.** Do not commit,
  amend, merge, rebase, revert, tag, push, reset, stash, clean, or create/delete
  branches unless the owner asked for that specific action. Finish the work,
  report it, and let the owner decide. See `AGENTS.md` §6.1.
- The repository is on `master` with no remote. Do not rewrite or force-push;
  do not create the initial commit or any other commit on your own initiative.
- `android/`, `ios/`, `node_modules/`, `.expo/` are ignored.
- Use imperative subjects that state reality, for example:
  - `Add prayer monthly table layout`
  - `Fix Tamil line height in reader`
  - not `Implement prayer API` when only the UI exists.

Branch naming: `feature/<area>` for new work (for example
`feature/home-screen`), `fix/<area>` for bug fixes, `docs/<area>` for
documentation-only changes.

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
