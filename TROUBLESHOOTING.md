# Troubleshooting — @finografic/lucide-manager

A log of every real issue hit during integration with the `@workspace/design-system` monorepo, including root cause, where the fix lived, and what changed.

---

## Part 1 — Issues Encountered

---

### Issue 1: `tsx` binary not found when running `lucide-manager generate`

**Versions affected:** `0.2.1`
**Origin:** This package (`@finografic/lucide-manager`)

**Symptom**

```
spawn ENOENT tsx
```

The `generate` command invoked `tsx` directly via its name, assuming it would be on `PATH`. It wasn't.

**Root Cause**

`tsx` was listed as a `devDependency`. When a package is consumed (installed inside another project), only `dependencies` are installed — `devDependencies` are skipped entirely. The binary therefore never existed in any reachable `node_modules/.bin/`.

**Fix — `bin/lucide-manager.js`**

Added a `findBin()` helper that searches multiple candidate locations in order:

1. `pkgRoot/../.bin/<name>` — pnpm stores dependency binaries as siblings of the package, not inside it
2. `pkgRoot/node_modules/.bin/<name>` — own `node_modules` (dev mode)
3. `process.cwd()/node_modules/.bin/<name>` — host package
4. `process.cwd()/../node_modules/.bin/<name>` — workspace root (one level up)
5. `process.cwd()/../../node_modules/.bin/<name>` — workspace root (two levels up)
6. Falls back to bare name (rely on `PATH`)

`tsx` was also moved from `devDependencies` to `dependencies`.

---

### Issue 2: `vite` binary not found when running `lucide-manager dev`

**Versions affected:** `0.2.2`
**Origin:** This package (`@finografic/lucide-manager`)

**Symptom**

```
spawn ENOENT vite
```

Same class of problem as Issue 1, but for `vite`.

**Root Cause**

`vite` was a `devDependency`. Not installed when consumed. The `findBin()` helper added in `0.2.2` couldn't find it because it genuinely didn't exist anywhere in the resolution paths.

**Fix**

Moved `vite` from `devDependencies` to `dependencies` (`0.2.3`). This ensures pnpm installs it alongside the package and places its binary in the sibling `.bin/` directory.

---

### Issue 3: `vite` binary still not found — wrong search path order

**Versions affected:** `0.2.3`
**Origin:** This package (`@finografic/lucide-manager`)

**Symptom**

`findBin('vite')` returned the bare name `"vite"`, which still caused `spawn ENOENT` because `PATH` lookup failed.

**Root Cause**

pnpm's content-addressable store places package dependency binaries at:

```
.pnpm/<pkg>@<version>/node_modules/.bin/
```

This is a _sibling_ directory to the package, not _inside_ it. The original `findBin` candidates started from `pkgRoot/node_modules/.bin/` (inside the package), which is wrong for pnpm.

**Fix — `bin/lucide-manager.js`**

Added `resolve(pkgRoot, '..', '.bin', name)` as the **first candidate** — one level up from `pkgRoot`, which is exactly where pnpm puts sibling bins (`0.2.4`).

---

### Issue 4: Picker showed only 10 icons instead of 77

**Versions affected:** `0.2.4`
**Origin:** This package (`@finografic/lucide-manager`)

**Symptom**

The picker UI launched correctly and reached `localhost:5199`, but showed only ~10 icons in the "Included" column — the seed icons from the package's own `icons.json`, not the host DS's `src/icons/icons.json`.

**Root Cause**

The `dev` command spawns Vite with `cwd: pkgRoot` (required so Vite can find `vite.config.ts`). Inside the Vite process, `process.cwd()` therefore equals `pkgRoot`. `loadConfig()` in `src/config/loadConfig.ts` checks whether `startDir === PKG_ROOT` to decide if it is running in _self-dev mode_. Since `cwd === PKG_ROOT`, self-dev mode was triggered — the config walker never ran, and the package's own seed `icons.json` (10 entries) was used.

**Fix — two files (`0.2.5`)**

1. **`bin/lucide-manager.js`**: Pass the host's real cwd as an env var when spawning Vite:

   ```js
   env: { ...process.env, LUCIDE_MANAGER_HOST_CWD: process.cwd() }
   ```

2. **`src/config/loadConfig.ts`**: Use `LUCIDE_MANAGER_HOST_CWD` as the default `startDir`:

   ```ts
   export function loadConfig(
     startDir: string = process.env['LUCIDE_MANAGER_HOST_CWD'] ?? process.cwd(),
   ): LucideManagerConfig {
   ```

