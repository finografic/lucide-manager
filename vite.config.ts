import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { loadConfig } from './src/config/load-config.utils';

const config = loadConfig();
const { iconsApi, manager } = config;
const { port: pickerPort, openOnStart } = manager.server;
const { appBranding } = manager;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      components: path.resolve(import.meta.dirname, './src/components'),
      config: path.resolve(import.meta.dirname, './src/config'),
      hooks: path.resolve(import.meta.dirname, './src/hooks'),
      lib: path.resolve(import.meta.dirname, './src/lib'),
      ui: path.resolve(import.meta.dirname, './src/components/ui'),
      utils: path.resolve(import.meta.dirname, './src/lib/utils.ts'),
    },
  },
  optimizeDeps: {
    include: ['use-sync-external-store/shim'],
  },
  define: {
    __ICONS_API_URL__: JSON.stringify(iconsApi.url),
    __APP_BRANDING__: JSON.stringify(appBranding),
  },
  server: {
    strictPort: false,
    port: pickerPort,
    open: openOnStart ? `http://localhost:${pickerPort}/` : false,
  },
});
