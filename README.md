# @finografic/lucide-manager

A local developer tool for managing a [Lucide](https://lucide.dev) icon registry in a design system package. Browse all 1500+ Lucide icons in a fast picker UI, select the ones you want, and generate strongly-typed TypeScript registry files from the result.

**This is a `devDependency` — not a runtime library.** It is installed in the host package (e.g. your design system) and launched from there. It is never imported or bundled into production code.

---

## How it works

The host package maintains a single source-of-truth file — `icons.json` — that lists which Lucide icons are in its registry. `lucide-manager` provides two commands that work with that file:

```
icons.json  ──(lucide-manager generate)──▶  icons.ts + index.ts  ──(pnpm build)──▶  dist/
     ▲
lucide-manager dev  (picker UI writes here on every selection)
```

| File             | Managed by                         | Description                                               |
| ---------------- | ---------------------------------- | --------------------------------------------------------- |
| `icons.json`     | You (via the picker UI or by hand) | Source of truth — which icons are included                |
| `icons.ts`       | `lucide-manager generate`          | Icon registry — `ICONS` object, wrapped exports           |
| `index.ts`       | `lucide-manager generate`          | Named exports — `ArrowUpIcon`, `ChevronDownIcon`, etc.    |
| `icons.utils.ts` | You (handwritten, permanent)       | `createIconWrapper` + `IconProps` — **never overwritten** |

---

## Installation

Install as a `devDependency` in your design system package:

```bash
# From your monorepo root, targeting the design system package:
pnpm add --filter @workspace/design-system --save-dev @finografic/lucide-manager

# Or from within the design system package directly:
pnpm add -D @finografic/lucide-manager
```

---

## Configuration

### 1. Create `lucide-manager.config.json`

Place this file in your **host package root** (alongside its `package.json`):

```json
{
  "iconsJsonPath": "./src/icons/icons.json",
  "iconsDir": "./src/icons"
}
```

| Field           | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| `iconsJsonPath` | Path to `icons.json` — the file the picker reads and writes |
| `iconsDir`      | Directory where `icons.ts` and `index.ts` will be generated |

Both paths are relative to the config file's location and resolved to absolute paths at runtime.

### 2. Add scripts to `package.json`

```json
{
  "scripts": {
    "icons": "lucide-manager dev",
    "generate:icons": "lucide-manager generate"
  }
}
```

You can name these scripts whatever you prefer — the above is the recommended convention.

### 3. Seed `icons.json`

Create the initial `icons.json` in the directory specified by `iconsJsonPath`. The shape is an array of entries:

```json
[
  { "lucideName": "arrow-up", "exportName": "ArrowUp" },
  { "lucideName": "chevron-down", "exportName": "ChevronDown" },
  { "lucideName": "x", "exportName": "Close" }
]
```

| Field        | Description                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lucideName` | Kebab-case name as Lucide uses it (e.g. `"arrow-up"`)                                                                                                                                                         |
| `exportName` | PascalCase name without the `Icon` suffix (e.g. `"ArrowUp"`). Normally derived automatically from `lucideName`, but can be overridden — useful when you want a semantic name like `"Close"` instead of `"X"`. |

### 4. Ensure `icons.utils.ts` exists

The `generate` command writes `icons.ts` and `index.ts`, which import from `./icons.utils`. That file is **not generated** — it must exist in `iconsDir` before you run `generate` for the first time.

`icons.utils.ts` must export:

- `IconProps` — the SVG prop type used by all icon components
- `createIconWrapper(IconComponent, exportName)` — wraps a Lucide component with a stable `.icon` class, `data-icon-name` attribute, `displayName`, and forwarded ref

See the [reference implementation](./.claude/assets/icons.utils.ts) for the expected interface.

---

## Usage

All commands are run from the **host package root** (the directory containing `lucide-manager.config.json`).

### Open the icon picker

```bash
pnpm icons
# → opens http://localhost:5199
```

The picker fetches all Lucide icon metadata from the public Lucide API on startup (cached for 24 hours). Browse by category, search by name, and click any icon to open its detail panel. Use the **Add / Remove** button to toggle it in or out of your registry.

Selections are saved automatically to `icons.json` as you click — no manual save step.

### Generate the TypeScript registry

```bash
pnpm generate:icons
```

Reads `icons.json` and writes two files into `iconsDir`:

- **`icons.ts`** — the `ICONS` map, auto-wrapped exports, `icons` object, `IconName` type, `ICON_NAMES` array, `IconComponent` type
- **`index.ts`** — named exports (`ArrowUpIcon`, `ChevronDownIcon`, …), plus re-exports of `icons`, `ICON_NAMES`, `IconName`, `IconProps`, `createIconWrapper`

These are generated artifacts. Commit them (for readability and to avoid requiring codegen in CI), but never edit them by hand.

### Typical workflow

```bash
# 1. Open the picker and make your selections
pnpm icons

# 2. After closing, regenerate the registry files
pnpm generate:icons

# 3. Rebuild the design system
pnpm build
```

---

## Generated file format

### `icons.ts` (example with 3 icons)

```ts
/**
 * Icon Registry — @workspace/design-system
 *
 * !! GENERATED FILE — do not edit by hand.
 * !! Edit icons.json via the lucide-manager picker, then run: lucide-manager generate
 */

import * as Lucide from 'lucide-react';
import { createIconWrapper } from './icons.utils';

const ICONS = {
  ArrowUpIcon: Lucide.ArrowUp,
  CloseIcon: Lucide.X,
  ChevronDownIcon: Lucide.ChevronDown,
} as const;

// ... wrapped exports, public API
export const icons = wrappedIcons;
export type IconName = keyof typeof ICONS;
export const ICON_NAMES = (Object.keys(ICONS) as IconName[]).sort();
export type IconComponent = ReturnType<typeof createIconWrapper>;
```

### `index.ts` (named exports)

```ts
export type { IconComponent, IconName } from './icons';
export { ICON_NAMES, icons } from './icons';

export const { ArrowUpIcon, ChevronDownIcon, CloseIcon } = icons;

export type { IconProps } from './icons.utils';
export { createIconWrapper } from './icons.utils';
```

---

## Development

These instructions are for working on `lucide-manager` itself.

### Setup

```bash
# Clone and install dependencies (sets up git hooks automatically)
pnpm install
```

### Run the picker in self-dev mode

```bash
pnpm dev
```

When run from this package's own root, `lucide-manager` detects that it is operating on itself and uses fixed local test paths instead of looking for a `lucide-manager.config.json`:

|                  | Self-dev path    |
| ---------------- | ---------------- |
| Icons JSON       | `dev/icons.json` |
| Icons output dir | `dev/`           |

Both are gitignored. On first run, `dev/` is created automatically and `dev/icons.json` is seeded from the root `icons.json`.

### Other scripts

```bash
pnpm typecheck       # TypeScript type check (no emit)
pnpm lint            # ESLint
pnpm lint.fix        # ESLint with auto-fix
pnpm format          # dprint format check (with diff)
pnpm format.check    # dprint format check (CI-safe)
pnpm test.run        # Run tests once
pnpm test            # Run tests in watch mode
```

### Project structure

```
bin/
  lucide-manager.js       CLI shim — dev → vite, generate → tsx
scripts/
  generate-icons-ts.ts    Reads icons.json, writes icons.ts + index.ts
src/
  config/
    colors.ts             All UI color tokens (single source of truth)
    defaults.ts           Config filename, self-dev paths, server defaults
    loadConfig.ts         Mode-aware config resolver (self-dev vs. installed)
  components/
    CategorySidebar.tsx   Left sidebar with category filter
    IconCard.tsx          Single icon cell in the grid
    IconDetail.tsx        Bottom detail panel (add/remove/rename)
    IconSvg.tsx           Renders icons from SVG node trees (no React imports)
  hooks/
    useIconsJson.ts       Manages local icons.json state via /api/icons-json
    useLucideData.ts      Fetches icon metadata from the Lucide public API
  server/
    plugin.ts             Vite plugin — GET/POST /api/icons-json
  App.tsx                 Main application shell
  main.tsx                React entry point
icons.json                Seed file used to populate dev/ on first self-dev run
index.html                Vite entry point
vite.config.ts            Vite config (port 5199)
```

---

## License

MIT © [Justin Rankin](https://github.com/finografic)
