import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';
import { Asset, AssetType, LicenseState } from '@semburat/domain';
import type { AssetRepository } from '@semburat/domain';
import type { AssetId, ArticleId } from '@semburat/shared';
import type { StorageProvider } from '@semburat/domain';

export interface RegisterAssetParams {
  articleId: string;
  type: string;
  sourceUrl?: string;
  creator?: string;
  licenseState: string;
  creditText?: string;
  altText?: string;
  data: Buffer;
  contentType: string;
  metadata?: Record<string, unknown>;
}

function extensionFor(contentType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'application/pdf': 'pdf',
  };
  return map[contentType] ?? 'bin';
}

export class AssetRegistryService {
  constructor(
    private readonly assetRepo: AssetRepository,
    private readonly storageProvider: StorageProvider
  ) {}

  async registerAsset(params: RegisterAssetParams): Promise<Asset> {
    const assetId = uuidv4();
    const hash = this.computeHash(params.data);
    const ext = extensionFor(params.contentType);
    const storageKey = `assets/${params.articleId}/${assetId}.${ext}`;

    await this.storageProvider.put(storageKey, params.data, params.contentType);

    const asset = new Asset({
      id: assetId as AssetId,
      articleId: params.articleId as ArticleId,
      type: params.type as AssetType,
      storageKey,
      sourceUrl: params.sourceUrl,
      hash,
      creator: params.creator,
      licenseState: (params.licenseState as LicenseState) ?? LicenseState.UNKNOWN,
      creditText: params.creditText,
      altText: params.altText,
      metadataJson: JSON.stringify({
        ...params.metadata,
        contentType: params.contentType,
        byteLength: params.data.length,
        registeredAt: new Date().toISOString(),
      }),
    });

    await this.assetRepo.insert(asset);
    return asset;
  }

  async getAsset(id: string): Promise<Asset | null> {
    return this.assetRepo.findById(id);
  }

  async getAssetsForArticle(articleId: string): Promise<Asset[]> {
    return this.assetRepo.findByArticleId(articleId);
  }

  async getPublicUrl(storageKey: string, ttlSeconds = 31_536_000): Promise<string> {
    return this.storageProvider.getSignedUrl(storageKey, ttlSeconds);
  }

  async deleteAsset(id: string): Promise<void> {
    const asset = await this.assetRepo.findById(id);
    if (!asset) {
      throw new Error(`Asset not found: ${id}`);
    }
    await this.storageProvider.delete(asset.storageKey);
    await this.assetRepo.delete(id);
  }

  private computeHash(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }
}
