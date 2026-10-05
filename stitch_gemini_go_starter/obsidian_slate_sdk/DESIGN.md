---
name: Obsidian Slate SDK
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353d'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.005em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-precision, surgical developer aesthetic engineered specifically for cloud-native Go developers and AI systems architects. Grounded in a minimalist technical dark mode, it merges deep slate foundations with crisp indigo and electric cyan directional accents. 

The visual personality evokes high-density signal clarity, technical command, and micro-engineered interactive efficiency. By replacing soft shadows and heavy blurs with razor-thin structural borders (`1px solid #243247`) and layered opacity steps, the interface simulates hardware-calibrated depth. The aesthetic rejects decorative gradients and playful motifs in favor of terminal discipline, monospace parity, and strict typographic hierarchy.

## Colors

The palette is tuned for high-contrast legible dark environments. 

- **Primary (`#6366f1` / Electric Indigo):** Reserved for primary interactive intents, active stepper rules, button fills, and keyboard focus states.
- **Secondary (`#06b6d4` / Luminous Cyan):** Dedicated to technical prompts (`$`), multimodal streaming badges, and core SDK API interfaces.
- **Tertiary (`#8b5cf6` / Deep Purple):** Denotes advanced runtime features, such as context caching, token savings, and model fine-tuning.
- **Neutral (`#0a0d14` / Deep Obsidian Canvas):** Provides the root application foundation.

Surfaces step cleanly through defined layers:
- Lowest/Canvas: `#0a0d14`
- Elevated Container: `#111724`
- Interactive Hover / Shelf: `#172030`
- Floating Modal / Command Palette: `#1e293d`
- Structural Hairline Borders: `#243247`
- Syntax Highlighting Palette: Emerald `#10b981` (strings, 200 OK), Rose `#f43f5e` (keywords, fatal errors), Sky `#38bdf8` (types, interfaces), Indigo `#818cf8` (invocations), and Amber `#f59e0b` (numbers, warnings).

## Typography

Typography pairs the neutral, architectural precision of **Geist** with the tabular discipline of **JetBrains Mono**. 

Monospace typography acts as a structural peer rather than an afterthought. Method prototypes (`genai.NewClient`), terminal flags (`--depth 1`), and uppercase section tags (`SDK REFERENCE`, `STEP 01`) use fixed-width alignments to enforce developer clarity. Proportional line heights maintain dense headlines alongside comfortable reading channels in reference prose. Inline code tags utilize 2px top/bottom and 6px left/right padding inside hairline containers.

## Layout & Spacing

The layout is built upon an asymmetric 3-column fixed/fluid hybrid architecture constrained to an outer maximum width of 1440px:
- **Left Column (260px fixed):** Documentation taxonomy, module tree, and API groups.
- **Center Well (Fluid, max-width 840px):** Quickstart guides, workflow steppers, copyable bash cards, and API references.
- **Right Column (220px fixed):** Scroll-spy Table of Contents, token latency monitors, and context anchors.

Responsive mechanics:
- **Desktop (>= 1280px):** 3-column view with 32px canvas margins (`2rem`) and 24px column gutters (`1.5rem`).
- **Tablet (768px - 1279px):** Table of contents collapses into a top sticky sheet; sidebar turns into an overlay drawer. Center well claims remaining canvas width with 24px margins.
- **Mobile (< 768px):** Single-column fluid stream with 16px margins (`1rem`), sticky step progression, and 44px minimum target areas.

## Elevation & Depth

Visual depth is communicated through tonal surface stepping and low-contrast outlines rather than traditional drop shadows:
- **Base Level:** `#0a0d14` forms the root backdrop.
- **Cards & Code Panes:** Nested with surface `#111724` and bounded by a calibrated hairline border (`1px solid #243247`).
- **Active State Highlights:** Workflow containers feature a 3px vertical accent border (`#6366f1`) and an indigo-tinted surface floor (`#1e1e38`).
- **Interactive Elevations & Overlays:** Hover states, command palettes (`Cmd+K`), and dialogs use `#172030` or `#1e293d` with faint, diffused indigo ambient glow (`0 0 16px rgba(99, 102, 241, 0.12)`) and a frosted backdrop filter (`blur(12px)`).

## Shapes

The interface employs a cohesive soft curvature system. Core panels, terminal preview containers, and interactive step cards use 0.375rem to 0.5rem radii. Buttons, inputs, and inline code badges adhere to 0.25rem (`rounded-xs`), preserving an engineered, technical silhouette. Pill geometry (9999px) is restricted strictly to telemetry badges, version tags (`v0.19.0`), and terminal prompt indicators.

## Components

### Buttons & Quick Actions
- **Primary Action (Run / Install / Authorize):** Solid Electric Indigo fill (`#6366f1`) with inset hairline border (`1px solid rgba(255, 255, 255, 0.15)`), 36px height, 13px SemiBold text, and 0.25rem corner radius. Glows subtly on hover.
- **Secondary Ghost Action:** Background `#111724`, border `1px solid #243247`, text Slate (`#94a3b8`), transitioning to White text with Cyan outline (`rgba(6, 182, 212, 0.4)`) on hover.
- **Copy Utility Button:** Embedded in the top-right of code blocks. Uses `11px` monospace font. When clicked, switches from clipboard icon to an Emerald checkmark with `"Copied!"` for 2000ms.

### Terminal Previews & Bash Snippets
- **Code Terminal:** Header (36px height, background `#0e1420`, bottom border `1px solid #1f2b3e`) contains macOS-style window dots (`#f43f5e`, `#f59e0b`, `#10b981`), file name tab (`main.go`), and embedded copy/run triggers. Code block background is `#080b11` with right-aligned gutter line numbers (`#334155`).
- **Bash Snippet Bar:** Single-line or multi-line container featuring a cyan prompt glyph (`$`), white monospace text, and a right-docked one-click copy button.

### Workflow Stepper Cards
- Container: Background `#111724`, border `1px solid #243247`, 0.5rem radius.
- Header: Left index indicator (e.g., `01`, `02`) encased in an Indigo circular badge, followed by the step title and runtime parameter selector tabs (`Go Get` | `Direct Import` | `Go Module`).
- Content Area: Houses copyable instructions and Go client initialization snippets (`genai.NewClient`).

### Form Inputs & Search Command Bar
- Command palette input and API key fields utilize `#0d121c` with `1px solid #243247`.
- Focus state applies a 2px outer outline in `#6366f1` with 20% opacity.
- API Key inputs use JetBrains Mono font with integrated visibility masking and inline validation pills.

### Chips, Badges & Telemetry
- Modality Badges (Audio, Video, PDF): Background `#0e3142`, text `#06b6d4`, border `1px solid rgba(6, 182, 212, 0.3)`.
- Performance Pill: Bottom terminal shelf showing latency metrics (e.g., `142ms TTFT`, `245 tok/s`) in 11px uppercase monospace.