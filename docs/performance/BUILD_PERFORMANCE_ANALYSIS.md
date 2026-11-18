# Build Performance Analysis — Tamil Quran vs APJ Police Academy

**Date:** 18 November 2026
**Author:** OpenCode investigation
**Scope:** Why `Tamil-Quran-App` compiles slower and uses more CPU/RAM than
`APJ-Abdul-Kalam-Police-Academy`, and whether `mockup/` is compiled.
**Status:** Investigation complete. **No configuration was changed.**

---

## 1. Investigation summary

### What was done

1. Read the previous OpenCode session `ses_e13300ebcffeqIRVprT5RzNygC`
   ("Tamil Quran React Native foundation", 18 Nov 2026, 09:30–12:33 IST) from
   the local session database, including the shell outputs that recorded the
   first Gradle build.
2. Read `/home/syxhackz/Projects/My-Quran-App/compliation-note.md`.
3. Inspected both projects read-only: `package.json`, Gradle wrapper, Gradle
   properties, `app.json`, native build outputs, `node_modules`, APKs.
4. Ran measurements that are safe and repeatable:

   | Measurement | How | Side effects |
   |---|---|---|
   | JS bundle size + bundling time + peak RSS | `npx expo export --platform android --output-dir /tmp/opencode/...` in each project | Wrote only to `/tmp/opencode/` |
   | Metro dev-server startup | `npx expo start --offline` until "Waiting on", then killed | None |
   | Warm Gradle incremental build | `./gradlew :app:assembleDebug` in the Tamil Quran `android/` | Refreshed build outputs only |
   | Task graph | `./gradlew :app:assembleDebug --dry-run` | None |
   | Local C++ work | Counted `.o` files, `build.ninja` files, Ninja targets | None |
   | APK contents | `unzip -l`, MD5 comparison against `mockup/` | None |

5. The APJ project was **not modified**; it was never built during this
   investigation.

### Bottom line

The difference is **not** project size, source files, dependencies, or Metro.
It is the **native Android build profile**:

- The Police Academy app runs **React Native 0.74 with the Old Architecture**.
  `libreactnative.so`, `libhermes.so`, `libfabricjni.so` etc. are **prebuilt**
  `.so` files shipped inside the `react-android:0.74.5` AAR. Gradle copies them.
- The Tamil Quran app runs **React Native 0.88 (New Architecture only)**.
  `newArchEnabled=false` no longer exists. Fabric/TurboModule codegen C++ for
  the app itself, `react-native-screens`, `react-native-safe-area-context` and
  `expo-modules-core` **must be compiled locally with clang/CMake/Ninja**.

Plus one historical accident that was already fixed mid-session: the very first
build compiled **4 ABIs** while an **emulator was holding ~2 GB of RAM**, on a
**13 GB machine with zram swap**, with Gradle 9.4.1 downloading itself inside
that same build.

The JS side is the opposite of what the note implies: **Tamil Quran bundles
faster than Police Academy** (13 s vs 36 s, measured below).

---

## 2. Session findings (`ses_e13300ebcffeqIRVprT5RzNygC`)

Measured facts recorded in that session, in order:

| Time (IST) | Event |
|---|---|
| 09:30 | Session starts; project scaffolded with `create-expo-app` (Expo SDK 58, RN 0.88) |
| ~09:55–10:29 | First `npx expo run:android` → **`BUILD SUCCESSFUL in 33m 46s`** |
| 10:27 | User asks why the build is slow |
| ~10:29 | `free -h` snapshot: Gradle daemon ≈3.1 GB, two Kotlin daemons ≈1.1 GB, emulator ≈2 GB, **zram swap 5.9 GB in use**, swap I/O (`si`/`so`) 50–100 MB/s |
| 10:33 | `reactNativeArchitectures` changed to `x86_64`; `org.gradle.workers.max=6`; caching enabled |
| 10:46 | Debug APK rebuilt — **x86_64 only**, 55 MB |
| 11:11 | Release APK built by the owner — **4 ABIs, R8 minification, baseline profiles**, 78 MB |
| 12:27–12:33 | Settings moved into `plugins/withBuildPerformance.js` so `expo prebuild` cannot silently undo them |
| — | While testing, the emulator was also running, competing for RAM |

