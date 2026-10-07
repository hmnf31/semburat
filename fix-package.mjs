import fs from 'fs';
const content = JSON.stringify(
  {
    name: 'semburat-shared',
    version: '0.0.0',
    type: 'module',
    scripts: {
      build: 'echo "Shared has no build step"',
      lint: 'eslint src/',
      'lint:fix': 'eslint src/ --fix',
      test: 'vitest run src/',
      typecheck: 'tsc --noEmit',
      clean: 'rimraf dist',
    },
    dependencies: {
      zod: '^3.22.0',
    },
    devDependencies: {
      typescript: '^5.4.0',
      eslint: '^9.0.0',
      prettier: '^3.2.0',
      vitest: '^1.3.0',
      '@vitest/coverage-v8': '^1.3.0',
    },
  },
  null,
  2
);
fs.writeFileSync('E:\\semburat-project\\packages\\shared\\package.json', content, 'utf8');
