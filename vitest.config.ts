import { defineConfig } from 'vitest/config';

export default defineConfig({
  envPrefix: 'VAR_',
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: 'text',
    },
  },
});
