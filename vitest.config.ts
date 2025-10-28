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
      thresholds: {
        lines: 94,
        statements: 94,
        branches: 84,
        functions: 100,
      },
    },
  },
});
