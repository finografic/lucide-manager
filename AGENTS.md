# AGENTS.md - AI Assistant Guide

Rules are canonical in `.github/instructions/` and shared across Claude Code, Cursor, and GitHub Copilot.

## Rules - Markdown Tables

- Padded pipes: one space on each side of every `|`, including the separator row.
- Align column widths so all cells in the same column are equal width.

## Rule Files

Project-specific instructions live in `.github/instructions/project/`:

- [Design System](.github/instructions/project/design-system.instructions.md)
- [SVA components (slot recipes)](.github/instructions/project/sva-components.instructions.md)
- [CVA components (atomic recipes)](.github/instructions/project/cva-components.instructions.md)

> Note: the shared numbered rule set (`00-general` … `08-readme`) still lives at `.github/instructions/`. The full monorepo instructions tree has not been copied here yet.
> Until it is, follow general TypeScript, ESLint, and naming conventions from prior context.

- [General](/.github/instructions/00-general.instructions.md)
- [File Naming](/.github/instructions/01-file-naming.instructions.md)
- [TypeScript Patterns](/.github/instructions/02-typescript-patterns.instructions.md)
- [Provider & Context Patterns](/.github/instructions/03-provider-context-patterns.instructions.md)
- [ESLint & Code Style](/.github/instructions/04-eslint-code-style.instructions.md)
- [Documentation](/.github/instructions/05-documentation.instructions.md)
- [Modern TypeScript Patterns](/.github/instructions/06-modern-typescript-patterns.instructions.md)
- [Variable Naming](/.github/instructions/07-variable-naming.instructions.md)
- [README Standards](/.github/instructions/08-readme-standards.instructions.md)

## Component Refactor Status

See **[TODO_COMPONENT_REFACTORS.md](docs/TODO_COMPONENT_REFACTORS.md)** for the completed refactor checklist.
All items are checked off. The file is kept as a reference log.

## Project-Specific

- This is a **standalone installable package** (`@finografic/design-system`), not a monorepo workspace.
- Published to GitHub Packages (`https://npm.pkg.github.com`).
- Do not include `Co-Authored-By` lines in commit messages.
- Do not reference `@workspace/*` — all imports and deps must use published package names.
- The `panda.preset` entry must always build with `platform: 'node'` in tsdown.
- Never add `watch: true` to `panda.config.ts` — it causes `panda codegen` to hang.
- **`dist/` is committed** — this is a published package library; `dist/` must be included. After every component refactor: run `pnpm build` from `packages/design-system/`, then commit `dist/` with `chore(dist): build — <summary>`.

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
