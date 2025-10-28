import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      enabled: true,
      // thresholds: {
      //   lines: 100,
      //   statements: 100,
      //   branches: 100,
      //   functions: 100,
      // },
    },
  },
});
