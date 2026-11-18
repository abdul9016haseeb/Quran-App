---
name: Serene Devotional Manuscript
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#414845'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#717975'
  outline-variant: '#c1c8c3'
  surface-tint: '#3f6658'
  primary: '#002218'
  on-primary: '#ffffff'
  primary-container: '#0f382c'
  on-primary-container: '#79a292'
  inverse-primary: '#a6d0be'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#151f1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a3431'
  on-tertiary-container: '#919c98'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecda'
  primary-fixed-dim: '#a6d0be'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#274e41'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#dae5e0'
  tertiary-fixed-dim: '#bec9c4'
  on-tertiary-fixed: '#141d1b'
  on-tertiary-fixed-variant: '#3f4946'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  scripture-arabic:
    fontFamily: Amiri
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 52px
  scripture-tamil:
    fontFamily: Noto Sans Tamil
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes an elevated, reverent sanctuary for sacred reading and reflection on mobile devices. Blending classical manuscript elegance with clean contemporary utility, the interface honors centuries of sacred text traditions while providing effortless mobile ergonomics for modern recitation, study, and daily meditation.

### Brand Personality & Emotional Tone
- **Contemplative & Serene:** Quiet, uncluttered surfaces allowing the sacred word to breathe.
- **Dignified & Scholarly:** Respectful typographic balance across Tamil, Arabic, and Latin scripts.
- **Timeless & Luxurious:** Organic warmth of fine vellum paper paired with deep botanical green and delicate gold illumination.

### Design Movement
**Elevated Editorial Manuscript:** A harmonious marriage between classical literary typography and contemporary touch-first mobile cards. Rather than heavy ornamentation, the system relies on disciplined typographic scale, subtle gold-accented rule lines, delicate inner boundaries, and gentle organic tinting.

## Colors

The palette is rooted in the tranquility of sacred courtyards and classical gilded manuscripts. It avoids stark sterile whites and synthetic blacks in favor of warm, tactile natural tones.

- **Primary (`#0F382C`):** Deep Forest Jade. Used for core brand identity, focused verse containers, primary CTA surfaces, active navigation anchors, and significant headings.
- **Secondary (`#C5A059`):** Burnished Champagne Gold. Serves as illuminated highlights, ayah verse markers, bookmark flourishes, active tab indicators, and gilded framing.
- **Tertiary (`#E8F3EE`):** Soft Mint Wash. Used for secondary active chips, soft audio player backgrounds, subtle tag highlights, and calming structural containers.
- **Neutral (`#1C1917`):** Rich Espresso. The foundational ink tone for high-contrast reading without the eye-straining sharpness of pure black.

### Surface Tiers
- **Canvas / Background:** `#FBF9F5` (Warm Alabaster/Ivory vellum).
- **Surface Container (Base Card):** `#FFFFFF` (Crisp reading card) with a hairline `#EFECE6` perimeter.
- **Surface Container High:** `#F4F0E8` (Muted parchment tint for commentary and translation drawers).

## Typography

The typographic hierarchy accommodates a tri-script editorial workflow with distinct responsibilities:
- **Headlines & Surah Names:** `EB Garamond` conveys classical prestige, poetic pacing, and warmth.
- **Sacred Arabic Text:** Set in traditional Naskh/Amiri with expansive line-height (`52px`) to accommodate comprehensive diacritics and voweling (Tashkeel).
- **Tamil Translation & Exegesis:** Rendered using clean, highly-legible glyph forms optimized for handheld screen reading without ink bleed or cramped ascenders/descenders.
- **Interface & Metadata:** `Plus Jakarta Sans` provides a clean, welcoming modern counterpoint for search bars, navigation, durations, audio controls, and labels.

## Layout & Spacing

Designed around a mobile-first 4-column viewport expanding into fluid dual-pane layouts on tablet and folding devices:

