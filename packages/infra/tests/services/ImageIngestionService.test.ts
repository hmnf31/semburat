import { describe, expect, it, vi } from 'vitest';
import { Article, Asset, LicenseState, Slug } from '@semburat/domain';
import type {
  ArticleRepository,
  AssetRepository,
  ImageCandidate,
  ImageSourceProvider,
  StorageProvider,
} from '@semburat/domain';

import { AssetRegistryService } from '../../src/services/AssetRegistryService.js';
import { ImageIngestionService } from '../../src/services/ImageIngestionService.js';
import { ImageSourcingService } from '../../src/services/ImageSourcingService.js';

class FakeImageProvider implements ImageSourceProvider {
  readonly name = 'fake';
  constructor(private readonly candidates: ImageCandidate[]) {}
  async search(): Promise<ImageCandidate[]> {
    return this.candidates;
  }
}

class FakeStorage implements StorageProvider {
  readonly store = new Map<string, Buffer>();
  async put(key: string, data: Buffer): Promise<string> {
    this.store.set(key, Buffer.from(data));
    return key;
  }
  async get(key: string): Promise<Buffer | null> {
    return this.store.get(key) ?? null;
  }
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
  async getSignedUrl(key: string): Promise<string> {
    return `https://cdn.test/media/${key}`;
  }
}

class FakeAssetRepo implements AssetRepository {
  assets: Asset[] = [];
  async insert(asset: Asset): Promise<void> {
    this.assets.push(asset);
  }
  async findById(id: string): Promise<Asset | null> {
    return this.assets.find((a) => a.id === id) ?? null;
  }
  async findByArticleId(articleId: string): Promise<Asset[]> {
    return this.assets.filter((a) => a.articleId === articleId);
  }
  async findByHash(hash: string): Promise<Asset | null> {
    return this.assets.find((a) => a.hash === hash) ?? null;
  }
  async update(asset: Asset): Promise<void> {
    const index = this.assets.findIndex((a) => a.id === asset.id);
    if (index >= 0) this.assets[index] = asset;
  }
  async delete(id: string): Promise<void> {
    this.assets = this.assets.filter((a) => a.id !== id);
  }
}

const ARTICLE_ID = '11111111-1111-4111-8111-111111111111';

class FakeArticleRepo implements ArticleRepository {
  articles = new Map<string, Article>();
  async insert(article: Article): Promise<void> {
    this.articles.set(article.id, article);
  }
  async findById(id: string): Promise<Article | null> {
    return this.articles.get(id) ?? null;
  }
  async findBySlug(slug: string): Promise<Article | null> {
    return [...this.articles.values()].find((a) => a.slug.value === slug) ?? null;
  }
  async findByStatus(): Promise<{ articles: Article[]; nextCursor: string | null }> {
    return { articles: [...this.articles.values()], nextCursor: null };
  }
  async findAll(): Promise<Article[]> {
    return [...this.articles.values()];
  }
  async update(article: Article): Promise<void> {
    this.articles.set(article.id, article);
  }
  async updateStatus(id: string, status: Article['status']): Promise<void> {
    const article = this.articles.get(id);
    if (article) this.articles.set(id, article.withStatus(status));
  }
}

function makeArticle(id = ARTICLE_ID): Article {
  return new Article({
    id,
    researchId: '44444444-4444-4444-8444-444444444444',
    title: 'Judul uji yang cukup panjang',
    slug: Slug.fromString('judul-uji'),
    dek: 'Dek uji yang cukup panjang untuk lolos validasi entitas.',
    summary: 'ringkasan',
    body: 'x'.repeat(120),
    category: 'gaming',
  });
}

const candidate = (overrides: Partial<ImageCandidate> = {}): ImageCandidate => ({
  provider: 'fake',
  url: 'https://img.test/a.png',
  title: 'Gambar contoh',
  sourceUrl: 'https://page.test/a',
  creator: 'Budi',
  licenseCode: 'cc0',
  licenseState: LicenseState.PUBLIC_DOMAIN,
  creditText: 'Budi — fake',
  ...overrides,
});

function okFetch(body = new Uint8Array([1, 2, 3]), contentType = 'image/png') {
  return vi.fn(
    async () =>
      new Response(body, { status: 200, headers: { 'content-type': contentType } }) as Response
  );
}

function setup(
  candidates: ImageCandidate[],
  fetchFn = okFetch(),
  maxBytes?: number,
  articleRepo?: ArticleRepository
) {
  const repo = new FakeAssetRepo();
  const storage = new FakeStorage();
  const registry = new AssetRegistryService(repo, storage);
  const sourcing = new ImageSourcingService([new FakeImageProvider(candidates)]);
  const ingestion = new ImageIngestionService({
    imageSourcing: sourcing,
    assetRegistry: registry,
    articleRepo,
    fetchFn,
    maxBytes,
  });
  return { repo, storage, registry, sourcing, ingestion };
}

