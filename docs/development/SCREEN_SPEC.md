# Screen Specification — Tamil Quran App

**Version:** 0.1 (UI foundation)
**Last updated:** 18 November 2026

This document describes what each screen does **today**, including honest
limitations. It is a build/QA reference, not a design wishlist. Where behaviour
is mocked, it is marked **[MOCK]**; where something is not implemented, it is
marked **[NOT IMPLEMENTED]**.

Navigation contract: `src/navigation/types.ts`.
Visual source: `mockup/original/` (primary), `mockup/stitch_redesign/` (secondary).

---

## 0. Global shell

### 0.1 App root

`App.tsx` → `src/app/AppRoot.tsx`

1. Loads Amiri (regular/bold), Noto Sans Tamil (400/500/600/700) and Noto Serif
   Tamil (400/600/700) through `expo-font`.
2. While loading, shows a deep-green splash with the Arabic word القرآن, the
   Tamil app name, and a gold spinner.
3. Then mounts `SafeAreaProvider` → `PreferencesProvider` → `RootNavigator`.

**Rules:** no screen may render before fonts are ready. Do not add a second font
loading path.

### 0.2 Navigation

Root stack (headers hidden; every screen draws its own):

| Route | Params | Presentation |
|---|---|---|
| `MainTabs` | optional nested tab | root |
| `SurahReader` | `{ surahId: number }` | push, slide from right |
| `Qibla` | — | push |
| `Bookmarks` | — | push |
| `Search` | — | push |
| `Appearance` | — | push |
| `ReciterPicker` | — | push |
| `About` | — | push |

Bottom tabs: `Home`, `Quran`, `Prayer`, `Settings`.
Tab bar height is `62 + bottom inset`; labels use Noto Sans Tamil 10sp.

### 0.3 Theme behaviour

- `PreferencesProvider` resolves `system | light | dark` using `useColorScheme`.
- Every screen reads colours from `useAppTheme()`.
- Status bar style is set per screen; dark mode uses light content.
- **[NOT IMPLEMENTED]** Theme choice is not persisted.

### 0.4 Reusable primitives

| Component | Purpose |
|---|---|
| `Screen` | background + safe-area edges |
| `ScreenHeader` | back button, title, subtitle, right actions |
| `AppText` | typography variants bound to fonts/tokens |
| `Card` | surface with radius/border/shadow |
| `IconButton` | 44dp icon action; variants plain/gold |
| `Pill` | compact metadata chip |
| `SampleBadge` | "மாதிரித் தரவு" disclosure |
| `SectionHeading` | section title + optional action |
| `SettingRow` | labelled navigation/setting row |
| `SegmentedControl` | typed 2–3 option switch |
| `SearchField` | rounded search input |
| `ProgressBar` | thin progress indicator |
| `EmptyState` | icon + title + explanation |
| `Divider` | 1px separator |
| `PrimaryButton` | filled/outline action |

---

## 1. Home (`Home` tab)

**File:** `src/features/home/HomeScreen.tsx`

### Layout

1. **Green hero** (rounded bottom corners, decorative circles):
   - Arabic app name in gold, Latin wordmark, Tamil app name, tagline.
   - Greeting line and date/location context.
   - Header actions: Qibla, theme toggle, Settings.
2. **Continue reading card** — overlaps the hero; surah 2, ayah 255 sample
   target; tapping opens `SurahReader`.
3. **Next prayer card** — prayer name, sample time, location, minutes remaining,
   progress bar; tapping opens the Prayer tab.
4. **Quick actions** — Search, Qibla, Bookmarks.
5. **Surah shortcuts** — a few surah rows opening the Reader.
6. **Explore grid** — Appearance, Reciter picker, Prayer times, About.
7. **Sample disclosure** where mock timings/content appear.

### Behaviour

- Theme toggle cycles the in-memory preference (system → light → dark → system).
- Pull-to-refresh is not implemented; a local `refreshed` flag drives a small
  visual acknowledgement only. **[MOCK]**
- No network calls.

### QA notes

- Hero must stay legible in dark mode (it uses `header`, not `primary`).
- Overlapping card must not clip on 320 dp width.
- Prayer countdown text is static sample copy.

---

## 2. Quran index (`Quran` tab)

**File:** `src/features/quran/SurahIndexScreen.tsx`

### Layout

1. Green header with title, search affordance and metadata count.
2. Segmented control: **சூரா / ஜுஸ் / பக்கம்**.
3. Search field filtering the surah list locally.
4. Surah rows: number badge, Tamil name, transliteration, Arabic name, meaning,
   ayah count, revelation place.
