import type { Asset } from '../entities/Asset.js';

export interface AssetRepository {
  insert(asset: Asset): Promise<void>;
  findById(id: string): Promise<Asset | null>;
  findByArticleId(articleId: string): Promise<Asset[]>;
  findByHash(hash: string): Promise<Asset | null>;
  update(asset: Asset): Promise<void>;
  delete(id: string): Promise<void>;
}
