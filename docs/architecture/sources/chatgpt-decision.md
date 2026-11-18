# ChatGPT Decision — Tamil Quran Application

> **Purpose:** This document captures the current product requirements, proposed technical direction, and unresolved options discussed with ChatGPT. It is intended to be read by OpenCode, DeepSeek, Antigravity, or another coding/research agent.
>
> **Status:** Architecture discussion / decision preparation. This is **not** approval to start implementation. Do not silently treat proposed options as final decisions.

---

## 1. Project overview

Build a Tamil-first Quran application for the user's personal use, inspired by the interface and functionality of the sample application supplied in `Archive.zip` (19 JPG screenshots).

The goal is to retain the useful Quran-app experience while creating a more creative, polished, modern interface. Do not copy the reference app's branding or reproduce its interface pixel-for-pixel. Use the screenshots to understand the information architecture and feature expectations.

### Product priorities

1. Full Quran Arabic text.
2. Tamil translation as the primary translation.
3. Verse-by-verse Imam/reciter audio for the entire Quran.
4. Search by Surah/Ayah number, Arabic text, and Tamil translation.
5. Prayer times suitable for locations in Tamil Nadu.
6. Quran recitation recognition / transcription, inspired by the type of experience offered by Tarteel.
7. A creative and accessible UI based on the sample app's broad layout and capabilities.
8. Offline reading and, if technically feasible, offline audio and recitation AI.

English translation is optional and can be considered for a future phase.

---

## 2. Existing source material

### Reference screenshots

- Source archive: `Archive.zip`
- Contents: 19 JPG screenshots (`1.jpg` through `19.jpg`)
- The screenshots belong to another Quran application identified by the user as **Al-Quran TNTJ Tarjuma**.
- Agents must inspect all 19 screenshots directly before making UI or feature assumptions.
- Extract and document visible screens, navigation, controls, settings, labels, and user flows.
- Do not claim to know the reference app's internal source code or architecture from screenshots alone.

### Initial visible feature inventory

The earlier visual review suggested the reference app includes some of the following areas. Treat this as a preliminary checklist and verify against the screenshots:

- Home/dashboard
- Prayer timings
- Qibla
- Quran Surah list and reading screen
- Arabic text with Tamil translation
- Reciter selection and audio playback
- Search / verse navigation
- Bookmarks
- Settings, language and font-size controls
- Light/dark appearance

Agents should correct or expand this inventory based on the actual screenshots.

---

## 3. Fixed and known constraints

| Item | Current status |
|---|---|
| Frontend framework | **Fixed: React Native** |
| Primary language/content | Tamil |
| Quran Arabic text | Required |
| Tamil translation | Required |
| English translation | Optional future feature |
| Prayer times | AlAdhan API is the user's reference |
| Recitation audio | Full Quran, verse-by-verse |
| Recitation recognition | Required feature to investigate and plan |
| Reference UI | `Archive.zip`, 19 screenshots |
| Backend | Not finalized |
| AI execution location | Not finalized |
| Offline scope | Not finalized |
| Translation edition and distribution rights | Not finalized |

Do not change React Native without presenting a strong technical reason and asking for approval.

---

## 4. Backend options to evaluate

The user is familiar with **Node.js** and **Supabase**. Prefer these technologies unless research demonstrates a compelling reason otherwise.

### Option A — Supabase-first (current recommended starting point)

Potential components:

- Supabase PostgreSQL for user/application data.
- Supabase Auth if accounts and cross-device synchronization are needed.
- Supabase Storage for files owned by the project, subject to licensing and cost review.
- Supabase Edge Functions for secure API integration and lightweight server-side logic.
- SQLite on the device for Quran text, translations, indexes, bookmarks/cache, and offline data.

Advantages:
- Less backend infrastructure to maintain.
- Fast development for authentication, database and synchronization.
- Familiar to the user.
- Can add a dedicated service later if required.

Limitations to investigate:
- Edge Functions are not intended to host heavy, long-running AI inference.
- Storage, bandwidth, database and function limits/pricing must be checked.
- Public Quran content should not be needlessly proxied through the backend if a safe, licensed source can be accessed directly or packaged locally.

### Option B — Node.js + Supabase

Use Supabase for database/auth/storage and Node.js for custom APIs, AI orchestration, audio processing, or workloads unsuitable for Edge Functions.

