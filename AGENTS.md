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

- IMPORTANT: NEVER include `Co-Authored-By` lines in commit messages. Non-negotiable.
- `.github/instructions/git/git-policy.instructions.md` (see Commits and Releases sections)

---

## Learned User Preferences

- Apply recipes inside design-system components; client uses `<Button variant="..." />` without calling the recipe
- Use `sva` as the default for any Ark-based (multi-slot) component; use `cva` only for genuinely single-DOM-element components (Badge, Spinner, Text)
- Translate Ark UI example CSS files into Panda `sva` recipes — treat them as style specifications, never import them as CSS modules directly
- Always import `cx` from `@styled-system/css`; never create local `cx` helper functions inside components
- Document which slot a recipe targets (name or JSDoc); keep recipe naming, structure, and variant conventions consistent with existing components
- **No separate `*.types.ts` files** — recipe type and explicit union types (`ButtonVariant`, `ButtonPalette`) live at the **bottom of the `*.recipe.ts` file**, co-located with the recipe. Import `RecipeProps` from `'../../types/recipes.types'`. Never index `RecipeProps` directly for variant/palette keys.
- **Recipe type naming:** `sva` recipes export `*RecipeProps`; `cva` recipes export `*Variants`. Some older SVA recipes (Switch, Dialog, RadioGroup, etc.) still use `*Variants` — align to `*RecipeProps` when touching those files.
- Button uses the prop name `palette` (not `colorScheme`) to avoid confusion with the CSS `color-scheme` property
- Use `@stylistic/stylelint-plugin` for Stylelint 17; `stylelint-stylistic` is deprecated and incompatible
- Ignore `.cursor/chats` and `.cursor/hooks`; commit `.cursor/mcp.json`
- Use Panda MCP for design-system questions (breakpoints, tokens, recipes) when relevant without explicit user ask
- Use Ark UI MCP for component props, examples, and styling guide questions — configured in `.vscode/mcp.json`
- Convenience wrappers use **`{Component}DS`** as the primary name + simplified handlers (e.g. `onChange(checked)` not Ark's `onCheckedChange` detail object); bare compounds keep Ark prop names
- No `*Field` aliases on `*DS` wrappers — export `*DS` directly, no duplicate names.
- DS authoring/refactors: `sva-components.instructions.md` + `cva-components.instructions.md`; recipe results named `styles` / `stylesComponent`; inline single-use `cx(...)`; no deprecated props (consumer overview: `design-system.instructions.md`)

## Learned Workspace Facts

- Client `panda.config` must include `./node_modules/@finografic/design-system/src/**/*.{ts,tsx}` for recipe CSS to be generated
- CSS import order: design-system `styles/global.css` first, then Panda `styled-system/styles.css`
- Reset must be wrapped in `@layer reset`; `global.css` declares `@layer reset, base, tokens, recipes, utilities`
- Shared Ark-style trigger chrome: `rootTriggerRecipe` in `packages/design-system/src/recipes/root-trigger.recipe.ts`; `Dialog.Trigger` composes it — reuse on other overlay triggers with `cx` as you add them
- Switch: `switchRecipe` is `sva` + `createStyleContext`; convenience export is `SwitchDS` (styled compound remains `Switch`)
- Panda MCP in monorepo: command `pnpm`, args `["--filter", "@finografic/design-system", "exec", "panda", "mcp"]`
- `panda.config.ts` and `@pandacss/dev` live in `packages/design-system`
- Watch script for linked library: `pnpm watch` runs `panda codegen -w` and `tsdown --watch` in parallel
- Ark reference CSS files (copied from Ark UI docs) live in `src/ark-reference/css/` — treat as specs for translating into `sva` recipes; never import or ship them as CSS modules
- `colorPalette` explicit-slot rule: in an `sva`, any slot that uses `colorPalette.*` inside a **conditional state** (`_checked`, `_hover`, `_expanded`, etc.) must have `colorPalette` set **directly on that slot** in the palette variant — inheritance from root is not sufficient for Panda's atomic extraction of conditional rules. See `sva-components.instructions.md` § `colorPalette in slot recipes`.
