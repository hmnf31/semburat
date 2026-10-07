import { fromISO, toISO, jsonParse, jsonQuote } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { ContentVariant, Platform, ApprovalState } from '@semburat/domain';
import type { ContentVariantRepository as ContentVariantRepositoryPort } from '@semburat/domain';
import type { AssetId } from '@semburat/shared';

export class D1ContentVariantRepository implements ContentVariantRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(variant: ContentVariant): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO content_variants ' +
      '(id, article_id, platform, format, content, asset_ids, approval_state, ' +
      'generation_metadata, created_at, published_at) VALUES (?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        variant.id,
        variant.articleId,
        variant.platform,
        variant.format,
        variant.content,
        jsonQuote(variant.assetIds),
        variant.approvalState,
        variant.generationMetadata,
        toISO(variant.createdAt),
        toISO(variant.publishedAt)
      )
      .run();
  }

  async findById(id: string): Promise<ContentVariant | null> {
    const row = await this.db
      .prepare('SELECT * FROM content_variants WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByArticleId(articleId: string): Promise<ContentVariant[]> {
    const result = await this.db
      .prepare('SELECT * FROM content_variants WHERE article_id = ? ORDER BY created_at ASC')
      .bind(articleId)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async updateApprovalState(id: string, state: ApprovalState): Promise<void> {
    const sql = 'UPDATE content_variants SET approval_state = ? WHERE id = ?';
    await this.db.prepare(sql).bind(state, id).run();
  }

  private fromRow(row: Record<string, unknown>): ContentVariant {
    return new ContentVariant({
      id: row.id as string,
      articleId: row.article_id as string,
      platform: row.platform as Platform,
      format: row.format as string,
      content: row.content as string,
      assetIds: jsonParse<AssetId[]>(row.asset_ids as string, []),
      approvalState: row.approval_state as ApprovalState,
      generationMetadata: (row.generation_metadata as string) ?? '{}',
      createdAt: fromISO(row.created_at),
      publishedAt: fromISO(row.published_at),
    });
  }
}
