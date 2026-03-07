/**
 * useIconsJson.ts
 *
 * Manages the local icons.json state — the set of icons
 * the developer has chosen to include in the DS registry.
 *
 * Reads from and writes to /api/icons-json (served by the Vite plugin).
 */

import { useCallback, useEffect, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IconEntry {
  lucideName: string; // kebab-case, e.g. "arrow-up"
  exportName: string; // PascalCase without "Icon" suffix, e.g. "ArrowUp"
}

interface IconsJsonState {
  entries: IconEntry[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** "arrow-up" → "ArrowUp" */
function toDefaultExportName(lucideName: string): string {
  return lucideName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useIconsJson() {
  const [state, setState] = useState<IconsJsonState>({
    entries: [],
    loading: true,
    saving: false,
    error: null,
  });

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/icons-json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load icons.json: ${res.status}`);
        return res.json() as Promise<IconEntry[]>;
      })
      .then(entries => setState({ entries, loading: false, saving: false, error: null }))
      .catch(err =>
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Load failed',
        }))
      );
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedNames = new Set(state.entries.map(e => e.lucideName));

  const isSelected = useCallback(
    (lucideName: string) => selectedNames.has(lucideName),
    [state.entries],
  );

  // ── Save ───────────────────────────────────────────────────────────────────

  const saveEntries = useCallback(async (next: IconEntry[]) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    try {
      const res = await fetch('/api/icons-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next, null, 2),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      setState(prev => ({ ...prev, entries: next, saving: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: err instanceof Error ? err.message : 'Save failed',
      }));
    }
  }, []);

  // ── Toggle ─────────────────────────────────────────────────────────────────

  const toggleIcon = useCallback((lucideName: string, currentExportName?: string) => {
    setState(prev => {
      const exists = prev.entries.some(e => e.lucideName === lucideName);
      const next = exists
        ? prev.entries.filter(e => e.lucideName !== lucideName)
        : [...prev.entries, {
          lucideName,
          exportName: currentExportName ?? toDefaultExportName(lucideName),
        }];
      void saveEntries(next);
      return { ...prev, entries: next };
    });
  }, [saveEntries]);

  // ── Rename export ──────────────────────────────────────────────────────────

  const renameExport = useCallback((lucideName: string, exportName: string) => {
    setState(prev => {
      const next = prev.entries.map(e => e.lucideName === lucideName ? { ...e, exportName } : e);
      void saveEntries(next);
      return { ...prev, entries: next };
    });
  }, [saveEntries]);

  return {
    entries: state.entries,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    isSelected,
    toggleIcon,
    renameExport,
  };
}