5. Inline notice: only the first 12 surahs are included; verified full dataset
   pending.

### Behaviour

- Surah mode: filter by Tamil name, transliteration, Arabic name or number.
- Juz/Page modes: explanatory empty state, **no fabricated divisions**.
- Tapping a row → `SurahReader` with `surahId`.
- Empty search → "முடிவுகள் இல்லை" state.

### Constraints

- Do not add surahs from memory.
- Do not show a fake 114 count.

---

## 3. Surah reader

**File:** `src/features/quran/SurahReaderScreen.tsx`
**Route:** `SurahReader { surahId }`

### Header

- Back, `"{id}. {Tamil name}"`, `"{ayahCount} வசனங்கள் · {Meccan|Medinan}"`.
- Right: bookmark toggle for the active ayah, appearance shortcut.

### Body

1. Reading-mode segmented control: both / Arabic / Tamil.
2. Three sample ayahs for the selected surah **[MOCK]**.
3. Each `AyahCard`:
   - ayah number medallion,
   - Arabic text (Amiri, user size, RTL),
   - Tamil text (Noto Sans Tamil, user size),
   - sample badge when `isPlaceholder`,
   - actions: play (visual), bookmark, copy/share (visual).
4. Active ayah is highlighted when the audio dock targets it.

### Audio dock (visual only)

- Fixed at the bottom above the safe area.
- Shows current surah + selected reciter.
- Previous / play-pause / next controls update local component state.
- Explicitly states audio is not connected.
- **[NOT IMPLEMENTED]** No sound, no streaming, no downloads.

### Behaviour

- Reading mode changes propagate from `PreferencesProvider` immediately.
- Bookmark toggles write to in-memory state and appear in Bookmarks.
- Unknown `surahId` falls back to the first surah rather than crashing.

### QA notes

- Arabic must be right-aligned and not clipped at 46sp.
- Long Tamil lines must wrap with the token line height.
- Dock must not cover the last ayah; add bottom padding.

---

## 4. Search

**File:** `src/features/search/SearchScreen.tsx`
**Route:** `Search`

### Layout

- Header "தேடல்", subtitle "அத்தியாயம் மற்றும் வசன எண்".
- Search field with clear action.
- Result rows opening the Reader.
- Empty prompt before typing; no-result state after typing.

### Behaviour

- Matches surah metadata only (name, transliteration, number).
- **[NOT IMPLEMENTED]** Full-text ayah search; it would be misleading while the
  text is placeholder.
- No search history, no debounce needed at this dataset size.

---

## 5. Bookmarks

**File:** `src/features/bookmarks/BookmarksScreen.tsx`
**Route:** `Bookmarks`

### Layout

- Header with count of saved places.
- Cards: surah name, ayah number, note (if any), added label, remove action.
- Empty state with explanation.

### Behaviour

- Reads/writes `PreferencesProvider.bookmarks`.
- Remove is immediate and destructive without confirmation (acceptable for
  in-memory data; revisit when persisted).
- Tapping a card opens the Reader.
- **[NOT IMPLEMENTED]** Persistence, folders, notes editing, sync.

### QA notes

- Initial mock bookmarks must be clearly sample data.
- Empty state must mention that bookmarks reset when the app closes.

---

## 6. Prayer Times (`Prayer` tab)

**File:** `src/features/prayer/PrayerTimesScreen.tsx`
**Route:** `Prayer` — **must remain separate from Qibla.**

### Layout

1. Green header: location (Tamil + Latin), district, date, timezone.
2. "Today" card: five prayers with icons, times, and next-prayer emphasis.
3. Next-prayer countdown / progress treatment **[MOCK]**.
4. Tomorrow preview.
5. Monthly table: day, weekday, fajr, dhuhr, asr, maghrib, isha.
6. Calculation-method note and notification placeholder.
7. Qibla shortcut (navigates to the separate Qibla screen).

### Behaviour

- All times are illustrative strings from `src/data/mock/prayerTimes.ts`.
- No location permission, no API, no calculation, no notifications.
- The notification card is a **disabled preview**: the switch is off and
  non-interactive, and the copy states that sound, alarms and battery
  permissions are not connected. Do not re-enable it until notifications exist.
- Monthly table is horizontally safe at 320 dp (compact columns).

### QA notes

- Must state that timings are sample values not valid for prayer.
- Time formatting should stay 12-hour as in the mockups unless the owner asks
  otherwise.
- Do not claim a calculation method was applied.

---

## 7. Qibla

