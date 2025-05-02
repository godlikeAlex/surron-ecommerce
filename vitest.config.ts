import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default defineConfig(
  mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text'],
        },
      },
    })
  )
);
