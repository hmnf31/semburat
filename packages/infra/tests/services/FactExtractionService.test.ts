import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FactExtractionService } from '../../src/services/FactExtractionService.js';
import { Research, ResearchStatus, Source, SourceType } from '@semburat/domain';
import type {
  AIProvider,
  FactEvidenceRepository,
  FactRepository,
  ResearchRepository,
  SourceRepository,
} from '@semburat/domain';

function buildSource(id: string, url: string, domain: string): Source {
  return new Source({
    id,
    url,
    domain,
    title: `Sumber ${id}`,
    publisher: domain,
    sourceType: SourceType.ESTABLISHED_MEDIA,
  });
}

describe('FactExtractionService', () => {
  const RESEARCH_ID = 'research-1';
  const ARTICLE_ID = 'art-1';

  let mockAIProvider: AIProvider;
  let mockFactRepo: FactRepository;
  let mockFactEvidenceRepo: FactEvidenceRepository;
  let mockResearchRepo: ResearchRepository;
  let mockSourceRepo: SourceRepository;
  let service: FactExtractionService;

  beforeEach(() => {
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
      deleteByArticleId: vi.fn(),
    } as unknown as FactRepository;

    mockFactEvidenceRepo = {
      insert: vi.fn(),
      findByFactId: vi.fn(),
      deleteByFactId: vi.fn(),
    } as unknown as FactEvidenceRepository;

    mockResearchRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByTrendId: vi.fn(),
      update: vi.fn(),
    } as unknown as ResearchRepository;

    mockSourceRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByDomain: vi.fn(),
      findAll: vi.fn(),
      upsert: vi.fn(),
    } as unknown as SourceRepository;

    service = new FactExtractionService(
      mockAIProvider,
      mockFactRepo,
      mockFactEvidenceRepo,
      mockResearchRepo,
      mockSourceRepo
    );

    vi.mocked(mockResearchRepo.findById).mockResolvedValue(
      new Research({
        id: RESEARCH_ID,
        trendId: 'trend-1',
        summary: 'Ringkasan riset tentang teknologi di Indonesia.',
        claimsJson: JSON.stringify([{ statement: 'Ada klaim', sources: [] }]),
        status: ResearchStatus.COMPLETED,
      })
    );
  });

  it('resolves evidence references by exact URL to a real source id', async () => {
    vi.mocked(mockSourceRepo.findById).mockResolvedValue(null);
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([
      buildSource('src-1', 'https://kompas.com/berita-ai', 'kompas.com'),
    ]);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      facts: [
        {
          statement: 'Indonesia mengadopsi AI',
          confidence: 0.8,
          evidence: [
            {
              text: 'Adopsi AI meningkat',
              sourceId: 'https://kompas.com/berita-ai',
              supportType: 'supports',
            },
          ],
        },
      ],
    });

    const facts = await service.extractFactsFromResearch(RESEARCH_ID, ARTICLE_ID);

    expect(facts).toHaveLength(1);
    expect(mockFactEvidenceRepo.insert).toHaveBeenCalledTimes(1);
    expect(vi.mocked(mockFactEvidenceRepo.insert).mock.calls[0][0].sourceId).toBe('src-1');
  });

  it('resolves evidence references given a direct source id', async () => {
    vi.mocked(mockSourceRepo.findById).mockResolvedValue(
      buildSource('src-2', 'https://detik.com/x', 'detik.com')
    );
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      facts: [
        {
          statement: 'Klaim kedua',
          confidence: 0.7,
          evidence: [{ text: 'Bukti', sourceId: 'src-2', supportType: 'supports' }],
        },
      ],
    });

    await service.extractFactsFromResearch(RESEARCH_ID, ARTICLE_ID);

    expect(vi.mocked(mockFactEvidenceRepo.insert).mock.calls[0][0].sourceId).toBe('src-2');
  });

  it('skips evidence that cannot be resolved to a known source', async () => {
    vi.mocked(mockSourceRepo.findById).mockResolvedValue(null);
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      facts: [
        {
          statement: 'Klaim dengan sumber tak dikenal',
          confidence: 0.6,
          evidence: [{ text: 'Bukti palsu', sourceId: 'mock-source', supportType: 'supports' }],
        },
      ],
    });

    const facts = await service.extractFactsFromResearch(RESEARCH_ID, ARTICLE_ID);

    expect(facts).toHaveLength(1);
    expect(mockFactRepo.insert).toHaveBeenCalledTimes(1);
    expect(mockFactEvidenceRepo.insert).not.toHaveBeenCalled();
  });

  it('keeps only resolvable evidence when a fact mixes known and unknown sources', async () => {
    vi.mocked(mockSourceRepo.findById).mockResolvedValue(null);
    vi.mocked(mockSourceRepo.findByDomain).mockImplementation(async (domain) =>
      domain === 'kumparan.com'
        ? [buildSource('src-3', 'https://kumparan.com/ai', 'kumparan.com')]
        : []
    );
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      facts: [
        {
          statement: 'Klaim campuran',
          confidence: 0.5,
          evidence: [
            { text: 'Bukti valid', sourceId: 'https://kumparan.com/ai', supportType: 'supports' },
            { text: 'Bukti tanpa sumber', sourceId: 'tidak-dikenal', supportType: 'neutral' },
          ],
        },
      ],
    });

    await service.extractFactsFromResearch(RESEARCH_ID, ARTICLE_ID);

    expect(mockFactEvidenceRepo.insert).toHaveBeenCalledTimes(1);
    expect(vi.mocked(mockFactEvidenceRepo.insert).mock.calls[0][0].sourceId).toBe('src-3');
  });
});
