import { Article, ArticleStatus } from '@semburat/domain';
import type { ArticleRepository } from '@semburat/domain';

export class HumanReviewQueueService {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async enqueueForReview(articleId: string, _reason: string): Promise<void> {
    const article = await this.loadArticle(articleId);
    const updated = article.withStatus(ArticleStatus.NEEDS_REVIEW);
    await this.articleRepo.update(updated);
  }

  async getReviewQueue(limit: number): Promise<Article[]> {
    const result = await this.articleRepo.findByStatus(ArticleStatus.NEEDS_REVIEW, limit);
    return result.articles;
  }

  async approve(articleId: string, _operator: string): Promise<Article> {
    const article = await this.loadArticle(articleId);
    const updated = article.withStatus(ArticleStatus.APPROVED);
    await this.articleRepo.update(updated);
    return updated;
  }

  async reject(articleId: string, _operator: string, _reason: string): Promise<Article> {
    const article = await this.loadArticle(articleId);
    const updated = article.withStatus(ArticleStatus.REJECTED);
    await this.articleRepo.update(updated);
    return updated;
  }

  private async loadArticle(articleId: string): Promise<Article> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new Error(`Article not found: ${articleId}`);
    }
    return article;
  }
}