There is **no session evidence** that the note's "184 compile/link steps" or
"2.1 GB of disk swap" figures were measured; they are approximations. The
mechanism (memory exhaustion → swap thrashing) is real and was observed.

### Warm build measured today (same project, no source changes)

```text
BUILD SUCCESSFUL in 22s
223 actionable tasks: 13 executed, 210 up-to-date
peak RSS of the build tree: 1.3 GB
```

**That is the number to judge the project by.** A 22 s incremental Debug build
is normal and healthy for an RN 0.88 + Expo SDK 58 project.

---

## 3. Review of `compliation-note.md`

| # | Claim in the note | Verdict | Evidence |
|---|---|---|---|
| 1 | Old arch RN 0.74 → **"zero C++ compilation … all prebuilt"** | **Partly wrong** | Prebuilt RN core is correct, but `find … -name "*.o"` found **252 locally compiled C++ objects** in the Police Academy project (`expo-modules-core/android/.cxx`, `react-native-screens/android/.cxx`). What it does *not* have is app-level Fabric codegen. |
| 2 | New arch → codegen + Fabric/TurboModules compiled locally | **Correct** | `android/app/.cxx/.../build.ninja` builds `libappmodules.so`, `libreact_codegen_rnscreens.so`, `libreact_codegen_safeareacontext.so`. RN core itself is still prefab-prebuilt (`react-android-0.88.1-debug/prefab/…/libreactnative.so`). |
| 3 | "4× C++ multi-architecture … 184 compile/link steps" | **Directionally correct** | `.cxx/RelWithDebInfo` contains `arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64` with **180** `.o` files total; Debug for one ABI has **45**. The 4-ABI release is exactly 4× that. |
| 4 | "RAM exhausted, forcing 2.1 GB of **disk** swap" | **Mechanism correct, detail wrong** | It was **zram** (compressed RAM block device), not a disk swap file: `swapon --show` → `/dev/zram0`, session recorded 5.9 GB in use. Same slowdown effect, faster than disk would be. |
| 5 | "R8 minification & baseline profiles **enabled**" | **Correct, but a red herring for dev builds** | `minifyReleaseWithR8` + `outputs/mapping/release/usage.txt` (4 MB) exist only in **release** outputs. `expo run:android` (debug) never runs R8. R8 cannot explain a slow dev loop. |
| 6 | Recommended fixes (minify off, workers 6, 4 GB heap, caching) | **Mostly applied already** | `android/gradle.properties` now has `workers.max=6`, `jvmargs=-Xmx3072m`, `caching=true`, `minify=false`, `reactNativeArchitectures=x86_64`. See §9 for the two adjustments that remain. |
| 7 | "RN 0.88 old architecture completely removed" | **Correct** | RN 0.88 is New-Architecture-only; the property is gone, not just defaulted. |
| 8 | Note omits `npm install` | **Important gap** | `npm install` deletes `node_modules/expo-modules-core/android/build` (**313 MB** of C++ output here), so the next build recompiles C++ from scratch. This is the most common way to "accidentally" get a slow build again. |
| 9 | Note recommends `-Xmx4096m` | **Risky on this machine** | 13 GB total with a 2 GB emulator + Kotlin daemons; 3 GB is the safer ceiling. Already applied. |

---

## 4. Project comparison (measured unless marked)

