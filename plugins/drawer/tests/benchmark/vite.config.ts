import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  server: {
    port: 4322,
    open: '/',
  },
});
