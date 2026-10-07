const fs = require('fs');
const content =
  'import { describe, it, expect } from "vitest";\n' +
  'import { QualityGate } from "../../src/services/QualityGate.js";\n' +
  'import { Article, ArticleStatus, FactCheckStatus } from "../../src/entities/Article.js";\n' +
  'import { Fact, VerificationStatus } from "../../src/entities/Fact.js";\n' +
  'import { Asset, AssetType } from "../../src/entities/Asset.js";\n' +
  'import { LicenseState } from "../../src/entities/Source.js";\n' +
  'import { Slug } from "../../src/value-objects/Slug.js";\n' +
  'import { RiskLevel } from "../../src/value-objects/RiskLevel.js";\n' +
  'import { QualityScore } from "../../src/value-objects/QualityScore.js";\n\n' +
  'describe("QualityGate", () => {\n' +
  '  const gate = new QualityGate();\n\n' +
  '  const createArticle = (overrides = {}) => new Article({\n' +
  '    id: "a1",\n' +
  '    researchId: "r1",\n' +
  '    title: "Test Article Title Here",\n' +
  '    slug: Slug.fromString("test-article"),\n' +
  '    dek: "This is a valid dek for the test article",\n' +
  '    summary: "Summary",\n' +
  '    body: "Body content that is long enough to pass validation requirements for the quality gate check.",\n' +
  '    category: "news",\n' +
  '    status: ArticleStatus.APPROVED,\n' +
  '    ...overrides,\n' +
  '  });\n\n' +
  '  const createFacts = (count, status = VerificationStatus.VERIFIED) =>\n' +
  '    Array.from({ length: count }, (_, i) => new Fact({\n' +
  '      id: "f" + i,\n' +
  '      articleId: "a1",\n' +
  '      statement: "Fact " + i,\n' +
  '      verificationStatus: status,\n' +
  '      confidence: 0.8,\n' +
  '    }));\n\n' +
  '  const createAssets = (count, license = LicenseState.LICENSED) =>\n' +
  '    Array.from({ length: count }, (_, i) => new Asset({\n' +
  '      id: "asset" + i,\n' +
  '      articleId: "a1",\n' +
  '      type: AssetType.IMAGE,\n' +
  '      storageKey: "asset" + i + ".jpg",\n' +
  '      licenseState: license,\n' +
  '    }));\n\n' +
  '  it("should pass for high quality article", () => {\n' +
  '    const article = createArticle({ seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(5);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(true);\n' +
  '    expect(result.score).toBeGreaterThanOrEqual(75);\n' +
  '    expect(result.issues).toHaveLength(0);\n' +
  '  });\n\n' +
  '  it("should fail for insufficient source coverage", () => {\n' +
  '    const article = createArticle({ seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(2);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("source coverage"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("should fail for asset provenance issues", () => {\n' +
  '    const article = createArticle({ seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(5);\n' +
  '    const assets = createAssets(1, LicenseState.UNKNOWN);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("Asset provenance"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("should fail for high risk content", () => {\n' +
  '    const article = createArticle({ riskLevel: RiskLevel.fromString("HIGH"), seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(5);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("High-risk"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("should fail for low fact verification rate", () => {\n' +
  '    const article = createArticle({ seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(10, VerificationStatus.UNVERIFIED);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("70%"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("should fail for short article body", () => {\n' +
  '    const article = createArticle({ body: "Short", seoTitle: "SEO Title That Is Long Enough", metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(5);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("too short"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("should fail for missing SEO title", () => {\n' +
  '    const article = createArticle({ metaDescription: "Meta description that is long enough for validation purposes." });\n' +
  '    const facts = createFacts(5);\n' +
  '    const assets = createAssets(1);\n' +
  '    const result = gate.evaluate(article, facts, assets);\n' +
  '    expect(result.passed).toBe(false);\n' +
  '    expect(result.issues.some(i => i.includes("SEO title"))).toBe(true);\n' +
  '  });\n\n' +
  '  it("checkAssetProvenance should return true for all publishable assets", () => {\n' +
  '    const assets = createAssets(3, LicenseState.LICENSED);\n' +
  '    expect(gate.checkAssetProvenance(assets)).toBe(true);\n' +
  '  });\n\n' +
  '  it("checkAssetProvenance should return false for any non-publishable asset", () => {\n' +
  '    const assets = [...createAssets(2, LicenseState.LICENSED), ...createAssets(1, LicenseState.UNKNOWN)];\n' +
  '    expect(gate.checkAssetProvenance(assets)).toBe(false);\n' +
  '  });\n\n' +
  '  it("checkRiskPolicy should return false for HIGH risk", () => {\n' +
  '    expect(gate.checkRiskPolicy(RiskLevel.fromString("HIGH"))).toBe(false);\n' +
  '  });\n\n' +
  '  it("checkRiskPolicy should return true for MEDIUM and LOW risk", () => {\n' +
  '    expect(gate.checkRiskPolicy(RiskLevel.fromString("MEDIUM"))).toBe(true);\n' +
  '    expect(gate.checkRiskPolicy(RiskLevel.fromString("LOW"))).toBe(true);\n' +
  '  });\n' +
  '});\n';
fs.writeFileSync('E:/semburat-project/packages/domain/tests/services/QualityGate.test.ts', content);
console.log('QualityGate.test.ts written');