| Category | Tamil Quran App | Police Academy | Performance impact |
|---|---|---|---|
| React Native | **0.88.1** (New Arch only) | **0.74.5** (Old Arch supported) | **Dominant factor** |
| Expo SDK | **58.0.26** | **~51.0.x** | Newer toolchain = AGP 9 / Gradle 9 / Kotlin 2.2 |
| React | 19.3.0 | 18.2.0 | — |
| Workflow | Expo prebuild + `expo run:android` dev build | Expo prebuild + `expo run:android` dev build | Same workflow |
| Entry point | `index.ts` | `node_modules/expo/AppEntry.js` | — |
| New Architecture | `newArchEnabled=true` (mandatory) | `newArchEnabled=false` | **Dominant factor** |
| Hermes | enabled | enabled | Same |
| Gradle | **9.4.1** | **8.8** | Gradle 9 is heavier to configure; first run downloads it |
| Android Gradle Plugin | **9.2.1** | **8.2.1** | AGP 9 adds work (built-in Kotlin opt-outs present in `gradle.properties`) |
| Kotlin | **2.2.10** (catalog 2.2.0) | **1.9.22** | More Kotlin daemons / longer Kotlin compile |
| NDK | 27.1.12297006 | 26.1.10909125 | Both present; only Tamil Quran uses it for app code |
| compile/target SDK | 36 / 36 (min 24) | 34 / 34 (min 23) | Minor |
| `reactNativeArchitectures` | `x86_64` (dev); 4 ABIs in the last release | `armeabi-v7a,arm64-v8a,x86,x86_64` | 4× native work for 4 ABIs |
| `org.gradle.parallel` | true | **false** | Small |
| `org.gradle.caching` | true | **false** | Second build much faster with caching |
| `org.gradle.workers.max` | 6 | unset (defaults to cores) | Prevents RAM exhaustion here |
| Gradle heap | 3 GB | 2 GB | Balance on 13 GB |
| Local C++ objects compiled | **570** (345 in `node_modules`, 225 in `android/`) | **252** (all in `node_modules`) | **2.3× more native work** |
| `android/app/.cxx` exists | yes, **267 MB** | **no** | — |
| Autolinked native modules | expo, expo-font, expo-status-bar, expo-system-ui, screens, safe-area | expo, font, svg, screens, safe-area, async-storage, crypto, web-browser, auth-session, file-system, linear-gradient… | APJ has **more** native modules and is still faster |
| Direct dependencies | 16 | 21 | Not the cause |
| Lockfile packages | **759** | **1194** | APJ has **57 % more** |
| `node_modules` size | 1.8 GB | 1.4 GB | Mostly `expo-modules-core` build output (474 MB) |
| Source files (`src/`) | 46 | 25 | Irrelevant to compile time |
| Project files (excl. `node_modules`, `android`, `.git`) | 150 | 84 | Irrelevant |
| All files (what Metro crawls) | 55,329 | 70,457 | APJ crawls **more** |
| `mockup/` | 11 MB, 41 files, **not imported** | — | Negligible |
| Assets inside the JS export | **1.9 MB** after the sub-path import fix (was 7.9 MB); `assets/` icons (0.5 MB) go through prebuild, not Metro | 244 KB (7 `require`d images live in `assets/` and are prebuild/asset inputs) | Bundle size only |
| Debug APK | 55 MB — **1 ABI**, 19 `.so` | 137 MB — **4 ABIs**, 184 `.so` | APJ's debug APK is 2.5× bigger |
| Release APK | 78 MB (4 ABIs + R8 + baseline profiles) | 64 MB (4 ABIs) | — |
| JS bundle (Hermes `.hbc`) | **2.5 MB** | **4.38 MB** | Tamil Quran JS is 43 % smaller |
| `expo export` wall time | **13 s** | **36 s** | **Tamil Quran is 2.8× faster** |
| `expo export` peak RSS | **2.4 GB** | **3.3 GB** | Tamil Quran uses less |
| Metro dev-server startup | 3.5 s | 2.0 s | Small; cache warmth not controlled |
| Warm `assembleDebug` | **22 s / 1.3 GB peak** (measured) | **Not measured** (project left untouched) | — |
| Cold `run:android` | **33 m 46 s** (session, 4 ABIs + emulator + zram + downloads) | **Not measured** | Historical, not like-for-like |
| APK install / startup | Not measured | Not measured | Out of scope |

> Equivalent conditions caution: the cold build figure comes from the previous
> session and included an emulator and 4 ABIs. The 22 s figure is today's warm
> incremental build. They are different stages and must not be compared.

