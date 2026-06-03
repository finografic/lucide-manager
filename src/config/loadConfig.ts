/**
 * LoadConfig.ts
 *
 * Resolves the icon server URL for the picker UI.
 *
 * Two modes:
 *
 * SELF-DEV — when run from within this package itself (pkgRoot === cwd).
 * Returns DEFAULT_SERVER_URL. No config file needed.
 *
 * INSTALLED — when run from a host package (the normal use case).
 * Walks up from cwd looking for `lucide-manager.config.json`.
 * Reads `serverUrl` from it, or falls back to DEFAULT_SERVER_URL.
 * Throws a descriptive error if the config file is not found at all.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONFIG_FILENAME, DEFAULT_SERVER_URL, SERVER } from './defaults.constants';

export interface LucideManagerConfig {
  serverUrl: string;
  open: boolean;
}

function parseOpenOverride(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false;
  }

  return undefined;
}

// The root of this package — two levels up from src/config/
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadConfig(
  startDir: string = process.env['LUCIDE_MANAGER_HOST_CWD'] ?? process.cwd(),
): LucideManagerConfig {
  const cwd = path.resolve(startDir);
  const envOpenOverride = parseOpenOverride(process.env['LUCIDE_MANAGER_OPEN']);

  // ── Self-dev mode ──────────────────────────────────────────────────────────
  // Detected when the tool is run from within its own package root.

  if (cwd === PKG_ROOT) {
    return {
      serverUrl: DEFAULT_SERVER_URL,
      open: envOpenOverride ?? SERVER.open,
    };
  }

  // ── Installed mode ─────────────────────────────────────────────────────────
  // Walk up from cwd to find lucide-manager.config.json in the host package root.

  let dir = cwd;
  const { root } = path.parse(dir);

  while (dir !== root) {
    const candidate = path.join(dir, CONFIG_FILENAME);

    if (fs.existsSync(candidate)) {
      const raw = JSON.parse(fs.readFileSync(candidate, 'utf8')) as {
        serverUrl?: string;
        open?: boolean;
      };

      return {
        serverUrl: raw.serverUrl ?? DEFAULT_SERVER_URL,
        open: envOpenOverride ?? raw.open ?? SERVER.open,
      };
    }

    dir = path.dirname(dir);
  }

  throw new Error(
    `[lucide-manager] Could not find "${CONFIG_FILENAME}" in "${startDir}" or any parent directory.\n\n` +
      `Create a "${CONFIG_FILENAME}" in your package root:\n\n` +
      `  {\n    "serverUrl": "http://localhost:3001",\n    "open": true\n  }\n`,
  );
}