Advantages:
- More control over custom server workloads.
- Familiar Node.js ecosystem.
- Can evolve into a dedicated AI service.

Disadvantages:
- More deployment, monitoring, security and maintenance work.
- Additional hosting cost and operational complexity.

### Option C — Node.js + PostgreSQL (without Supabase)

Build and operate the backend directly.

Advantages:
- Maximum control.
- No dependency on Supabase-specific services.

Disadvantages:
- More implementation and maintenance.
- Authentication, file storage, database backups, authorization and admin tooling must be assembled and operated.

### Preliminary recommendation

Start by evaluating **Option A: Supabase-first**, with SQLite for offline content. Keep Node.js as an optional separate service if recitation AI or custom processing requires it. Do not add Node.js merely to duplicate Supabase CRUD or authentication.

**Decision pending:** The user has not selected a backend option.

---

## 5. Quran recitation recognition / AI options

The desired experience is similar in broad concept to Tarteel:

- User recites into the phone microphone.
- App identifies the Quran passage / current Ayah.
- App compares the recitation with the expected Quran text.
- App can detect omissions, substitutions, repetitions, or other word-level differences.
- More advanced future work may evaluate pronunciation and Tajweed.

### Important distinction

General Arabic speech-to-text is not automatically Quran recitation evaluation. Quran recitation has distinct pronunciation, elongation, articulation, recitation styles and Tajweed considerations. A model that transcribes ordinary Arabic must not be assumed to evaluate Quran recitation correctly.

### Option A — On-device AI

Model inference runs on the phone.

Advantages:
- Can work offline after model download.
- Better privacy because audio can remain on-device.
- No per-minute server inference cost.
- Potentially responsive.

Challenges:
- Model size, RAM, CPU/NPU performance, battery and thermal load.
- Android device compatibility and performance range.
- Native integration with React Native / Expo.
- Need to validate Arabic/Quran recitation accuracy, not just model claims.
- Model updates and device storage management.

### Option B — Server-side AI

Phone sends recorded or streamed audio to a backend AI service.

Advantages:
- Centralized model updates.
- Can use larger models and more compute.
- Easier to improve without distributing a new mobile model.

Challenges:
- Internet required.
- Hosting/GPU and audio-processing costs.
- Privacy, consent, retention and security requirements.
- Network latency and upload bandwidth.

### Option C — Hybrid AI (preliminary recommendation)

- On-device recognition for supported devices and offline practice, if the model is accurate enough.
- Optional server-side advanced processing or fallback.
- Explicit user control over whether audio is uploaded.
- No audio retention by default unless the user opts in and the retention purpose is clearly explained.

### Candidate projects mentioned for investigation

These are research leads, **not approved dependencies**. Verify current repositories, documentation, licenses, maintenance status, supported devices, model files, benchmark methodology and actual recitation accuracy.

1. **Tilawi / FastConformer**
   - Previously identified as a Quran-specific ASR project with ONNX and React Native integration.
   - Investigate its current API, model variants, license, package maintenance, language/recitation coverage and real-device performance.
   - Do not rely on previously quoted model-size or accuracy figures without verifying them from primary sources.

2. **Quran Lab / TajweedFormer**
   - Previously identified as a Quran recitation / Tajweed-related model or SDK.
   - Verify whether it is publicly available, its license and commercial/personal-use terms, platform support, offline capabilities and evaluation evidence.
   - Do not assume its stated features guarantee reliable Tajweed correction.

### AI implementation stages

1. Microphone permission and recording.
2. Detect / identify the recited Surah and Ayah.
3. Compare recognized words with the canonical verse.
4. Highlight current word or Ayah.
5. Detect missing, substituted and repeated words.
6. Evaluate pronunciation and Tajweed only after suitable model validation.
7. Store practice progress locally; synchronize only if the user wants it.

**Decision pending:** The user has not chosen on-device, server-side or hybrid AI.

---

## 6. Quran Arabic text and Tamil translation

### Arabic Quran

Potential source to investigate:

- **Tanzil** — https://tanzil.net/

Before use, verify:
- Exact text edition and script (Uthmani or other).
- Text integrity and any required attribution.
- License and redistribution conditions.
- Whether text may be bundled in an app.
- Stable verse identifiers and metadata.
- A reproducible method to validate the complete dataset.

Never edit, normalize, re-punctuate or silently alter canonical Quran text. Preserve the selected source's text exactly, subject to its license and technical encoding requirements.

