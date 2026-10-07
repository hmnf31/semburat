import type { Article, ArticleStatus } from '../entities/Article.js';

export interface ArticleRepository {
  insert(article: Article): Promise<void>;
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findByStatus(
    status: ArticleStatus,
    limit: number,
    cursor?: string
  ): Promise<{ articles: Article[]; nextCursor: string | null }>;
  update(article: Article): Promise<void>;
  updateStatus(id: string, status: ArticleStatus): Promise<void>;
}
