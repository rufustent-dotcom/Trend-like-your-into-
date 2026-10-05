---
name: Autonomous Kinetic Command
colors:
  surface: '#111418'
  surface-dim: '#111418'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e12'
  surface-container-low: '#191c20'
  surface-container: '#1d2024'
  surface-container-high: '#272a2f'
  surface-container-highest: '#32353a'
  on-surface: '#e1e2e8'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e2e8'
  inverse-on-surface: '#2e3135'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffd799'
  on-secondary: '#432c00'
  secondary-container: '#feb300'
  on-secondary-container: '#6a4800'
  tertiary: '#dbffde'
  on-tertiary: '#003918'
  tertiary-container: '#34f885'
  on-tertiary-container: '#006e35'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#ffba38'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#62ff96'
  tertiary-fixed-dim: '#00e475'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#111418'
  on-background: '#e1e2e8'
  surface-variant: '#32353a'
typography:
  display-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets autonomous systems engineers, mission directors, and mission-critical fleet operators orchestrating distributed agent networks. The aesthetic balances deep-space operational command with military-grade precision engineering.

Visual principles:
- **Absolute Instrumental Precision:** Zero gratuitous decoration. Every line, badge, and border corresponds to a hardware state, guardrail limit, or policy boundary.
- **Deep Obsidian Immersion:** A pitch-black foundation that eliminates eye fatigue during continuous control cycles while framing telemetry like luminous instruments.
- **High-Acuity Signaling:** Active system states emit crisp, high-frequency electric cyan, while policy guardrails, warning limits, and awakening thresholds strike in controlled amber luminescence.
- **Structural Integrity:** Heavy reliance on monospaced spatial alignment, technical borders, hairline division metrics, and diagnostic status matrices.

## Colors

The chromatic structure utilizes deep obsidian neutrals punctured by selective, saturated electroluminescent accents.

### Palette Architecture
- **Primary (`#00F0FF` - Electric Cyan):** Active execution pathways, autonomous agent nodes, active command signals, and focused telemetry streams.
- **Secondary (`#FFB300` - Radiant Amber):** Policy boundaries, threshold warnings, human-in-the-loop triggers, manual overrides, and awakening criteria.
- **Tertiary (`#00E676` - Kinetic Mint):** Operational nominal state, verified consensus, and validated safety invariants.
- **Destructive/Critical (`#FF3838` - Crimson Interlock):** Autonomous emergency disengagement, hard limit violations, and system failure.
- **Neutral Core (`#080B0F` - Deep Obsidian):** 
  - `surface-0` (`#040608`): Deep canvas void.
  - `surface-1` (`#080B0F`): Base panel backdrop.
  - `surface-2` (`#10151C`): Telemetry modules and cards.
  - `surface-3` (`#171F2A`): Hover states, active inputs, and elevated inspection HUDs.
  - `border-dim` (`#1E293B`): Hairline boundary definition.
  - `border-bright` (`#334155`): Focus and active state structural definition.
  - `text-primary` (`#F1F5F9`): Uncompromising legibility for telemetry values.
  - `text-muted` (`#64748B`): Secondary parameters, units, and structural metadata.

## Typography

The design system enforces complete monospaced typography using **JetBrains Mono** across all typographic levels. This guarantees tabular number alignment, character-cell horizontal rhythm, and an unapologetically technical telemetry profile.

- **Capitalization Rule:** All `label-*` and status metadata elements must render in full uppercase (`text-transform: uppercase`) with widened tracking (`0.08em` to `0.12em`).
- **Data Densities:** Numerical readouts, coordinates, and thresholds utilize tabular figures (`font-variant-numeric: tabular-nums`) by default.
- **Hierarchy:** Primary emphasis is achieved via weight differentiation (`700` vs `400`) and luminescence shifts rather than exaggerated font size variations.

## Layout & Spacing

The architecture operates on a high-density, multi-pane operational layout anchored to a strict 4px/8px modular grid.

### Layout Model
- **Command Matrix (Desktop):** Dynamic 12-column grid or dense split-pane dock system with 12px (`0.75rem`) gutters. Layout is calculated to maximize simultaneously viewable telemetry feeds without vertical scrolling.
- **Telemetry Shell (Tablet/Mobile):** Stacks down to a single-column diagnostic stream. Edge margins adjust to `0.75rem`, prioritizing data card perimeter lines over whitespace.
- **Rhythm Rules:** Vertical spacing between data cells is clamped strictly to `space-xs` (4px) or `space-sm` (8px) within cards, and `space-md` (12px) between card modules.

