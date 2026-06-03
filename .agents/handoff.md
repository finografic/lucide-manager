# Project — Handoff

> **How to maintain this file**
> Update after sessions that change architecture, add/remove features, resolve open questions, or shift priorities — not every session.
> — Update only the sections that changed. Keep the total under 150 lines.
> — Write in present tense. No code snippets — describe what exists, not how it works.
> — `.agents/memory.md` = chronological working memory / session log. `.agents/handoff.md` = current project state snapshot. See `docs/process/PROJECT_MEMORY_MODEL.md`.

## Project

`@finografic/lucide-manager` is a Vite + React devtool and CLI for browsing Lucide icons and editing a host package’s `icons.json` registry. It is installed as a devDependency and launched via `lucide-manager` (or a host script alias). It is not a runtime library.

## Architecture

Two servers, two owners:

| Role                                       | Typical port | Owner                          |
| ------------------------------------------ | ------------ | ------------------------------ |
| Icons API (`GET`/`POST` `/api/icons-json`) | 3001         | Host package (Hono or similar) |
| Picker UI (Vite dev server)                | 5199         | This package                   |

Configuration merges package defaults with host overrides: `lucide-manager.defaults.json` → `lucide-manager.config.json` → env (`LUCIDE_MANAGER_OPEN`, `LUCIDE_MANAGER_HOST_CWD`). Canonical schema: `lucide-manager.config.schema.json`. Types: `src/config/lucide-manager.config.types.ts` (kept in sync manually).

At build time, Vite `define` injects `__ICONS_API_URL__` and `__APP_BRANDING__` into the browser bundle. The CLI passes `LUCIDE_MANAGER_HOST_CWD` so config resolution uses the host cwd even though Vite runs with cwd at the package root.

The picker fetches Lucide metadata from the public Lucide API (cached in the browser). Registry read/write goes to the host icons API only — there is no Vite middleware or in-package file plugin anymore. Icon codegen (`icons.json` → `icons.ts`) is the host’s responsibility, not this package.

UI stack: shadcn (preset `b2oDq0a9a`, radix-nova), Tailwind v4, dark theme via `class="dark"` on `index.html`. Layout: full-height sidebar (optional branding row + categories), header row over the main pane only; sidebar title and header share fixed `h-14` chrome height.

## Status

Shipped at **0.11.0** on branch `master`.

**Working:** shadcn-themed picker; category sidebar; search; single-click focus + footer; double-click / Space / footer toggle inclusion; nested JSON config with `iconsApi`, `manager.server`, optional `manager.appBranding`; aligned sidebar/header chrome.

**Not in scope (this repo):** `lucide-manager generate`, Vite icons-json plugin, self-dev `dev/` sandbox — removed or never migrated to the icons-API architecture.

**Next (planned):** hostable picker refactor for embedded hosts (see `docs/todo/TODO_HOSTABLE_PICKER.md`).

## Key Decisions

- Host owns `icons.json` persistence and codegen; this package owns the picker UI only.
- Config filenames: `CONFIG_FILENAME`, `PACKAGE_DEFAULTS_FILENAME`, `CONFIG_SCHEMA_FILENAME` in `defaults.constants.ts`.
- `manager.appBranding`: optional in host JSON; when present all fields required; defaults title “Lucide Manager”, img `/lucide.png`, `showInSidebar: true`.
- `vite` is a peerDependency; host or workspace must provide it. CLI `findBin()` resolves vite across pnpm layouts.
- `dist/` is gitignored; consumers run the picker via Vite dev server, not a prebuilt static bundle (for now).
- Self-link devDep `@finografic/lucide-manager: link:` so example config `$schema` paths resolve in this repo.

## Open Questions

- First LLAAB integration: iframe/proxy route vs waiting for hostable-picker refactor (`docs/todo/NEXT_STEPS.md`).
- Whether to ship a prebuilt static bundle (see `TROUBLESHOOTING.md` Alternative A) to drop runtime Vite peer dep.
