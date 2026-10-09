import { QualityGate } from '@semburat/domain';
import type {
  AIProvider,
  AnalyticsEventRepository,
  ArticleRepository,
  AssetRepository,
  ImageSourceProvider,
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
  AssetRegistryService,
  CURATED_FEEDS,
  DeviantArtImageAdapter,
  EditorialGenerationService,
  EnhancedResearchAdapter,
  FactExtractionService,
  FactVerificationService,
  GoogleTrendsAdapter,
  HumanReviewQueueService,
  ImageIngestionService,
  ImageSourcingService,
  MockAIProvider,
  NewsAdapter,
  OpenAICompatibleAdapter,
  OpenRouterAdapter,
  OpenverseImageAdapter,
  parseFeedList,
  parseSubredditList,
  RSSAdapter,
  KvStorageProvider,
  QualityGateService,
  RedditTrendAdapter,
  TrendDiscoveryService,
  TrendResearchPipeline,
  WikimediaImageAdapter,
} from '@semburat/infra';

import type { Env } from './env.js';

export type AiMode = 'openrouter' | 'openai-compatible' | 'mock';

export interface Container {
  aiMode: AiMode;
  aiProvider: AIProvider;
  researchProvider: ResearchProvider;
  imageSourcing: ImageSourcingService;
  imageIngestion: ImageIngestionService;
  assetRegistry: AssetRegistryService;
  storage: StorageProvider;
  articleRepo: ArticleRepository;
  assetRepo: AssetRepository;
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
  env?: Pick<Env, 'RESEARCH_MODE' | 'RSS_FEEDS' | 'REDDIT_SUBREDDITS'>
): ResearchProvider {
  const enabled = env?.RESEARCH_MODE !== 'offline';
  const feeds = env?.RSS_FEEDS === undefined ? [...CURATED_FEEDS] : parseFeedList(env.RSS_FEEDS);
  const subreddits = parseSubredditList(env?.REDDIT_SUBREDDITS);
  const reddit = new RedditTrendAdapter(
    subreddits.length > 0 ? { enabled, subreddits } : { enabled }
  );
  return new EnhancedResearchAdapter(
    new NewsAdapter({ enabled }),
    new RSSAdapter({ enabled, feeds }),
    new GoogleTrendsAdapter({ enabled }),
    reddit
  );
}

export function createImageSourcing(
  env?: Pick<Env, 'RESEARCH_MODE' | 'ENABLE_FANART'>
): ImageSourcingService {
  const enabled = env?.RESEARCH_MODE !== 'offline';
  const fanartEnabled = (env?.ENABLE_FANART ?? 'false').toLowerCase() === 'true';
  const providers: ImageSourceProvider[] = [
    new OpenverseImageAdapter({ enabled }),
    new WikimediaImageAdapter({ enabled }),
  ];
  if (fanartEnabled) {
    providers.push(new DeviantArtImageAdapter({ enabled }));
  }
  return new ImageSourcingService(providers);
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
  const imageSourcing = createImageSourcing(env);
  const storage = new KvStorageProvider(env.ASSETS, {
    baseUrl: env.ASSETS_PUBLIC_BASE_URL ?? env.R2_PUBLIC_BASE_URL,
  });
  const assetRegistry = new AssetRegistryService(assetRepo, storage);
  const imageIngestion = new ImageIngestionService({
    imageSourcing,
    assetRegistry,
    articleRepo,
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
    imageSourcing,
    imageIngestion,
    assetRegistry,
    storage,
    articleRepo,
    assetRepo,
    trendRepo,
    analyticsRepo,
    trendDiscovery: new TrendDiscoveryService(trendRepo, researchProvider, aiProvider),
    pipeline,
    reviewQueue: new HumanReviewQueueService(articleRepo),
  };
}
