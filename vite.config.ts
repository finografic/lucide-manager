import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { iconsJsonPlugin } from './src/server/plugin';

export default defineConfig({
  plugins: [
    react(),
    iconsJsonPlugin(),
  ],
  server: {
    port: 5199,
    open: true,
  },
});
