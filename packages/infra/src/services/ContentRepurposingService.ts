import type { ContentVariantRepository, ArticleRepository, AIProvider } from '@semburat/domain';
import { ContentVariant, ApprovalState, Platform } from '@semburat/domain';
import { Article } from '@semburat/domain';
import { v4 as uuidv4 } from 'uuid';

const PLATFORM_CONFIGS: Record<string, { format: string; prompt: string }> = {
  web: { format: 'canonical', prompt: 'Generate the canonical web version of this article.' },
  instagram_feed: {
    format: 'feed',
    prompt: 'Generate an Instagram feed post with hook, short context, CTA, and article link.',
  },
  instagram_story: {
    format: 'story',
    prompt: 'Generate an Instagram story with alert, short summary, and article link.',
  },
  instagram_carousel: {
    format: 'carousel',
    prompt:
      'Generate a 7-slide Instagram carousel: hook, what happened, key fact, context, why it matters, conclusion, CTA/source.',
  },
  facebook: {
    format: 'link',
    prompt:
      'Generate a Facebook post with short context, headline, article link, and visual suggestion.',
  },
  x: { format: 'post', prompt: 'Generate a short X post or thread with source link.' },
  threads: { format: 'post', prompt: 'Generate a Threads post: conversational but factual.' },
  telegram: {
    format: 'alert',
    prompt: 'Generate a Telegram alert with short summary and article link.',
  },
  reel: {
    format: 'short',
    prompt: 'Generate a Reel script: hook (1-3 sec), context, facts, explanation, CTA.',
  },
  short: {
    format: 'short',
    prompt: 'Generate a YouTube Short script: hook, context, facts, explanation, CTA.',
  },
};

export class ContentRepurposingService {
  constructor(
    private readonly contentVariantRepo: ContentVariantRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly aiProvider: AIProvider
  ) {}

  async generateVariantsForArticle(articleId: string): Promise<ContentVariant[]> {
    const platforms = Object.keys(PLATFORM_CONFIGS);
    const variants: ContentVariant[] = [];
    for (const platform of platforms) {
      const variant = await this.generateVariant(
        articleId,
        platform,
        PLATFORM_CONFIGS[platform].format
      );
      variants.push(variant);
    }
    return variants;
  }

  async generateVariant(
    articleId: string,
    platform: string,
    format: string
  ): Promise<ContentVariant> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new Error(`Article not found: ${articleId}`);
    }
    const config = PLATFORM_CONFIGS[platform] ?? { format, prompt: 'Generate social content.' };
    const prompt = `${config.prompt}\n\nArticle title: ${article.title}\nArticle dek: ${article.dek}\nArticle body: ${article.body}`;
    const result = (await this.aiProvider.generateStructured(prompt, {})) as { content: string };
    const variant = new ContentVariant({
      id: uuidv4(),
      articleId: article.id,
      platform: platform as Platform,
      format: config.format,
      content: result.content ?? '',
      approvalState: ApprovalState.PENDING,
      generationMetadata: JSON.stringify({ generatedAt: new Date(), platform, format }),
      createdAt: new Date(),
    });
    await this.contentVariantRepo.insert(variant);
    return variant;
  }

  async approveVariant(variantId: string): Promise<ContentVariant> {
    const variant = await this.contentVariantRepo.findById(variantId);
    if (!variant) throw new Error(`Variant not found: ${variantId}`);
    const updated = variant.withApprovalState(ApprovalState.APPROVED);
    await this.contentVariantRepo.updateApprovalState(variantId, ApprovalState.APPROVED);
    return updated;
  }

  async rejectVariant(variantId: string, reason: string): Promise<ContentVariant> {
    void reason;
    const variant = await this.contentVariantRepo.findById(variantId);
    if (!variant) throw new Error(`Variant not found: ${variantId}`);
    const updated = variant.withApprovalState(ApprovalState.REJECTED);
    await this.contentVariantRepo.updateApprovalState(variantId, ApprovalState.REJECTED);
    return updated;
  }

  async getVariantsForArticle(articleId: string): Promise<ContentVariant[]> {
    return this.contentVariantRepo.findByArticleId(articleId);
  }
}