## Elevation & Depth

Visual hierarchy is enforced exclusively through **low-contrast precision borders** and **monochrome tonal stacking**, avoiding organic drop shadows.

- **Tonal Layers:**
  - Base Deck: `#040608`
  - System Panels: `#080B0F` framed with 1px solid `#1E293B`
  - Floating Telemetry & Overlays: `#10151C` with 1px solid `#334155`
- **Electroluminescent Edge Highlights:** Selected, hovered, or critical nodes replace the perimeter border with a 1px crisp outline in Electric Cyan (`#00F0FF`) or Radiant Amber (`#FFB300`), backed by an ultra-subtle, non-diffuse 2px colored inner stroke (`box-shadow: inset 0 0 0 1px ...`).
- **Interlock Modals:** Overlays cast no blurred ambient drop shadow; instead, they sit atop a semi-opaque background scrim (`rgba(4, 6, 8, 0.85)`) coupled with a solid 1px active status perimeter.

## Shapes

The shape system adopts a strict **Sharp (`0`)** profile with zero border-radius across all interactive components, cards, inputs, and badges.

- **Hard-Edged Industrial Aesthetics:** All rectangles, buttons, and telemetry matrices possess absolute `0px` corners.
- **Technical Chamfers (Optional Utility):** For primary triggers or awakening interlocks, clipped 45-degree chamfered corners (using `clip-path: polygon(...)`) may be used to reinforce defense/aerospace avionics styling.

## Components

### Telemetry Cards
- **Base:** Background `#080B0F`, border 1px solid `#1E293B`, padding `space-md`.
- **Card Header:** Monospace label (`label-xs`) in `#64748B`, uppercase, paired with a small 6x6px coordinate grid symbol or status beacon. Top edge carries an optional 2px primary/secondary accent runner indicating execution mode.
- **Data Display:** Numerical values render in `headline-md` or `headline-lg` in `#F1F5F9`, right-aligned alongside fixed-width metric units (e.g., `M/S²`, `HZ`, `RAD`).

### Action Buttons & Interlocks
- **Primary Command:** Solid electric cyan (`#00F0FF`) background with pitch-black (`#040608`) bold text. Hover shifts to `#80F7FF`.
- **Guardrail / Threshold (Amber):** Border 1px solid `#FFB300`, transparent background, amber text. Hover fills to `#FFB300` with obsidian text.
- **Emergency Abort:** Red alert background (`#FF3838`) with hairline black hatched striping on the active border.
- **Padding:** 0.5rem 1rem for standard, 0.25rem 0.5rem for compact telemetry headers. All caps.

### Status Badges
- **Structure:** 1px border, 0px radius, padding 2px 6px.
- **Indicators:** Leading 4x4px square indicator with blinking animation support for streaming states:
  - *Nominal Fleet:* Border `#00E676`, background `rgba(0, 230, 118, 0.08)`, text `#00E676`.
  - *Awakening Policy:* Border `#FFB300`, background `rgba(255, 179, 0, 0.08)`, text `#FFB300`.
  - *Locked Interlock:* Border `#64748B`, text `#94A3B8`.

### Checkboxes & Binary Selectors
- **Checkbox:** 12x12px square box, 1px border `#334155`. Checked state fills `#00F0FF` with a central black diamond or inset square.
- **Toggle Switches:** Sharp rectangular track (28x14px), 1px border `#1E293B`, rectangular thumb (10x10px) that shifts from muted gray (`#475569`) to glowing cyan (`#00F0FF`) on positive autonomous engagement.

### Input Fields & Parameter Steppers
- **Base:** Obsidian field (`#040608`), 1px outline `#1E293B`, monospace font (`body-md`).
- **Focus:** Sharp 1px outline `#00F0FF` without glow. 
- **Inline Prefixes:** Embedded hardware identifiers (e.g., `SYS://`, `THOLD>`) rendered in `#64748B` within the field box.

### Telemetry Sparklines & Guardrail Gauges
- **Linear Gauges:** 4px tall tracks in `#171F2A` with segmented block indicators. Amber threshold brackets visibly pin minimum and maximum allowable operational variances.