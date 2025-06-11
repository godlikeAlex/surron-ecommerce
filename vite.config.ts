import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@modules-mocks': path.resolve(__dirname, '__mocks__'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  envPrefix: 'VAR_',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
