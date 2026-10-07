const fs = require('fs');
const content =
  'import { ValidationError } from "semburat-shared";\n\n' +
  'export type RiskLevelValue = "LOW" | "MEDIUM" | "HIGH";\n\n' +
  'export class RiskLevel {\n' +
  '  constructor(value) {\n' +
  '    this.value = value;\n' +
  '  }\n\n' +
  '  static fromString(input) {\n' +
  '    const upper = input.trim().toUpperCase();\n' +
  '    if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH") {\n' +
  '      return new RiskLevel(upper);\n' +
  '    }\n' +
  '    throw new ValidationError(`Invalid risk level: ${input}. Must be LOW, MEDIUM, or HIGH`);\n' +
  '  }\n\n' +
  '  static fromScore(score) {\n' +
  '    if (score >= 70) return new RiskLevel("HIGH");\n' +
  '    if (score >= 40) return new RiskLevel("MEDIUM");\n' +
  '    return new RiskLevel("LOW");\n' +
  '  }\n\n' +
  '  isHighRisk() {\n' +
  '    return this.value === "HIGH";\n' +
  '  }\n\n' +
  '  toString() {\n' +
  '    return this.value;\n' +
  '  }\n\n' +
  '  equals(other) {\n' +
  '    return this.value === other.value;\n' +
  '  }\n' +
  '}\n';
fs.writeFileSync('E:/semburat-project/packages/domain/src/value-objects/RiskLevel.ts', content);
console.log('RiskLevel.ts written');
