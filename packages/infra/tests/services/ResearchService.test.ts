import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Trend, TrendStatus } from '@semburat/domain';
import { Research, ResearchStatus } from '@semburat/domain';
import { Source, SourceType, ReliabilityState, LicenseState, UrlValue } from '@semburat/domain';
import { ResearchService } from '../../src/services/ResearchService.js';
import type { TrendRepository } from '@semburat/domain';
import type { SourceRepository } from '@semburat/domain';
import type { ResearchRepository } from '@semburat/domain';
import type { ResearchProvider } from '@semburat/domain';
import type { AIProvider } from '@semburat/domain';
import type { FactRepository } from '@semburat/domain';
import type { FactEvidenceRepository } from '@semburat/domain';

describe('ResearchService', () => {
  let mockTrendRepo: TrendRepository;
  let mockSourceRepo: SourceRepository;
  let mockResearchRepo: ResearchRepository;
  let mockResearchProvider: ResearchProvider;
  let mockAIProvider: AIProvider;
  let mockFactRepo: FactRepository;
  let mockFactEvidenceRepo: FactEvidenceRepository;
  let service: ResearchService;

  const mockTrend = new Trend({
    id: 'trend-1' as any,
    title: 'AI di Indonesia',
    normalizedKey: 'ai-di-indonesia',
    score: 80,
    velocity: 50,
    relevance: 70,
    freshness: 60,
    sourceCount: 5,
    status: TrendStatus.CANDIDATE,
    detectedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockTrendRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByNormalizedKey: vi.fn(),
      findByStatus: vi.fn(),
      findByScore: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    } as unknown as TrendRepository;

    mockSourceRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByDomain: vi.fn(),
      upsert: vi.fn(),
    } as unknown as SourceRepository;

    mockResearchRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByTrendId: vi.fn(),
      update: vi.fn(),
    } as unknown as ResearchRepository;

    mockResearchProvider = {
      search: vi.fn(),
      fetchPage: vi.fn(),
    } as unknown as ResearchProvider;

    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as unknown as AIProvider;

    mockFactRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByArticleId: vi.fn(),
      bulkInsert: vi.fn(),
    } as unknown as FactRepository;

    mockFactEvidenceRepo = {
      insert: vi.fn(),
      findByFactId: vi.fn(),
    } as unknown as FactEvidenceRepository;

    service = new ResearchService(
      mockTrendRepo,
      mockSourceRepo,
      mockResearchRepo,
      mockResearchProvider,
      mockAIProvider,
      mockFactRepo,
      mockFactEvidenceRepo
    );
  });

  it('researches a trend and returns Research entity', async () => {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(mockTrend);

    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      { url: 'https://example.com/1', title: 'AI News 1', snippet: 'Indonesia AI development' },
      { url: 'https://example.com/2', title: 'AI News 2', snippet: 'Digital transformation' },
    ]);

    vi.mocked(mockResearchProvider.fetchPage).mockResolvedValue({
      content: 'Full article content about AI in Indonesia',
      metadata: { title: 'AI News', publishedAt: new Date(), author: 'Reporter' },
    });

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      summary: 'Indonesia mengembangkan AI untuk sektor industri.',
      facts: [
        {
          statement: 'Indonesia berinvestasi pada AI',
          confidence: 0.9,
          supportType: 'supports',
          sourceUrls: ['https://example.com/1'],
          evidenceText: 'Indonesia berinvestasi pada AI',
        },
      ],
      claims: [
        {
          statement: 'AI akan mendorong ekonomi',
          confidence: 0.8,
          supportType: 'supports',
          sources: ['https://example.com/1'],
        },
      ],
      conflicts: [],
      confidenceScore: 0.85,
    });

    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockSourceRepo.upsert).mockResolvedValue(undefined);
    vi.mocked(mockResearchRepo.insert).mockResolvedValue(undefined);
    vi.mocked(mockFactRepo.insert).mockResolvedValue(undefined);
    vi.mocked(mockFactEvidenceRepo.insert).mockResolvedValue(undefined);

    const research = await service.researchTrend('trend-1');

    expect(research).toBeInstanceOf(Research);
    expect(research.trendId).toBe('trend-1');
    expect(research.summary).toBe('Indonesia mengembangkan AI untuk sektor industri.');
    expect(research.confidenceScore).toBe(0.85);
    expect(research.status).toBe(ResearchStatus.COMPLETED);
    expect(mockResearchRepo.insert).toHaveBeenCalled();
    expect(mockFactRepo.insert).toHaveBeenCalled();
  });

  it('throws error when trend not found', async () => {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(null);

    await expect(service.researchTrend('non-existent')).rejects.toThrow('Trend not found');
  });

  it('gets existing research for trend', async () => {
    const existingResearch = new Research({
      id: 'research-1' as any,
      trendId: 'trend-1' as any,
      summary: 'Existing research',
      factsJson: '[]',
      claimsJson: '[]',
      conflictsJson: '[]',
      confidenceScore: 0.7,
      status: ResearchStatus.COMPLETED,
    });

    vi.mocked(mockResearchRepo.findByTrendId).mockResolvedValue(existingResearch);

    const research = await service.getResearchForTrend('trend-1');

    expect(research).toBe(existingResearch);
    expect(mockResearchRepo.findByTrendId).toHaveBeenCalledWith('trend-1');
  });

  it('returns null when no research exists for trend', async () => {
    vi.mocked(mockResearchRepo.findByTrendId).mockResolvedValue(null);

    const research = await service.getResearchForTrend('trend-1');

    expect(research).toBeNull();
  });

  it('reuses existing source by domain', async () => {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(mockTrend);

    const existingSource = new Source({
      id: 'source-1' as any,
      url: UrlValue.fromString('https://example.com/1'),
      domain: 'example.com',
      title: 'Existing Source',
      publisher: 'example.com',
      sourceType: SourceType.ESTABLISHED_MEDIA,
      reliabilityState: ReliabilityState.MEDIUM,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date(),
    });

    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      { url: 'https://example.com/1', title: 'AI News 1', snippet: 'Indonesia AI development' },
    ]);

    vi.mocked(mockResearchProvider.fetchPage).mockResolvedValue({
      content: 'Full article content',
      metadata: { title: 'AI News', publishedAt: new Date(), author: 'Reporter' },
    });

    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([existingSource]);
    vi.mocked(mockSourceRepo.upsert).mockResolvedValue(undefined);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      summary: 'Summary',
      facts: [],
      claims: [],
      conflicts: [],
      confidenceScore: 0.5,
    });
    vi.mocked(mockResearchRepo.insert).mockResolvedValue(undefined);

    await service.researchTrend('trend-1');

    expect(mockSourceRepo.findByDomain).toHaveBeenCalledWith('example.com');
    expect(mockSourceRepo.upsert).toHaveBeenCalled();
  });
});