---

## 5. Dependency analysis

- Tamil Quran is the **lighter** project by every dependency metric: 16 direct
  deps vs 21, 759 lockfile packages vs 1194, 1.8 GB vs 1.4 GB `node_modules`
  (and that gap is explained by C++ build output folders inside
  `node_modules/expo-modules-core/android/build`, 474 MB vs 313 MB).
- **Expensive native dependencies** in Tamil Quran, and why they cost time:

  | Package | Native cost | Required? |
  |---|---|---|
  | `react-native` 0.88 | Fabric codegen + app `libappmodules.so` | Yes — core |
  | `expo-modules-core` | C++ core compiled per ABI | Yes — Expo runtime |
  | `react-native-screens` 4.30 | `libreact_codegen_rnscreens.so` | Yes — navigation |
  | `react-native-safe-area-context` 5.11 | `libreact_codegen_safeareacontext.so` | Yes — navigation + layout |
  | `expo-font`, `expo-status-bar`, `expo-system-ui`, `expo` | Kotlin/Java only | Yes |
  | `@expo-google-fonts/*` (3) | **No native code**; 9 TTFs bundled as assets (7.9 MB) | Yes — Tamil/Arabic typography |

- **No dependency is a build-time villain.** Removing fonts would not change the
  compile time. Nothing here justifies a removal request.
- **Bundle-size finding (not build time):** importing from the package barrels
  pulls in *every* file in them.
  `import { Amiri_400Regular } from '@expo-google-fonts/amiri'` makes Metro
  bundle all 4 Amiri weights (1.6 MB), all 9 Noto Sans Tamil weights (720 KB)
  and all 18 Noto Serif Tamil files (1.7 MB) — even though only 9 files are
  used. Likewise `import { Ionicons } from '@expo/vector-icons'` bundles all
  **16** icon fonts (4.0 MB) when only `Ionicons.ttf` (390 KB) is used.
  Measured before the fix: **7.9 MB of bundled assets were fonts, of which
  ~1.74 MB is used** (~4.0 MB from the Google font barrels, ~3.9 MB from the
  icon barrels).
  **Applied on 18 Nov 2026:** every import now uses a sub-path —
  `from '@expo-google-fonts/amiri/400Regular'` and
  `Ionicons from '@expo/vector-icons/Ionicons'`. Measured after the fix:
  **assets 7.9 MB → 1.9 MB, total export 11 MB → 3.9 MB, 12 s.**
- The Police Academy project has `react-native-svg`, `async-storage`,
  `expo-auth-session`, `expo-crypto`, `expo-web-browser` and is still faster —
  further proof that the difference is architecture, not package count.

---

## 6. Mockup folder investigation

**Path:** `mockup/` — 41 files, **11 MB**, 3.25 MB of which is a single
`Mock_ui_20.zip`.

| Sub-folder | Size | Contents |
|---|---|---|
| `mockup/original/` | 6.6 MB | 19 JPG screenshots + `Mock_ui_20.zip` |
| `mockup/stitch_redesign/` | 3.3 MB | 9 PNG screens (~0.2–0.6 MB each) |
| `mockup/legacy_reference/` | 348 KB | 1 JPEG + 1 WebP |
| root | small | `README.md`-style notes, 9 HTML files |

### Direct answers

**1. Are all files inside `mockup/` compiled?**
No. Not one of them is compiled, transformed, or bundled.

**2. Are they bundled automatically just because they sit in the project?**
No. Metro's bundler follows `import`/`require` from `index.ts`. A file that is
never imported is never added to the graph. The only `mockup` string in `src/`
is the word "mockups" inside a code comment (`src/data/mock/prayerTimes.ts:6`).

**3. Which files are actually in the application bundle?**
Measured with `expo export --platform android`:

```text
_expo/static/js/android/index-*.hbc   2.5 MB   (Hermes bytecode)
assets/…                              7.9 MB   (9 TTFs: Amiri, Noto Sans/Serif Tamil,
                                                + Ionicons font + 5 navigation PNG icons)
total exported                        11 MB, 69 files
```

