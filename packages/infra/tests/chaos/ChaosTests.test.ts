import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TrendDiscoveryService } from '../../src/services/TrendDiscoveryService.js';
import { TrendDeduplicationService } from '../../src/services/TrendDeduplicationService.js';
import { QualityGate } from '@semburat/domain';
import { Article, ArticleStatus, FactCheckStatus } from '@semburat/domain';
import { Fact, VerificationStatus } from '@semburat/domain';
import { Asset, AssetType } from '@semburat/domain';
import { LicenseState } from '@semburat/domain';
import { Slug } from '@semburat/domain';
import { RiskLevel } from '@semburat/domain';
import { QualityScore } from '@semburat/domain';
import { OpenRouterAdapter } from '../../src/adapters/openrouter/OpenRouterAdapter.js';
import { ValidationError } from '@semburat/shared';
import type { TrendRepository } from '@semburat/domain';
import type { ResearchProvider } from '@semburat/domain';
import type { AIProvider } from '@semburat/domain';

describe('Chaos Tests', () => {
  describe('Chaos Test 1: Kill Switch - TrendDiscoveryService can be stopped', () => {
    let mockTrendRepo: TrendRepository;
    let mockResearchProvider: ResearchProvider;
    let mockAIProvider: AIProvider;
    let service: TrendDiscoveryService;

    beforeEach(() => {
      mockTrendRepo = {
        insert: vi.fn(),
        findById: vi.fn(),
        findByNormalizedKey: vi.fn(),
        findByStatus: vi.fn(),
        findByScore: vi.fn(),
        update: vi.fn(),
        upsert: vi.fn(),
      };
      mockResearchProvider = { search: vi.fn(), fetchPage: vi.fn() };
      mockAIProvider = { generateStructured: vi.fn(), generateText: vi.fn(), streamChat: vi.fn() };
      service = new TrendDiscoveryService(mockTrendRepo, mockResearchProvider, mockAIProvider);
    });

    it('should not persist partial data when cancelled mid-execution', async () => {
      let rejectSearch: ((reason: Error) => void) | null = null;
      const searchPromise = new Promise<{ url: string; title: string; snippet: string }[]>(
        (_resolve, reject) => {
          rejectSearch = (reason: Error) => reject(reason);
        }
      );
      vi.mocked(mockResearchProvider.search).mockReturnValue(searchPromise);
      const discoverPromise = service.discoverTrends(['AI']);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const cancellationError = new Error('Kill switch activated');
      (rejectSearch as unknown as (reason: Error) => void | null)?.(cancellationError);
      await expect(discoverPromise).rejects.toThrow('Kill switch activated');
      expect(mockTrendRepo.insert).not.toHaveBeenCalled();
    });

    it('should not persist data when research provider throws during processing', async () => {
      vi.mocked(mockResearchProvider.search).mockRejectedValue(
        new Error('Kill switch: research interrupted')
      );
      await expect(service.discoverTrends(['AI'])).rejects.toThrow(
        'Kill switch: research interrupted'
      );
      expect(mockTrendRepo.insert).not.toHaveBeenCalled();
    });
  });

  describe('Chaos Test 2: Retry with Backoff - OpenRouterAdapter retries with exponential backoff', () => {
    it('should retry 3 times with exponential backoff on network failures', async () => {
      let attempt = 0;
      const mockFetch = vi.fn().mockImplementation(() => {
        attempt++;
        if (attempt <= 2) {
          throw new Error('Network error');
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'success' } }] }),
        });
      });
      const adapter = new OpenRouterAdapter({
        apiKey: 'test-key',
        fetch: mockFetch,
        maxRetries: 2,
      });
      const startTime = Date.now();
      const result = await adapter.generateText('test prompt');
      const elapsed = Date.now() - startTime;
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toBe('success');
      const expectedMinDelay = 200 + 400;
      expect(elapsed).toBeGreaterThanOrEqual(expectedMinDelay - 50);
    });

    it('should retry with exponential backoff on 5xx errors', async () => {
      let attempt = 0;
      const mockFetch = vi.fn().mockImplementation(() => {
        attempt++;
        if (attempt <= 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Server error'),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'success' } }] }),
        });
      });
      const adapter = new OpenRouterAdapter({
        apiKey: 'test-key',
        fetch: mockFetch,
        maxRetries: 2,
      });
      const startTime = Date.now();
      const result = await adapter.generateText('test prompt');
      const elapsed = Date.now() - startTime;
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toBe('success');
      const expectedMinDelay = 200 + 400;
      expect(elapsed).toBeGreaterThanOrEqual(expectedMinDelay - 50);
    });

    it('should retry with exponential backoff on 429 rate limit', async () => {
      let attempt = 0;
      const mockFetch = vi.fn().mockImplementation(() => {
        attempt++;
        if (attempt <= 2) {
          return Promise.resolve({
            ok: false,
            status: 429,
            text: () => Promise.resolve('Rate limited'),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'success' } }] }),
        });
      });
      const adapter = new OpenRouterAdapter({
        apiKey: 'test-key',
        fetch: mockFetch,
        maxRetries: 2,
      });
      const startTime = Date.now();
      const result = await adapter.generateText('test prompt');
      const elapsed = Date.now() - startTime;
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toBe('success');
      const expectedMinDelay = 200 + 400;
      expect(elapsed).toBeGreaterThanOrEqual(expectedMinDelay - 50);
    });
  });

  describe('Chaos Test 3: Duplicate Detection - TrendDeduplicationService catches duplicates', () => {
    const service = new TrendDeduplicationService();

    it('should mark only first occurrence as non-duplicate', () => {
      const trends = [
        { normalizedKey: 'ai-trend', title: 'AI Trend' },
        { normalizedKey: 'ai-trend', title: 'AI Trend Again' },
        { normalizedKey: 'ai-trend', title: 'AI Trend Third' },
        { normalizedKey: 'different-key', title: 'Different' },
      ];
      const result = service.deduplicate(trends);
      expect(result).toHaveLength(4);
      expect(result[0].isDuplicate).toBe(false);
      expect(result[1].isDuplicate).toBe(true);
      expect(result[2].isDuplicate).toBe(true);
      expect(result[3].isDuplicate).toBe(false);
    });

    it('should handle empty input', () => {
      expect(service.deduplicate([])).toEqual([]);
    });

    it('should handle all unique keys', () => {
      const trends = [
        { normalizedKey: 'key1', title: 'One' },
        { normalizedKey: 'key2', title: 'Two' },
        { normalizedKey: 'key3', title: 'Three' },
      ];
      const result = service.deduplicate(trends);
      expect(result.every((t) => !t.isDuplicate)).toBe(true);
    });
  });

  describe('Chaos Test 4: Quality Gate Blocking - QualityGate blocks low-quality articles', () => {
    const gate = new QualityGate();

    const createLowQualityArticle = () =>
      new Article({
        id: 'a1',
        researchId: 'r1',
        title: 'Low Quality Article',
        slug: Slug.fromString('low-quality-article'),
        dek: 'This is a short dek for testing', // >= 10 chars
        summary: 'Short summary',
        body: 'Short body content that is long enough to pass entity validation but still too short for quality gate check.', // >= 100 chars
        category: 'news',
        status: ArticleStatus.DRAFT,
        riskLevel: RiskLevel.fromString('HIGH'),
        qualityScore: QualityScore.fromNumber(0),
        seoTitle: '',
        metaDescription: '',
      });

    it('should fail article with no facts, no sources, high risk', () => {
      const article = createLowQualityArticle();
      const facts: Fact[] = [];
      const assets: Asset[] = [];
      const result = gate.evaluate(article, facts, assets);
      expect(result.passed).toBe(false);
      expect(result.score).toBeLessThan(75);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues.some((i) => i.includes('source coverage'))).toBe(true);
      expect(result.issues.some((i) => i.includes('High-risk'))).toBe(true);
      expect(result.issues.some((i) => i.includes('too short'))).toBe(true);
      expect(result.issues.some((i) => i.includes('SEO title'))).toBe(true);
      expect(result.issues.some((i) => i.includes('Meta description'))).toBe(true);
    });

    it('should fail article with insufficient facts', () => {
      const article = new Article({
        id: 'a1',
        researchId: 'r1',
        title: 'Test Article With Enough Title Length',
        slug: Slug.fromString('test-article'),
        dek: 'This is a valid dek for the test article that is long enough',
        summary: 'Summary',
        body: 'Body content that is long enough to pass validation requirements for the quality gate check. This body should be more than 500 characters to pass the quality gate check for article length. Adding more text to ensure it passes the five hundred character minimum required by the quality gate evaluation. More text to make it longer than five hundred characters for the quality gate test to pass successfully. Additional content to ensure the body exceeds the minimum five hundred character threshold required by the quality gate system.',
        category: 'news',
        status: ArticleStatus.APPROVED,
        seoTitle: 'SEO Title That Is Long Enough For Validation',
        metaDescription:
          'Meta description that is long enough for validation purposes and meets the minimum character requirement of one hundred twenty characters for the quality gate check.',
        riskLevel: RiskLevel.fromString('LOW'),
      });
      const facts = [
        new Fact({
          id: 'f1',
          articleId: 'a1',
          statement: 'Fact 1',
          verificationStatus: VerificationStatus.UNVERIFIED,
          confidence: 0.5,
        }),
      ];
      const assets = [
        new Asset({
          id: 'as1',
          articleId: 'a1',
          type: AssetType.IMAGE,
          storageKey: 'img.jpg',
          licenseState: LicenseState.LICENSED,
        }),
      ];
      const result = gate.evaluate(article, facts, assets);
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => i.includes('source coverage'))).toBe(true);
      expect(result.issues.some((i) => i.includes('70%'))).toBe(true);
    });
  });

  describe('Chaos Test 5: Secret Not in Repo - Verify no secrets committed', () => {
    it('should not have any API keys, tokens, secrets, or passwords in tracked files', () => {
      const fs = require('fs');
      const path = require('path');
      const projectRoot = path.resolve(__dirname, '../../../..');
      const gitLsFiles = require('child_process').execSync('git ls-files', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });
      const files = gitLsFiles
        .trim()
        .split('\n')
        .filter((f: string) => f.length > 0);

      // Patterns that match actual secret VALUES (not field names or documentation)
      const secretPatterns = [
        // Generic API key / token / secret assignments with 16+ char values
        /(api[_-]?key|secret|token|password|passwd)\s*[:=]\s*["'][A-Za-z0-9_.-]{16,}["']/i,
        // Private key blocks
        /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
        // OpenRouter key format: sk-or-<20+ chars>
        /sk-or-[A-Za-z0-9_\-]{20,}/,
        // Telegram bot token format: <8-10 digits>:<35 alphanumeric>
        /[0-9]{8,10}:[A-Za-z0-9_\-]{35}/,
        // MiniMax API key format: MM-<20+ chars>
        /MM-[A-Za-z0-9_\-]{20,}/,
        // Google service-account private key field
        /"private_key"\s*:\s*"[A-Za-z0-9_\-\.]{40,}"/,
        // Generic long random strings assigned to env vars
        /process\.env\.[A-Z_]+\s*=\s*["'][A-Za-z0-9_.-]{20,}["']/i,
      ];

      // Files to exclude from secret scanning
      const excludePatterns = [
        /\.md$/, // Documentation files
        /\.test\./, // Test files
        /\.spec\./, // Spec files
        /\.env\.example$/, // Example env files
        /\.example$/, // Other example files
        /pnpm-lock\.yaml$/, // Lock files
      ];

      const suspiciousFiles = [];
      for (const file of files) {
        // Skip excluded files
        if (excludePatterns.some((p) => p.test(file))) continue;

        const filePath = path.join(projectRoot, file);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, 'utf-8');

        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            suspiciousFiles.push(file);
            break;
          }
        }
      }

      if (suspiciousFiles.length > 0) {
        console.log('Suspicious files found:', suspiciousFiles);
      }
      expect(suspiciousFiles).toHaveLength(0);
    });
  });

  describe('Chaos Test 6: State Machine Validation - Article cannot transition to invalid states', () => {
    const createDraftArticle = () =>
      new Article({
        id: 'a1',
        researchId: 'r1',
        title: 'Test Article Title Here That Is Long Enough',
        slug: Slug.fromString('test-article'),
        dek: 'This is a valid dek for the test article that is long enough',
        summary: 'Summary',
        body: 'Body content that is long enough to pass validation requirements for the quality gate check. This body should be more than 500 characters to pass the quality gate check for article length. Adding more text to ensure it passes the five hundred character minimum required by the quality gate evaluation.',
        category: 'news',
        status: ArticleStatus.DRAFT,
      });

    it('should throw ValidationError when transitioning from DRAFT to PUBLISHED directly', () => {
      const article = createDraftArticle();
      expect(() => article.withStatus(ArticleStatus.PUBLISHED)).toThrow(ValidationError);
      expect(() => article.withStatus(ArticleStatus.PUBLISHED)).toThrow(
        'Cannot transition from draft to published'
      );
    });

    it('should allow valid transitions from DRAFT', () => {
      const article = createDraftArticle();
      const researching = article.withStatus(ArticleStatus.RESEARCHING);
      expect(researching.status).toBe(ArticleStatus.RESEARCHING);
      const needsResearch = article.withStatus(ArticleStatus.NEEDS_RESEARCH);
      expect(needsResearch.status).toBe(ArticleStatus.NEEDS_RESEARCH);
      const rejected = article.withStatus(ArticleStatus.REJECTED);
      expect(rejected.status).toBe(ArticleStatus.REJECTED);
    });

    it('should throw ValidationError for invalid transitions from other states', () => {
      const article = createDraftArticle();
      const researching = article.withStatus(ArticleStatus.RESEARCHING);
      expect(() => researching.withStatus(ArticleStatus.PUBLISHED)).toThrow(ValidationError);
      expect(() => researching.withStatus(ArticleStatus.APPROVED)).toThrow(ValidationError);
      const verified = researching.withStatus(ArticleStatus.VERIFIED);
      expect(() => verified.withStatus(ArticleStatus.PUBLISHED)).toThrow(ValidationError);
      expect(() => verified.withStatus(ArticleStatus.APPROVED)).toThrow(ValidationError);
      const editorialReview = verified.withStatus(ArticleStatus.EDITORIAL_REVIEW);
      const approved = editorialReview.withStatus(ArticleStatus.APPROVED);
      expect(() => approved.withStatus(ArticleStatus.DRAFT)).toThrow(ValidationError);
      expect(() => approved.withStatus(ArticleStatus.RESEARCHING)).toThrow(ValidationError);
    });
  });
});
