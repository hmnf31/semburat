import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrendResearchPipeline } from '../../src/services/TrendResearchPipeline.js';
import {
  Article,
  ArticleStatus,
  Fact,
  FactCheckStatus,
  ResearchStatus,
  Trend,
  TrendStatus,
  VerificationStatus,
} from '@semburat/domain';
import type {
  AIProvider,
  ArticleRepository,
  AssetRepository,
  FactEvidenceRepository,
  FactRepository,
  ResearchProvider,
  ResearchRepository,
  SourceRepository,
  TrendRepository,
} from '@semburat/domain';
import type {
  EditorialGenerationService,
  GeneratedArticle,
} from '../../src/services/EditorialGenerationService.js';
import type { FactExtractionService } from '../../src/services/FactExtractionService.js';
import type { FactVerificationService } from '../../src/services/FactVerificationService.js';
import type { QualityGateService } from '../../src/services/QualityGateService.js';

describe('TrendResearchPipeline', () => {
  const TREND_ID = 'trend-123';
  const ARTICLE_ID = `art_${TREND_ID}`;
  const RESEARCH_ID = `res_${TREND_ID}`;

  let mockTrendRepo: TrendRepository;
  let mockSourceRepo: SourceRepository;
  let mockResearchRepo: ResearchRepository;
  let mockArticleRepo: ArticleRepository;
  let mockFactRepo: FactRepository;
  let mockFactEvidenceRepo: FactEvidenceRepository;
  let mockAssetRepo: AssetRepository;
  let mockAIProvider: AIProvider;
  let mockResearchProvider: ResearchProvider;
  let mockFactExtractionService: FactExtractionService;
  let mockFactVerificationService: FactVerificationService;
  let mockEditorialGenerationService: EditorialGenerationService;
  let mockQualityGateService: QualityGateService;
  let pipeline: TrendResearchPipeline;

  const trend = new Trend({
    id: TREND_ID,
    title: 'Kecerdasan Buatan di Indonesia',
    normalizedKey: 'kecerdasan-buatan-di-indonesia',
    score: 85,
    velocity: 70,
    relevance: 90,
    freshness: 60,
    sourceCount: 4,
    status: TrendStatus.SELECTED,
  });

  const generatedArticle: GeneratedArticle = {
    title: 'Indonesia Kembangkan AI untuk Sektor Industri',
    dek: 'Pemerintah dan pelaku industri di Indonesia mulai mengadopsi kecerdasan buatan untuk meningkatkan produktivitas nasional.',
    body: 'Artikel ini membahas bagaimana kecerdasan buatan mulai mengubah berbagai sektor industri di Indonesia. Transformasi digital yang berjalan cepat membawa dampak signifikan terhadap produktivitas dan efisiensi kerja di berbagai bidang ekonomi nasional.',
    summary: 'Ringkasan artikel tentang pengembangan kecerdasan buatan di Indonesia.',
    key_points: ['Poin kunci pertama', 'Poin kunci kedua', 'Poin kunci ketiga'],
    faq: [
      {
        question: 'Apa yang sedang berkembang di Indonesia?',
        answer: 'Kecerdasan buatan sedang berkembang pesat di berbagai sektor industri Indonesia.',
      },
      {
        question: 'Kapan transformasi digital dimulai?',
        answer: 'Transformasi digital mulai berjalan cepat dalam beberapa tahun terakhir.',
      },
      {
        question: 'Mengapa adopsi AI penting?',
        answer: 'Adopsi AI meningkatkan produktivitas dan efisiensi kerja di Indonesia.',
      },
    ],
    seo_title: 'AI untuk Sektor Industri Indonesia - SEMBURAT',
    meta_description:
      'Baca analisis lengkap tentang pengembangan kecerdasan buatan di Indonesia dan dampaknya terhadap sektor industri nasional yang sedang berkembang pesat.',
  };

  function buildArticle(status: ArticleStatus): Article {
    return new Article({
      id: ARTICLE_ID,
      researchId: RESEARCH_ID,
      title: 'Artikel Yang Sudah Diproses Sebelumnya',
      slug: 'artikel-yang-sudah-diproses-sebelumnya',
      dek: 'Dek dari artikel yang sudah diproses sebelumnya oleh pipeline riset.',
      summary: 'Ringkasan dari artikel yang sudah diproses sebelumnya.',
      body: 'Body artikel yang sudah ada sebelumnya dengan panjang yang cukup untuk memenuhi validasi domain Article minimal seratus karakter.',
      category: 'general',
      status,
    });
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

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

    mockArticleRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
    } as unknown as ArticleRepository;

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

    mockAssetRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByArticleId: vi.fn(),
      findByHash: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as AssetRepository;

    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as unknown as AIProvider;

    mockResearchProvider = {
      search: vi.fn(),
      fetchPage: vi.fn(),
    } as unknown as ResearchProvider;

    mockFactExtractionService = {
      extractFactsFromResearch: vi.fn(),
    } as unknown as FactExtractionService;

    mockFactVerificationService = {
      verifyArticleFacts: vi.fn(),
    } as unknown as FactVerificationService;

    mockEditorialGenerationService = {
      generateArticle: vi.fn(),
    } as unknown as EditorialGenerationService;

    mockQualityGateService = {
      evaluateArticle: vi.fn(),
    } as unknown as QualityGateService;

    pipeline = new TrendResearchPipeline(
      mockTrendRepo,
      mockSourceRepo,
      mockResearchRepo,
      mockArticleRepo,
      mockFactRepo,
      mockFactEvidenceRepo,
      mockAssetRepo,
      mockAIProvider,
      mockResearchProvider,
      mockFactExtractionService,
      mockFactVerificationService,
      mockEditorialGenerationService,
      mockQualityGateService
    );
  });

  function setupHappyPath(): void {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(trend);
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(null);
    vi.mocked(mockResearchRepo.findByTrendId).mockResolvedValue(null);
    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      {
        url: 'https://example.com/article-1',
        title: 'Berita AI Pertama',
        snippet: 'Indonesia mengembangkan AI',
      },
      {
        url: 'https://example.com/article-2',
        title: 'Berita AI Kedua',
        snippet: 'Adopsi AI di industri',
      },
    ]);
    vi.mocked(mockResearchProvider.fetchPage).mockResolvedValue({
      content: 'Konten lengkap artikel tentang pengembangan kecerdasan buatan di Indonesia.',
      metadata: { title: 'Berita AI Pertama', publishedAt: new Date(), author: 'Jurnalis' },
    });
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue({
      summary: 'Indonesia terus mengembangkan kecerdasan buatan untuk berbagai sektor industri.',
      claims: [
        {
          statement: 'Indonesia menginvestasikan dana untuk AI',
          confidence: 0.9,
          supportType: 'supports',
          sources: ['https://example.com/article-1'],
        },
      ],
      conflicts: [],
      confidenceScore: 0.85,
    });
    vi.mocked(mockFactExtractionService.extractFactsFromResearch).mockResolvedValue([
      new Fact({
        id: 'fact-1',
        articleId: ARTICLE_ID,
        statement: 'Indonesia menginvestasikan dana untuk AI',
        confidence: 0.9,
        verificationStatus: VerificationStatus.UNVERIFIED,
      }),
    ]);
    vi.mocked(mockFactVerificationService.verifyArticleFacts).mockResolvedValue([
      new Fact({
        id: 'fact-1',
        articleId: ARTICLE_ID,
        statement: 'Indonesia menginvestasikan dana untuk AI',
        confidence: 0.95,
        verificationStatus: VerificationStatus.VERIFIED,
      }),
    ]);
    vi.mocked(mockEditorialGenerationService.generateArticle).mockResolvedValue(generatedArticle);
    vi.mocked(mockQualityGateService.evaluateArticle).mockResolvedValue({
      score: 92,
      passed: true,
      issues: [],
    });
  }

  it('processTrend runs the full pipeline and returns a verified article', async () => {
    setupHappyPath();

    const article = await pipeline.processTrend(TREND_ID);

    expect(article).toBeInstanceOf(Article);
    expect(article.id).toBe(ARTICLE_ID);
    expect(article.researchId).toBe(RESEARCH_ID);
    expect(article.status).toBe(ArticleStatus.VERIFIED);
    expect(article.qualityScore.value).toBe(92);
    expect(article.title).toBe(generatedArticle.title);
    expect(article.dek).toBe(generatedArticle.dek);
    expect(article.body).toBe(generatedArticle.body);
    expect(article.seoTitle).toBe(generatedArticle.seo_title);
    expect(article.metaDescription).toBe(generatedArticle.meta_description);
    expect(article.factCheckStatus).toBe(FactCheckStatus.COMPLETE);

    expect(mockResearchProvider.search).toHaveBeenCalledWith('Kecerdasan Buatan di Indonesia', 10);
    expect(mockAIProvider.generateStructured).toHaveBeenCalledTimes(1);
    const extractionCall = vi.mocked(mockAIProvider.generateStructured).mock.calls[0];
    expect(extractionCall[0]).toContain('Kecerdasan Buatan di Indonesia');
    expect(extractionCall[0]).toContain('https://example.com/article-1');

    expect(mockResearchRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: RESEARCH_ID,
        trendId: TREND_ID,
        status: ResearchStatus.COMPLETED,
        confidenceScore: 0.85,
      })
    );
    expect(mockArticleRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({ id: ARTICLE_ID, status: ArticleStatus.DRAFT })
    );
    expect(mockArticleRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: ARTICLE_ID, status: ArticleStatus.RESEARCHING })
    );
    expect(mockArticleRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: ARTICLE_ID, status: ArticleStatus.VERIFIED })
    );
    expect(mockEditorialGenerationService.generateArticle).toHaveBeenCalledWith(
      'Indonesia terus mengembangkan kecerdasan buatan untuk berbagai sektor industri.',
      [{ statement: 'Indonesia menginvestasikan dana untuk AI', confidence: 0.95 }],
      'general'
    );
    expect(mockFactRepo.bulkInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'fact-1',
        verificationStatus: VerificationStatus.VERIFIED,
      }),
    ]);
    expect(mockSourceRepo.upsert).toHaveBeenCalledTimes(2);
  });

  it('processTrend throws when the trend does not exist', async () => {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(null);

    await expect(pipeline.processTrend('missing-trend')).rejects.toThrow(
      'Trend not found: missing-trend'
    );

    expect(mockResearchProvider.search).not.toHaveBeenCalled();
    expect(mockArticleRepo.insert).not.toHaveBeenCalled();
  });

  it('processTrend returns the existing article when the trend was already processed', async () => {
    const existingArticle = buildArticle(ArticleStatus.VERIFIED);
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(trend);
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(existingArticle);

    const article = await pipeline.processTrend(TREND_ID);

    expect(article).toBe(existingArticle);
    expect(mockArticleRepo.findById).toHaveBeenCalledWith(ARTICLE_ID);
    expect(mockResearchProvider.search).not.toHaveBeenCalled();
    expect(mockAIProvider.generateStructured).not.toHaveBeenCalled();
    expect(mockArticleRepo.insert).not.toHaveBeenCalled();
    expect(mockFactRepo.bulkInsert).not.toHaveBeenCalled();
  });

  it('processTrend throws when the research provider returns no sources', async () => {
    vi.mocked(mockTrendRepo.findById).mockResolvedValue(trend);
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(null);
    vi.mocked(mockResearchRepo.findByTrendId).mockResolvedValue(null);
    vi.mocked(mockResearchProvider.search).mockResolvedValue([]);

    await expect(pipeline.processTrend(TREND_ID)).rejects.toThrow(
      `No sources found for trend: ${TREND_ID}`
    );

    expect(mockResearchRepo.insert).not.toHaveBeenCalled();
    expect(mockArticleRepo.insert).not.toHaveBeenCalled();
  });

  it('processTrend marks the article NEEDS_RESEARCH when the quality gate fails', async () => {
    setupHappyPath();
    vi.mocked(mockQualityGateService.evaluateArticle).mockResolvedValue({
      score: 48,
      passed: false,
      issues: ['Insufficient source coverage (minimum 3 sources required)'],
    });

    const article = await pipeline.processTrend(TREND_ID);

    expect(article.status).toBe(ArticleStatus.NEEDS_RESEARCH);
    expect(article.qualityScore.value).toBe(48);
    expect(mockArticleRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: ARTICLE_ID,
        status: ArticleStatus.NEEDS_RESEARCH,
      })
    );
    expect(mockFactRepo.bulkInsert).toHaveBeenCalledTimes(1);
  });
});
