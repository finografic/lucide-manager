import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { SERVER } from './src/config/defaults';
import { iconsJsonPlugin } from './src/server/plugin';

export default defineConfig({
  plugins: [
    react(),
    iconsJsonPlugin(),
  ],
  server: {
    port: SERVER.port,
    open: SERVER.open,
  },
});
