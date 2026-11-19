# Technology Evaluation — Tamil Quran App

**Status:** Research report, not final approval
**Prepared:** 18 November 2026
**Applies to:** `Tamil-Quran-App/` (Expo SDK 58 / React Native 0.88 / TypeScript)
**Owner decisions are tracked separately in [`DECISIONS.md`](./DECISIONS.md).**

> Evidence policy: claims below are marked **Verified** (checked against a primary
> source on 18 Nov 2026), **Reported** (stated by one of the source documents but
> not independently verified), or **Unverified** (must be checked before use).
> No pricing, licence, API capability or AI accuracy figure should be treated as
> final without re-checking at implementation time.

---

## 1. Inputs inspected

| Input | Location | What it contributed |
|---|---|---|
| ChatGPT decision brief | `docs/architecture/sources/chatgpt-decision.md` | Requirements, cautious evaluation framework, licensing warnings, phased plan |
| Grok opinion | `docs/architecture/sources/grok-opinion.md` | Pragmatic offline-first stack proposal, concrete candidate sources |
| Original mockups (19 screens) | `mockup/original/` | Primary UI/IA reference (TNTJ-style green app) |
| Stitch redesign | `mockup/stitch_redesign/` | Secondary visual reference (cream/gold editorial direction) |
| Legacy visual reference | `mockup/legacy_reference/` | Alternate gold/cream layout exploration |
| Original project observation note | `docs/architecture/sources/older-project-observations.txt` | Preferred documentation workflow and EAS/Android expectations |
| Original brief | `docs/architecture/sources/original-brief.txt` | Phase 1 scope, Tamil-first, AlAdhan reference, Tarteel-like ambition |

The mockups were inspected screen by screen. They show: home dashboard with
next-prayer card, last-read card, Quran hero, search/qibla/bookmark quick actions
and an explore grid; surah index; dual-language reader with per-ayah actions and
font controls; prayer times with today/tomorrow/monthly views and notification
settings; a separate Qibla compass screen; reciter picker; bookmarks; settings;
and a "go to verse" sheet. Prayer times and Qibla are distinct screens, matching
the brief.

---

## 2. ChatGPT vs Grok: comparison

### 2.1 Where they agree

| Topic | Shared position |
|---|---|
| Frontend | React Native with TypeScript |
| Offline core | SQLite for Quran text, translation, bookmarks and progress |
| Backend weight | Do **not** build a heavy custom backend for Phase 1 |
| Cloud | Supabase is the leading optional backend candidate |
| Prayer | AlAdhan as the reference provider, with local caching |
| Audio | Verse-by-verse recitation for the whole Quran |
| AI | Privacy-preserving, on-device-first direction is attractive |
| Tamil translation | TNTJ edition is desired but not assumed reusable |
| Scope discipline | Personal app; avoid over-engineering |

### 2.2 Where they differ

| Topic | ChatGPT | Grok | Assessment |
|---|---|---|---|
| Starting posture | Research and validation before code; wait for approval | Implement immediately with a chosen stack | The user has now explicitly asked for a UI-first implementation. Proceed with reversible UI choices, but keep content/backend/AI decisions gated. |
| Backend | Supabase-first, Node.js only if justified | Supabase light, no Node server | Agree in practice: no backend now. A server becomes mandatory only if the Quran Foundation Content API is used, because mobile clients cannot hold its `client_secret` (Verified). |
| Audio source | Quran Foundation API is a candidate; verify rights/coverage | EveryAyah is the choice | Neither is validated for licensing. EveryAyah's site offers verse MP3s but no clear redistribution licence was found on the pages checked (Unverified). Use neither until reviewed. |
| AI | Benchmark candidates; distinguish ASR from Tajweed evaluation | "Strongly preferred" on-device; cites model sizes and a project as proof | ChatGPT is methodologically stronger. Grok's model-size/accuracy claims were not verified and must not drive a decision. |
| Tamil translation | Verify edition and permission; never scrape | Explicitly says TNTJ is not freely redistributable; start with another translation | Grok is sharper on the TNTJ risk, but "another publicly available translation" is not automatically licensed either. Both must be verified. |
| Expo | Expo possible, but native AI/audio may require dev builds | Expo, treated as uncomplicated | Both are partly right. Expo fits the UI phase, but native AI/audio requires development builds/prebuild, not Expo Go (Verified from Expo documentation/template guidance). |
| Detail level | Broad architecture and risk register | Concrete stack table and next steps | Use ChatGPT's rigour + Grok's decisiveness, without inheriting unverified claims. |

