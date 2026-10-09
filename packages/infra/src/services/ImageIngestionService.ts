import { AssetType } from '@semburat/domain';
import type { Asset } from '@semburat/domain';
import type { FetchLike } from '../adapters/research/FeedParser.js';
import { AssetRegistryService } from './AssetRegistryService.js';
import type { ImageSourcingService, SourcedImage } from './ImageSourcingService.js';

export const IMAGE_DOWNLOAD_MAX_BYTES = 25 * 1024 * 1024;

const DEFAULT_USER_AGENT = 'SEMBURAT/1.0 (+https://github.com/hmnf31/semburat)';

const EXTENSION_CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
};

export interface ImageIngestionOptions {
  limit?: number;
  includeUnpublishable?: boolean;
  providers?: string[];
  type?: string;
  altText?: string;
}

export interface IngestedImage {
  asset: Asset;
  publicUrl: string | null;
  provider: string;
}

export interface SkippedImage {
  provider: string;
  url: string;
  reason: string;
}

export interface ImageIngestionResult {
  ingested: IngestedImage[];
  skipped: SkippedImage[];
}

async function defaultFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}

export function contentTypeForUrl(url: string): string | undefined {
  const clean = url.split(/[?#]/)[0];
  const ext = clean.slice(clean.lastIndexOf('.') + 1).toLowerCase();
  return EXTENSION_CONTENT_TYPES[ext];
}

export class ImageIngestionService {
  constructor(
    private readonly imageSourcing: ImageSourcingService,
    private readonly assetRegistry: AssetRegistryService,
    private readonly fetchFn: FetchLike = defaultFetch,
    private readonly timeoutMs = 12_000,
    private readonly maxBytes = IMAGE_DOWNLOAD_MAX_BYTES
  ) {}

  async ingest(
    articleId: string,
    query: string,
    options: ImageIngestionOptions = {}
  ): Promise<ImageIngestionResult> {
    const limit = Math.min(Math.max(options.limit ?? 3, 1), 12);
    const candidates = await this.imageSourcing.search(query, limit, {
      includeUnpublishable: options.includeUnpublishable,
      providers: options.providers,
    });

    const ingested: IngestedImage[] = [];
    const skipped: SkippedImage[] = [];

    for (const candidate of candidates) {
      if (!candidate.publishable && !options.includeUnpublishable) {
        skipped.push({
          provider: candidate.provider,
          url: candidate.url,
          reason: 'not_publishable',
        });
        continue;
      }
      try {
        const asset = await this.persist(articleId, candidate, query, options);
        ingested.push({
          asset,
          publicUrl: await this.publicUrl(asset.storageKey),
          provider: candidate.provider,
        });
      } catch (error) {
        skipped.push({
          provider: candidate.provider,
          url: candidate.url,
          reason: error instanceof Error ? error.message : 'ingestion_failed',
        });
      }
    }

    return { ingested, skipped };
  }

  private async persist(
    articleId: string,
    candidate: SourcedImage,
    query: string,
    options: ImageIngestionOptions
  ): Promise<Asset> {
    const { data, contentType } = await this.download(candidate.url);
    return this.assetRegistry.registerAsset({
      articleId,
      type: options.type ?? AssetType.IMAGE,
      sourceUrl: candidate.sourceUrl ?? candidate.url,
      creator: candidate.creator,
      licenseState: candidate.licenseState,
      creditText: candidate.creditText,
      altText: options.altText ?? candidate.title,
      data,
      contentType,
      metadata: {
        provider: candidate.provider,
        query,
        title: candidate.title,
        thumbnailUrl: candidate.thumbnailUrl,
        licenseCode: candidate.licenseCode,
        tags: candidate.tags,
        publishable: candidate.publishable,
        attributionRequired: candidate.attributionRequired,
      },
    });
  }

  private async download(url: string): Promise<{ data: Buffer; contentType: string }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchFn(url, {
        signal: controller.signal,
        headers: { accept: 'image/*', 'user-agent': DEFAULT_USER_AGENT },
      });
      if (!response.ok) {
        throw new Error(`download_failed_${response.status}`);
      }
      const declaredLength = Number(response.headers.get('content-length') ?? '0');
      if (declaredLength > this.maxBytes) {
        throw new Error('asset_too_large');
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength === 0) {
        throw new Error('empty_asset');
      }
      if (buffer.byteLength > this.maxBytes) {
        throw new Error('asset_too_large');
      }
      const headerType = response.headers.get('content-type')?.split(';')[0].trim();
      const contentType =
        headerType && headerType.startsWith('image/')
          ? headerType
          : (contentTypeForUrl(url) ?? headerType ?? 'application/octet-stream');
      return { data: buffer, contentType };
    } finally {
      clearTimeout(timer);
    }
  }

  private async publicUrl(storageKey: string): Promise<string | null> {
    try {
      return await this.assetRegistry.getPublicUrl(storageKey);
    } catch {
      return null;
    }
  }
}
