/**
 * loadConfig.ts
 *
 * Resolves paths to icons.json and the icons output directory.
 *
 * Two modes:
 *
 * SELF-DEV — when run from within this package itself (pkgRoot === cwd).
 *   Uses fixed paths from defaults.ts (dev/icons.json, dev/).
 *   Ensures the dev directory exists and seeds icons.json on first run.
 *   No config file needed or consulted.
 *
 * INSTALLED — when run from a host package (the normal use case).
 *   Walks up from cwd looking for `lucide-manager.config.json`.
 *   Throws a descriptive error if not found.
 *
 * Returns resolved absolute paths so callers never need to think about cwd.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONFIG_FILENAME, SELF_DEV } from './defaults';

export interface LucideManagerConfig {
  iconsJsonPath: string; // absolute path to icons.json
  iconsDir: string; // absolute path to the icons output directory
}

// The root of this package — two levels up from src/config/
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadConfig(startDir: string = process.cwd()): LucideManagerConfig {
  const cwd = path.resolve(startDir);

  // ── Self-dev mode ──────────────────────────────────────────────────────────
  // Detected when the tool is run from within its own package root.

  if (cwd === PKG_ROOT) {
    const iconsDir = path.join(PKG_ROOT, SELF_DEV.iconsDir);
    const iconsJsonPath = path.join(PKG_ROOT, SELF_DEV.iconsJson);

    // Ensure dev/ exists
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Seed dev/icons.json from root icons.json on first run
    if (!fs.existsSync(iconsJsonPath)) {
      const seed = path.join(PKG_ROOT, 'icons.json');
      fs.copyFileSync(seed, iconsJsonPath);
    }

    return { iconsJsonPath, iconsDir };
  }

  // ── Installed mode ─────────────────────────────────────────────────────────
  // Walk up from cwd to find lucide-manager.config.json in the host package root.

  let dir = cwd;
  const root = path.parse(dir).root;

  while (dir !== root) {
    const candidate = path.join(dir, CONFIG_FILENAME);

    if (fs.existsSync(candidate)) {
      const raw = JSON.parse(fs.readFileSync(candidate, 'utf8')) as {
        iconsJsonPath: string;
        iconsDir: string;
      };

      return {
        iconsJsonPath: path.resolve(dir, raw.iconsJsonPath),
        iconsDir: path.resolve(dir, raw.iconsDir),
      };
    }

    dir = path.dirname(dir);
  }

  throw new Error(
    `[lucide-manager] Could not find "${CONFIG_FILENAME}" in "${startDir}" or any parent directory.\n\n`
      + `Create a "${CONFIG_FILENAME}" in your package root:\n\n`
      + `  {\n    "iconsJsonPath": "./src/icons/icons.json",\n    "iconsDir": "./src/icons"\n  }\n`,
  );
}