### 2.3 Quality assessment

**ChatGPT brief — strengths:** separates facts, proposals and open decisions;
demands primary-source verification; correctly warns that a free API is not a
redistribution licence; treats Quran text as immutable; recognises that general
Arabic ASR ≠ Tajweed evaluation; includes accessibility and offline scope.

**ChatGPT brief — weaknesses:** very long and repetitive; proposes many report
artefacts without prioritising them; leaves nearly every decision open; was
written before the current Quran Foundation OAuth requirements, so its
"Quran Foundation as a direct audio provider" assumption needs revision.

**Grok opinion — strengths:** concise, actionable, correctly prioritises offline
reading and privacy; explicitly flags the TNTJ redistribution problem; keeps the
backend minimal.

**Grok opinion — weaknesses:** presents recommendations as conclusions; makes
unverified claims about AI model size/accuracy and about EveryAyah; does not
address Quran text/translation licences rigorously; ignores the operational
details of background audio, notifications and native AI in Expo; treats Expo as
a free pass for native modules.

---

## 3. Evaluation criteria

Every option is assessed against: content accuracy and licensing, offline
behaviour, React Native integration, privacy, cost, maintenance burden, vendor
lock-in, and suitability for a small personal/open-source project.

---

## 4. Frontend workflow: Expo vs bare React Native

### 4.1 What Expo provides

Expo is a framework and toolchain around React Native. It supplies SDK modules
(fonts, audio, location, sensors, notifications, SQLite), a config-plugin system,
development builds, EAS Build/Submit, and continuous native generation (CNG).
`android/` and `ios/` can be generated when needed.

### 4.2 Comparison

| Criterion | Expo (managed + development builds) | Bare React Native CLI |
|---|---|---|
| UI iteration speed | High; Metro and prebuilt modules | High, but native project upkeep |
| Native modules | Supported via dev builds and config plugins; Expo Go cannot include arbitrary native code | Full control, configured manually |
| Audio/background playback | Expo audio modules + config plugins; background behaviour still needs native QA | Direct native library control |
| Notifications | Expo Notifications + config | Manual setup |
| Qibla sensors | `expo-sensors` / `expo-location` | Direct sensor APIs |
| On-device AI (ONNX/TFLite) | Possible, but likely needs a custom dev build/config plugin; verify on device | More direct native integration |
| Build/release | EAS or local `expo run:android` | Gradle/Xcode directly |
| Upgrade burden | SDK upgrades, but mostly coordinated | Manual RN/native upgrades |
| Lock-in | Low–moderate: prebuild produces native projects; EAS is optional | Low |
| Open-source friendliness | High; no paid service required for local builds | High |

### 4.3 Recommendation

**Use Expo with development builds for the UI-first phase.** The app currently
uses no custom native code, so Expo gives the fastest safe path. Do **not** rely
on Expo Go for future audio/AI/sensor work; validate those in a development
build. Keep CNG (`android/`/`ios/` generated, not hand-edited) until a concrete
native requirement forces a different workflow.

**Kept open:** moving to a bare/prebuild workflow or adding custom native modules
if the chosen Quran ASR engine cannot be packaged acceptably with Expo. This is
a later, evidence-based decision, not a reason to avoid Expo now.

**Verified context:** Expo SDK 58.0.26, React Native 0.88.1, React 19.3.0 were
installed by the current template on 18 Nov 2026.

---

## 5. Backend options

### 5.1 Option A — No backend (current phase)

The UI runs entirely locally with mock data. No accounts, network calls, secrets,
or database.

- **Cost:** zero.
- **Privacy:** best possible.
- **Limitation:** no sync, no cross-device progress, no server-side AI.
- **Verdict:** correct for the UI milestone and probably for the first usable
  personal release if sync is not required.

### 5.2 Option B — Supabase (leading candidate for optional sync)

Supabase provides PostgreSQL, Auth, Storage, Edge Functions and Row Level
Security. It is open source and can be self-hosted.

**Verified pricing (18 Nov 2026, supabase.com/pricing):**

- Free: $0, 500 MB database, 5 GB egress, 1 GB storage, 50,000 MAU, 2 active
  projects, **paused after 1 week of inactivity**.
- Pro: from $25/month, 8 GB disk per project, 250 GB egress, 100 GB storage,
  daily backups, no inactivity pause.

