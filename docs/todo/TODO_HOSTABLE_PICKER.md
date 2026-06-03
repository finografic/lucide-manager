# TODO — Hostable Picker

> **Status:** Not started.
>
> **Note (2026-06-04):** Runtime config is now merged JSON + Vite `define` (`__ICONS_API_URL__`, `__APP_BRANDING__`). A hostable refactor should replace globals with explicit React props or a small config provider — see `LucideManagerResolvedConfig` in `src/config/lucide-manager.config.types.ts`.

Refactor `@finografic/lucide-manager` so the picker can be hosted in more than one shell:

1. the current standalone Vite app
2. an embedded host such as LLAAB

The goal is not to remove the standalone app. The goal is to extract the picker into reusable
React primitives and a small host adapter layer so other apps can mount it directly.

## Why

Today the picker is tightly coupled to its own Vite host:

- `src/main.tsx` mounts a single standalone app
- runtime config is injected through Vite globals
- the write-back server URL is resolved for one host mode
- styling is inline and owned entirely by the standalone shell

That makes iframe/proxy embedding easy, but native in-app hosting awkward.

## Target Outcome

- `@finografic/lucide-manager` still supports `pnpm exec lucide-manager`
- the picker UI can also be imported and rendered directly inside another React app
- host apps can provide:
  - the icons API base URL
  - optional shell styling overrides
  - optional wrapper layout around the picker
- the standalone Vite app becomes a thin host around reusable picker modules

## Non-Goals

- Replacing `@finografic/icons` or its write-back server
- Rebuilding the picker in another framework
- Merging the standalone app into LLAAB permanently

## Proposed Shape

### Phase 1 — Extract reusable picker modules

- [ ] Create a reusable `Picker` entry component exported from `src/index.ts`
- [ ] Move host-specific bootstrap code out of `src/main.tsx`
- [ ] Replace direct Vite-global assumptions with explicit props or provider config
- [ ] Keep current behavior unchanged for the standalone app

Deliverable:

- host apps can import something like `LucidePicker`

### Phase 2 — Introduce host adapter boundary

- [ ] Define a small host config contract:
  - `iconsServerUrl`
  - `initialQuery?`
  - `className?` / `style?` / theme hooks
- [ ] Move API calls behind a small client layer instead of raw globals in hooks
- [ ] Make the standalone Vite host supply that config explicitly

Deliverable:

- picker logic no longer depends on Vite to exist

### Phase 3 — Styling and composition cleanup

- [ ] Audit inline styles and identify what should remain internal vs. host-overridable
- [ ] Allow outer container sizing/layout to be controlled by the host
- [ ] Preserve a strong default standalone visual style

Deliverable:

- embedded hosts can fit the picker into their own layout without forking the UI

### Phase 4 — Validate second host

- [ ] Mount the picker inside LLAAB as a direct React import
- [ ] Verify read/write behavior against `@finografic/icons`
- [ ] Verify keyboard focus, selection, rename, and save states in embedded mode
- [ ] Keep standalone `lucide-manager` behavior intact

Deliverable:

- two supported host modes from one picker implementation

## API Sketch

Probable exported surface:

- `LucidePicker`
- `type LucidePickerProps`
- optional lower-level exports if needed later:
  - `CategorySidebar`
  - `IconGrid`
  - `IconDetail`
  - `useIconsJson`
  - `useLucideData`

Keep the first iteration conservative. Export the full picker first; only export subparts if a real
consumer needs them.

## Risks

- Over-extracting too early and creating a messy public API
- Letting host styling concerns leak too far into picker internals
- Breaking the standalone Vite workflow while optimizing for embedding

## Recommended Delivery Order

- [ ] Do not start with this refactor for the immediate LLAAB need
- [ ] First ship a fast integration path via proxy or iframe embedding
- [ ] Start this refactor only once the embedded workflow proves worth keeping

## Success Criteria

- LLAAB can render the picker without an iframe
- standalone `lucide-manager` still works with the same CLI entrypoint
- no duplicate picker UI implementation exists across hosts
