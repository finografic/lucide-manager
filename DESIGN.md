---
version: alpha
name: "@finografic/lucide-manager"
source-of-truth: design-system
colors:
  sidebar-ring: oklch(0.709 0.01 56.259)
  sidebar-border: oklch(0.923 0.003 48.717)
  sidebar-accent-foreground: oklch(0.216 0.006 56.043)
  sidebar-accent: oklch(0.97 0.001 106.424)
  sidebar-primary-foreground: oklch(0.986 0.031 120.757)
  sidebar-primary: oklch(0.648 0.2 131.684)
  sidebar-foreground: oklch(0.147 0.004 49.25)
  sidebar: oklch(0.985 0.001 106.423)
  chart-5: oklch(0.448 0.119 151.328)
  chart-4: oklch(0.527 0.154 150.069)
  chart-3: oklch(0.627 0.194 149.214)
  chart-2: oklch(0.723 0.219 149.579)
  chart-1: oklch(0.871 0.15 154.449)
  ring: oklch(0.709 0.01 56.259)
  input: oklch(0.923 0.003 48.717)
  border: oklch(0.923 0.003 48.717)
  destructive: oklch(0.577 0.245 27.325)
  accent-foreground: oklch(0.216 0.006 56.043)
  accent: oklch(0.97 0.001 106.424)
  muted-foreground: oklch(0.553 0.013 58.071)
  muted: oklch(0.97 0.001 106.424)
  secondary-foreground: oklch(0.21 0.006 285.885)
  secondary: oklch(0.967 0.001 286.375)
  primary-foreground: oklch(0.405 0.101 131.063)
  primary: oklch(0.841 0.238 128.85)
  popover-foreground: oklch(0.147 0.004 49.25)
  popover: oklch(1 0 0)
  card-foreground: oklch(0.147 0.004 49.25)
  card: oklch(1 0 0)
  foreground: oklch(0.147 0.004 49.25)
  background: oklch(1 0 0)
typography:
  text-caption:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: 0.625rem
    lineHeight: "1.2"
  text-xs:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: 0.75rem
  text-sm:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: 0.875rem
  text-base:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: 1rem
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
  2xl: 1.125rem
  3xl: 1.375rem
  4xl: 1.625rem
spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "6": 1.5rem
  "1.5": 0.375rem
  "2.5": 0.625rem
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.lg}"
    height: 2rem
    padding: 0.625rem
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.lg}"
    height: 2rem
    padding: 0.625rem
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.lg}"
    height: 2rem
    padding: 0.625rem
  button-destructive:
    textColor: "{colors.destructive}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.lg}"
    height: 2rem
    padding: 0.625rem
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.text-xs}"
    rounded: "{rounded.md}"
    height: 1.75rem
    padding: 0.625rem
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: 1.5rem
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.lg}"
    height: 2rem
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    typography: "{typography.text-sm}"
---

# Design System

## Overview

Lucide Manager is a local developer tool for curating which Lucide icons are registered in a
design-system icon registry. It is a dense, keyboard-driven workbench, not a marketing surface:
a three-pane layout (category sidebar, icon grid, detail panel) that stays on one screen and
never scrolls the page body.

The personality is **quiet and utilitarian**. Colour is used almost entirely for state and
structure — neutral stone greys carry the interface, and the single acid-lime primary is
reserved for the current selection and the one affirmative action in view. Type is small by
default (14px body) because information density matters more than comfort here; the design
should feel closer to an IDE panel than to a consumer app.

## Colors

The palette is shadcn/ui's semantic role set on a warm-neutral (stone) base, so tokens name
their **role**, not their hue — `background`, `foreground`, `muted`, `border`, `ring`.

- **Primary** `oklch(0.841 0.238 128.85)`: a high-chroma lime. Deliberately loud and used
  sparingly — the selected icon and the primary action, never as a surface fill for large areas.
  Its companion `primary-foreground` is a dark green rather than white, because white text on
  this lime fails contrast badly.
- **Foreground / muted-foreground**: near-black for primary text, mid-stone for secondary
  labels, icon names, and counts. Two levels only — resist inventing a third grey.
- **Border / input / ring**: one light stone shared by all three, so field outlines, dividers,
  and focus rings read as one system. `ring` is the darker stone so focus stays visible.
- **Destructive**: used as a tinted background (`destructive/10`) with destructive text, not as
  a solid red button — consistent with the tool's quiet register.
- **Chart 1–5** are a green ramp reserved for data visualisation; they are not general-purpose
  accents and must not be used for UI chrome.
- **Sidebar-\*** mirrors the core roles for the navigation pane so it can be themed
  independently of the content area.

## Typography

One family throughout: **Roboto Variable**, loaded locally via `@fontsource-variable/roboto`.
No serif or display face — a second family would break the tool-like register.

The scale is four steps and no more: Tailwind's three defaults, plus one extra step **below**
`text-xs` for the density this tool needs.

| Token          | Size            | Used for                                               |
| -------------- | --------------- | ------------------------------------------------------ |
| `text-base`    | 1rem (16px)     | Detail-panel prose; the largest text on screen         |
| `text-sm`      | 0.875rem (14px) | Default body — lists, descriptions, inputs, buttons    |
| `text-xs`      | 0.75rem (12px)  | Dense chrome: badges, counts, secondary labels         |
| `text-caption` | 0.625rem (10px) | Icon names in the grid, where 12px is too large to fit |

