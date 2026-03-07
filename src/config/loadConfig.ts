/**
 * loadConfig.ts
 *
 * Locates and parses `lucide-manager.config.json` by walking up the directory
 * tree from `startDir` (defaults to `process.cwd()`).
 *
 * Returns resolved absolute paths so callers never need to think about cwd.
 * Throws a descriptive error if the config file is not found anywhere.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface LucideManagerConfig {
  iconsJsonPath: string; // absolute path to icons.json in the host package
  iconsDir: string; // absolute path to the host package's icons directory
}

const CONFIG_FILENAME = 'lucide-manager.config.json';

export function loadConfig(startDir: string = process.cwd()): LucideManagerConfig {
  let dir = path.resolve(startDir);
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
