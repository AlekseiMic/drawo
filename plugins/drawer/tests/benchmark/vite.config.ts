import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  server: {
    port: 4322,
    open: '/',
  },
  resolve: {
    alias: {
      '@plugins': path.resolve(__dirname, '../../'),
    },
  },
});
