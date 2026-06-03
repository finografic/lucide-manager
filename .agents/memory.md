# Session Memory

> **How to maintain this file**
> Update during or at the end of a session with checklists, recent discoveries, and temporary context.
> — Keep only the recent tail unless there is a strong reason to preserve more.
> — If something becomes stable project truth, move it to `.agents/handoff.md`.
> — If something completes a milestone, record it in `docs/todo/ROADMAP.md`.
> — See `docs/process/PROJECT_MEMORY_MODEL.md`.

## 2026-06-04 — Config system, appBranding, chrome alignment

- Added nested config: `iconsApi`, `manager.server`, optional `manager.appBranding`.
- Files: `lucide-manager.defaults.json`, `lucide-manager.config.schema.json`, `lucide-manager.config.example.json`, `load-config.utils.ts`, `lucide-manager.config.types.ts`.
- Vite define: `__ICONS_API_URL__`, `__APP_BRANDING__`; oxlint allows both globals.
- Sidebar branding from config; `showInSidebar: false` hides logo/title row.
- Shared `APP_CHROME_ROW_CLASS` / `h-14` aligns sidebar title bottom border with main header.
- Removed legacy `loadConfig.ts`; hooks call host API via `__ICONS_API_URL__`.
- VS Code `json.schemas` wired for config JSON files.
- Docs pass: handoff, memory, ROADMAP, NEXT_STEPS, README Development section.

## 2026-06-03 — Layout + interactions (prior session)

- Full-height sidebar with branding; header spans main column only.
- shadcn preset b2oDq0a9a; theme tokens for included/focus/sidebar states.
- Single-click focus; double-click / Space / footer Add toggles inclusion.
- `ICON_GRID_SIZE` / `ICON_DETAIL_SIZE`; inline SVG sizes (Button clamps child SVGs).

## Key paths (current)

| Path                                 | Role                                             |
| ------------------------------------ | ------------------------------------------------ |
| `bin/lucide-manager.js`              | CLI → spawns Vite with `LUCIDE_MANAGER_HOST_CWD` |
| `src/config/load-config.utils.ts`    | Merge defaults + host config + env               |
| `src/config/app-chrome.constants.ts` | Shared `h-14` chrome row classes                 |
| `src/hooks/useIconsJson.ts`          | Fetch/save registry via host icons API           |
| `vite.config.ts`                     | `loadConfig()`, Vite define globals, picker port |