Now even though Vite runs with `cwd = pkgRoot`, `loadConfig()` gets the host's original cwd and correctly walks up to find `lucide-manager.config.json` in the DS package.

---

### Issue 5: TypeScript error in generated `index.ts`

**Versions affected:** `0.2.5` (generate script)
**Origin:** This package (`@finografic/lucide-manager`) — in the generate script template
**Manifested in:** Host DS package — `src/icons/index.ts`

**Symptom**

After running `lucide-manager generate`, the output `index.ts` had a red squiggle on the closing `} = icons` line. Error persisted after saving and restarting the TS server.

**Root Cause**

The generated template used:

```ts
export { ICON_NAMES, icons } from './icons';

export const {
  AddIcon,
  ...
} = icons;
```

`export { icons } from './icons'` is a **re-export** — it does not create a local binding. The `= icons` in the destructuring refers to a name that is not in scope as a local variable. TypeScript correctly flags this.

**Fix — `scripts/generate-icons-ts.ts` template + direct patch to `src/icons/index.ts`**

Added a local import before the re-export:

```ts
import { icons } from './icons';          // local binding for destructuring

export type { IconComponent, IconName } from './icons';
export { ICON_NAMES, icons } from './icons';

export const {
  AddIcon,
  ...
} = icons;
```

Both `import { icons }` (local binding) and `export { icons } from './icons'` (re-export) can coexist in the same file. The import gives the destructuring a resolvable reference; the re-export preserves the public API.

Fixed in the generate script template (`0.3.0`) so all future `lucide-manager generate` runs produce correct output. Also directly patched the already-generated `index.ts` in the host DS to unblock immediately.

---

### Issue 6: CI failure due to stale `pnpm-lock.yaml`

**Origin:** This package's repo CI
**Trigger:** Bumping `tsx` and `vite` from `devDependencies` to `dependencies`

**Root Cause**

`package.json` was updated (dependency section changed) but the corresponding `pnpm-lock.yaml` was not committed in the same change. CI runs with `--frozen-lockfile`, which rejects any mismatch between `package.json` and the lock file.

**Fix**

Run `pnpm install` locally after any `package.json` change to regenerate the lock file, then commit both files together.

---

## Part 2 — Alternative Approaches

The current architecture: a published npm CLI (`lucide-manager dev | generate`) that spins up a full Vite + React dev server in the CLI package's directory, talking to the host via a config file and an env var. It works, but carries real complexity: dep resolution across pnpm's content-addressable store, cwd spoofing, self-dev mode detection, and a full Vite process just to serve a picker UI.

Here are three meaningfully different directions.

---

### Alternative A — Pre-built static bundle, zero runtime deps

**The idea**

Build the picker UI _once_ at publish time (as part of `pnpm run build`), ship the compiled `dist/` folder inside the npm package, and replace the Vite dev server with a tiny Node.js `http.createServer()` in the CLI bin itself.

**How it works**

- `lucide-manager dev` spawns no child process for Vite. The bin reads `lucide-manager.config.json` directly (no cwd tricks needed), starts an `http` server, serves `dist/index.html` + assets as static files, and handles `/api/icons-json` GET/POST inline.
- All server code is in the bin or a sibling `.js` file — no TypeScript compilation at runtime.
- The React app is pre-compiled. `vite`, `tsx`, and `react` become `devDependencies` again (build-time only), dropping to **zero runtime `dependencies`**.

**Tradeoffs**

