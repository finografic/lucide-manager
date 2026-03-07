/**
 * useLucideData.ts
 *
 * Fetches icon metadata from the public Lucide APIs:
 *
 *   /api/icon-nodes  → { [kebabName]: IconNode[] }
 *   /api/categories  → { [kebabName]: string[] }
 *
 * Both are served with Cache-Control: public, max-age=86400
 * so repeated dev sessions won't re-fetch unnecessarily.
 *
 * Returns a flat array of LucideIcon objects, each with:
 *   - name:       kebab-case (e.g. "arrow-up")
 *   - node:       SVG node tree for direct rendering
 *   - categories: string[] of category names
 */

import { useEffect, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type SVGElementName =
  | 'circle'
  | 'ellipse'
  | 'g'
  | 'line'
  | 'path'
  | 'polygon'
  | 'polyline'
  | 'rect';
type IconNodeElement = [SVGElementName, Record<string, string>];
type IconNodeMap = Record<string, IconNodeElement[]>;
type CategoryMap = Record<string, string[]>;

export interface LucideIcon {
  name: string;
  node: IconNodeElement[];
  categories: string[];
}

interface LucideDataState {
  icons: LucideIcon[];
  loading: boolean;
  error: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const BASE_URL = 'https://lucide.dev';
const ICON_NODES_URL = `${BASE_URL}/api/icon-nodes`;
const CATEGORIES_URL = `${BASE_URL}/api/categories`;

// Simple in-memory cache so HMR doesn't refetch
let cachedIcons: LucideIcon[] | null = null;

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useLucideData(): LucideDataState {
  const [state, setState] = useState<LucideDataState>({
    icons: cachedIcons ?? [],
    loading: cachedIcons === null,
    error: null,
  });

  useEffect(() => {
    if (cachedIcons !== null) return;

    let cancelled = false;

    async function load() {
      try {
        const [nodeRes, catRes] = await Promise.all([
          fetch(ICON_NODES_URL),
          fetch(CATEGORIES_URL),
        ]);

        if (!nodeRes.ok) throw new Error(`icon-nodes fetch failed: ${nodeRes.status}`);
        if (!catRes.ok) throw new Error(`categories fetch failed: ${catRes.status}`);

        const nodeMap: IconNodeMap = await nodeRes.json() as IconNodeMap;
        const catMap: CategoryMap = await catRes.json() as CategoryMap;

        const icons: LucideIcon[] = Object.entries(nodeMap)
          .map(([name, node]) => ({
            name,
            node,
            categories: catMap[name] ?? [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        cachedIcons = icons;

        if (!cancelled) {
          setState({ icons, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          }));
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
