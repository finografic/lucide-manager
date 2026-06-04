/**
 * Load-config.utils.ts
 *
 * Deep-merges package defaults with the host lucide-manager.config.json:
 *
 * MergeConfig(defaults, hostConfig, envOverrides)
 *
 * Config shape: lucide-manager.config.schema.json ↔ LucideManagerConfig
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  LucideManagerAppBranding,
  LucideManagerConfigOverrides,
  LucideManagerResolvedConfig,
} from './lucide-manager.config.types';

import { CONFIG_FILENAME, DEFAULT_APP_BRANDING, PACKAGE_DEFAULTS_FILENAME } from './defaults.constants';

export type {
  LucideManagerConfig,
  LucideManagerConfigOverrides,
  LucideManagerResolvedConfig,
  LucideManagerAppBranding,
} from './lucide-manager.config.types';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const DEFAULT_ICONS_API_PROTOCOL = 'http';

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

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function mergeConfig(...layers: LucideManagerConfigOverrides[]): LucideManagerConfigOverrides {
  const merged: LucideManagerConfigOverrides = {};

  for (const layer of layers) {
    if (layer.iconsApi) {
      merged.iconsApi = { ...merged.iconsApi, ...layer.iconsApi };
    }
    if (layer.manager) {
      merged.manager = {
        ...merged.manager,
        ...layer.manager,
        server: { ...merged.manager?.server, ...layer.manager.server },
        appBranding: layer.manager.appBranding
          ? { ...merged.manager?.appBranding, ...layer.manager.appBranding }
          : merged.manager?.appBranding,
      };
    }
  }

  return merged;
}

function iconsApiUrl(host: string, port: number): string {
  return `${DEFAULT_ICONS_API_PROTOCOL}://${host}:${port}`;
}

const IMG_MIME_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  ico: 'image/x-icon',
};

function resolveImgToDataUrl(img: string, configDir: string): string {
  if (img.startsWith('data:') || img.startsWith('/') || img.startsWith('http')) {
    return img;
  }

  const absPath = path.resolve(configDir, img);

  if (!fs.existsSync(absPath)) {
    throw new Error(`[lucide-manager] appBranding.img file not found: "${absPath}"`);
  }

  const ext = path.extname(absPath).toLowerCase().slice(1);
  const mime = IMG_MIME_TYPES[ext] ?? 'image/png';
  const data = fs.readFileSync(absPath).toString('base64');

  return `data:${mime};base64,${data}`;
}

function resolveAppBranding(partial: LucideManagerConfigOverrides): LucideManagerAppBranding {
  const { title, img, showInSidebar } = {
    ...DEFAULT_APP_BRANDING,
    ...partial.manager?.appBranding,
  };

  if (!title) {
    throw new Error('[lucide-manager] Config is missing "manager.appBranding.title".');
  }

  if (!img) {
    throw new Error('[lucide-manager] Config is missing "manager.appBranding.img".');
  }

  if (showInSidebar === undefined) {
    throw new Error('[lucide-manager] Config is missing "manager.appBranding.showInSidebar".');
  }

  return { title, img, showInSidebar };
}

function loadPackageDefaults(): LucideManagerConfigOverrides {
  const defaultsPath = path.join(PKG_ROOT, PACKAGE_DEFAULTS_FILENAME);

  if (!fs.existsSync(defaultsPath)) {
    throw new Error(
      `[lucide-manager] Missing package defaults file "${PACKAGE_DEFAULTS_FILENAME}" at ${PKG_ROOT}.`,
    );
  }

  return readJsonFile<LucideManagerConfigOverrides>(defaultsPath);
}

function resolveConfig(merged: LucideManagerConfigOverrides): LucideManagerResolvedConfig {
  const host = merged.iconsApi?.host;
  const iconsPort = merged.iconsApi?.port;
  const pickerPort = merged.manager?.server?.port;
  const openOnStart = merged.manager?.server?.openOnStart;

  if (!host) {
    throw new Error('[lucide-manager] Config is missing "iconsApi.host".');
  }

  if (iconsPort === undefined) {
    throw new Error('[lucide-manager] Config is missing "iconsApi.port".');
  }

  if (pickerPort === undefined) {
    throw new Error('[lucide-manager] Config is missing "manager.server.port".');
  }

  if (openOnStart === undefined) {
    throw new Error('[lucide-manager] Config is missing "manager.server.openOnStart".');
  }

  return {
    iconsApi: {
      host,
      port: iconsPort,
      url: iconsApiUrl(host, iconsPort),
    },
    manager: {
      server: {
        port: pickerPort,
        openOnStart,
      },
      appBranding: resolveAppBranding(merged),
    },
  };
}

function findHostConfigFile(startDir: string): string | null {
  let dir = path.resolve(startDir);
  const { root } = path.parse(dir);

  while (dir !== root) {
    const candidate = path.join(dir, CONFIG_FILENAME);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    dir = path.dirname(dir);
  }

  return null;
}

const HOST_CONFIG_EXAMPLE = `{
  "$schema": "./node_modules/@finografic/lucide-manager/lucide-manager.config.schema.json",
  "iconsApi": {
    "host": "localhost",
    "port": 3001
  },
  "manager": {
    "server": {
      "port": 5199,
      "openOnStart": true
    },
    "appBranding": {
      "title": "Lucide Manager",
      "img": "/lucide.png",
      "showInSidebar": true
    }
  }
}`;

export function loadConfig(
  startDir: string = process.env['LUCIDE_MANAGER_HOST_CWD'] ?? process.cwd(),
): LucideManagerResolvedConfig {
  const cwd = path.resolve(startDir);
  const envOpenOverride = parseOpenOverride(process.env['LUCIDE_MANAGER_OPEN']);
  const defaults = loadPackageDefaults();

  const envOverrides: LucideManagerConfigOverrides =
    envOpenOverride === undefined ? {} : { manager: { server: { openOnStart: envOpenOverride } } };

  if (cwd === PKG_ROOT) {
    return resolveConfig(mergeConfig(defaults, envOverrides));
  }

  const hostConfigPath = findHostConfigFile(cwd);

  if (!hostConfigPath) {
    throw new Error(
      `[lucide-manager] Could not find "${CONFIG_FILENAME}" in "${startDir}" or any parent directory.\n\n` +
        `Create "${CONFIG_FILENAME}" in your package root (see lucide-manager.config.schema.json):\n\n` +
        `${HOST_CONFIG_EXAMPLE}\n`,
    );
  }

  const hostConfig = readJsonFile<LucideManagerConfigOverrides>(hostConfigPath);

  if (hostConfig.manager?.appBranding?.img) {
    hostConfig.manager.appBranding.img = resolveImgToDataUrl(
      hostConfig.manager.appBranding.img,
      path.dirname(hostConfigPath),
    );
  }

  return resolveConfig(mergeConfig(defaults, hostConfig, envOverrides));
}