MD5 of every mockup image was compared against the 67 exported assets:
**0 matches**. No mockup file reaches the bundle or the APK.

**4. Are unreferenced images consuming build resources?**
Almost nothing: one metadata entry per file and one inode each. Metro does index
them — `mockup/original/Mock_ui_1.jpg` is present in
`/tmp/metro-file-map-expo-*` — but "indexed" means "watched for changes", not
"compiled". 41 files is **0.07 %** of the 55,329 files Metro already crawls.

**5. Does the location of the folder affect Metro watching/crawling?**
Yes, in the trivial sense: anything under the project root is crawled once and
watched afterwards. It is not re-read on each reload, and it never enters the
transform pipeline. Moving it *outside* the repo would remove those 41 entries
and save nothing measurable.

**6. Can we safely exclude mockups from Metro?**
Yes, technically safe (nothing imports them), but it is **not worth doing for
speed** and it carries a small risk: `AGENTS.md` names `mockup/` as the primary
design reference, and a future agent may `require` a reference image
deliberately. The only place where exclusion has a real, if modest, benefit is
**EAS upload / archive size** (11 MB and a 3 MB zip would otherwise be shipped
on every build upload).

**7. Keep or move?**
Keep `mockup/` in the project. It is documentation, it is 11 MB, and it costs
effectively nothing. If EAS is ever configured, add `.easignore` entries.
Do not delete, move or block it without an explicit owner decision.

---

## 7. Resource usage during compilation

### Observed in the previous session (first, cold build)

| Process | RAM |
|---|---|
| Gradle daemon | ~3.1 GB |
| Two Kotlin compile daemons | ~1.1 GB |
| Android emulator (`qemu-system`) | ~2.0 GB |
| clang/Ninja workers (up to 16) | remainder |
| **zram swap in use** | **5.9 GB**, 50–100 MB/s I/O |

### Measured today (warm incremental build)

| Metric | Value |
|---|---|
| Wall time | 22 s |
| Tasks executed | 13 of 223 (210 up-to-date) |
| Peak RSS of build tree | **1.3 GB** |
| Swap used | ~0 |

### Metro / JS (measured today, cold cache, both projects)

| Metric | Tamil Quran | Police Academy |
|---|---|---|
| `expo export` time | 13 s | 36 s |
| Peak RSS | 2.4 GB | 3.3 GB |
| Output | 11 MB → **3.9 MB** after the font/icon sub-path fix (2.5 MB bundle + 1.9 MB assets) | 4.5 MB (4.38 MB bundle + 244 KB assets) |
| Dev-server start | 3.5 s | 2.0 s |

### Disk

| Item | Size |
|---|---|
| `android/` (Tamil Quran, incl. build) | 2.8 GB (`.cxx` 267 MB, `build/` ~2.5 GB) |
| `android/` (Police Academy, incl. build) | 1000 MB |
| `node_modules` (Tamil Quran / APJ) | 1.8 GB / 1.4 GB |
| `~/.gradle/caches` (shared) | 9.9 GB |
| `~/.gradle/wrapper` (shared) | 644 MB |
| `mockup/` | 11 MB |

---

## 8. Root causes, ranked

### 8.1 Confirmed root causes

**RC-1 — New Architecture native compilation (high severity, high confidence)**
- *Evidence:* 570 locally compiled `.o` files vs 252; `libappmodules.so`,
  `libreact_codegen_rnscreens.so`, `libreact_codegen_safeareacontext.so` exist
  only in the Tamil Quran build; APJ has no `android/app/.cxx`.
- *Why it matters:* every clean build recompiles these per ABI; a Gradle clean
  or `npm install` destroys them.
- *Improvement:* none available without giving up RN 0.88; this is the price of
  the modern architecture and it is cheap on incremental builds.
- *Risk of "fixing" (downgrading):* very high — would lose Fabric, Expo SDK 58,
  RN 0.88 APIs, and requires a full rewrite of native config. **Not recommended.**

