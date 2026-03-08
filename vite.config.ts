import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { SERVER } from './src/config/defaults';
import { loadConfig } from './src/config/loadConfig';

const { serverUrl } = loadConfig();

export default defineConfig({
  plugins: [react()],
  define: {
    // Injected at build/dev time so the browser bundle can reach the Hono server.
    // Read from lucide-manager.config.json → serverUrl, or defaults to localhost:3001.
    __ICONS_SERVER_URL__: JSON.stringify(serverUrl),
  },
  server: {
    strictPort: false, // allow auto-increment
    port: SERVER.port,
    open: `http://localhost:${SERVER.port}/`,
  },
});
