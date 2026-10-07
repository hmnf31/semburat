const fs = require('fs');
const path = require('path');

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /from ["\x27]semburat-shared["\x27]/g,
    'from "../../packages/shared/src/index.js"'
  );
  content = content.replace(
    /from ["\x27]semburat-shared\/errors["\x27]/g,
    'from "../../packages/shared/src/errors.js"'
  );
  content = content.replace(
    /from ["\x27]semburat-shared\/types["\x27]/g,
    'from "../../packages/shared/src/types.js"'
  );
  fs.writeFileSync(filePath, content);
  console.log('Fixed:', filePath);
}

const domainSrc = 'E:/semburat-project/packages/domain/src';
const domainTests = 'E:/semburat-project/packages/domain/tests';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts')) {
      fixImports(fullPath);
    }
  }
}

walk(domainSrc);
walk(domainTests);
console.log('Done fixing imports');
