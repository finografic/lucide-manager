# Roadmap

> **This is the primary high-level plan for the project.**
> Check this file before proposing new work. Add new items when conceiving features.
> Keep it ordered by priority — move completed items to the Done section at the bottom.

---

## How to use this file

| Tier | Meaning                                   |
| ---- | ----------------------------------------- |
| P0   | Active — being worked on now              |
| P1   | Next — fully scoped, ready to start       |
| P2   | Planned — direction decided, detail TBD   |
| P3   | Backlog — good ideas, not yet prioritised |

When an item is done, move it to the Done section at the bottom with a completion date.

---

## Next

- [ ] Manual smoke test against a real host package: host icons API running on `iconsApi.port`, picker on `manager.server.port`, selections persist to host `icons.json`.
- [ ] Verify `manager.appBranding` overrides (custom title/img, `showInSidebar: false`) in a host `lucide-manager.config.json`.
- [ ] Decide whether LLAAB should use a plain iframe route or a reverse-proxy route for the first
      in-app picker integration.
- [ ] If choosing the fast path, implement the embedded host without starting the full
      `TODO_HOSTABLE_PICKER.md` refactor yet.

## Docs / hygiene

- [x] Refresh `.agents/handoff.md`, `.agents/memory.md`, README Development section (2026-06-04).
- [ ] Audit `TROUBLESHOOTING.md` and `docs/LUCIDE_ALTS.md` for pre–icons-API architecture references when those docs are next touched.

## P0 — Active

_Nothing active right now — pick from P1._

---

## P1 — Next Up

- Hostable picker refactor — extract reusable picker UI/core so the standalone Vite app and
  embedded hosts such as LLAAB can share one implementation.
  See [TODO_HOSTABLE_PICKER.md](./TODO_HOSTABLE_PICKER.md).

---

## P2 — Planned

- Embedded host path for LLAAB — use a fast integration approach first (proxy or iframe route)
  before investing in the full hostable-picker refactor.
- Prebuilt static bundle option — ship compiled `dist/` and drop runtime Vite peer dep
  (see `TROUBLESHOOTING.md` Alternative A).

---

## P3 — Backlog

- VS Code WebView picker (see `TROUBLESHOOTING.md` Alternative C).

---

## Done

| Item                                                                   | Completed  |
| ---------------------------------------------------------------------- | ---------- |
| shadcn + Tailwind v4 UI (preset b2oDq0a9a, dark theme)                 | 2026-06-03 |
| Picker interactions (focus, double-click/Space toggle, footer)         | 2026-06-03 |
| Full-height sidebar layout + header over main pane                     | 2026-06-03 |
| Nested JSON config (`iconsApi`, `manager.server`) + schema/types       | 2026-06-04 |
| Host icons API integration (`__ICONS_API_URL__`, no in-package plugin) | 2026-06-04 |
| `appBranding` config + Vite inject                                     | 2026-06-04 |
| Aligned sidebar title / header chrome height (`h-14`)                  | 2026-06-04 |