**File:** `src/features/qibla/QiblaScreen.tsx`
**Route:** `Qibla` — separate screen, reached from Home and Prayer.

### Layout

1. Header "கிப்லா திசை", subtitle "மக்கா நோக்கிய திசை".
2. Large drawn compass (`Compass` component) with cardinal marks and needle.
3. Bearing readout (sample `294.4°` for Colachel).
4. Instruction card: face the direction, calibrate, avoid metal.
5. Explicit caveat: live compass/location not connected; bearing is illustrative.

### Behaviour

- Static needle rotation from mock data.
- **[NOT IMPLEMENTED]** `expo-location`, `expo-sensors`, permission flow, true
  bearing calculation, calibration state.

### QA notes

- Compass must scale down on small screens without clipping labels.
- Text must not imply the needle tracks the device.

---

## 8. Reciter picker

**File:** `src/features/audio/ReciterPickerScreen.tsx`
**Route:** `ReciterPicker`

### Layout

- Header "ஓதுபவர் தேர்வு", subtitle "வசன வாரியான ஒலி".
- List of seven reciters with name and style.
- Selected row marked with a check.
- Every row shows "ஒலி இன்னும் இணைக்கப்படவில்லை" / unavailable status.

### Behaviour

- Selection updates `reciterId` in memory; reader dock reflects it.
- No audio, URLs, downloads or autoplay.
- Reciter names are public metadata only; no endorsement implied.

---

## 9. Settings (`Settings` tab)

**File:** `src/features/settings/SettingsScreen.tsx`

### Layout

- Profile/status card explaining the prototype state.
- **Reading group:** Appearance & theme; Font & reading.
- **Preferences group:** Language (Tamil primary), Reciter.
- **Prayer group:** Prayer times, notifications (placeholder).
- **About group:** About, reset preferences.
- Footer: version, "no backend connected" note.

### Behaviour

- Appearance → `Appearance`; Reciter → `ReciterPicker`; About → `About`.
- Reset restores theme/fonts/mode/reciter/initial bookmarks.
- Notification row must not toggle anything real; label it as pending.
- **[NOT IMPLEMENTED]** Language switching, accounts, storage, sync.

---

## 10. Appearance

**File:** `src/features/settings/AppearanceScreen.tsx`
**Route:** `Appearance`

### Layout

1. Header "தோற்றம் & வாசிப்பு", subtitle "மாற்றங்கள் உடனடியாகத் தெரியும்".
2. Theme section: system / light / dark.
3. Arabic font size: minus/plus controls, 22–46, current value.
4. Tamil font size: minus/plus controls, 13–26.
5. Reading mode: both / Arabic / Tamil.
6. Live preview card using current settings.
7. Note that settings reset on restart.

### Behaviour

- All controls write to `PreferencesProvider`; changes are instant.
- Values are clamped at the provider level, not just in the UI.
- **[NOT IMPLEMENTED]** Persistence, per-surah overrides, font family choice.

### QA notes

- Preview must handle the largest Arabic size without overflow.
- Dark mode contrast of the preview surface must be checked.

---

## 11. About

**File:** `src/features/about/AboutScreen.tsx`
**Route:** `About`

### Layout

- App identity block (Arabic/Tamil/Latin names, version).
- Milestone statement: UI foundation, no backend/audio/AI.
- Status list: what works / what is mocked / what is blocked.
- Rights section: app licence undecided; fonts are third-party; Quran text,
  translation and audio are separate, unresolved rights.
- No repository link, no invented publisher, no "open source" claim.

### Behaviour

- Static content.
- **[NOT IMPLEMENTED]** Acknowledgements list for future licensed sources; it
  must be added when those sources are chosen.

---

## 12. Empty, error and loading states

| Situation | Required treatment |
|---|---|
| Fonts loading | Branded splash with spinner |
| No search results | Icon + "முடிவுகள் இல்லை" + suggestion |
| No bookmarks | Icon + explanation that bookmarks are session-only |
| Unknown surah id | Fall back to first surah, never crash |
| Juz/Page tabs | Explanatory empty state, no invented data |
| Audio unavailable | Disabled-looking controls + explicit copy |
| Missing network | Not applicable: no network is used |

---

## 13. Accessibility checklist per screen

- Every `IconButton` has a Tamil `label`.
- Text contrast meets WCAG AA for body sizes in both themes.
- Touch targets ≥ 44×44 dp.
- Screen readers announce the sample-data badge near the content it qualifies.
- Scroll containers do not trap focus.
- Arabic content is not read as Tamil by the accessibility layer where it can be
  avoided (separate text nodes).
