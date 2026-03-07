/**
 * loadConfig.ts
 *
 * Resolves the icon server URL for the picker UI.
 *
 * Two modes:
 *
 * SELF-DEV — when run from within this package itself (pkgRoot === cwd).
 *   Returns DEFAULT_SERVER_URL. No config file needed.
 *
 * INSTALLED — when run from a host package (the normal use case).
 *   Walks up from cwd looking for `lucide-manager.config.json`.
 *   Reads `serverUrl` from it, or falls back to DEFAULT_SERVER_URL.
 *   Throws a descriptive error if the config file is not found at all.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONFIG_FILENAME, DEFAULT_SERVER_URL } from './defaults';

export interface LucideManagerConfig {
  serverUrl: string;
}

// The root of this package — two levels up from src/config/
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadConfig(
  startDir: string = process.env['LUCIDE_MANAGER_HOST_CWD'] ?? process.cwd(),
): LucideManagerConfig {
  const cwd = path.resolve(startDir);

  // ── Self-dev mode ──────────────────────────────────────────────────────────
  // Detected when the tool is run from within its own package root.

  if (cwd === PKG_ROOT) {
    return { serverUrl: DEFAULT_SERVER_URL };
  }

  // ── Installed mode ─────────────────────────────────────────────────────────
  // Walk up from cwd to find lucide-manager.config.json in the host package root.

  let dir = cwd;
  const root = path.parse(dir).root;

  while (dir !== root) {
    const candidate = path.join(dir, CONFIG_FILENAME);

    if (fs.existsSync(candidate)) {
      const raw = JSON.parse(fs.readFileSync(candidate, 'utf8')) as {
        serverUrl?: string;
      };

      return {
        serverUrl: raw.serverUrl ?? DEFAULT_SERVER_URL,
      };
    }

    dir = path.dirname(dir);
  }

  throw new Error(
    `[lucide-manager] Could not find "${CONFIG_FILENAME}" in "${startDir}" or any parent directory.\n\n`
      + `Create a "${CONFIG_FILENAME}" in your package root:\n\n`
      + `  {\n    "serverUrl": "http://localhost:3001"\n  }\n`,
  );
}