**Advantages:** fast auth/sync; familiar to the owner; SQL; RLS; generous free
tier for a personal app; exportable Postgres data; self-host path.

**Disadvantages:** another service to secure and maintain; free projects pause;
Edge Functions are unsuitable for long-running AI inference; adds account
complexity the app may not need.

**React Native integration:** official `@supabase/supabase-js`; straightforward.
Never embed a service-role key in the app.

**Offline:** Supabase is not an offline database. SQLite remains the source of
truth; sync is an optional reconciliation layer.

**Lock-in:** low–moderate. Postgres data is portable; Auth/Edge/Realtime APIs are
Supabase-specific but replaceable. Self-hosting is possible.

### 5.3 Option C — Node.js service

Useful for: Quran Foundation OAuth token handling and proxying, licensed audio
URL signing, server-side advanced AI, push notification fan-out, or scheduled
content ingestion.

Not useful for: duplicating auth/CRUD that Supabase already provides.

**Cost:** small always-on hosting (e.g. a container/VPS) plus egress; exact
provider costs must be quoted at build time. Server-side GPU AI is materially
more expensive than CPU CRUD.

**Maintenance:** deployments, monitoring, secrets, rate limiting, backups.

**Verdict:** do not add Node now. Add only when a concrete workload exists. The
strongest current candidate workload is the Quran Foundation Content API, which
requires a confidential backend client (Verified).

### 5.4 Option D — Firebase

**Advantages:** mature auth, Firestore, storage, notifications, analytics.

**Disadvantages:** NoSQL modelling is a weaker fit for canonical Quran content
and relational verse/translation/audio metadata; stronger Google lock-in; pricing
is usage-based and harder to predict; offline persistence exists but SQLite
queries/search are more controllable.

**Verdict:** technically viable but not preferred over Supabase for this data
model. Keep as a fallback only.

### 5.5 Option E — Custom PostgreSQL without Supabase

**Verdict:** maximum control but unnecessary operational burden for a personal
app. Revisit only if Supabase's terms/pricing become unsuitable.

### 5.6 Backend synthesis

1. Ship the offline reader with **no backend**.
2. If accounts/sync are requested, use **Supabase** + SQLite sync.
3. If licensed content requires a confidential API client, add a narrow
   **Node service or Supabase Edge Function** for token handling/proxying only.
4. Never put server secrets in the app bundle.

---

## 6. Database and local content storage

### 6.1 SQLite (recommended local store)

- **What:** embedded relational database on device.
- **Why:** full Quran text, Tamil translation, metadata, search indexes,
  bookmarks, reading progress, audio download state and prayer cache in one
  transactional store.
- **React Native:** `expo-sqlite` is supported; migrations and repositories are
  straightforward.
- **Offline:** complete.
- **Cost:** zero.
- **Limitations:** schema migrations, FTS5 availability/behaviour must be tested
  on target devices; database size must be measured; writes should be batched.
- **Verdict:** recommended for the content/offline layer, not yet implemented.

### 6.2 PostgreSQL (cloud)

Appropriate for user accounts, sync metadata, and content ingestion pipelines.
Not a substitute for on-device offline reading. Free-tier sizing is ample for
personal sync; canonical content should be packaged, not fetched per screen.

### 6.3 Alternatives

- **Realm:** capable, but adds a different ecosystem and licence considerations;
  not needed when SQLite is available.
- **WatermelonDB:** good for large sync-heavy datasets, but extra abstraction for
  a small app.
- **AsyncStorage:** suitable only for small preference blobs, not Quran content.
- **Bundled JSON:** excellent for first-run seeding and small datasets; less
  suitable for search/progress queries than SQLite.

### 6.4 Content packaging recommendation

Ship a versioned, read-only content database (or JSON seed imported into SQLite)
with a manifest containing: source edition, source version, checksum, verse count,
translation edition, licence/attribution text, and build date. Validate at build
time and on first run. Keep content separate from user tables.

---

## 7. Quran text and Tamil translation

### 7.1 Arabic text

**Tanzil (candidate, not approved):**

- Verified: Tanzil offers Uthmani and simple scripts, UTF-8, with a documented
  provenance from the Medina Mushaf (Hafs).
- Verified: its FAQ says resources are available for **non-commercial** purposes.
  A commercial licence may be required for commercial distribution. Exact terms
  and attribution requirements must be read on the download/licence page before
  bundling.
