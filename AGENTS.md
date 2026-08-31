# AGENTS.md — AI Assistant Guide

## Project Memory Model

- `docs/todo/ROADMAP.md` = milestone plan, near-term tasks, and completed history.
- `.agents/handoff.md` = stable current project state.
- `.agents/memory.md` = chronological session log.

Promote durable findings from memory → handoff, priorities and follow-ups → roadmap.

Reference: [`docs/process/PROJECT_MEMORY_MODEL.md`](./docs/process/PROJECT_MEMORY_MODEL.md)

---

## Roadmap and Planning Docs

- Check `ROADMAP.md` before proposing new initiatives.
- Use `ROADMAP.md#next` for small follow-ups and manual validation.
- Keep detailed plans in `docs/todo/TODO_*.md`; graduate completed plans to `DONE_*.md`.
- Follow `.agents/instructions/documentation/todo-done-docs.instructions.md`.

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

Rules are canonical in `.agents/instructions/` — see `README.md` there for folder structure.
Shared across Claude Code, Cursor, and GitHub Copilot.

**General**

- General baseline: `.agents/instructions/general.instructions.md`

**Code**

- TypeScript patterns: `.agents/instructions/code/typescript-patterns.instructions.md`
- Modern TS patterns: `.agents/instructions/code/modern-typescript-patterns.instructions.md`
- Oxlint & style: `.agents/instructions/code/linting-code-style.instructions.md`
- Provider/context patterns: `.agents/instructions/code/provider-context-patterns.instructions.md`
- Picocolors CLI styling: `.agents/instructions/code/picocolors-cli-styling.instructions.md`

**Naming**

- File naming: `.agents/instructions/naming/file-naming.instructions.md`
- Variable naming: `.agents/instructions/naming/variable-naming.instructions.md`

**Documentation**

- Documentation: `.agents/instructions/documentation/documentation.instructions.md`
- README standards: `.agents/instructions/documentation/readme-standards.instructions.md`
- Agent-facing markdown: `.agents/instructions/documentation/agent-facing-markdown.instructions.md`
- Feature design specs: `.agents/instructions/documentation/feature-design-specs.instructions.md`
- TODO/DONE docs: `.agents/instructions/documentation/todo-done-docs.instructions.md`

**Git**

- Git policy: `.agents/instructions/git/git-policy.instructions.md`

---

## Rules — Markdown Tables

- Padded pipes: one space on each side of every `|`, including the separator row.
- **Do NOT manually align column widths or pad cells to equal width.** `oxfmt` (run automatically
  by lint-staged on commit and by `pnpm format:fix`) fixes table alignment automatically. Spending
  tokens counting characters and iterating on spacing is wasted effort — write the content, let the
  formatter handle alignment.

---

## Git Policy

- Do not include `Co-Authored-By` lines in commit messages.
- `.agents/instructions/git/git-policy.instructions.md` (see Commits and Releases sections)

---

## Rules — Project-Specific

- Project-specific rules live in `.agents/instructions/project/**/*.instructions.md`.
- Do not reference `@workspace/*` — all imports and deps must use published package names.

## Cursor

- Always-on rules: `.cursor/rules/` (`alwaysApply` — entry point is `AGENTS.md`, same as `CLAUDE.md`)

---

## Agent execution efficiency

Prefer the smallest complete implementation and validation loop for the task. Aim for one orientation pass, one coherent edit pass, and one focused validation pass; further loops need a concrete failure or newly discovered dependency.

Avoid side quests: do not broaden into adjacent refactors, cleanup, environment repair, or unrelated warning fixes unless required to complete or validate the requested change.

### Before editing

- Orient on the owning module, its direct callers/callees, and affected tests — not adjacent subsystems.
- Read applicable repository instructions before implementing.
- Once owning surfaces are identified, start implementing.

### Scope

- Reuse established patterns before adding abstractions.
- Do not generalize one-use helpers unless reuse is immediate and obvious.
- Preserve unrelated uncommitted files and pre-existing warnings.

### Validation

Use progressive validation and stop once the change is proven:

1. Narrowest relevant test or test file
2. Typecheck for directly affected packages
3. Format/lint on touched files when supported
4. Broader repo checks only when shared exports change, focused checks cannot prove correctness, a failure requires them, or the user asks

### Tool use and failures

- Batch related reads/searches and coherent edits; avoid repeating the same command through different wrappers.
- Progress updates at phase boundaries only (orientation / implementation / validation).
- Distinguish failures caused by this change from pre-existing ones; fix unrelated failures only when they block validation, and report them in the summary.

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