### Tamil translation

The user's priority is Tamil translation, with English optional later.

Potential directions:
- TNTJ Tamil translation, if the user wants that specific edition and permission can be obtained.
- Another verified Tamil translation with clear redistribution rights.
- Multiple Tamil translations, if the data model and rights permit.

Do not scrape, copy, bundle or redistribute a translation until its source, edition, accuracy, attribution and permission/license have been verified. A translation's presence in another app or website does not mean it is free to reuse.

**Decision pending:** Exact Tamil translation edition and redistribution permission.

### Suggested content model

Keep Quran text and translations separate from user records. Candidate entities:

- `surahs`: Surah number, Arabic name, Tamil name and metadata.
- `ayahs`: Surah number, Ayah number, canonical Arabic text and relevant metadata.
- `translations`: translation edition, language, translator/publisher and license/attribution metadata.
- `ayah_translations`: Surah/Ayah reference, translation edition and translated text.
- `reciters`: reciter name and metadata.
- `ayah_audio`: reciter, Surah/Ayah, audio URL/file reference and timing metadata if available.

Use stable verse identifiers and enforce uniqueness for `(surah_number, ayah_number)` and `(translation_id, surah_number, ayah_number)`.

Do not duplicate all canonical Quran content into user-specific tables.

---

## 7. Verse-by-verse recitation audio

Potential source to investigate:

- Quran Foundation developer documentation: https://api-docs.quran.com/

Evaluate:
- Whether the API provides the desired reciters.
- Whether verse-by-verse audio URLs are available for the entire Quran.
- Audio quality and formats.
- Reciter attribution and metadata.
- Playback reliability and CDN behavior.
- Timing/word timestamp availability for verse highlighting.
- Download and offline caching rights.
- API terms, rate limits and attribution requirements.

Required user experience:
- Play an individual Ayah.
- Play continuously from the selected Ayah.
- Select a reciter.
- Highlight the currently playing Ayah.
- Optional word-level highlighting if reliable timing data exists.
- Download Surah/audio for offline use only if permitted by the source's terms.

Do not assume every reciter has complete verse-by-verse audio or that API access automatically grants redistribution rights.

---

## 8. Prayer time calculation

User-provided reference:

- AlAdhan Prayer Times API: https://aladhan.com/prayer-times-api

Expected functionality:
- Daily prayer times.
- Monthly timetable.
- Tamil Nadu city/district selection.
- Optional GPS-based location, with permission.
- Manual location selection if location permission is denied.
- Timezone handling for `Asia/Kolkata`.
- Calculation-method selection.
- Asr madhab / calculation setting where supported.
- User-configurable minute adjustments where appropriate.
- Local prayer notifications.
- Cache timings locally to reduce repeated requests and support offline viewing.

Important:
- API-calculated timings can differ from local mosque schedules.
- Do not hardcode one calculation method for all Tamil Nadu users.
- Verify the calculation method and Asr setting against the user's intended local practice.
- Keep the API key (if any) and integration security requirements under review; do not expose secrets in the app.

---

## 9. Offline-first strategy

### Candidate approach

- SQLite for Quran text, Tamil translation, Surah metadata, search indexes, bookmarks and reading progress.
- Local audio downloads/cache where licensing and storage allow.
- Prayer schedule cache.
- AI model downloaded on demand, with model size and device requirements clearly disclosed.
- Supabase synchronization for user data when online, if account sync is enabled.

### Offline options

**Option A — Full offline**
- Quran Arabic and Tamil.
- Downloaded audio.
- AI recitation recognition if the model supports the device.
- Cached prayer timings.

**Option B — Reader offline**
- Quran and Tamil translation offline.
- Audio and AI require internet.

**Option C — Mostly online**
- Basic caching only.

**Decision pending:** The user has not selected the offline scope.

---

## 10. Frontend and project structure

React Native is fixed. TypeScript is recommended unless the existing project has a justified reason to use JavaScript.

Evaluate Expo versus React Native CLI based on:
- Existing repository and project setup.
- Native audio playback requirements.
- Microphone recording.
- ONNX / native AI integration.
- Background playback and notifications.
- Android build/release requirements.
- iOS support plans.

Expo with development builds may be suitable, but do not assume Expo Go supports all native AI/audio features. If a required library needs native code, validate it in a development build or choose an appropriate bare/native workflow.

