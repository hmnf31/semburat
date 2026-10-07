import { v4 as uuidv4 } from 'uuid';
import { Asset, AssetType, LicenseState } from '@semburat/domain';
import type { AssetRepository } from '@semburat/domain';
import type { AssetId } from '@semburat/shared';
import type { StorageProvider } from '@semburat/domain';

interface VariantSpec {
  type: AssetType;
  width: number;
  height: number;
  label: string;
}

const IMAGE_VARIANTS: VariantSpec[] = [
  { type: AssetType.HERO, width: 1200, height: 630, label: 'hero' },
  { type: AssetType.THUMBNAIL, width: 400, height: 200, label: 'thumbnail' },
  { type: AssetType.OG, width: 1200, height: 630, label: 'og' },
];

function parseMetadata(asset: Asset): Record<string, unknown> {
  try {
    return JSON.parse(asset.metadataJson ?? '{}');
  } catch {
    return {};
  }
}

export class AssetTransformationService {
  constructor(
    private readonly assetRepo: AssetRepository,
    private readonly storageProvider: StorageProvider
  ) {}

  async generateVariants(asset: Asset): Promise<Asset[]> {
    if (asset.type !== AssetType.IMAGE) {
      return [];
    }

    const sourceData = await this.storageProvider.get(asset.storageKey);
    if (!sourceData) {
      throw new Error(`Source asset data not found in storage: ${asset.storageKey}`);
    }

    const variants: Asset[] = [];
    for (const spec of IMAGE_VARIANTS) {
      const variantId = uuidv4();
      const storageKey = `assets/${asset.articleId}/${variantId}.${spec.label}`;
      await this.storageProvider.put(storageKey, sourceData, 'image/jpeg');

      const variant = new Asset({
        id: variantId as AssetId,
        articleId: asset.articleId,
        type: spec.type,
        storageKey,
        sourceUrl: asset.sourceUrl,
        hash: asset.hash,
        creator: asset.creator,
        licenseState: asset.licenseState ?? LicenseState.UNKNOWN,
        creditText: asset.creditText,
        altText: asset.altText,
        metadataJson: JSON.stringify({
          parentAssetId: asset.id,
          label: spec.label,
          width: spec.width,
          height: spec.height,
          sourceContentType: 'image/jpeg',
          generatedAt: new Date().toISOString(),
        }),
      });

      await this.assetRepo.insert(variant);
      variants.push(variant);
    }

    return variants;
  }

  async getVariants(asset: Asset): Promise<Asset[]> {
    const allAssets = await this.assetRepo.findByArticleId(asset.articleId);
    return allAssets.filter((candidate) => {
      if (candidate.id === asset.id) return false;
      const meta = parseMetadata(candidate);
      return meta.parentAssetId === asset.id;
    });
  }
}
