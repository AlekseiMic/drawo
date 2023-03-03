import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, 'public'),
  server: {
    port: 4320,
  },
});
