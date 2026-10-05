---
name: Obsidian Prism
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
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
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets systems engineers, backend developers, and AI researchers working with the Google Gemini API in Go. The aesthetic blends the mechanical precision of developer CLI environments with the refined minimalism of modern technical documentation platforms like Linear and Stripe Docs. 

The emotional tone conveys absolute technical authority, computational speed, and low cognitive friction. Visual composition relies on structured grid alignment, deliberate depth through tonal layering, crisp borders, and subtle luminous gradients evoking generative intelligence without distraction. 

Key attributes:
- **Architectural Minimalism:** Functional density with generous breathing room around complex data.
- **Luminous Precision:** Monochromatic dark foundations highlighted by directional ambient glows and electric cyan-to-violet gradients.
- **Code-First Legibility:** Code, tokens, and schemas are first-class design elements, not secondary embeds.

## Colors

The palette establishes an obsidian-slate environment optimized for long-duration reading and terminal integration. Surface hierarchy relies on calibrated dark neutrals rather than pure black, ensuring accessible contrast against subtle borders and glow artifacts.

### Surfaces & Neutrals
- **Canvas Base:** `#0B0F17` (Deep Obsidian) — Ground-level workspace and application canvas.
- **Surface Elevation 1:** `#111827` (Card & Sidebar Surface) — Structural containers, sidebars, and sub-panels.
- **Surface Elevation 2:** `#1E293B` (Dropdowns, Dialogs, Popovers) — Raised interactive layers.
- **Surface Elevation 3:** `#0F172A` (Code Editor Canvas) — Dedicated code block background with maximum contrast.
- **Border Default:** `#1F2937` — Structural partition lines, table boundaries.
- **Border Active/Hover:** `#374151` — Focused boundaries and interactive component rings.

### Accents & Intelligence Signifiers
- **Primary Accent:** `#3B82F6` (Gemini Blue) — Focus rings, primary triggers, active navigation items.
- **Secondary Accent:** `#06B6D4` (Electric Cyan) — Execution indicators, network streams, token meters.
- **Tertiary Accent:** `#8B5CF6` (Prism Violet) — AI-generated outputs, streaming token markers, gradient endpoints.
- **Gradient Linear Engine:** `linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #8B5CF6 100%)` used for key active states, brand headers, and progress rails.

### Syntax Palette
- **Keywords & Types:** `#F59E0B` (Amber 500)
- **Functions & Structs:** `#38BDF8` (Sky 400)
- **Strings & Payloads:** `#10B981` (Emerald 500)
- **Comments & Annotations:** `#64748B` (Slate 500)
- **Constants & Operators:** `#F43F5E` (Rose 500)

## Typography

Typography prioritizes fast scanning, technical parsing, and zero horizontal drift. Geist handles all prose, marketing copy, and structural documentation. JetBrains Mono handles all Go signatures, terminal examples, inline API variables, badges, and numeric data tables.

- Headings use tightened letter spacing (`-0.01em` to `-0.03em`) to maintain rigidity on large displays.
- Body text utilizes relaxed line-heights (1.6x) to avoid visual fatigue during lengthy technical deep-dives.
- Monospace snippets inline with regular text maintain identical vertical height to prevent paragraph jitter: `font-size: 0.9em; vertical-align: baseline`.

## Layout & Spacing

The layout uses a multi-pane split view typical of advanced developer documentation:
- **Left Panel (Navigation):** Fixed width (260px) containing hierarchical API navigation and endpoint trees.
- **Center Canvas (Prose & Guides):** Max-width 780px, retaining readable line lengths.
- **Right Panel (Interactive Playground & Code Examples):** Fluid width (min 420px, max 640px) displaying executable Go snippets, curl outputs, and parameter payloads side-by-side.

### Breakpoints & Adaptive Strategy
- **Desktop (>= 1280px):** Full three-column layout. Navigation, content, and interactive code view simultaneously visible.
- **Tablet (768px - 1279px):** Two-column layout. Code block collapses directly underneath the explanatory body text; navigation switches to a collapsible drawer.
- **Mobile (< 768px):** Single-column stacked stream. Margins compress to `margin-sm` (`1rem`). Code previews feature horizontal scrolling with pinned tab controls.

## Elevation & Depth

This system intentionally eliminates traditional diffuse drop shadows. Depth is achieved via **low-contrast outlines** paired with subtle **tonal layering** and **luminous edge backlights**.

- **Level 0 (Canvas):** Pure `#0B0F17` base.
- **Level 1 (Panels & Structural Groups):** `#111827` surface with a continuous `1px` border of `#1F2937`.
- **Level 2 (Floating Popovers, Command Palettes):** `#1E293B` surface, `1px` border of `#374151`, complemented by a focused glow: `0 0 0 1px rgba(59, 130, 246, 0.1), 0 12px 32px -8px rgba(0, 0, 0, 0.6)`.
- **AI Focus & Active Cards:** When an API route is invoked or an interactive prompt is processing, cards gain a localized linear top-border accent using a `1px` gradient (`#3B82F6` to `#06B6D4`) without heavy outer diffusion.

## Shapes

The design system enforces a disciplined, compact shape language (`roundedness: 1`). Subtly rounded geometry communicates a sharp, engineering-grade instrument:

- Standard controls, inputs, and inline code tags use `0.25rem` (4px).
- Cards, code editor containers, and modal dialogs use `0.5rem` (8px).
- Status pips and model architecture pills use fully circular profiles (`rounded-full` / 9999px) strictly for high-contrast tag identification.

## Components

### Buttons
- **Primary:** Solid `#3B82F6` background, `#FFFFFF` text, `font-family: Geist`, weight 500. Subdued blue edge highlight on hover, transitioning to `#2563EB`. Active state scales down to `0.98`.
- **Secondary / Ghost:** Transparent background, `#111827` base, bordered by `#1F2937`. Text in `#E2E8F0`. Hover state elevates border to `#374151` and background to `#1E293B`.
- **Icon / Copy Action:** Frameless buttons embedded inside code headers with `JetBrains Mono` tooltips. On copy, switches dynamically from clipboard outline to an `#10B981` check icon.

### Code Blocks & Tabbed Snippets
- Enclosed in `#0F172A` with a `#1F2937` perimeter.
- Pinned header bar featuring the Go package signature (`package main`), language switcher tab, execution time counter, and a "Run in Go Playground" action.
- Line numbers rendered in `#475569`, non-selectable via CSS.

### Inputs & Command Bars (Cmd+K)
- Darkened `#0B0F17` interior with inset `1px` border in `#1F2937`. Focus shifts border to `#3B82F6` with an immediate `0 0 0 1px #3B82F6` ring.
- Monospace keyboard shortcut indicators (`Ctrl`, `⌘K`) rendered in pill badges with `#1F2937` backgrounds and `#94A3B8` labels.

### Chips & Badges
- **HTTP Methods:** Compact monospace badges. `GET` in `#06B6D4` (muted background, solid text), `POST` in `#3B82F6`, `DELETE` in `#F43F5E`.
- **Go Types & Interfaces:** `JetBrains Mono`, `0.75rem`, background `#1E293B`, foreground `#93C5FD`, border `#1F2937`.

### Parameter Lists & API References
- Alternating subtle rows without full heavy table grids. Left column pins the Go parameter name (e.g., `ctx context.Context`, `req *genai.GenerateContentRequest`) in bold monospace; right column renders Markdown explanation and default values.