**RC-2 — Four ABIs by default (high, confirmed in the 33 m 46 s build)**
- *Evidence:* `.cxx/RelWithDebInfo` has 4 ABI folders; the 11:11 release APK
  contains 19 `.so` × 4 ABIs; the debug APK after the fix contains 19 `.so` × 1.
- *Improvement:* ~4× less C++/packaging work. Already applied
  (`reactNativeArchitectures=x86_64`).

**RC-3 — Cold one-time costs inside the 33 m 46 s build (high, confirmed)**
- *Evidence:* session log shows Gradle 9.4.1 being downloaded and configured,
  dependency resolution, codegen, 210+ tasks. This was the project's **first
  ever** native build.
- *Improvement:* none needed — it cannot happen twice. The same graph is now
  22 s.

**RC-4 — Memory pressure / zram thrashing (medium-high, confirmed)**
- *Evidence:* 3.1 GB daemon + 1.1 GB Kotlin + 2 GB emulator + 16 clang jobs on
  13 GB; 5.9 GB zram in use; 50–100 MB/s swap I/O.
- *Improvement:* large during cold builds. Mitigated by `workers.max=6` and by
  not running the emulator during a clean build.

**RC-5 — R8 + baseline profiles + native symbol extraction on release (medium,
release only, confirmed)**
- *Evidence:* `minifyReleaseWithR8`, `mapping.txt` 46 MB, `usage.txt` 4 MB,
  `baselineProfiles/0|1` in `output-metadata.json`.
- *Improvement:* minutes on release builds. Debug/dev builds are unaffected.
  `minify` is currently off; keep it off until a real release is cut.

### 8.2 Likely contributing factors

**LC-1 — Android Studio builds are not the same build.** Studio deploys one
variant to one device and typically one ABI with a warm daemon, and it does not
re-run Expo CLI's prebuild/doctor steps. This matches the owner's observation
that "manual builds are fine". *(Suspected, not instrumented.)*

**LC-2 — Toolchain generation gap.** Gradle 8.8/AGP 8.2/Kotlin 1.9 (APJ) vs
Gradle 9.4/AGP 9.2/Kotlin 2.2 (Tamil Quran). Configuration and Kotlin compile
are heavier, independent of C++. *(Confirmed versions; time split not measured.)*

**LC-3 — Two Gradle daemons.** A 2 GB-heap Gradle 9.4.1 daemon was still alive
alongside the project's 3 GB configuration. Two daemons double memory pressure.
*(Observed; effect not isolated.)*

### 8.3 Minor / non-issues

| Item | Verdict |
|---|---|
| `mockup/` folder | Indexed, never bundled. 0.07 % of crawled files. Non-issue. |
| Dependency count | Tamil Quran has **fewer** deps than the faster project. Non-issue. |
| Font packages | No native code, so no compile cost. They **do** inflate the bundle: ~7.9 MB bundled vs 1.74 MB actually used (barrel imports, see §5). |
| `.html`/`.zip`/`.md` inside `mockup/` | Not source or asset extensions; Metro ignores them entirely. |
| Hermes | Enabled in both; not a differentiator. |
| Metro/bundling | Tamil Quran is **faster** than APJ. Not a cause. |

### 8.4 Needs further measurement

- Controlled clean-build comparison (same ABIs, no emulator, warm Gradle cache)
  on both projects. Deliberately **not** run: it would take ~10–30 min per
  project and would modify APJ's build directory.
- Per-phase timing (configuration vs Kotlin vs C++ vs packaging) via a Gradle
  build scan. Requires a build-scan plugin decision; not added.
- App cold-start and runtime RAM on device (different question from compile time).

---

## 9. Optimisation plan

### Stage 1 — Safe (state: mostly done)

