# AGENTS.md — AI Assistant Guide

## Project Memory Model

- `docs/todo/ROADMAP.md` = milestone plan and completed history.
- `docs/todo/NEXT_STEPS.md` = near-term tasks and manual checks.
- `.agents/handoff.md` = stable current project state.
- `.agents/memory.md` = chronological session log.

Promote durable findings from memory → handoff, priorities → roadmap, and concrete follow-ups → next steps.

Reference: [`docs/process/PROJECT_MEMORY_MODEL.md`](./docs/process/PROJECT_MEMORY_MODEL.md)

---

## Roadmap and Planning Docs

- Check `ROADMAP.md` before proposing new initiatives.
- Use `NEXT_STEPS.md` for small follow-ups and manual validation.
- Keep detailed plans in `docs/todo/TODO_*.md`; graduate completed plans to `DONE_*.md`.
- Follow `.github/instructions/documentation/todo-done-docs.instructions.md`.

---

## Rules - Project-Specific

- This is a **standalone installable package** (`@finografic/lucide-manager`), not a monorepo workspace package alias.
- Published to GitHub Packages (`https://npm.pkg.github.com`).
- Do not include `Co-Authored-By` lines in commit messages.
- Do not reference `@workspace/*` in published docs — use `@finografic/lucide-manager` and host package names.
- **`dist/` is gitignored** — picker runs via Vite dev server; `pnpm build` output is local only unless publish strategy changes.
- Config: keep `lucide-manager.config.schema.json` and `src/config/lucide-manager.config.types.ts` in sync manually.
- Shipped npm `files`: include `lucide-manager.defaults.json`, `lucide-manager.config.schema.json`, `lucide-manager.config.example.json`.

## Rules — Global

Rules are canonical in `.github/instructions/` — see `README.md` there for folder structure.
Shared across Claude Code, Cursor, and GitHub Copilot.

**General**

- General baseline: `.github/instructions/general.instructions.md`

**Code**

- TypeScript patterns: `.github/instructions/code/typescript-patterns.instructions.md`
- Modern TS patterns: `.github/instructions/code/modern-typescript-patterns.instructions.md`
- Oxlint & style: `.github/instructions/code/linting-code-style.instructions.md`
- Provider/context patterns: `.github/instructions/code/provider-context-patterns.instructions.md`
- Picocolors CLI styling: `.github/instructions/code/picocolors-cli-styling.instructions.md`

**Naming**

- File naming: `.github/instructions/naming/file-naming.instructions.md`
- Variable naming: `.github/instructions/naming/variable-naming.instructions.md`

**Documentation**

- Documentation: `.github/instructions/documentation/documentation.instructions.md`
- README standards: `.github/instructions/documentation/readme-standards.instructions.md`
- Agent-facing markdown: `.github/instructions/documentation/agent-facing-markdown.instructions.md`
- Feature design specs: `.github/instructions/documentation/feature-design-specs.instructions.md`
- TODO/DONE docs: `.github/instructions/documentation/todo-done-docs.instructions.md`

**Git**

- Git policy: `.github/instructions/git/git-policy.instructions.md`

---

## Rules — Markdown Tables

- Padded pipes: one space on each side of every `|`, including the separator row.
- Align column widths so all cells in the same column are equal width.

---

## Git Policy

- Do not include `Co-Authored-By` lines in commit messages.
- `.github/instructions/git/git-policy.instructions.md` (see Commits and Releases sections)

---

## Learned User Preferences

- When integrating shadcn, keep preset oklch `:root` / `.dark` tokens in `src/index.css` — do not replace them with legacy hex overrides that hide the chosen theme
- Icon grid active/included accents: `src/config/colors.constants.ts` references theme CSS variables (`var(--primary)`, `var(--ring)`)
- Put the `shadcn` npm package in `devDependencies`; use `pnpm dlx shadcn@latest add …` for one-off component adds
- Icon picker selection: single-click focuses and opens the footer; double-click, Space (when an icon is focused, not in text inputs), and footer Add/Remove all toggle registry inclusion and save to `icons.json`
- Ignore `.cursor/chats` and `.cursor/hooks`; commit `.cursor/mcp.json`
- Install VS Code extensions missing from Cursor’s marketplace via Command Palette `Extensions: Install from VSIX…` or `cursor --install-extension <path>.vsix`

## Learned Workspace Facts

- `@finografic/lucide-manager` is a Vite devtool + CLI (host **devDependency**); runtime entry is `bin/lucide-manager.js`, not public exports from `src/index.ts`. Host owns `icons.json` and the icons API; this package is picker UI only
- UI stack: shadcn (preset `b2oDq0a9a`, radix-nova) + Tailwind v4 (`@tailwindcss/vite`); `index.html` uses `class="dark"` for the dark theme
- shadcn `Button` applies `[&_svg:not([class*='size-'])]:size-4` to child SVGs — `IconSvg` must set inline width/height (shared `ICON_GRID_SIZE` / `ICON_DETAIL_SIZE`) so grid icons are not clamped to 16px
- Picker states use theme tokens: included → `primary`; focused grid cell → `ring` / `muted`; sidebar active row → `sidebar-accent` / `sidebar-primary`
- oxlint `ignorePatterns`: `src/components/ui/**`, `src/lib/utils.ts` (generated shadcn)
- oxlint `no-underscore-dangle`: allow `__ICONS_API_URL__` and `__APP_BRANDING__` (Vite `define` globals)
- Config merge: `lucide-manager.defaults.json` → host `lucide-manager.config.json` → env (`LUCIDE_MANAGER_OPEN`, `LUCIDE_MANAGER_HOST_CWD`); shape uses `iconsApi` (host-owned API, e.g. port 3001) and `manager.server` (picker Vite dev server, e.g. port 5199)
- Optional `manager.appBranding`: `{ title, img, showInSidebar }`; defaults in `lucide-manager.defaults.json` and `DEFAULT_APP_BRANDING` in `defaults.constants.ts`
- Sidebar/header chrome: shared `h-14` via `APP_CHROME_ROW_CLASS` / `APP_CHROME_ROW_SIDEBAR_CLASS` in `app-chrome.constants.ts`
- oxlint `react/react-in-jsx-scope`: `off` when `tsconfig` uses `jsx: react-jsx`
- `tsconfig.json`: `lib` includes `ES2023` for `Array.prototype.toSorted` types; `target` stays `ES2022`
- Path alias `@/*` → `./src/*` in both `tsconfig.json` and `vite.config.ts`
