/**
 * Lucide Manager configuration types.
 *
 * Keep in sync with lucide-manager.config.schema.json (canonical for JSON validation).
 * TypeScript cannot infer these types from the schema at compile time without a codegen
 * step — update both when adding or changing config fields.
 */

/** Host icons API — external Hono/backend (not owned by lucide-manager). */
export interface LucideManagerIconsApiConfig {
  /** Hostname or IP (no URL scheme). */
  host: string;
  port: number;
}

/** Lucide-manager Vite dev server for the picker UI. */
export interface LucideManagerServerConfig {
  port: number;
  openOnStart: boolean;
}

/** Sidebar logo + title (optional in JSON; all fields required when object is present). */
export interface LucideManagerAppBranding {
  title: string;
  /** URL, site-root path, or relative file path (e.g. ./logo.svg). Omit to show no image. */
  img?: string;
  showInSidebar: boolean;
}

/** This package — picker dev server and UI settings. */
export interface LucideManagerManagerConfig {
  server: LucideManagerServerConfig;
  appBranding?: LucideManagerAppBranding;
}

/** On-disk shape for lucide-manager.defaults.json and lucide-manager.config.json. */
export interface LucideManagerConfig {
  iconsApi: LucideManagerIconsApiConfig;
  manager: LucideManagerManagerConfig;
}

/** Deep partial for layered merge (defaults → host → env). */
export interface LucideManagerConfigOverrides {
  iconsApi?: Partial<LucideManagerIconsApiConfig>;
  manager?: {
    server?: Partial<LucideManagerServerConfig>;
    appBranding?: Partial<LucideManagerAppBranding>;
  };
}

/** Resolved config returned by loadConfig (includes computed iconsApi.url). */
export interface LucideManagerResolvedConfig {
  iconsApi: LucideManagerIconsApiConfig & { url: string };
  manager: {
    server: LucideManagerServerConfig;
    appBranding: Required<Omit<LucideManagerAppBranding, 'img'>> & { img?: string };
  };
}