- **Vertical Rhythm:** Built strictly on an 8pt base grid for component alignments and 4pt increments for micro-gaps.
- **Reading Margins:** Ayah reading zones feature generous horizontal breathing room (`margin: 1rem`) to keep the eye centered without thumb collision during one-handed operation.
- **Safe Insets:** Screen edges preserve a minimum bottom inset of `space-xl` to prevent sticky audio playback bars from obscuring sacred verses.
- **Responsive Adaptations:**
  - **Phone (< 600px):** Single-column stacked stream: Surah heading -> Arabic Verse -> Tamil translation -> Transliteration.
  - **Tablet (>= 600px):** Split-view manuscript display; left pane maintains Surah index and commentary markers, right pane preserves uninterrupted verse recitation.

## Elevation & Depth

This design system avoids heavy, aggressive drop shadows. Depth is achieved through parchment layering, subtle warm ambient diffusion, and delicate perimeter strokes:

- **Surface Tiers:** Content layers sit on `#FBF9F5`. Individual verses and card groups inhabit clean `#FFFFFF` planes.
- **Ambient Shadow (Card Level):** A warm, extra-diffused tint: `offset: (0, 3)`, `blur: 14px`, `color: rgba(28, 25, 23, 0.04)`.
- **Illuminated Focus:** Selected ayah cards apply an inner hairline border (`1px solid #C5A059`) accompanied by an ethereal gold ambient glow: `offset: (0, 4)`, `blur: 20px`, `color: rgba(197, 160, 89, 0.12)`.
- **Floating Controls (Audio / Reciter bar):** Elevated using a frosted blur backing with `offset: (0, -4)`, `blur: 24px`, `color: rgba(15, 56, 44, 0.08)`.

## Shapes

The design system employs a soft, architectural roundedness (`roundedness: 1`). Corner radii are disciplined and restrained, referencing the crisp geometry of traditional bookbinding:

- **Base Radius (0.25rem / 4px):** Micro badges, verse end symbols, and status indicators.
- **Medium Radius (0.5rem / 8px):** Verse card containers, action buttons, search bars, and bottom sheets.
- **Large Radius (0.75rem / 12px):** Surah header banners, media playback modules, and modal overlays.
- **Ayah Numbering Medallions:** Symmetrical octagonal or soft 8-pointed geometric rosettes, carrying the burnished gold line work.

## Components

### Buttons
- **Primary Action:** Solid `#0F382C` background, `#FFFFFF` text, `rounded-md` (8px). Pressed state shifts to `#0A271F`.
- **Gilded Accent:** Secondary interactive states use a `#C5A059` stroke with soft champagne hover/press tints (`rgba(197, 160, 89, 0.08)`).
- **Text Buttons:** Unbordered rich espresso (`#1C1917`) with `label-md` typographic weighting and 44x44pt minimum touch area.

### Ayah / Verse Card
- **Structure:** Clean white card with `0.5rem` roundedness, delicate inner border (`1px solid #EFECE6`), and `1.25rem` internal padding.
- **Arrangement:** 
  1. Top bar: Hexagonal/octagonal ayah marker in `#C5A059` (left) and recitation bookmark/play action (right).
  2. Main body: RTL Arabic scripture in `scripture-arabic` with right alignment and generous line spacing.
  3. Lower body: LTR Tamil translation in `scripture-tamil` set against a faint `#FBF9F5` tinted sub-container.
- **Active / Reciting State:** Background shifts to `#E8F3EE` (soft mint wash) with a 1px `#0F382C` left border indicator.

### Chips & Filter Pills
- **Inactive:** `#F4F0E8` background with `#1C1917` body text and subtle `#EFECE6` border.
- **Active:** `#0F382C` fill with `#FFFFFF` text and zero border.
- **Juz / Surah Selectors:** Pill-shaped capsules with `label-sm` tracking.

### Audio Recitation Dock
- **Layout:** Floating sticky bar docked at bottom safe area.
- **Styling:** Semi-translucent `#FFFFFF` background with subtle blur, upper border `1px solid #EFECE6`.
- **Controls:** Deep green `#0F382C` circular play button, gold waveform scrubber, and synchronized verse text display.

### Inputs & Search
- **Search Bar:** Height 48px, background `#F4F0E8`, placeholder in muted neutral (`#78716C`), search icon in `#0F382C`.
- **Focus State:** 1px stroke `#0F382C` with no harsh outline glow.