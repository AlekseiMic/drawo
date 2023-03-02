import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  server: {
    port: 4322,
    open: '/plugins/drawer/tests/benchmark/main.html',
  },
});