Possible high-level structure (adapt to the actual repository; do not impose blindly):

```text
src/
  app/                  # navigation / routes
  components/           # reusable UI
  features/
    home/
    quran/
    audio/
    search/
    prayer/
    qibla/
    bookmarks/
    recitation/
    settings/
  services/
    quran/
    prayer/
    audio/
    ai/
    sync/
  database/
    migrations/
    repositories/
  hooks/
  theme/
  utils/
  types/
assets/
  fonts/
  icons/
  images/
```

---

## 11. UI / UX direction

Design goals:
- Creative, polished and modern Islamic visual language.
- Preserve the familiar Quran-app navigation patterns users need.
- Do not copy the reference app pixel-for-pixel.
- Prioritize Arabic readability and correct text rendering.
- Tamil typography must be readable at multiple font sizes.
- Support light and dark themes.
- Provide clear playback controls and current-Ayah highlighting.
- Avoid clutter and excessive decoration around Quran text.
- Accessibility: scalable text, sufficient contrast, screen-reader labels and usable touch targets.
- Make prayer times and the next prayer easy to understand.
- Support small and large Android screens.

The screenshots must be inspected directly before the final design specification is written.

---

## 12. Search requirements

Support:
1. Surah number / Surah name navigation.
2. Ayah number navigation.
3. Arabic text search.
4. Tamil translation search.
5. Search result links to the exact Surah and Ayah.
6. Offline search for locally bundled content.

Research Arabic search behavior carefully:
- Diacritics / harakat handling.
- Alef variants and orthographic normalization.
- Uthmani script differences.
- Whether normalization is only used in a separate search index; never mutate displayed canonical Quran text.

Tamil search must handle Unicode consistently and be tested with real Tamil queries.

---

## 13. User data and backup

Candidate user-data entities:
- `profiles`
- `bookmarks`
- `reading_progress`
- `prayer_preferences`
- `notification_preferences`
- `download_history`
- Optional `recitation_sessions` (only if practice history is desired and privacy implications are addressed)

Backup and recovery plan should cover:
- Database backup and restore.
- Schema migrations.
- Quran source datasets and version identifiers.
- Translation source, edition and license evidence.
- Audio metadata and storage references.
- App configuration and environment variable documentation.
- No secrets committed to Git.
- Test restoration, not just backup creation.

Do not store raw user voice recordings by default. If recordings are needed for a feature, obtain explicit consent and define retention/deletion behavior.

---

## 14. Proposed development phases

### Phase 0 — Research and technical validation (do this first)

- Inspect all 19 screenshots.
- Identify existing repository/project structure if a project is supplied.
- Verify Quran Arabic source and licensing.
- Identify Tamil translation edition and permissions.
- Verify reciter audio coverage and rights.
- Prototype candidate Quran ASR on a real Android device.
- Compare Supabase/SQLite architecture.
- Verify AlAdhan settings for the target region.
- Produce an architecture decision record and risk register.

### Phase 1 — Core Quran application

- Creative UI and navigation.
- Quran Arabic text.
- Tamil translation.
- Surah/Ayah navigation.
- Arabic and Tamil search.
- Verse-by-verse audio.
- Reciter selection.
- Bookmarks and reading progress.
- Offline Quran reading.

### Phase 2 — Prayer features

- AlAdhan integration.
- Tamil Nadu location support.
- Manual city selection.
- Prayer timetable and notifications.
- Qibla, if included in the final feature scope.

### Phase 3 — Basic recitation AI

- Microphone and recording.
- Quran-specific recognition.
- Surah/Ayah identification.
- Word-level comparison.
- Missing/substituted/repeated word feedback.
- Device compatibility and accuracy testing.

### Phase 4 — Advanced recitation

- Pronunciation feedback.
- Tajweed evaluation, only if validated.
- Practice history and progress.
- Optional server-side enhancement.

### Phase 5 — Hardening and release

- Offline behavior.
- Accessibility and Arabic/Tamil typography QA.
- Performance and battery tests.
- Security review.
- Backup/restore testing.
- Release builds and deployment documentation.

---

## 15. Open decisions — do not assume answers

These are the decisions the user must make or explicitly delegate after reviewing evidence.

### Decision 1 — Tamil translation

