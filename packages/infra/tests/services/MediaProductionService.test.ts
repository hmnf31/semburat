import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MediaProductionService } from '../../src/services/MediaProductionService.js';
import type {
  AIProvider,
  VoiceProvider,
  SoundEffectProvider,
  ArticleRepository,
  AssetRepository,
} from '@semburat/domain';
import { Article, ArticleStatus } from '@semburat/domain';
import { Slug } from '@semburat/domain';
import { RiskLevel } from '@semburat/domain';
import { QualityScore } from '@semburat/domain';
import type { ArticleId, ResearchId, AssetId, TopicId } from '@semburat/shared';

describe('MediaProductionService', () => {
  let service: MediaProductionService;
  let mockArticleRepo: ArticleRepository;
  let mockAssetRepo: AssetRepository;
  let mockVoiceProvider: VoiceProvider;
  let mockSfxProvider: SoundEffectProvider;
  let mockAiProvider: AIProvider;

  const createMockArticle = (overrides = {}): Article => {
    return new Article({
      id: 'article-1' as ArticleId,
      researchId: 'research-1' as ResearchId,
      title: 'Test Article About Technology',
      slug: Slug.fromString('test-article-about-technology'),
      dek: 'Test article description that is long enough',
      summary: 'Test summary of the article content',
      body: 'This is a test article body that is definitely longer than one hundred characters to satisfy the validation requirement for article creation in the SEMBURAT system.',
      category: 'technology',
      ...overrides,
    });
  };

  beforeEach(() => {
    mockArticleRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByStatus: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
    };

    mockAssetRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByArticleId: vi.fn(),
      findByHash: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockVoiceProvider = {
      synthesize: vi.fn(),
    };

    mockSfxProvider = {
      search: vi.fn(),
    };

    mockAiProvider = {
      generateText: vi.fn(),
      generateStructured: vi.fn(),
      streamChat: vi.fn(),
    };

    service = new MediaProductionService(
      mockArticleRepo,
      mockAssetRepo,
      mockVoiceProvider,
      mockSfxProvider,
      mockAiProvider
    );
  });

  it('produceVideo returns render info', async () => {
    const mockArticle = createMockArticle();
    vi.mocked(mockArticleRepo.findById).mockResolvedValue(mockArticle);
    vi.mocked(mockAiProvider.generateText).mockResolvedValue('Test script for video');
    vi.mocked(mockVoiceProvider.synthesize).mockResolvedValue({
      storageKey: 'media/voiceover/test.mp3',
      duration: 45,
    });
    vi.mocked(mockSfxProvider.search).mockResolvedValue([
      { id: 'sfx-1', name: 'Whoosh', storageKey: 'media/sfx/whoosh.mp3' },
    ]);

    const result = await service.produceVideo('article-1', 'template-1');

    expect(result).toHaveProperty('renderId');
    expect(result).toHaveProperty('storageKey');
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('assetIds');
    expect(typeof result.renderId).toBe('string');
    expect(typeof result.storageKey).toBe('string');
    expect(typeof result.duration).toBe('number');
    expect(Array.isArray(result.assetIds)).toBe(true);
    expect(result.duration).toBe(45);
  });

  it('getRenderStatus returns completed status', async () => {
    const result = await service.getRenderStatus('render-123');

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('storageKey');
    expect(result.status).toBe('completed');
    expect(result.storageKey).toBe('renders/render-123.mp4');
  });
});
