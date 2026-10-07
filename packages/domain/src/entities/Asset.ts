import { ValidationError } from '@semburat/shared';
import { LicenseState } from './Source.js';

import type { ArticleId, AssetId } from '@semburat/shared';

export enum AssetType {
  IMAGE = 'image',
  THUMBNAIL = 'thumbnail',
  HERO = 'hero',
  OG = 'og',
  VIDEO = 'video',
  AUDIO = 'audio',
  SFX = 'sfx',
  CAROUSEL = 'carousel',
}

export interface AssetParams {
  id: AssetId;
  articleId: ArticleId;
  type: AssetType;
  storageKey: string;
  sourceUrl?: string;
  hash?: string;
  creator?: string;
  licenseState?: LicenseState;
  creditText?: string;
  altText?: string;
  metadataJson?: string;
  createdAt?: Date;
}

export class Asset {
  public readonly id: AssetId;
  public readonly articleId: ArticleId;
  public readonly type: AssetType;
  public readonly storageKey: string;
  public readonly sourceUrl?: string;
  public readonly hash?: string;
  public readonly creator?: string;
  public readonly licenseState: LicenseState;
  public readonly creditText?: string;
  public readonly altText?: string;
  public readonly metadataJson: string;
  public readonly createdAt: Date;

  constructor(params: AssetParams) {
    if (!params.storageKey || params.storageKey.trim().length === 0) {
      throw new ValidationError('Storage key cannot be empty');
    }

    this.id = params.id;
    this.articleId = params.articleId;
    this.type = params.type;
    this.storageKey = params.storageKey.trim();
    this.sourceUrl = params.sourceUrl?.trim();
    this.hash = params.hash?.trim();
    this.creator = params.creator?.trim();
    this.licenseState = params.licenseState ?? LicenseState.UNKNOWN;
    this.creditText = params.creditText?.trim();
    this.altText = params.altText?.trim();
    this.metadataJson = params.metadataJson ?? '{}';
    this.createdAt = params.createdAt ?? new Date();
  }

  withLicense(state: LicenseState): Asset {
    return new Asset({ ...this.toParams(), licenseState: state });
  }

  withCredit(text: string): Asset {
    return new Asset({ ...this.toParams(), creditText: text.trim() });
  }

  canBePublished(): boolean {
    return (
      this.licenseState !== LicenseState.UNKNOWN && this.licenseState !== LicenseState.RESTRICTED
    );
  }

  public toParams(): AssetParams {
    return {
      id: this.id,
      articleId: this.articleId,
      type: this.type,
      storageKey: this.storageKey,
      sourceUrl: this.sourceUrl,
      hash: this.hash,
      creator: this.creator,
      licenseState: this.licenseState,
      creditText: this.creditText,
      altText: this.altText,
      metadataJson: this.metadataJson,
      createdAt: this.createdAt,
    };
  }
}
