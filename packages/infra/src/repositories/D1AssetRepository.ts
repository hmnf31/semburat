import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Asset, AssetType, LicenseState } from '@semburat/domain';
import type { AssetRepository as AssetRepositoryPort } from '@semburat/domain';

export class D1AssetRepository implements AssetRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(asset: Asset): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO assets ' +
      '(id, article_id, type, storage_key, source_url, hash, creator, license_state, ' +
      'credit_text, alt_text, metadata_json, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        asset.id,
        asset.articleId,
        asset.type,
        asset.storageKey,
        asset.sourceUrl ?? null,
        asset.hash ?? null,
        asset.creator ?? null,
        asset.licenseState,
        asset.creditText ?? null,
        asset.altText ?? null,
        asset.metadataJson,
        toISO(asset.createdAt)
      )
      .run();
  }

  async findById(id: string): Promise<Asset | null> {
    const row = await this.db
      .prepare('SELECT * FROM assets WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByArticleId(articleId: string): Promise<Asset[]> {
    const result = await this.db
      .prepare('SELECT * FROM assets WHERE article_id = ? ORDER BY created_at ASC')
      .bind(articleId)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async findByHash(hash: string): Promise<Asset | null> {
    const row = await this.db
      .prepare('SELECT * FROM assets WHERE hash = ? LIMIT 1')
      .bind(hash)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async update(asset: Asset): Promise<void> {
    const sql =
      'UPDATE assets SET article_id = ?, type = ?, storage_key = ?, source_url = ?, hash = ?, ' +
      'creator = ?, license_state = ?, credit_text = ?, alt_text = ?, metadata_json = ?, created_at = ? ' +
      'WHERE id = ?';
    await this.db
      .prepare(sql)
      .bind(
        asset.articleId,
        asset.type,
        asset.storageKey,
        asset.sourceUrl ?? null,
        asset.hash ?? null,
        asset.creator ?? null,
        asset.licenseState,
        asset.creditText ?? null,
        asset.altText ?? null,
        asset.metadataJson,
        toISO(asset.createdAt),
        asset.id
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM assets WHERE id = ?').bind(id).run();
  }

  private fromRow(row: Record<string, unknown>): Asset {
    return new Asset({
      id: row.id as string,
      articleId: row.article_id as string,
      type: row.type as AssetType,
      storageKey: row.storage_key as string,
      sourceUrl: row.source_url ? (row.source_url as string) : undefined,
      hash: row.hash ? (row.hash as string) : undefined,
      creator: row.creator ? (row.creator as string) : undefined,
      licenseState: row.license_state as LicenseState,
      creditText: row.credit_text ? (row.credit_text as string) : undefined,
      altText: row.alt_text ? (row.alt_text as string) : undefined,
      metadataJson: row.metadata_json as string,
      createdAt: fromISO(row.created_at),
    });
  }
}