describe('ImageIngestionService', () => {
  it('downloads a publishable candidate, stores it and registers the asset', async () => {
    const { ingestion, storage, repo } = setup([candidate()]);
    const result = await ingestion.ingest(ARTICLE_ID, 'contoh', { limit: 1 });

    expect(result.skipped).toEqual([]);
    expect(result.ingested).toHaveLength(1);
    const { asset, publicUrl, provider } = result.ingested[0];
    expect(provider).toBe('fake');
    expect(asset.licenseState).toBe(LicenseState.PUBLIC_DOMAIN);
    expect(asset.creditText).toBe('Budi — fake');
    expect(asset.sourceUrl).toBe('https://page.test/a');
    expect(asset.storageKey).toMatch(/^assets\/.+\/.+\.png$/);
    expect(storage.store.get(asset.storageKey)?.byteLength).toBe(3);
    expect(publicUrl).toBe(`https://cdn.test/media/${asset.storageKey}`);
    expect(repo.assets).toHaveLength(1);

    const metadata = JSON.parse(asset.metadataJson) as Record<string, unknown>;
    expect(metadata.provider).toBe('fake');
    expect(metadata.contentType).toBe('image/png');
  });

  it('skips restricted candidates by default', async () => {
    const restricted = candidate({ licenseState: LicenseState.RESTRICTED, provider: 'fake' });
    const { ingestion, repo } = setup([restricted]);
    const result = await ingestion.ingest(ARTICLE_ID, 'fan art', { limit: 1 });

    expect(result.ingested).toEqual([]);
    expect(result.skipped[0]).toMatchObject({ reason: 'not_publishable', provider: 'fake' });
    expect(repo.assets).toEqual([]);
  });

  it('ingests restricted candidates when explicitly allowed', async () => {
    const restricted = candidate({ licenseState: LicenseState.RESTRICTED });
    const { ingestion } = setup([restricted]);
    const result = await ingestion.ingest(ARTICLE_ID, 'fan art', {
      limit: 1,
      includeUnpublishable: true,
    });

    expect(result.ingested).toHaveLength(1);
    expect(result.ingested[0].asset.licenseState).toBe(LicenseState.RESTRICTED);
  });

  it('records a skip when the download fails', async () => {
    const fetchFn = vi.fn(async () => new Response('nope', { status: 404 }));
    const { ingestion, repo } = setup([candidate()], fetchFn);
    const result = await ingestion.ingest(ARTICLE_ID, 'x', { limit: 1 });

    expect(result.ingested).toEqual([]);
    expect(result.skipped[0].reason).toBe('download_failed_404');
    expect(repo.assets).toEqual([]);
  });

  it('skips assets that exceed the size limit', async () => {
    const { ingestion } = setup([candidate()], okFetch(new Uint8Array([1, 2, 3, 4, 5])), 2);
    const result = await ingestion.ingest(ARTICLE_ID, 'x', { limit: 1 });

    expect(result.ingested).toEqual([]);
    expect(result.skipped[0].reason).toBe('asset_too_large');
  });

  it('infers the content type from the URL when the header is generic', async () => {
    const fetchFn = okFetch(new Uint8Array([1]), 'application/octet-stream');
    const { ingestion } = setup([candidate({ url: 'https://img.test/photo.jpeg' })], fetchFn);
    const result = await ingestion.ingest(ARTICLE_ID, 'x', { limit: 1 });

    const metadata = JSON.parse(result.ingested[0].asset.metadataJson) as Record<string, unknown>;
    expect(metadata.contentType).toBe('image/jpeg');
    expect(result.ingested[0].asset.storageKey.endsWith('.jpg')).toBe(true);
  });

  it('attaches the first ingested asset as the article hero when requested', async () => {
    const articleRepo = new FakeArticleRepo();
    await articleRepo.insert(makeArticle());
    const { ingestion } = setup([candidate()], okFetch(), undefined, articleRepo);

    const result = await ingestion.ingest(ARTICLE_ID, 'contoh', { limit: 1, setAsHero: true });

    expect(result.heroAssetId).toBe(result.ingested[0].asset.id);
    expect((await articleRepo.findById(ARTICLE_ID))?.heroAssetId).toBe(result.ingested[0].asset.id);
  });

  it('does not set a hero when the article is missing', async () => {
    const articleRepo = new FakeArticleRepo();
    const { ingestion } = setup([candidate()], okFetch(), undefined, articleRepo);

    const result = await ingestion.ingest(ARTICLE_ID, 'contoh', { limit: 1, setAsHero: true });

    expect(result.heroAssetId).toBeUndefined();
    expect(articleRepo.articles.size).toBe(0);
  });

  it('does not set a hero unless setAsHero is requested', async () => {
    const articleRepo = new FakeArticleRepo();
    await articleRepo.insert(makeArticle());
    const { ingestion } = setup([candidate()], okFetch(), undefined, articleRepo);

    const result = await ingestion.ingest(ARTICLE_ID, 'contoh', { limit: 1 });

    expect(result.heroAssetId).toBeUndefined();
    expect((await articleRepo.findById(ARTICLE_ID))?.heroAssetId).toBeUndefined();
  });
});
