import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.config.*', '**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@semburat/domain': path.resolve(__dirname, 'packages/domain/src/index.ts'),
      '@semburat/db': path.resolve(__dirname, 'packages/db/src/index.ts'),
      '@semburat/infra': path.resolve(__dirname, 'packages/infra/src/index.ts'),
      '@semburat/shared': path.resolve(__dirname, 'packages/shared/src/index.ts'),
    },
  },
});
