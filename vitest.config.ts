import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      enabled: true,
      thresholds: {
        lines: 93,
        statements: 93,
        branches: 82,
        functions: 100,
      },
    },
  },
});
