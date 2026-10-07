const fs = require('fs');
const content =
  'import { ValidationError } from "semburat-shared";\n\n' +
  'export class URL {\n' +
  '  constructor(value) {\n' +
  '    this.value = value;\n' +
  '  }\n\n' +
  '  static fromString(input) {\n' +
  '    const trimmed = input.trim();\n' +
  '    if (!trimmed) {\n' +
  '      throw new ValidationError("URL cannot be empty");\n' +
  '    }\n\n' +
  '    let url;\n' +
  '    try {\n' +
  '      url = new globalThis.URL(trimmed);\n' +
  '    } catch {\n' +
  '      throw new ValidationError("Invalid URL format");\n' +
  '    }\n\n' +
  '    if (url.protocol !== "http:" && url.protocol !== "https:") {\n' +
  '      throw new ValidationError("URL must use http or https protocol");\n' +
  '    }\n\n' +
  '    const normalized = url.protocol + "//" + url.hostname.toLowerCase() + url.pathname + url.search + url.hash;\n' +
  '    return new URL(normalized);\n' +
  '  }\n\n' +
  '  toString() {\n' +
  '    return this.value;\n' +
  '  }\n\n' +
  '  getHostname() {\n' +
  '    try {\n' +
  '      return new globalThis.URL(this.value).hostname;\n' +
  '    } catch {\n' +
  '      return "";\n' +
  '    }\n' +
  '  }\n\n' +
  '  equals(other) {\n' +
  '    return this.value === other.value;\n' +
  '  }\n' +
  '}\n';
fs.writeFileSync('E:/semburat-project/packages/domain/src/value-objects/URL.ts', content);
console.log('URL.ts written');
