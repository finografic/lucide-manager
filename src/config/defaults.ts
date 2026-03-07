/**
 * defaults.ts
 *
 * Single source of truth for all constants used across the tool:
 *   - config filename (host packages create this file in their root)
 *   - self-dev paths (fixed, gitignored — used when running from within this package)
 *   - dev server defaults (referenced by vite.config.ts)
 */

/** The config file that host packages create in their root. */
export const CONFIG_FILENAME = 'lucide-manager.config.json';

/**
 * Self-development paths — used only when the tool is run from its own package root.
 * These paths are relative to the package root and are always gitignored.
 * They are fixed (not configurable) to guarantee they stay out of version control.
 */
export const SELF_DEV = {
  iconsJson: 'dev/icons.json',
  iconsDir: 'dev',
} as const;

/** Dev server defaults — referenced by vite.config.ts. */
export const SERVER = {
  port: 5199,
  open: true,
} as const;
