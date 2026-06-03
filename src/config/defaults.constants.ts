/**
 * Defaults.constants.ts
 *
 * Config filenames and non-config constants. Default values live in
 * lucide-manager.defaults.json (merged with lucide-manager.config.json).
 */

/** Host package config — same schema as lucide-manager.defaults.json; overrides defaults. */
export const CONFIG_FILENAME = 'lucide-manager.config.json';

/** Package-only defaults shipped with @finografic/lucide-manager. */
export const PACKAGE_DEFAULTS_FILENAME = 'lucide-manager.defaults.json';

/** JSON Schema for defaults + host config (IDE validation). */
export const CONFIG_SCHEMA_FILENAME = 'lucide-manager.config.schema.json';

/** Grid preview size (~15% above original 28px). */
export const ICON_GRID_SIZE = 32;

/** Detail footer preview size (~15% above original 36px). */
export const ICON_DETAIL_SIZE = 41;

/** Fallback when manager.appBranding is omitted from merged JSON (also in lucide-manager.defaults.json). */
export const DEFAULT_APP_BRANDING = {
  title: 'Lucide Manager',
  img: '/lucide.png',
  showInSidebar: true,
} as const;
