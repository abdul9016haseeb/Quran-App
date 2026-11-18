# AGENTS.md — Tamil Quran App

Operating instructions for human and AI contributors.

**Read these first, in order:**

1. `AGENTS.md` (this file)
2. `requirements.md` — scope, non-goals, hard constraints
3. `PROJECT_STATE.md` — what actually exists right now
4. `docs/architecture/DECISIONS.md` — what is approved vs undecided
5. `docs/development/WORKFLOW.md` — how to change the project safely

If a request conflicts with `requirements.md` or an owner decision in
`DECISIONS.md`, stop and ask. Do not silently widen scope.

---

## 1. Project in one paragraph

A Tamil-first Quran mobile app. The current milestone is a **UI foundation only**:
a complete, polished, typed React Native interface with realistic navigation and
interaction. There is no backend, no database, no auth, no audio engine, no
sensor integration and no AI. All Quran/translation content on screen is
**explicitly labelled placeholder** and is deliberately non-Quranic sample text.

**Never invent Quranic verses, Tamil translations, hadith, or scholarly claims.**
Never present mock data as if a service produced it.

---

## 2. Stack (as installed, not aspirational)

| Layer | Choice | Version |
|---|---|---|
| Runtime | Expo SDK | 58.0.26 |
| UI | React Native | 0.88.1 |
| Language | TypeScript (strict) | 6.0.3 |
| UI library | React | 19.3.0 |
| Navigation | React Navigation: `native`, `native-stack`, `bottom-tabs` | v7 |
| Fonts | `expo-font` + `@expo-google-fonts/*` | bundled |
| Icons | `@expo/vector-icons` (Ionicons) | bundled |

Rationale and alternatives: `docs/architecture/TECHNOLOGY_EVALUATION.md`.
This is a **React Navigation** project, not Expo Router. `src/app/` is an
application-layer folder (providers, root composition), **not** a file-router
directory. Do not add `_layout.tsx` or `expo-router` imports.

### SDK discipline

Expo breaks APIs between SDK releases. Before using an Expo or React Native API:

1. Confirm the SDK major in `package.json`.
2. Check `https://docs.expo.dev/versions/v58.0.0/` or the relevant RN docs.
3. Prefer an installed module over a new dependency.

Install packages with `npx expo install <package>` so versions stay SDK-compatible.
Do not run plain `npm install` for Expo/RN packages.

---

## 3. Commands

```bash
npm run typecheck     # tsc --noEmit  (must pass)
npm run lint          # eslint .      (must pass with 0 warnings)
npm run doctor        # npx expo-doctor
npm start             # Metro dev server
npm run android       # open on Android emulator/device
npx expo run:android  # native build (generates android/, currently git-ignored)
npx expo export --platform android   # bundle smoke test
```

`npx expo lint` is broken in this environment (it demands an older ESLint).
Use `npm run lint` instead. Do not "fix" this by downgrading ESLint.

**Definition of done for any code change:** `npm run typecheck` passes,
`npm run lint` passes with zero warnings, and any affected screen has been
launched and inspected on a device or emulator (or the limitation is stated
explicitly).

---

## 4. Hard rules

### 4.1 Content integrity

- All displayed Quran text and Tamil translation currently comes from
  `src/data/mock/sampleAyahs.ts` and is **non-Quranic placeholder copy**.
- Every placeholder ayah carries `isPlaceholder: true` and must render the
  `SampleBadge` / `SAMPLE_DATA_LONG` disclosure.
- Never extend `MOCK_SURAHS` from memory. It contains factual metadata for the
  first 12 surahs only; the full verified 114-surah dataset is pending.
- Never remove or weaken a placeholder badge to make a screen look "finished".
- Do not add real scripture, translation text, or audio URLs without an owner
  decision recorded in `docs/architecture/DECISIONS.md`.

### 4.2 Licensing

- No licence has been chosen for this repository. Do not add a `LICENSE` file,
  SPDX identifier, or open-source claim.
- TNTJ Tamil translation is treated as **all rights reserved** until written
  permission exists. Do not scrape, bundle, or "temporarily" include it.
- Arabic text source, audio rights, and prayer API terms are unresolved. Do not
  imply otherwise in UI copy, README, or commit messages.
- Do not invent a repository URL, maintainer identity, pricing, or API limits.

