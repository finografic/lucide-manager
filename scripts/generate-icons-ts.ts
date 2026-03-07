/**
 * generate-icons-ts.ts
 *
 * Reads icons.json (path from lucide-manager.config.json) and writes:
 *   - {iconsDir}/icons.ts   (the icon registry)
 *   - {iconsDir}/index.ts   (named exports)
 *
 * Never touches icons.utils.ts or any other file in iconsDir.
 *
 * Run via: lucide-manager generate
 * (or the host package script that calls it)
 */

import fs from 'node:fs';
import path from 'node:path';

import { loadConfig } from '../src/config/loadConfig';

// ── Config ─────────────────────────────────────────────────────────────────────

const config = loadConfig();

const jsonPath = config.iconsJsonPath;
const tsPath = path.join(config.iconsDir, 'icons.ts');
const indexPath = path.join(config.iconsDir, 'index.ts');

// ── Types ──────────────────────────────────────────────────────────────────────

interface IconEntry {
  lucideName: string; // kebab-case Lucide export, e.g. "arrow-up"
  exportName: string; // PascalCase without "Icon" suffix, e.g. "ArrowUp"
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** "arrow-up" → "ArrowUp" (standard kebab → PascalCase) */
function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** "arrow-up" → "ArrowUp" as Lucide names it in lucide-react exports */
function toLucideExportName(lucideName: string): string {
  return toPascalCase(lucideName);
}

// ── Load ───────────────────────────────────────────────────────────────────────

const raw = fs.readFileSync(jsonPath, 'utf8');
const entries = JSON.parse(raw) as IconEntry[];

// Sort alphabetically by exportName for stable, readable output
entries.sort((a, b) => a.exportName.localeCompare(b.exportName));

// ── Build icons.ts ─────────────────────────────────────────────────────────────

const maxLen = Math.max(...entries.map(e => (e.exportName + 'Icon').length));

const registryLines = entries
  .map(({ lucideName, exportName }) => {
    const key = `${exportName}Icon`;
    const lucide = `Lucide.${toLucideExportName(lucideName)}`;
    const pad = ' '.repeat(maxLen - key.length + 2);
    return `  ${key}:${pad}${lucide},`;
  })
  .join('\n');

const iconsTsContent = `\
/**
 * Icon Registry — @workspace/design-system
 *
 * !! GENERATED FILE — do not edit by hand.
 * !! Edit icons.json via the lucide-manager picker, then run: lucide-manager generate
 *
 * Source of truth: lucide-manager.config.json → iconsJsonPath
 */

import * as Lucide from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ── Icon registry ──────────────────────────────────────────────────────────────

const ICONS = {
${registryLines}
} as const;

// ── Auto-wrap ──────────────────────────────────────────────────────────────────

type WrappedIconMap = { [K in keyof typeof ICONS]: ReturnType<typeof createIconWrapper> };

const wrappedIcons = Object.fromEntries(
  Object.entries(ICONS).map(([name, icon]) => [name, createIconWrapper(icon, name)]),
) as WrappedIconMap;

// ── Public API ─────────────────────────────────────────────────────────────────

/** All registered icons as a strongly-typed object. Destructure at the call site. */
export const icons = wrappedIcons;

/** Union of all registered icon export names. */
export type IconName = keyof typeof ICONS;

/** Sorted list of all registered icon names (useful for pickers / docs). */
export const ICON_NAMES = (Object.keys(ICONS) as IconName[]).sort();

/** Type of any wrapped icon component returned by \`createIconWrapper\`. */
export type IconComponent = ReturnType<typeof createIconWrapper>;
`;

// ── Build index.ts ─────────────────────────────────────────────────────────────

const namedExports = entries
  .map(({ exportName }) => `  ${exportName}Icon,`)
  .join('\n');

const indexTsContent = `\
/**
 * icons/index.ts — @workspace/design-system
 *
 * !! GENERATED FILE — do not edit by hand.
 * !! Edit icons.json via the lucide-manager picker, then run: lucide-manager generate
 */

import { icons } from './icons';

export type { IconComponent, IconName } from './icons';
export { ICON_NAMES, icons } from './icons';

// Named icon exports
export const {
${namedExports}
} = icons;

// Expose wrapper factory for consumers who need to register app-specific icons
export type { IconProps } from './icons.utils';
export { createIconWrapper } from './icons.utils';
`;

// ── Write ──────────────────────────────────────────────────────────────────────

fs.writeFileSync(tsPath, iconsTsContent, 'utf8');
fs.writeFileSync(indexPath, indexTsContent, 'utf8');

console.log(`✓ Written ${path.relative(process.cwd(), tsPath)}`);
console.log(`✓ Written ${path.relative(process.cwd(), indexPath)}`);
console.log(`  ${entries.length} icons registered`);
