import { createHash } from 'node:crypto';
import { Asset } from '@semburat/domain';
import type { AssetRepository } from '@semburat/domain';

export class AssetDeduplicationService {
  computeHash(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  isDuplicate(hash1: string, hash2: string): boolean {
    return hash1.toLowerCase() === hash2.toLowerCase();
  }

  async findExistingAsset(hash: string, assetRepo: AssetRepository): Promise<Asset | null> {
    return assetRepo.findByHash(hash);
  }
}