- Risk: edition/script mismatch, accidental normalization, and redistribution
  terms.

**Quran Foundation / Quran.com (candidate, not approved):**

- Verified: content APIs now require OAuth2; Content API credentials use a
  client secret and **must be called from a backend**, not a mobile client.
- Verified: the pre-live dataset contains only Al-Fatihah and Al-Baqarah;
  production access requires approval. This makes it unsuitable as the sole
  source for an offline-first v1 unless production access and download rights are
  granted.
- Risk: access gating, terms of use, attribution, caching/download permissions.

**Other sources:** Quranic Universal Library, quran-json and similar projects
exist, but each must be traced to its underlying text edition and licence. A JSON
mirror is not evidence of rights.

### 7.2 Tamil translation

- **TNTJ Tarjuma:** desired by the owner. Grok states it is not freely
  redistributable; ChatGPT requires permission. **No licence evidence was found
  in this review.** Treat as all rights reserved. Do not scrape the official app
  or website.
- **Other Tamil translations:** must be verified for translator/publisher,
  edition, accuracy, attribution, modification rights, and commercial/non-
  commercial redistribution. "Available on a website" ≠ licensed for bundling.
- **Current build:** verified Tanzil Uthmani and QuranEnc `tamil_omar` content is
  bundled in SQLite with attribution. Non-Quranic sample copy survives only as a
  clearly marked fallback when the database cannot be read.

### 7.3 Integrity controls (required before release)

1. Pin an exact source edition and version.
2. Store the canonical text verbatim; never "fix" spelling or diacritics.
3. Validate 114 surahs / 6,236 ayahs for the standard Hafs text (confirm against
   the chosen edition) and `(surah, ayah)` uniqueness.
4. Record checksums and source URLs in the content manifest.
5. Use a separate normalized index for search; never mutate displayed text.
6. Diff imported text against the source; run spot checks with a qualified
   reviewer.
7. Keep attribution and licence text visible in About.

---

## 8. Recitation audio

### 8.1 Candidate providers

| Provider | Model | Verified status | Concerns |
|---|---|---|---|
| Quran Foundation | API/CDN, authenticated | API requires backend OAuth; production access gated | Terms, download/caching rights, coverage, attribution |
| EveryAyah | Static verse MP3 files | Site lists many reciters; some sets have missing files (e.g. Warsh Abdul Basit "47 files missing") | No clear redistribution licence found; do not bundle/download until clarified |
| mp3quran.net | Surah-level audio | Not reviewed | Verse-level sync and rights unverified |
| Self-hosted CDN | Files served by project | Only after licensed files are obtained | Storage/egress cost and rights |

### 8.2 Requirements

- Per-ayah playback, continuous play, reciter selection, current-ayah highlight.
- Download for offline only if the licence permits it.
- Cache with explicit storage limits and user-controlled deletion.
- Background playback and lock-screen controls require a dev build and native
  configuration.
- Word-level timing is optional; do not promise it without verified timing data.

### 8.3 Licensing caution

Reciter performance rights vary by recording and distributor. A public URL is not
a redistribution licence. Do not bundle audio into the repository or app until
the terms are documented in `DECISIONS.md` and `docs/architecture/`.

**Current state:** reciter names only; no audio files, URLs, or playback engine.

---

## 9. Prayer times and Qibla

### 9.1 Prayer times — AlAdhan

- **What:** HTTP API for daily/monthly timings, calculation methods, and Qibla
  direction.
- **Verified:** the service exists and publishes a prayer-times API.
- **Not verified in this review:** current rate limits, attribution requirements,
  commercial terms (the attempted terms URL returned 404), and long-term
  stability guarantees. Review the site's linked terms before shipping.
- **React Native:** simple HTTPS; works with fetch.
- **Offline:** cache responses; an on-device calculator is preferable for true
  offline operation.
- **Alternative:** `adhan-js` (candidate; confirm licence and calculation
  coverage) for local calculation. This removes network dependence and API terms
  risk, at the cost of implementing method/madhab configuration and validation.

**Recommendation:** keep AlAdhan as the reference for cross-checking, but aim for
local calculation + cached monthly tables. Prayer times vary by method, Asr
madhab, high-latitude rules, and local mosque practice; expose settings and never
hard-code one method for all users.

### 9.2 Qibla

