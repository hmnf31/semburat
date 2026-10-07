import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Article, ArticleStatus, FactCheckStatus } from '@semburat/domain';
import type { ArticleRepository as ArticleRepositoryPort } from '@semburat/domain';

export class D1ArticleRepository implements ArticleRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(article: Article): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO articles ' +
      '(id, research_id, title, slug, dek, summary, body, category, subcategory, status, ' +
      'risk_level, quality_score, seo_title, meta_description, canonical_url, hero_asset_id, ' +
      'topic_id, source_count, fact_check_status, version, published_at, created_at, updated_at) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(article.id, ...this.bindValues(article))
      .run();
  }

  async findById(id: string): Promise<Article | null> {
    const row = await this.db
      .prepare('SELECT * FROM articles WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const row = await this.db
      .prepare('SELECT * FROM articles WHERE slug = ? LIMIT 1')
      .bind(slug)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByStatus(
    status: ArticleStatus,
    limit: number,
    cursor?: string
  ): Promise<{ articles: Article[]; nextCursor: string | null }> {
    let sql: string;
    let params: unknown[];
    if (cursor) {
      sql = 'SELECT * FROM articles WHERE status = ? AND id > ? ORDER BY id LIMIT ?';
      params = [status, cursor, limit];
    } else {
      sql = 'SELECT * FROM articles WHERE status = ? ORDER BY id LIMIT ?';
      params = [status, limit];
    }
    const result = await this.db
      .prepare(sql)
      .bind(...params)
      .all<Record<string, unknown>>();
    const articles = (result.results ?? []).map((row) => this.fromRow(row));
    const nextCursor =
      articles.length === limit && articles.length > 0 ? articles[articles.length - 1].id : null;
    return { articles, nextCursor };
  }

  async update(article: Article): Promise<void> {
    const sql =
      'UPDATE articles SET research_id = ?, title = ?, slug = ?, dek = ?, summary = ?, body = ?, ' +
      'category = ?, subcategory = ?, status = ?, risk_level = ?, quality_score = ?, seo_title = ?, ' +
      'meta_description = ?, canonical_url = ?, hero_asset_id = ?, topic_id = ?, source_count = ?, ' +
      'fact_check_status = ?, version = ?, published_at = ?, created_at = ?, updated_at = ? WHERE id = ?';
    const values = this.bindValues(article);
    await this.db
      .prepare(sql)
      .bind(...values, article.id)
      .run();
  }

  async updateStatus(id: string, status: ArticleStatus): Promise<void> {
    const sql =
      'UPDATE articles SET status = ?, updated_at = ?, version = version + 1 WHERE id = ?';
    await this.db.prepare(sql).bind(status, toISO(new Date()), id).run();
  }

  private bindValues(article: Article): unknown[] {
    return [
      article.researchId,
      article.title,
      article.slug.toString(),
      article.dek,
      article.summary ?? null,
      article.body,
      article.category,
      article.subcategory ?? null,
      article.status,
      article.riskLevel.toString().toLowerCase(),
      article.qualityScore.value,
      article.seoTitle ?? null,
      article.metaDescription ?? null,
      article.canonicalUrl ?? null,
      article.heroAssetId ?? null,
      article.topicId ?? null,
      article.sourceCount,
      article.factCheckStatus,
      article.version,
      toISO(article.publishedAt),
      toISO(article.createdAt),
      toISO(article.updatedAt),
    ];
  }

  private fromRow(row: Record<string, unknown>): Article {
    return new Article({
      id: row.id as string,
      researchId: row.research_id as string,
      title: row.title as string,
      slug: row.slug as string,
      dek: row.dek as string,
      summary: (row.summary as string) ?? '',
      body: row.body as string,
      category: row.category as string,
      subcategory: row.subcategory ? (row.subcategory as string) : undefined,
      status: row.status as ArticleStatus,
      riskLevel: row.risk_level as string,
      qualityScore: row.quality_score as number,
      seoTitle: row.seo_title ? (row.seo_title as string) : undefined,
      metaDescription: row.meta_description ? (row.meta_description as string) : undefined,
      canonicalUrl: row.canonical_url ? (row.canonical_url as string) : undefined,
      heroAssetId: row.hero_asset_id ? (row.hero_asset_id as string) : undefined,
      topicId: row.topic_id ? (row.topic_id as string) : undefined,
      publishedAt: fromISO(row.published_at),
      createdAt: fromISO(row.created_at),
      updatedAt: fromISO(row.updated_at),
      version: row.version as number,
      sourceCount: row.source_count as number,
      factCheckStatus: row.fact_check_status as FactCheckStatus,
    });
  }
}
