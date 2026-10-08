import { defineConfig } from 'vitest/config';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');
const aliasPath = (relative: string) => path.join(root, relative).split(path.sep).join('/');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@semburat/domain': aliasPath('packages/domain/src/index.ts'),
      '@semburat/db': aliasPath('packages/db/src/index.ts'),
      '@semburat/infra': aliasPath('packages/infra/src/index.ts'),
      '@semburat/shared': aliasPath('packages/shared/src/index.ts'),
    },
  },
});
