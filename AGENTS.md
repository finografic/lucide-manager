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

Project-specific rules live in `.github/instructions/project/`:

- [Design System](.github/instructions/project/design-system.instructions.md)
- [SVA components (slot recipes)](.github/instructions/project/sva-components.instructions.md)
- [CVA components (atomic recipes)](.github/instructions/project/cva-components.instructions.md)

- This is a **standalone installable package** (`@finografic/design-system`), not a monorepo workspace.
- Published to GitHub Packages (`https://npm.pkg.github.com`).
- Do not include `Co-Authored-By` lines in commit messages.
- Do not reference `@workspace/*` — all imports and deps must use published package names.
- The `panda.preset` entry must always build with `platform: 'node'` in tsdown.
- Never add `watch: true` to `panda.config.ts` — it causes `panda codegen` to hang.
- **`dist/` is committed** — this is a published package library; `dist/` must be included. After every component refactor: run `pnpm build` from `packages/design-system/`, then commit `dist/` with `chore(dist): build — <summary>`.

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
- Icon grid active/included accents: named constants in `src/config/colors.ts` must reference theme CSS variables (`var(--primary)`, `var(--ring)`), kept in sync with `index.css`
- Put the `shadcn` npm package in `devDependencies`; use `pnpm dlx shadcn@latest add …` for one-off component adds
- Icon picker selection: single-click focuses and opens the footer; double-click, Space (when an icon is focused, not in text inputs), and footer Add/Remove all toggle registry inclusion and save to `icons.json`
- Ignore `.cursor/chats` and `.cursor/hooks`; commit `.cursor/mcp.json`
- Install VS Code extensions missing from Cursor’s marketplace via Command Palette `Extensions: Install from VSIX…` or `cursor --install-extension <path>.vsix`

## Learned Workspace Facts

- `@finografic/lucide-manager` is a Vite devtool + CLI; runtime entry is `bin/lucide-manager.js`, not public exports from `src/index.ts`
- UI stack: shadcn (preset `b2oDq0a9a`, radix-nova) + Tailwind v4 (`@tailwindcss/vite`); `index.html` uses `class="dark"` for the dark theme
- shadcn `Button` applies `[&_svg:not([class*='size-'])]:size-4` to child SVGs — `IconSvg` must set inline width/height (shared `ICON_GRID_SIZE` / `ICON_DETAIL_SIZE`) so grid icons are not clamped to 16px
- Picker states use theme tokens: included → `primary`; focused grid cell → `ring` / `muted`; sidebar active row → `sidebar-accent` / `sidebar-primary`
- oxlint `ignorePatterns`: `src/components/ui/**`, `src/lib/utils.ts` (generated shadcn)
- oxlint `no-underscore-dangle`: allow `__ICONS_SERVER_URL__` (Vite `define` global)
- oxlint `react/react-in-jsx-scope`: `off` when `tsconfig` uses `jsx: react-jsx`
- `tsconfig.json`: `lib` includes `ES2023` for `Array.prototype.toSorted` types; `target` stays `ES2022`
- Path alias `@/*` → `./src/*` in both `tsconfig.json` and `vite.config.ts`