- Requires location (GPS or manual city) and a magnetometer/compass.
- Expo modules: `expo-location`, `expo-sensors`.
- Device magnetometer accuracy varies; calibration and a fallback to a
  map/bearing display are required.
- **Current state:** static sample bearing and drawn compass; no sensors or
  permissions. Clearly labelled in the UI.

---

## 10. On-device / server / hybrid AI

### 10.1 Goal

Recognise Quran recitation, align it to the expected ayah/word sequence, and give
useful feedback on omissions, substitutions and repetitions. Tajweed scoring is a
later, harder problem and must not be implied by a generic ASR demo.

### 10.2 Options

| Option | Pros | Cons | Assessment |
|---|---|---|---|
| On-device | Offline, private, zero marginal cost, low latency | Model size, RAM/NPU support, battery/heat, native integration, accuracy unknown | **Recommended for a proof of concept**, not yet a commitment |
| Server-side | Larger models, easier updates, weaker devices supported | Internet, upload privacy, GPU cost, latency, retention policy | Possible premium/fallback path |
| Hybrid | On-device default, opt-in server enhancement | Most complexity; two pipelines to validate | Likely long-term shape, but only after on-device evidence |

### 10.3 Evidence status

- **Tilawi / FastConformer:** candidate; current repo, licence, model formats,
  React Native support, device performance and accuracy are **Unverified**.
- **Quran Lab / TajweedFormer:** candidate; availability, licence and evaluation
  evidence are **Unverified**.
- Grok's "25–130 MB" and accuracy implications are **unverified claims** and must
  not be used in planning as facts.
- General Arabic ASR is not Quran recitation evaluation. Any candidate must be
  benchmarked on real recitation, on target Android hardware, with a
  Quran-specific error metric.

### 10.4 Recommended proof of concept (before any AI decision)

1. Choose one candidate with a clear licence.
2. Build a throwaway native harness (or Expo dev build) on the target phone.
3. Test: verse identification, word alignment, omissions, substitutions,
   background noise, different reciters, memory/battery/thermal behaviour.
4. Record measured results and failure cases.
5. Only then choose on-device, server-side or hybrid.

**Current state:** no AI dependency, no microphone permission, no model assets.

---

## 11. Hosting, cost, scalability, open-source compatibility

| Component | Likely cost | Scaling behaviour | Lock-in / notes |
|---|---|---|---|
| App distribution | Google Play one-time fee; Apple annual fee | Store limits | Platform requirement |
| Content bundling | Zero marginal cost | App size grows | Best for offline |
| Supabase (optional) | Free tier; Pro from $25/mo (Verified) | Postgres + MAU/egress quotas | Open source; self-host possible |
| Node service | Hosting + egress | Horizontal | Portable containers |
| Audio self-hosting | Storage + egress; potentially the largest recurring cost | Grows with downloads/streams | Only with licensed files |
| Server AI | GPU time; potentially expensive | Per-minute inference | Avoid until validated |
| Expo/EAS | Local builds free; EAS has paid tiers (verify current) | Build minutes | Prebuild keeps exit path |
| AlAdhan | Public API; verify terms/limits | Rate-limited | Replaceable with local calculation |

**Open-source friendliness:** Expo, React Native, SQLite, Supabase and adhan-js
have open-source paths. Quran text/translation/audio rights are the real
constraints, not the software licences. The app's own source is now MIT
(ADR-016); third-party notices and content terms must still be audited before a
store release.

---

## 12. Recommended architecture (phased)

```text
┌──────────────────────────────────────────────┐
│ Expo / React Native / TypeScript app         │
│  UI → features → theme tokens                │
│  Content repository (interface)              │
│    ├─ mock repository (now)                  │
│    └─ SQLite repository (next)               │
│  Local user state (bookmarks, preferences)   │
│  Audio service (later)                       │
│  Prayer service (later)                      │
└──────────────────────────────────────────────┘
             │ optional sync (later)
             ▼
┌──────────────────────────────────────────────┐
│ Supabase (only if accounts/sync requested)   │
│  Auth + Postgres + RLS                       │
└──────────────────────────────────────────────┘
             │ only if a confidential API is needed
             ▼
┌──────────────────────────────────────────────┐
│ Narrow Node/Edge service                     │
│  Quran Foundation OAuth proxy, signed URLs   │
│  advanced server AI (only if validated)      │
└──────────────────────────────────────────────┘
```

