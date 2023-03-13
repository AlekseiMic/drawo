import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  build: {
    outDir: 'dist/client'
  },
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@plugins': path.resolve(__dirname, 'plugins'),
    },
  },
});
