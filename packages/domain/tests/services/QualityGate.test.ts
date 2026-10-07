import { describe, it, expect } from 'vitest';
import { QualityGate } from '../../src/services/QualityGate.js';
import { Article, ArticleStatus, FactCheckStatus } from '../../src/entities/Article.js';
import { Fact, VerificationStatus } from '../../src/entities/Fact.js';
import { Asset, AssetType } from '../../src/entities/Asset.js';
import { LicenseState } from '../../src/entities/Source.js';
import { Slug } from '../../src/value-objects/Slug.js';
import { RiskLevel } from '../../src/value-objects/RiskLevel.js';
import { QualityScore } from '../../src/value-objects/QualityScore.js';

describe('QualityGate', () => {
  const gate = new QualityGate();

  const createArticle = (overrides = {}) =>
    new Article({
      id: 'a1',
      researchId: 'r1',
      title: 'Test Article Title Here That Is Long Enough',
      slug: Slug.fromString('test-article'),
      dek: 'This is a valid dek for the test article that is long enough',
      summary: 'Summary',
      body: 'Body content that is long enough to pass validation requirements for the quality gate check. This body should be more than 500 characters to pass the quality gate check for article length. Adding more text to ensure it passes the five hundred character minimum required by the quality gate evaluation. More text to make it longer than five hundred characters for the quality gate test to pass successfully. Additional content to ensure the body exceeds the minimum five hundred character threshold required by the quality gate system. This paragraph adds even more characters to guarantee the test passes without any issues related to body length validation.',
      category: 'news',
      status: ArticleStatus.APPROVED,
      seoTitle: 'SEO Title That Is Long Enough For Validation',
      metaDescription:
        'Meta description that is long enough for validation purposes and meets the minimum character requirement of one hundred twenty characters for the quality gate check.',
      ...overrides,
    });

  const createFacts = (count: number, status = VerificationStatus.VERIFIED) =>
    Array.from(
      { length: count },
      (_, i: number) =>
        new Fact({
          id: 'f' + i,
          articleId: 'a1',
          statement: 'Fact ' + i,
          verificationStatus: status,
          confidence: 0.8,
        })
    );

  const createAssets = (count: number, license = LicenseState.LICENSED) =>
    Array.from(
      { length: count },
      (_, i: number) =>
        new Asset({
          id: 'asset' + i,
          articleId: 'a1',
          type: AssetType.IMAGE,
          storageKey: 'asset' + i + '.jpg',
          licenseState: license,
        })
    );

  it('should pass for high quality article', () => {
    const article = createArticle();
    const facts = createFacts(5);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.issues).toHaveLength(0);
  });

  it('should fail for insufficient source coverage', () => {
    const article = createArticle();
    const facts = createFacts(2);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('source coverage'))).toBe(true);
  });

  it('should fail for asset provenance issues', () => {
    const article = createArticle();
    const facts = createFacts(5);
    const assets = createAssets(1, LicenseState.UNKNOWN);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('Asset provenance'))).toBe(true);
  });

  it('should fail for high risk content', () => {
    const article = createArticle({
      riskLevel: RiskLevel.fromString('HIGH'),
    });
    const facts = createFacts(5);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('High-risk'))).toBe(true);
  });

  it('should fail for low fact verification rate', () => {
    const article = createArticle();
    const facts = createFacts(10, VerificationStatus.UNVERIFIED);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('70%'))).toBe(true);
  });

  it('should fail for short article body', () => {
    const article = createArticle({
      body: 'This body is long enough to pass entity validation but not quality gate. It has more than one hundred characters but less than five hundred characters for testing purposes.',
    });
    const facts = createFacts(5);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('too short'))).toBe(true);
  });

  it('should fail for missing SEO title', () => {
    const article = createArticle({
      seoTitle: undefined,
      metaDescription:
        'Meta description that is long enough for validation purposes and meets the minimum character requirement of one hundred twenty characters for the quality gate check.',
    });
    const facts = createFacts(5);
    const assets = createAssets(1);
    const result = gate.evaluate(article, facts, assets);
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes('SEO title'))).toBe(true);
  });

  it('checkAssetProvenance should return true for all publishable assets', () => {
    const assets = createAssets(3, LicenseState.LICENSED);
    expect(gate.checkAssetProvenance(assets)).toBe(true);
  });

  it('checkAssetProvenance should return false for any non-publishable asset', () => {
    const assets = [
      ...createAssets(2, LicenseState.LICENSED),
      ...createAssets(1, LicenseState.UNKNOWN),
    ];
    expect(gate.checkAssetProvenance(assets)).toBe(false);
  });

  it('checkRiskPolicy should return false for HIGH risk', () => {
    expect(gate.checkRiskPolicy(RiskLevel.fromString('HIGH'))).toBe(false);
  });

  it('checkRiskPolicy should return true for MEDIUM and LOW risk', () => {
    expect(gate.checkRiskPolicy(RiskLevel.fromString('MEDIUM'))).toBe(true);
    expect(gate.checkRiskPolicy(RiskLevel.fromString('LOW'))).toBe(true);
  });
});