**Now:** UI plus verified offline reading/search; no backend, audio or AI.
**Next:** reproducible content manifest, persistence for bookmarks/position, and
the Arabic-search/deep-link fixes.
**Then:** prayer calculation/cache, Qibla sensors, audio (licensed), AI POC.

---

## 13. Alternatives worth keeping open

- **Bare React Native** if a required native AI/audio module cannot work in an
  Expo development build.
- **Self-hosted Supabase / plain PostgreSQL + Node** if managed costs or terms
  become unsuitable.
- **Local Adhan calculation** as the primary prayer engine, with AlAdhan only for
  verification.
- **Surah-level audio + verse timing metadata** if verse-level files are not
  licensed.
- **Server-side AI fallback** if on-device accuracy or device coverage fails.
- **English translation** as an optional second edition.

---

## 14. Decisions that remain with the owner

1. Tamil translation edition and written permission.
2. Arabic text edition/source and licence.
3. Audio provider, reciters, download rights, and offline audio scope.
4. Backend: none vs Supabase vs Supabase + Node.
5. Accounts/sync: none, optional, or required.
6. Offline scope: reader only, reader + downloaded audio, or full offline AI.
7. AI execution: on-device, server-side, hybrid — after a measured POC.
8. Platform scope: Android first vs Android + iOS.
9. Prayer calculation method/Asr madhab and location strategy.
10. App licence, repository URL, package identifiers, and branding assets.
11. Whether commercial use is intended (this changes Tanzil and translation
    licensing options).

---

## 15. Risks and unresolved questions

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| R-01 | Unlicensed Tamil translation bundled | Critical | Written permission; placeholder until verified |
| R-02 | Unlicensed audio bundled/redistributed | Critical | Verify terms; stream only if permitted; document |
| R-03 | Quran text altered or wrong edition | Critical | Verbatim import, checksums, verse-count validation, review |
| R-04 | Quran Foundation API access not granted | High | Offline dataset as primary; backend proxy only if approved |
| R-05 | Tanzil non-commercial restriction conflicts with distribution | High | Read exact terms; seek permission if commercial |
| R-06 | Expo native AI/audio incompatibility | Medium | Development-build spike before committing |
| R-07 | On-device AI accuracy/device coverage | High | Measured POC; keep server fallback open |
| R-08 | Prayer method mismatch with local mosque | Medium | Configurable method + manual adjustments + comparison |
| R-09 | Qibla sensor inaccuracy | Medium | Calibration guidance, fallback bearing/map |
| R-10 | Free-tier backend pauses/data loss | Medium | Local-first; backups; paid tier if sync matters |
| R-11 | Scope creep into backend/AI before reader is solid | High | Phase gates; current UI-first boundary |
| R-12 | App size from bundled text/audio/fonts | Medium | Measure; download audio on demand; subset fonts if needed |
| R-13 | API rate limits/terms change | Medium | Cache; local calculation; abstract providers |
| R-14 | Accessibility/typography regressions | Medium | Token system, QA matrix, screen-reader checks |

---

## 16. Primary sources checked (18 Nov 2026)

- Expo SDK/template versions: local `package.json` after `create-expo-app`
  (Expo 58.0.26, RN 0.88.1, React 19.3.0); npm registry `expo` dist-tags.
- Expo docs entry point and template guidance: `https://docs.expo.dev/`
  (navigation guidance and dev-build/CNG notes in the generated template).
- Tanzil download page: `https://tanzil.net/docs/download`.
- Tanzil FAQ (non-commercial resources statement):
  `https://tanzil.net/docs/faq`.
- Quran Foundation developer docs (OAuth client credentials, backend-only
  Content API, prelive dataset limitation):
  `https://api-docs.quran.foundation/docs/quickstart/`.
- Quran Foundation docs landing page: `https://api-docs.quran.foundation/`.
- AlAdhan Prayer Times API: `https://aladhan.com/prayer-times-api`
  (terms URL attempted returned 404; terms still unverified).
- EveryAyah recitation index: `https://everyayah.com/recitations_ayat.html`
  (no licence statement found on the page).
- Supabase pricing (Free/Pro quotas and inactivity pause):
  `https://supabase.com/pricing`.

Unchecked by this review and therefore explicitly unverified: current AlAdhan
terms/rate limits, EveryAyah licensing, Quran Foundation production content
rights, TNTJ permission status, Expo EAS pricing, adhan-js licence, Tilawi/Quran
Lab repositories and model performance.
