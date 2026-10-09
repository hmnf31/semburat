import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FactVerificationService } from '../../src/services/FactVerificationService.js';
import { Fact, FactEvidence, SupportType, VerificationStatus } from '@semburat/domain';
import type { AIProvider, FactRepository, FactEvidenceRepository } from '@semburat/domain';

describe('FactVerificationService', () => {
  let mockAIProvider: AIProvider;
  let mockFactRepo: FactRepository;
  let mockFactEvidenceRepo: FactEvidenceRepository;
  let service: FactVerificationService;

  beforeEach(() => {
    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as AIProvider;

    mockFactRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByArticleId: vi.fn(),
      bulkInsert: vi.fn(),
      deleteByArticleId: vi.fn(),
    } as FactRepository;

    mockFactEvidenceRepo = {
      insert: vi.fn(),
      findByFactId: vi.fn(),
      deleteByFactId: vi.fn(),
    } as FactEvidenceRepository;

    service = new FactVerificationService(mockAIProvider, mockFactRepo, mockFactEvidenceRepo);
  });

  it('verifyArticleFacts loads facts for article and updates verification status', async () => {
    const articleId = 'article-123';
    const factId = 'fact-456';

    const fact = new Fact({
      id: factId,
      articleId: articleId,
      statement: 'Indonesia has a population of over 270 million',
      verificationStatus: VerificationStatus.UNVERIFIED,
      confidence: 0,
    });

    const evidence = [
      new FactEvidence({
        factId: factId,
        sourceId: 'source-1',
        evidenceText: 'World Bank data shows Indonesia population 277 million in 2023',
        supportType: SupportType.SUPPORTS,
      }),
    ];

    vi.mocked(mockFactRepo.findByArticleId).mockResolvedValue([fact]);
    vi.mocked(mockFactEvidenceRepo.findByFactId).mockResolvedValue(evidence);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      verificationStatus: 'verified',
      confidence: 0.95,
    });
    vi.mocked(mockFactRepo.bulkInsert).mockResolvedValue(undefined);

    const result = await service.verifyArticleFacts(articleId);

    expect(result).toHaveLength(1);
    expect(result[0].verificationStatus).toBe(VerificationStatus.VERIFIED);
    expect(result[0].confidence).toBe(0.95);
    expect(mockFactRepo.findByArticleId).toHaveBeenCalledWith(articleId);
    expect(mockFactEvidenceRepo.findByFactId).toHaveBeenCalledWith(factId);
    expect(mockAIProvider.generateStructured).toHaveBeenCalledTimes(1);
    expect(mockFactRepo.bulkInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: factId,
          verificationStatus: VerificationStatus.VERIFIED,
          confidence: 0.95,
        }),
      ])
    );
  });

  it('verifyArticleFacts returns empty array when no facts exist', async () => {
    const articleId = 'article-empty';

    vi.mocked(mockFactRepo.findByArticleId).mockResolvedValue([]);

    const result = await service.verifyArticleFacts(articleId);

    expect(result).toEqual([]);
    expect(mockFactRepo.findByArticleId).toHaveBeenCalledWith(articleId);
    expect(mockFactEvidenceRepo.findByFactId).not.toHaveBeenCalled();
    expect(mockAIProvider.generateStructured).not.toHaveBeenCalled();
    expect(mockFactRepo.bulkInsert).not.toHaveBeenCalled();
  });

  it('verifyArticleFacts handles AI errors gracefully', async () => {
    const articleId = 'article-123';
    const factId = 'fact-456';

    const fact = new Fact({
      id: factId,
      articleId: articleId,
      statement: 'Test claim',
      verificationStatus: VerificationStatus.UNVERIFIED,
      confidence: 0,
    });

    vi.mocked(mockFactRepo.findByArticleId).mockResolvedValue([fact]);
    vi.mocked(mockFactEvidenceRepo.findByFactId).mockResolvedValue([]);
    vi.mocked(mockAIProvider.generateStructured).mockRejectedValue(
      new Error('AI service unavailable')
    );
    vi.mocked(mockFactRepo.bulkInsert).mockResolvedValue(undefined);

    await expect(service.verifyArticleFacts(articleId)).rejects.toThrow('AI service unavailable');

    expect(mockFactRepo.findByArticleId).toHaveBeenCalledWith(articleId);
    expect(mockFactEvidenceRepo.findByFactId).toHaveBeenCalledWith(factId);
    expect(mockAIProvider.generateStructured).toHaveBeenCalledTimes(1);
    expect(mockFactRepo.bulkInsert).not.toHaveBeenCalled();
  });
});
