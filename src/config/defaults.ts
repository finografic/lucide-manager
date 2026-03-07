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

/** Default server URL — used in self-dev mode and as fallback. */
export const DEFAULT_SERVER_URL = 'http://localhost:3001';

/** Dev server defaults — referenced by vite.config.ts. */
export const SERVER = {
  port: 5199,
  open: true,
} as const;