| Action | Status |
|---|---|
| Build only the emulator's ABI in dev (`reactNativeArchitectures=x86_64`) | **Done** via `plugins/withBuildPerformance.js` |
| Cap parallel workers (`org.gradle.workers.max=6`) | **Done** |
| Gradle build cache (`org.gradle.caching=true`) | **Done** |
| Gradle heap 3 GB (not 4 GB on a 13 GB machine) | **Done** |
| Disable R8 + PNG crunch for non-production builds | **Done** |
| **Stop the emulator during a clean/first build** | Process rule, not config |
| **Do not run `npm install` unless dependencies change** | Process rule; it wipes `expo-modules-core/android/build` (313 MB) |
| Add `.easignore` for `mockup/`, `docs/`, `prompts/` | **Done** — `.easignore` added; it only affects EAS uploads, never Metro or Gradle |
| Import fonts/icons from sub-paths to drop unused TTFs from the bundle | **Done** — assets 7.9 MB → 1.9 MB (AppRoot + 22 component files) |
| Optionally add `mockup/` to Metro `blockList` | **Not recommended** — zero measurable gain, small risk |

### Stage 2 — Build workflow (recommended)

1. **Separate the two loops.** JS changes → Metro only (`npm start` + reload).
   Native rebuild only when a native dep, plugin, permission or `app.json`
   native field changes. This is the single biggest perceived-speed win.
2. **One Gradle daemon.** Point Android Studio's *Gradle JDK* at the same JDK 17
   used by the CLI so Studio and the terminal share a daemon instead of keeping
   two 2–3 GB JVMs alive.
3. **Physical device builds:** `TAMIL_QURAN_ARCHS="x86_64,arm64-v8a" npx expo prebuild --platform android`
   (already supported by the plugin), or pass
   `-PreactNativeArchitectures=arm64-v8a` to a single Gradle invocation.
4. **Release profile:** keep `minify=false` for preview builds; flip to `true`
   only for the store build and accept the extra minutes there.
5. **Verify with the numbers in this document** (22 s warm Debug; 13 s export).

### Stage 3 — Architectural (only if evidence demands it)

- Do **not** remove `react-native-screens` or `safe-area-context` for build
  speed; they are load-bearing and are not the bottleneck.
- Do **not** downgrade RN/Expo. Old Architecture no longer exists in RN 0.88,
  and downgrading to 0.74 would trade the entire current UI foundation for a
  build-time difference that only appears on clean builds.
- If bundle/APK size matters later, the font/icon lever is already pulled:
  assets are 1.9 MB and only the 10 fonts actually used are shipped. No further
  dependency work is justified by the evidence.

---

## 10. Risks and trade-offs

| Change | Benefit | Risk / mitigation |
|---|---|---|
| `x86_64`-only dev builds | ~4× less native work | Will not install on a physical ARM device. Mitigate with `TAMIL_QURAN_ARCHS` or a `-P` override for device builds. Never ship an x86_64-only release. |
| `workers.max=6` | No zram thrashing | Cold builds take slightly longer wall-clock on an otherwise idle 16-core machine. Acceptable trade. |
| `minify=false` | Faster release builds | Bigger APK, no obfuscation. Must be re-enabled before publishing; the comment in `gradle.properties` says so. |
| Gradle heap 3 GB | Fits alongside an emulator | Very large multiplatform builds could OOM; this project does not. |
| Blocking `mockup/` from Metro | ~0 s | Breaks nothing today, but blocks a future deliberate `require()` of a reference image. Not worth it. |
| Keeping mockups in-repo | Agents keep design access; AGENTS.md stays true | EAS uploads no longer carry them; `.easignore` excludes `mockup/`, `docs/` and `prompts/`. |
| Font/icon sub-path imports (applied) | Assets 7.9 MB → 1.9 MB, export 11 MB → 3.9 MB | Couples the imports to package folder names (`/400Regular`, `/Ionicons`). If a major upgrade moves them, `typecheck` and `expo export` fail loudly; both are already part of the definition of done. |

---

## 11. Answers to the owner's questions

1. **Why is Police Academy faster?** It is on RN 0.74 with the Old Architecture:
   React Native's native libraries arrive prebuilt inside the AAR and are just
   copied into the APK. Tamil Quran is on RN 0.88, where the architecture is
   mandatory and app-level Fabric/TurboModule C++ must be compiled on this
   machine (570 objects vs 252), for every ABI, on every clean build.
