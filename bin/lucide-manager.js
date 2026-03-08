#!/usr/bin/env node

/**
 * bin/lucide-manager.js
 *
 * CLI shim for @finografic/lucide-manager.
 *
 * Usage:
 *   lucide-manager dev   → starts the Vite icon picker at localhost:5199
 *
 * The picker UI talks to a local Hono server that the host package provides.
 * Start the server separately via: pnpm icons  (from the host package root)
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
 *   1. lucide-manager's own node_modules
 *   2. The host package's node_modules (process.cwd())
 *   3. The workspace / monorepo root (one or two levels up from cwd)
 *   4. Fall back to bare name and rely on PATH
 */
function findBin(name) {
  const candidates = [
    resolve(pkgRoot, '..', '.bin', name),
    resolve(pkgRoot, 'node_modules', '.bin', name),
    resolve(process.cwd(), 'node_modules', '.bin', name),
    resolve(process.cwd(), '..', 'node_modules', '.bin', name),
    resolve(process.cwd(), '..', '..', 'node_modules', '.bin', name),
  ];
  return candidates.find(p => existsSync(p)) ?? name;
}

const viteBin = findBin('vite');

if (command === 'dev' || command === 'config') {
  spawn(viteBin, ['--config', resolve(pkgRoot, 'vite.config.ts')], {
    stdio: 'inherit',
    cwd: pkgRoot,
    // Pass the host's cwd so loadConfig() inside the Vite process can find
    // lucide-manager.config.json even though Vite runs with cwd = pkgRoot.
    env: { ...process.env, LUCIDE_MANAGER_HOST_CWD: process.cwd() },
  });
} else {
  const label = command ? `"${command}"` : '(none)';
  process.stderr.write(`lucide-manager: unknown command ${label}\n`);
  process.stderr.write('Usage: lucide-manager dev\n');
  process.exit(1);
}