### 4.3 Scope

Do not add, without an explicit owner request:

- backend services, databases, auth, cloud sync
- SQLite/AsyncStorage persistence (preferences are intentionally in memory)
- audio playback, downloads, or reciter audio
- `expo-location`, `expo-sensors`, notifications, or permissions
- AI/ML libraries, models, or microphone access

If a task seems to need one of these, write the proposal in
`docs/development/IMPLEMENTATION_PLAN.md` and ask first.

### 4.4 UI and design

- Colours, spacing, radii, typography come from `src/theme/tokens.ts` via
  `useAppTheme()`. No raw hex values or ad-hoc font sizes in screens.
- Keep the green/white identity and gold accent. The TNTJ-style mockups in
  `mockup/original/` are the **primary** reference; `mockup/stitch_redesign/`
  is secondary.
- Prayer Times and Qibla are **separate screens**. Do not merge them.
- Support light and dark modes through the existing provider; check both.
- Tamil and Arabic must render with the bundled fonts (`Noto Sans Tamil`,
  `Noto Serif Tamil`, `Amiri`). Do not rely on system fallback.
- Every interactive element needs an accessibility label/role and a touch
  target of at least 44×44 dp where practical.

### 4.5 Code conventions

- Feature-first folders: `src/features/<feature>/`, shared primitives in
  `src/components/ui/`.
- Screens are named exports (`export function HomeScreen()`), not default exports.
- Route params are typed in `src/navigation/types.ts`; add new routes there
  first, then to `RootNavigator`.
- Use `type` imports for types. No `any`. No non-null assertions to silence
  the compiler.
- Relative imports use the depth of the file. Components inside
  `src/features/*/components/` import shared code via `../../../`.
- Keep user-facing copy in Tamil where the mockups do; status/disclosure copy
  lives in `src/constants/app.ts`.
- Prefer small, focused components. Avoid premature abstraction.

---

## 5. Repository map

```text
App.tsx                     entry → AppRoot
index.ts                    Expo registerRootComponent
src/app/                    root composition + global providers
src/navigation/             typed routes, tabs, theme bridge
src/theme/tokens.ts         colours, spacing, type scale
src/components/ui/          reusable primitives (AppText, Card, …)
src/features/<feature>/     screens and feature components
src/data/mock/              labelled mock data
src/types/content.ts        shared domain types
mockup/                     preserved visual references (do not edit)
docs/architecture/          evaluation, decisions, source material
docs/development/           workflow, plan, testing, screen spec
prompts/                    task prompts for AI agents
```

`mockup/` and `docs/architecture/sources/` are archival. Never modify or delete
them; copy if you need to annotate.

---

## 6. Git

### 6.1 No git changes without the owner's permission

**Never run a command that writes to git history or refs unless the owner has
explicitly asked for it in this conversation.** Permission for one action is
not permission for the next one.

Ask first, every time, before:

- `git commit` (including `--amend`), `git merge`, `git rebase`, `git revert`,
  `git cherry-pick`, `git tag`, `git push`, `git reset --hard`, `git stash`,
  `git clean`
- creating or deleting branches (`git branch`, `git switch -c`,
  `git checkout -b`, `git branch -d/-D`)
- anything that rewrites, discards or removes work

Allowed without asking: read-only inspection (`git status`, `git diff`,
`git log`, `git show`, `git branch`, `git remote -v`) and simply editing files
in the working tree.

When a task is finished, **stop and report** what changed; let the owner decide
whether and how to commit. If a commit is wanted, state the exact subject and
body you propose before running it.

### 6.2 Repository facts and conventions

- The repository is on `master` with no remote. Feature work happens on
  `feature/*` branches; do not create a branch unless asked.
- `android/` and `ios/` are generated by prebuild and are git-ignored. Never
  hand-edit them; change `app.json` or config plugins instead.
- Commit messages must be accurate about what works. Do not claim
  "audio added" when only UI exists, and keep placeholder content labelled.

---

## 7. When you finish a task

1. Run typecheck and lint.
2. Launch the affected screens and check light/dark plus a small-screen layout.
3. Update `PROJECT_STATE.md` if capabilities changed.
4. Update `CHANGELOG.md` under `[Unreleased]`.
5. Report what is real, what is mocked, and what is still blocked.