|   |                                                                                                    |
| - | -------------------------------------------------------------------------------------------------- |
| + | Zero dep resolution headaches — no `findBin()`, no sibling `.bin/` hunting                         |
| + | Instant startup — no Vite bundling or HMR pipeline                                                 |
| + | Smaller install footprint in the host project                                                      |
| + | The picker UI is frozen/stable — no surprise breakage from Vite or React updates in the host       |
| - | Picker UI changes require a new publish (can't hot-reload during development of the picker itself) |
| - | Need to commit `dist/` to the package or build it in CI before publish                             |

**Is Vite necessary?** No — only as a build tool (devDependency). Node's built-in `http` module handles the file server.

---

### Alternative B — Decouple codegen into the DS; picker becomes a standalone web app

**The idea**

Split the two responsibilities into two separate, independently deployable things:

1. **Codegen lives in the DS** — `scripts/generate-icons-ts.ts` moves into `packages/design-system/scripts/` as a plain local script. No external package needed. The DS's `package.json` gains `"icons.generate": "tsx scripts/generate-icons-ts.ts"` directly.

2. **The picker is a hosted web app** — `@finografic/lucide-manager` becomes a deployable web app (GitHub Pages, Vercel, wherever). It reads `icons.json` from a URL you configure (e.g. your raw GitHub file URL or a locally-running file server), lets you edit, and on save POSTs back or exports a downloadable `icons.json` that you drop into the repo.

   Alternatively: the picker runs locally via `lucide-manager dev` but is purely a UI — it writes nothing itself. It emits a JSON payload. A small local file-server script (in the DS) receives that payload and writes to `icons.json`, then triggers regeneration.

**How the handoff works**

```
picker UI (browser)  →  POST /api/save  →  DS local server  →  writes icons.json  →  runs generate script
```

The DS package owns the file write + codegen. The picker owns the visual selection. They talk over a local HTTP handshake.

**Tradeoffs**

|   |                                                                               |
| - | ----------------------------------------------------------------------------- |
| + | Clean separation of concerns — codegen is collocated with the generated files |
| + | Picker can evolve independently of the DS version                             |
| + | Picker could be a hosted app — no CLI install needed at all                   |
| + | DS doesn't depend on an external package for a core build step                |
| - | Two moving parts to keep in sync (picker URL format + DS server format)       |
| - | Slightly more setup for new consumers                                         |

**Is Vite necessary?** Only if the picker stays as a React app. The DS file-server would be plain Node. If the picker becomes a hosted app, Vite is entirely off the consumer's machine.

---

### Alternative C — VS Code Extension with WebView

**The idea**

Ship the icon picker as a VS Code extension. The picker opens as a WebView panel inside the editor. File reads/writes go through the VS Code `workspace.fs` API — no HTTP server, no CLI, no dep resolution.

**How it works**

- User opens the Command Palette: `Lucide Manager: Open Icon Picker`
- Extension reads `lucide-manager.config.json` from the workspace root (or infers the DS package path)
- Opens a WebView panel rendering the same React picker UI (compiled to a static bundle, loaded from the extension's `media/` folder)
- On save, the extension's TypeScript host code writes `icons.json` and optionally runs the generate script via `vscode.tasks.executeTask` or a child process

**Why this makes sense**

You're already in VS Code. The picker becomes a first-class editor feature rather than a terminal command. The VS Code extension model handles file access, no server port needed, and the extension can watch `icons.json` for external changes and reflect them live.

This is the direction Panda Studio is moving — their VS Code extension opens a panel for token browsing and recipe editing. If you plan to integrate Panda Studio, a WebView-based icon picker would feel native alongside it.

**Tradeoffs**

|   |                                                                                            |
| - | ------------------------------------------------------------------------------------------ |
| + | No server, no Vite at runtime, no dep resolution — zero moving parts                       |
| + | Deep editor integration (can open files, jump to usages, etc.)                             |
| + | VS Code handles file permissions and workspace detection                                   |
| + | Consistent with where the ecosystem is heading (Panda Studio, Tailwind IntelliSense, etc.) |
| - | VS Code only — no terminal-only or CI usage                                                |
| - | Extension packaging and Marketplace publishing is its own process                          |
| - | VS Code extension API has a learning curve                                                 |

---

## Vite — Is It Necessary?

Short answer: **No**, not at runtime — and even as a build tool it's replaceable.

Vite is currently used for:

1. **JSX/TSX compilation** of the React picker app
2. **The dev server** (HMR, asset pipeline)
3. **`vite.config.ts`** to load the `iconsJsonPlugin` middleware

All three can be replaced:

| Role            | Alternative                                                     |
| --------------- | --------------------------------------------------------------- |
| JSX compilation | `esbuild` (zero-config, ships with Vite anyway), or `bun build` |
| Dev server      | Node `http` serving a pre-built bundle (Alternative A above)    |
| Config/plugin   | Inline Node.js server code, no framework needed                 |

The simplest upgrade path for this package: build the UI once with `vite build`, ship `dist/`, remove Vite from `dependencies`. Startup time drops from ~1s (Vite cold start) to near-instant.

---

## Does Panda Studio Use Vite?

Yes. Panda Studio (`@pandacss/studio`) is a Vite + React application. When you run `panda studio`, it calls `vite.createServer()` internally — Vite is listed as a direct dependency of `@pandacss/studio`.

**Implication for this monorepo:** if you add Panda Studio to the DS dev workflow, Vite will already be present at the monorepo level (in `node_modules/.bin/vite`). That means the existing `findBin()` approach would find it via the workspace root candidates — and if you adopt Alternative A (pre-built static bundle), Vite's presence is irrelevant at runtime anyway.
