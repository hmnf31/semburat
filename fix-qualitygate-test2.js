const fs = require('fs');
let content = fs.readFileSync(
  'E:/semburat-project/packages/domain/tests/services/QualityGate.test.ts',
  'utf8'
);
content = content.replace(
  'const createFacts = (count, status = VerificationStatus.VERIFIED) =>',
  'const createFacts = (count: number, status = VerificationStatus.VERIFIED) =>'
);
content = content.replace(
  'const createAssets = (count, license = LicenseState.LICENSED) =>',
  'const createAssets = (count: number, license = LicenseState.LICENSED) =>'
);
fs.writeFileSync('E:/semburat-project/packages/domain/tests/services/QualityGate.test.ts', content);
console.log('QualityGate.test.ts fixed');
