const fs = require('fs');

function fixValueObject(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log('Fixed:', filePath);
}

// Fix RiskLevel.ts
fixValueObject(
  'E:/semburat-project/packages/domain/src/value-objects/RiskLevel.ts',
  `import { ValidationError } from "../../packages/shared/src/index.js";

export type RiskLevelValue = "LOW" | "MEDIUM" | "HIGH";

export class RiskLevel {
  public readonly value: RiskLevelValue;

  private constructor(value: RiskLevelValue) {
    this.value = value;
  }

  static fromString(input: string): RiskLevel {
    const upper = input.trim().toUpperCase();
    if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH") {
      return new RiskLevel(upper);
    }
    throw new ValidationError(\`Invalid risk level: \${input}. Must be LOW, MEDIUM, or HIGH\`);
  }

  static fromScore(score: number): RiskLevel {
    if (score >= 70) return new RiskLevel("HIGH");
    if (score >= 40) return new RiskLevel("MEDIUM");
    return new RiskLevel("LOW");
  }

  isHighRisk(): boolean {
    return this.value === "HIGH";
  }

  toString(): string {
    return this.value;
  }

  equals(other: RiskLevel): boolean {
    return this.value === other.value;
  }
}
`
);

// Fix URL.ts
fixValueObject(
  'E:/semburat-project/packages/domain/src/value-objects/URL.ts',
  `import { ValidationError } from "../../packages/shared/src/index.js";

export class URL {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static fromString(input: string): URL {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new ValidationError("URL cannot be empty");
    }

    let url: URL;
    try {
      url = new globalThis.URL(trimmed);
    } catch {
      throw new ValidationError("Invalid URL format");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new ValidationError("URL must use http or https protocol");
    }

    const normalized = url.protocol + "//" + url.hostname.toLowerCase() + url.pathname + url.search + url.hash;
    return new URL(normalized);
  }

  toString(): string {
    return this.value;
  }

  getHostname(): string {
    try {
      return new globalThis.URL(this.value).hostname;
    } catch {
      return "";
    }
  }

  equals(other: URL): boolean {
    return this.value === other.value;
  }
}
`
);

// Fix Slug.ts
fixValueObject(
  'E:/semburat-project/packages/domain/src/value-objects/Slug.ts',
  `import { ValidationError } from "../../packages/shared/src/index.js";

export class Slug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static fromString(input: string): Slug {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      throw new ValidationError("Slug cannot be empty");
    }
    if (trimmed.length > 100) {
      throw new ValidationError("Slug cannot exceed 100 characters");
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      throw new ValidationError("Slug must contain only lowercase alphanumeric characters and hyphens, no consecutive hyphens");
    }
    if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
      throw new ValidationError("Slug cannot start or end with a hyphen");
    }
    if (trimmed.includes("--")) {
      throw new ValidationError("Slug cannot contain consecutive hyphens");
    }
    return new Slug(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
`
);

// Fix QualityScore.ts
fixValueObject(
  'E:/semburat-project/packages/domain/src/value-objects/QualityScore.ts',
  `import { ValidationError } from "../../packages/shared/src/index.js";

export class QualityScore {
  public readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static fromNumber(input: number): QualityScore {
    if (!Number.isInteger(input)) {
      throw new ValidationError("Quality score must be an integer");
    }
    if (input < 0 || input > 100) {
      throw new ValidationError("Quality score must be between 0 and 100");
    }
    return new QualityScore(input);
  }

  getValue(): number {
    return this.value;
  }

  isPassing(): boolean {
    return this.value >= 75;
  }

  isAutoPublishable(): boolean {
    return this.value >= 90;
  }

  isRejected(): boolean {
    return this.value < 60;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: QualityScore): boolean {
    return this.value === other.value;
  }
}
`
);

console.log('Done fixing value objects');
