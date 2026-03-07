#!/usr/bin/env node

/**
 * bin/lucide-manager.js
 *
 * CLI shim for @finografic/lucide-manager.
 *
 * Usage:
 *   lucide-manager dev       → starts the Vite icon picker at localhost:5199
 *   lucide-manager generate  → reads icons.json and writes icons.ts + index.ts
 *
 * Must be run from the host package root (where lucide-manager.config.json lives).
 */

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const [, , command] = process.argv;

// Resolve the root of the lucide-manager package itself (not the host's cwd)
const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * Find a binary by searching candidate locations in order:
 *   1. lucide-manager's own node_modules (present in dev / when deps are installed)
 *   2. The host package's node_modules (process.cwd())
 *   3. The workspace / monorepo root (one or two levels up from cwd)
 *   4. Fall back to bare name and rely on PATH
 */
function findBin(name) {
  const candidates = [
    resolve(pkgRoot, 'node_modules', '.bin', name),
    resolve(process.cwd(), 'node_modules', '.bin', name),
    resolve(process.cwd(), '..', 'node_modules', '.bin', name),
    resolve(process.cwd(), '..', '..', 'node_modules', '.bin', name),
  ];
  return candidates.find(p => existsSync(p)) ?? name;
}

const viteBin = findBin('vite');
const tsxBin = findBin('tsx');

if (command === 'dev') {
  spawn(viteBin, ['--config', resolve(pkgRoot, 'vite.config.ts')], {
    stdio: 'inherit',
    cwd: pkgRoot,
  });
} else if (command === 'generate') {
  spawn(tsxBin, [resolve(pkgRoot, 'scripts', 'generate-icons-ts.ts')], {
    stdio: 'inherit',
    cwd: process.cwd(), // host package's cwd — loadConfig() walks up from here
  });
} else {
  const label = command ? `"${command}"` : '(none)';
  process.stderr.write(`lucide-manager: unknown command ${label}\n`);
  process.stderr.write('Usage: lucide-manager dev | generate\n');
  process.exit(1);
}