- [ ] TNTJ translation specifically (verify permission).
- [ ] Another verified Tamil translation.
- [ ] Multiple Tamil translations.
- [ ] Research available datasets and rights first; decide later.

### Decision 2 — Recitation AI execution

- [ ] Entirely on-device.
- [ ] Server-side.
- [ ] Hybrid: on-device first, optional server processing.
- [ ] Research and benchmark candidates before deciding.

### Decision 3 — Offline support

- [ ] Full offline: Quran, translation, downloaded audio and supported AI.
- [ ] Offline Quran and translation only.
- [ ] Mostly online with basic caching.
- [ ] Decide after estimating storage and device requirements.

### Decision 4 — Backend

- [ ] Supabase + SQLite; add Node.js only if justified.
- [ ] Supabase + Node.js from the beginning.
- [ ] Node.js + PostgreSQL without Supabase.
- [ ] Research and recommend based on requirements/costs.

### Decision 5 — Platform scope

- [ ] Android first; consider iOS later.
- [ ] Android and iOS together.
- [ ] Other scope to be specified.

### Decision 6 — Accounts and synchronization

- [ ] No account; local-only personal app.
- [ ] Optional account and cloud synchronization.
- [ ] Account required.
- [ ] Decide later.

### Decision 7 — Audio scope

- [ ] One reciter initially.
- [ ] Multiple reciters from the beginning.
- [ ] Start with available licensed reciters and expand after verification.

### Decision 8 — Prayer-time convention

- [ ] User selects calculation method and Asr setting.
- [ ] Use a specific locally preferred method (user must specify).
- [ ] Support both calculated timings and manual adjustments.

---

## 16. Instructions for OpenCode / DeepSeek / other coding agents

You are being given this file as a decision brief, not as permission to immediately implement the application.

1. Read this entire file.
2. Inspect the supplied `Archive.zip` and all 19 screenshots.
3. If a project repository exists, inspect its actual files and structure before recommending changes.
4. Separate **confirmed requirements**, **proposals**, **assumptions**, and **open decisions**.
5. Independently verify current documentation, licenses, API terms, model availability and compatibility using primary sources.
6. Do not fabricate API endpoints, model capabilities, package names, benchmark results, licenses or pricing.
7. Specifically validate Quran text and translation integrity and redistribution permissions.
8. Specifically test whether the proposed Quran AI can recognize real Quran recitation on the target Android hardware. Do not equate ordinary Arabic ASR with Tajweed evaluation.
9. Compare options with pros, cons, development complexity, ongoing costs, offline behavior, privacy and maintenance.
10. Recommend a coherent architecture that avoids unnecessary services.
11. Do not replace React Native without explaining and obtaining approval.
12. Do not start coding, install packages, alter project files, or create branches until the user approves the architecture and implementation plan.
13. Produce:
    - `architecture-research.md`
    - `technology-comparison.md`
    - `data-sources-and-licensing.md`
    - `ai-feasibility.md`
    - `implementation-roadmap.md`
    - `open-decisions.md`
14. In each report, cite the exact primary documentation/repository/license URLs and state the date checked.
15. Where evidence is insufficient, say so and propose a small proof of concept rather than guessing.

### Expected first response from the agent

After reviewing the project and screenshots, provide:
- A concise understanding of the application.
- A verified feature inventory from the screenshots.
- Recommended architecture and alternatives.
- Quran/Tamil/audio data-source findings and licensing risks.
- Quran AI feasibility findings.
- Offline storage and device requirements.
- Cost and operational considerations.
- Open questions requiring the user's decision.
- A phased implementation plan.

**Stop after presenting the research and recommendations. Wait for explicit user approval before implementation.**

---

## 17. Current overall recommendation (provisional)

The current preferred direction for evaluation is:

- React Native + TypeScript.
- Expo development build if native module compatibility is confirmed.
- Supabase for backend services and PostgreSQL.
- SQLite for offline Quran content and local user state.
- Tanzil as a candidate Arabic text source, subject to license and integrity checks.
- A properly licensed Tamil translation, with the exact edition still undecided.
- Quran Foundation as a candidate recitation/audio data provider, subject to coverage and rights checks.
- AlAdhan for prayer-time calculations, with configurable regional settings.
- Prototype Quran-specific on-device AI first; compare Tilawi and Quran Lab candidates.
- Keep Node.js optional until a concrete workload justifies it.

**None of the provisional choices above should be treated as final user approval.**
