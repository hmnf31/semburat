import { describe, it, expect } from 'vitest';
import { D1AssetRepository } from '../../src/repositories/D1AssetRepository.js';
import { MockD1Database } from '../utils/MockD1Database.js';
import { Asset, AssetType, LicenseState } from '@semburat/domain';

function makeAsset(overrides: Partial<ConstructorParameters<typeof Asset>[0]> = {}): Asset {
  return new Asset({
    id: '550e8400-e29b-41d4-a716-446655440100',
    articleId: '550e8400-e29b-41d4-a716-446655440101',
    type: AssetType.IMAGE,
    storageKey: 'assets/article/hero.png',
    sourceUrl: 'https://example.com/hero.png',
    hash: 'abc123',
    creator: 'Reporter',
    licenseState: LicenseState.OWNED,
    creditText: 'Photo by Reporter',
    altText: 'Hero image',
    metadataJson: JSON.stringify({ width: 1200 }),
    ...overrides,
  });
}

describe('D1AssetRepository', () => {
  it('insert + findById round-trips an asset', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);
    const asset = makeAsset();

    await repo.insert(asset);

    const fetched = await repo.findById(asset.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(asset.id);
    expect(fetched!.articleId).toBe(asset.articleId);
    expect(fetched!.type).toBe(AssetType.IMAGE);
    expect(fetched!.storageKey).toBe(asset.storageKey);
    expect(fetched!.sourceUrl).toBe('https://example.com/hero.png');
    expect(fetched!.hash).toBe('abc123');
    expect(fetched!.creator).toBe('Reporter');
    expect(fetched!.licenseState).toBe(LicenseState.OWNED);
    expect(fetched!.creditText).toBe('Photo by Reporter');
    expect(fetched!.altText).toBe('Hero image');
    expect(fetched!.metadataJson).toBe(JSON.stringify({ width: 1200 }));
  });

  it('insert replaces an existing asset with the same id', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);
    const asset = makeAsset();

    await repo.insert(asset);
    await repo.insert(asset);

    const fetched = await repo.findById(asset.id);
    expect(fetched).not.toBeNull();
  });

  it('findByArticleId returns all assets for an article', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);

    await repo.insert(makeAsset({ id: 'asset-1' as any, storageKey: 'assets/a/1.png' }));
    await repo.insert(makeAsset({ id: 'asset-2' as any, storageKey: 'assets/a/2.png' }));
    await repo.insert(
      makeAsset({
        id: 'asset-3' as any,
        articleId: 'other-article' as any,
        storageKey: 'assets/b/3.png',
      })
    );

    const results = await repo.findByArticleId('550e8400-e29b-41d4-a716-446655440101');
    expect(results).toHaveLength(2);
    expect(results.map((a) => a.id).sort()).toEqual(['asset-1', 'asset-2']);
  });

  it('findByArticleId returns empty array when no assets exist', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);

    const results = await repo.findByArticleId('no-assets');
    expect(results).toEqual([]);
  });

  it('findByHash returns the matching asset', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);
    const asset = makeAsset({ hash: 'deadbeef' });

    await repo.insert(asset);

    const fetched = await repo.findByHash('deadbeef');
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(asset.id);
  });

  it('findByHash returns null when no match exists', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);

    const fetched = await repo.findByHash('no-such-hash');
    expect(fetched).toBeNull();
  });

  it('update persists changes', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);
    const asset = makeAsset();

    await repo.insert(asset);

    const updated = new Asset({
      ...asset.toParams(),
      altText: 'Updated alt text',
      creditText: 'Updated credit',
    });
    await repo.update(updated);

    const fetched = await repo.findById(asset.id);
    expect(fetched!.altText).toBe('Updated alt text');
    expect(fetched!.creditText).toBe('Updated credit');
  });

  it('delete removes the asset', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);
    const asset = makeAsset();

    await repo.insert(asset);
    await repo.delete(asset.id);

    const fetched = await repo.findById(asset.id);
    expect(fetched).toBeNull();
  });

  it('delete on non-existent id is a no-op', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);

    await expect(repo.delete('non-existent')).resolves.toBeUndefined();
  });

  it('findById returns null when no match exists', async () => {
    const db = new MockD1Database();
    const repo = new D1AssetRepository(db);

    const fetched = await repo.findById('no-such-id');
    expect(fetched).toBeNull();
  });
});