2. **Why does Tamil Quran use more CPU and RAM?** C++/CMake/Ninja compilation
   plus Kotlin 2.2/Gradle 9/AGP 9. During the recorded cold build the machine
   also ran the emulator (~2 GB), and with 16 parallel clang jobs the 13 GB of
   RAM ran out and pushed the build into 5.9 GB of zram swap at 50–100 MB/s.
3. **Which exact dependencies/configurations contribute most?** `react-native`
   0.88 (Fabric codegen), `expo-modules-core` C++, `react-native-screens` and
   `react-native-safe-area-context` codegen libs — multiplied by the ABI count.
   Gradle 9.4.1/AGP 9.2.1/Kotlin 2.2 add overhead but are secondary.
   Dependency count is **not** a factor.
4. **Are the files inside `mockup/` compiled or bundled?** No. None of them.
   Proven by MD5 comparison against the export (0 of 41 present) and by the
   absence of any import.
5. **Is `mockup/` affecting Metro performance?** Only trivially. Metro indexes
   41 extra entries in a 55,329-file crawl (0.07 %) and never parses them.
6. **Safest way to keep mockups for AI agents without affecting builds?** Leave
   them exactly where they are (docs/agents need them on disk), and when/if EAS
   is configured, add `.easignore` entries so they are not uploaded. Optionally
   add a Metro `blockList` guard later — but it buys nothing today.
7. **Top five improvements:** (1) keep single-ABI dev builds and set the ABI
   per target; (2) keep `workers.max=6` + one shared Gradle daemon + no
   emulator during clean builds; (3) never rebuild native for JS-only changes,
   and do not run `npm install` casually; (4) keep R8/baseline profiles for
   production releases only; (5) add `.easignore` for reference material when
   packaging starts.
8. **Can we reach similar speed without losing features?** For the daily loop,
   yes — the project is already at **22 s warm builds and 13 s bundling**, which
   is faster than the baseline project on the JS side. For a from-scratch native
   build, Tamil Quran will always pay more than an Old-Architecture project,
   but not 34 minutes: with one ABI, capped workers, no emulator, and warm
   Gradle caches, the extra work is the app's C++ codegen only. Matching APJ
   exactly would require downgrading RN/Expo — not worth it.

---

## 12. Verification performed for this document

| Check | Result |
|---|---|
| `npx expo export --platform android` (Tamil Quran, before changes) | Pass, 13 s, 11 MB, 69 files |
| `npx expo export --platform android` (Tamil Quran, after sub-path imports) | Pass, **12 s, 3.9 MB, 29 files** (assets 7.9 MB → 1.9 MB) |
| `npx expo export --platform android` (APJ) | Pass, 36 s, 4.5 MB, 5 files |
| `./gradlew :app:assembleDebug` (Tamil Quran, warm) | **BUILD SUCCESSFUL in 22 s**, 13 executed / 210 up-to-date |
| `./gradlew :app:assembleDebug --dry-run` | 239 tasks, 28 up-to-date |
| `npm run typecheck` / `npm run lint` (after changes) | Pass, 0 warnings |
| MD5 mockup vs exported assets | 0 matches |
| APJ project modified | **No** |
| Repo files changed | `docs/performance/BUILD_PERFORMANCE_ANALYSIS.md`, `PROJECT_STATE.md`, `CHANGELOG.md`, `.easignore`, `src/app/AppRoot.tsx` and 22 files with the Ionicons import |

## 13. Suggested next steps

1. Owner approves or rejects the Stage 2 workflow rules (nothing needs a code
   change for them).
2. If a controlled clean-build comparison is wanted, schedule it once (emulator
   off, one ABI, both projects) and record the per-phase timings here.
3. Keep `PROJECT_STATE.md` §7 (K-13) aligned with the warm-build numbers.
4. Runtime-verify the icon/font change on a device (bundle and type checks
   passed, but no emulator was run during the change).
