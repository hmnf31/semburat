import { QualityGate } from '@semburat/domain';
import type {
  AIProvider,
  AnalyticsEventRepository,
  ArticleRepository,
  ResearchProvider,
  StorageProvider,
  TrendRepository,
} from '@semburat/domain';
import {
  D1AnalyticsEventRepository,
  D1ArticleRepository,
  D1AssetRepository,
  D1FactEvidenceRepository,
  D1FactRepository,
  D1ResearchRepository,
  D1SourceRepository,
  D1TrendRepository,
  EditorialGenerationService,
  EnhancedResearchAdapter,
  FactExtractionService,
  FactVerificationService,
  GoogleTrendsAdapter,
  HumanReviewQueueService,
  MockAIProvider,
  NewsAdapter,
  OpenAICompatibleAdapter,
  OpenRouterAdapter,
  parseFeedList,
  RSSAdapter,
  R2StorageProvider,
  QualityGateService,
  TrendDiscoveryService,
  TrendResearchPipeline,
} from '@semburat/infra';
import type { R2BucketLike } from '@semburat/infra';

import type { Env } from './env.js';

export type AiMode = 'openrouter' | 'openai-compatible' | 'mock';

export interface Container {
  aiMode: AiMode;
  aiProvider: AIProvider;
  researchProvider: ResearchProvider;
  storage: StorageProvider;
  articleRepo: ArticleRepository;
  trendRepo: TrendRepository;
  analyticsRepo: AnalyticsEventRepository;
  trendDiscovery: TrendDiscoveryService;
  pipeline: TrendResearchPipeline;
  reviewQueue: HumanReviewQueueService;
}

export function createAiProvider(env: Env): { provider: AIProvider; mode: AiMode } {
  if (env.AI_API_KEY && env.AI_BASE_URL && env.AI_MODEL) {
    return {
      provider: new OpenAICompatibleAdapter({
        provider: env.AI_PROVIDER ?? 'openai-compatible',
        apiKey: env.AI_API_KEY,
        baseUrl: env.AI_BASE_URL,
        model: env.AI_MODEL,
      }),
      mode: 'openai-compatible',
    };
  }
  if (env.OPENROUTER_API_KEY) {
    return {
      provider: new OpenRouterAdapter({
        apiKey: env.OPENROUTER_API_KEY,
        model: env.OPENROUTER_MODEL,
      }),
      mode: 'openrouter',
    };
  }
  return { provider: new MockAIProvider(), mode: 'mock' };
}

export function createResearchProvider(
  env?: Pick<Env, 'RESEARCH_MODE' | 'RSS_FEEDS'>
): ResearchProvider {
  const enabled = env?.RESEARCH_MODE !== 'offline';
  const feeds = env?.RSS_FEEDS === undefined ? undefined : parseFeedList(env.RSS_FEEDS);
  return new EnhancedResearchAdapter(
    new NewsAdapter({ enabled }),
    new RSSAdapter(feeds ? { enabled, feeds } : { enabled }),
    new GoogleTrendsAdapter({ enabled })
  );
}

export function createContainer(env: Env): Container {
  const { provider: aiProvider, mode: aiMode } = createAiProvider(env);

  const articleRepo = new D1ArticleRepository(env.DB);
  const trendRepo = new D1TrendRepository(env.DB);
  const sourceRepo = new D1SourceRepository(env.DB);
  const researchRepo = new D1ResearchRepository(env.DB);
  const factRepo = new D1FactRepository(env.DB);
  const factEvidenceRepo = new D1FactEvidenceRepository(env.DB);
  const assetRepo = new D1AssetRepository(env.DB);
  const analyticsRepo = new D1AnalyticsEventRepository(env.DB);

  const researchProvider = createResearchProvider(env);
  const storage = new R2StorageProvider(env.ASSETS as unknown as R2BucketLike, {
    baseUrl: env.R2_PUBLIC_BASE_URL,
  });

  const factExtractionService = new FactExtractionService(
    aiProvider,
    factRepo,
    factEvidenceRepo,
    researchRepo,
    sourceRepo
  );
  const factVerificationService = new FactVerificationService(
    aiProvider,
    factRepo,
    factEvidenceRepo
  );
  const editorialGenerationService = new EditorialGenerationService(aiProvider);
  const qualityGateService = new QualityGateService(new QualityGate());

  const pipeline = new TrendResearchPipeline(
    trendRepo,
    sourceRepo,
    researchRepo,
    articleRepo,
    factRepo,
    factEvidenceRepo,
    assetRepo,
    aiProvider,
    researchProvider,
    factExtractionService,
    factVerificationService,
    editorialGenerationService,
    qualityGateService
  );

  return {
    aiMode,
    aiProvider,
    researchProvider,
    storage,
    articleRepo,
    trendRepo,
    analyticsRepo,
    trendDiscovery: new TrendDiscoveryService(trendRepo, researchProvider, aiProvider),
    pipeline,
    reviewQueue: new HumanReviewQueueService(articleRepo),
  };
}
