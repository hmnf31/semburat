const fs = require('fs');
const packages = [
  'E:\\semburat-project\\package.json',
  'E:\\semburat-project\\apps\\web\\package.json',
  'E:\\semburat-project\\apps\\worker\\package.json',
  'E:\\semburat-project\\packages\\domain\\package.json',
  'E:\\semburat-project\\packages\\db\\package.json',
  'E:\\semburat-project\\packages\\infra\\package.json',
  'E:\\semburat-project\\packages\\shared\\package.json',
];
for (const pkg of packages) {
  const content = JSON.stringify(JSON.parse(fs.readFileSync(pkg, 'utf8')), null, 2);
  fs.writeFileSync(pkg, content, 'utf8');
  console.log('Fixed:', pkg);
}
