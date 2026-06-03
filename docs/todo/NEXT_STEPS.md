# Next Steps

Near-term working list, manual testing, and small follow-ups.

## Active

- [ ] Manual smoke test against a real host package: host icons API running on `iconsApi.port`, picker on `manager.server.port`, selections persist to host `icons.json`.
- [ ] Verify `manager.appBranding` overrides (custom title/img, `showInSidebar: false`) in a host `lucide-manager.config.json`.
- [ ] Decide whether LLAAB should use a plain iframe route or a reverse-proxy route for the first
      in-app picker integration.
- [ ] If choosing the fast path, implement the embedded host without starting the full
      `TODO_HOSTABLE_PICKER.md` refactor yet.

## Docs / hygiene

- [x] Refresh `.agents/handoff.md`, `.agents/memory.md`, README Development section (2026-06-04).
- [ ] Audit `TROUBLESHOOTING.md` and `docs/LUCIDE_ALTS.md` for pre–icons-API architecture references when those docs are next touched.
