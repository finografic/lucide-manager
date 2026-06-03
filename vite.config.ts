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
      '@': path.resolve(import.meta.dirname, './src'),
    },
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