`text-caption` is this project's own step. It exists for a functional reason: the icon grid uses
`88px` cells with truncated captions, and at 12px noticeably more Lucide names truncate.

**Why the other three are declared at Tailwind's own default values:** so the design system states
its full scale and DESIGN.md can mirror it, with no rendering change at all. Redefining them to
_different_ values was considered and rejected — about 110 of the 115 uses of
`text-sm`/`text-xs`/`text-base` are inside the vendored shadcn primitives in
`src/components/ui/`, which `shadcn add` regenerates. Changing what those class names mean would
silently resize every component, now and on every future add.

Weight carries emphasis, not size (`font-medium` on buttons and active nav, 38 uses). Weight is a
separate axis and deliberately not part of these tokens — do not add a step to express emphasis.

## Layout

Three panes at a fixed viewport height (`html, body, #root { height: 100% }`, body
`overflow-hidden`). Only the inner regions scroll, via `ScrollArea`; the page itself never does.

Spacing follows Tailwind's 4px base. Real usage clusters tightly — `1.5` (6px) and `2.5` (10px)
for control-internal gaps, `4` (16px) and `6` (24px) for pane padding and section separation.
The mid-steps exist because the chrome is dense; do not reach for `8` and above inside panes.

Scrollbars are custom and deliberately thin (6px, transparent track, `--border` thumb) so they
recede in a dense layout.

## Elevation & Depth

Depth is expressed with **borders and background steps, not shadows**. Panes are separated by
1px `border` lines; raised surfaces (`popover`, `card`) sit on `card`/`popover` white against
the `background`. Overlays from Radix primitives carry their own shadow — that is the only place
a shadow is appropriate. Do not introduce a shadow scale to express hierarchy.

## Shapes

Radius is the most consistent axis in the codebase and should stay that way.

- `lg` (0.625rem) is the default for interactive surfaces — buttons, inputs, cards in the grid.
  It is the single most-used radius (43 occurrences).
- `md` (0.5rem) for small controls (`sm`/`xs` buttons) so the curve stays proportional to height.
- `xl` (0.875rem) for the largest containers — panels and dialogs.
- `full` for avatars and icon-only pills; `none` only where a surface meets a pane edge.

Note `none` and `full` are Tailwind built-ins rather than tokens in `@theme`; see Source of
Truth for why they are not mirrored above.

## Components

Component tokens above capture the resolved geometry of the primitives in `src/components/ui/`.
They are a description of the intended contract, not a second implementation — the primitives
remain the source for behaviour and variants.

- **Button** — height `2rem` default, `1.75rem` small, radius `lg` (small drops to `md`),
  `label-md` type. Variants change colour only, never geometry. `default` is the lime primary;
  `outline` and `ghost` are the workhorses in this UI.
- **Button (destructive)** — deliberately has **no `backgroundColor` token**. The real surface is
  `destructive` at 10% opacity over the page background, and the spec has no alpha or blend
  concept: recording the base token here would claim destructive text on a solid destructive
  fill, which is a 1:1 contrast failure that does not exist in the product. The tint is a
  property of the implementation, not a token.
- **Card** — the icon grid cell: `card` background, `xl` radius, generous internal padding
  relative to the dense chrome around it.
- **Input** — matches button height exactly (`2rem`) so search and its adjacent buttons align
  on a single row.
- **Sidebar** — its own background/foreground pair so the navigation pane can be tinted
  independently.

## Do's and Don'ts

- **Do** use semantic role tokens (`muted-foreground`, `border`) rather than picking a stone
  value directly. There are only two text greys by design.
- **Do** keep the type scale at three sizes. Use weight, not a new size, for emphasis.
- **Don't** introduce arbitrary Tailwind values for type or radius. `text-[0.8rem]` in the
  button `sm` variant is an existing deviation — it sits between `text-xs` (0.75rem) and
  `text-sm` (0.875rem) and belongs on the scale.
- **Don't** use `chart-*` colours for interface chrome; they are reserved for data.
- **Don't** add a shadow scale. Depth here is borders and background steps.
- **Don't** put white text on `primary`. The lime is bright: `primary-foreground` is a dark
  green for contrast, and pairing it with white fails WCAG AA badly.
- **Do** keep the page body non-scrolling. New panes scroll internally via `ScrollArea`.

## Source of Truth

Tokens are canonical in `src/index.css` (Tailwind v4 `@theme` + the `:root` custom properties it
points at). This file mirrors them for agent consumption — when they disagree, the design system
wins; refresh with `genx design sync --pull`.

These tokens are the **base (light) palette**. The design system also defines a dark palette;
the DESIGN.md schema has no concept of themes, so it is not mirrored here and stays canonical in
the design system. Do not infer that only one palette exists.

`colors` and `rounded` are mirrored from `@theme` and are overwritten on every pull. `typography`,
`spacing`, and `components` are **not** expressed in `@theme` — this project uses Tailwind's
default scales — so they are authored here from observed usage and are preserved across pulls.

Two tokens the interface uses but `@theme` does not define — `rounded.none` and `rounded.full`
(Tailwind built-ins) — are **proposed, not mirrored**: adding them above would register as drift
against the design system on the next `genx design check`. To make them real, add
`--radius-none` and `--radius-full` to `@theme`, then pull.
