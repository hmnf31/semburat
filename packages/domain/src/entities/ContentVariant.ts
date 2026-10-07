import { ValidationError } from '@semburat/shared';

import type { ArticleId, AssetId, ContentVariantId } from '@semburat/shared';

export enum Platform {
  WEB = 'web',
  INSTAGRAM_FEED = 'instagram_feed',
  INSTAGRAM_STORY = 'instagram_story',
  INSTAGRAM_CAROUSEL = 'instagram_carousel',
  FACEBOOK = 'facebook',
  X = 'x',
  THREADS = 'threads',
  TELEGRAM = 'telegram',
  REEL = 'reel',
  SHORT = 'short',
  NEWSLETTER = 'newsletter',
}

export enum ApprovalState {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review',
}

export interface ContentVariantParams {
  id: ContentVariantId;
  articleId: ArticleId;
  platform: Platform;
  format: string;
  content: string;
  assetIds?: AssetId[];
  approvalState?: ApprovalState;
  generationMetadata?: string;
  createdAt?: Date;
  publishedAt?: Date;
}

export class ContentVariant {
  public readonly id: ContentVariantId;
  public readonly articleId: ArticleId;
  public readonly platform: Platform;
  public readonly format: string;
  public readonly content: string;
  public readonly assetIds: AssetId[];
  public readonly approvalState: ApprovalState;
  public readonly generationMetadata: string;
  public readonly createdAt: Date;
  public readonly publishedAt?: Date;

  constructor(params: ContentVariantParams) {
    if (!params.content || params.content.trim().length === 0) {
      throw new ValidationError('Content cannot be empty');
    }
    if (!params.format || params.format.trim().length === 0) {
      throw new ValidationError('Format cannot be empty');
    }

    this.id = params.id;
    this.articleId = params.articleId;
    this.platform = params.platform;
    this.format = params.format.trim();
    this.content = params.content.trim();
    this.assetIds = params.assetIds ?? [];
    this.approvalState = params.approvalState ?? ApprovalState.PENDING;
    this.generationMetadata = params.generationMetadata ?? '{}';
    this.createdAt = params.createdAt ?? new Date();
    this.publishedAt = params.publishedAt;
  }

  withApprovalState(state: ApprovalState): ContentVariant {
    return new ContentVariant({ ...this.toParams(), approvalState: state });
  }

  markPublished(): ContentVariant {
    return new ContentVariant({
      ...this.toParams(),
      approvalState: ApprovalState.APPROVED,
      publishedAt: new Date(),
    });
  }

  public toParams(): ContentVariantParams {
    return {
      id: this.id,
      articleId: this.articleId,
      platform: this.platform,
      format: this.format,
      content: this.content,
      assetIds: this.assetIds,
      approvalState: this.approvalState,
      generationMetadata: this.generationMetadata,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
    };
  }
}
