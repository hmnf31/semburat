import { ValidationError } from '@semburat/shared';
import { UrlValue } from '../value-objects/URL.js';

import type { SourceId } from '@semburat/shared';

export enum SourceType {
  OFFICIAL = 'official',
  PRIMARY = 'primary',
  ESTABLISHED_MEDIA = 'established_media',
  EXPERT = 'expert',
  PUBLIC_DATABASE = 'public_database',
  COMMUNITY = 'community',
  SOCIAL_POST = 'social_post',
  USER_GENERATED = 'user_generated',
}

export enum ReliabilityState {
  UNVERIFIED = 'unverified',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum LicenseState {
  OWNED = 'owned',
  LICENSED = 'licensed',
  PUBLIC_DOMAIN = 'public_domain',
  PERMITTED = 'permitted',
  GENERATED = 'generated',
  UNKNOWN = 'unknown',
  RESTRICTED = 'restricted',
}

export interface SourceParams {
  id: SourceId;
  url: UrlValue | string;
  domain: string;
  title: string;
  publisher?: string;
  publishedAt?: Date;
  accessedAt?: Date;
  sourceType: SourceType;
  reliabilityState?: ReliabilityState;
  licenseState?: LicenseState;
  createdAt?: Date;
}

export class Source {
  public readonly id: SourceId;
  public readonly url: UrlValue;
  public readonly domain: string;
  public readonly title: string;
  public readonly publisher: string;
  public readonly publishedAt?: Date;
  public readonly accessedAt: Date;
  public readonly sourceType: SourceType;
  public readonly reliabilityState: ReliabilityState;
  public readonly licenseState: LicenseState;
  public readonly createdAt: Date;

  constructor(params: SourceParams) {
    if (!params.title || params.title.trim().length === 0) {
      throw new ValidationError('Source title cannot be empty');
    }
    if (!params.domain || params.domain.trim().length === 0) {
      throw new ValidationError('Domain cannot be empty');
    }

    this.id = params.id;
    this.url = params.url instanceof UrlValue ? params.url : UrlValue.fromString(params.url);
    this.domain = params.domain.trim().toLowerCase();
    this.title = params.title.trim();
    this.publisher = params.publisher?.trim() ?? '';
    this.publishedAt = params.publishedAt;
    this.accessedAt = params.accessedAt ?? new Date();
    this.sourceType = params.sourceType;
    this.reliabilityState = params.reliabilityState ?? ReliabilityState.UNVERIFIED;
    this.licenseState = params.licenseState ?? LicenseState.UNKNOWN;
    this.createdAt = params.createdAt ?? new Date();
  }

  withReliability(state: ReliabilityState): Source {
    return new Source({ ...this.toParams(), reliabilityState: state });
  }

  withLicense(state: LicenseState): Source {
    return new Source({ ...this.toParams(), licenseState: state });
  }

  isHighReliability(): boolean {
    return this.reliabilityState === ReliabilityState.HIGH;
  }

  canBePublished(): boolean {
    return (
      this.licenseState !== LicenseState.UNKNOWN && this.licenseState !== LicenseState.RESTRICTED
    );
  }

  public toParams(): SourceParams {
    return {
      id: this.id,
      url: this.url,
      domain: this.domain,
      title: this.title,
      publisher: this.publisher,
      publishedAt: this.publishedAt,
      accessedAt: this.accessedAt,
      sourceType: this.sourceType,
      reliabilityState: this.reliabilityState,
      licenseState: this.licenseState,
      createdAt: this.createdAt,
    };
  }
}
