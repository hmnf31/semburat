const fs = require('fs');
let c = fs.readFileSync('packages/infra/tests/chaos/ChaosTests.test.ts', 'utf8');

// Fix the extra slash
c = c.replace(/\/i\//g, '/i');

fs.writeFileSync('packages/infra/tests/chaos/ChaosTests.test.ts', c);
console.log('Fixed extra slashes');
