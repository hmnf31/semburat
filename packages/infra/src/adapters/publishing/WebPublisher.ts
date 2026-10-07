import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher, ArticleRepository } from '@semburat/domain';
import { ArticleStatus } from '@semburat/domain';

export class WebPublisher implements Publisher {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.WEB) {
      throw new Error('WebPublisher can only publish to web, got ' + variant.platform);
    }

    const article = await this.articleRepo.findById(variant.articleId);
    if (!article) {
      throw new Error('Article not found: ' + variant.articleId);
    }

    const publishedArticle = article.markPublished();
    await this.articleRepo.update(publishedArticle);

    return {
      externalId: article.id,
      url: article.canonicalUrl ?? 'https://semburat.com/' + article.slug.toString(),
    };
  }

  async delete(externalId: string): Promise<void> {
    const article = await this.articleRepo.findById(externalId);
    if (!article) {
      throw new Error('Article not found: ' + externalId);
    }

    const archivedArticle = article.withStatus(ArticleStatus.ARCHIVED);
    await this.articleRepo.update(archivedArticle);
  }
}
