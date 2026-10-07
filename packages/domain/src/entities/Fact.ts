import { ValidationError } from '@semburat/shared';

import type { ArticleId, FactId } from '@semburat/shared';

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PARTIALLY_VERIFIED = 'partially_verified',
  VERIFIED = 'verified',
  CONTRADICTED = 'contradicted',
  NEEDS_REVIEW = 'needs_review',
}

export interface FactParams {
  id: FactId;
  articleId: ArticleId;
  statement: string;
  normalizedStatement?: string;
  verificationStatus?: VerificationStatus;
  confidence?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Fact {
  public readonly id: FactId;
  public readonly articleId: ArticleId;
  public readonly statement: string;
  public readonly normalizedStatement: string;
  public readonly verificationStatus: VerificationStatus;
  public readonly confidence: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: FactParams) {
    if (!params.statement || params.statement.trim().length === 0) {
      throw new ValidationError('Fact statement cannot be empty');
    }
    if (params.confidence !== undefined && (params.confidence < 0 || params.confidence > 1)) {
      throw new ValidationError('Confidence must be between 0 and 1');
    }

    this.id = params.id;
    this.articleId = params.articleId;
    this.statement = params.statement.trim();
    this.normalizedStatement =
      params.normalizedStatement?.trim() ?? params.statement.trim().toLowerCase();
    this.verificationStatus = params.verificationStatus ?? VerificationStatus.UNVERIFIED;
    this.confidence = params.confidence ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  withVerificationStatus(status: VerificationStatus): Fact {
    return new Fact({ ...this.toParams(), verificationStatus: status, updatedAt: new Date() });
  }

  withConfidence(confidence: number): Fact {
    if (confidence < 0 || confidence > 1) {
      throw new ValidationError('Confidence must be between 0 and 1');
    }
    return new Fact({ ...this.toParams(), confidence, updatedAt: new Date() });
  }

  private toParams(): FactParams {
    return {
      id: this.id,
      articleId: this.articleId,
      statement: this.statement,
      normalizedStatement: this.normalizedStatement,
      verificationStatus: this.verificationStatus,
      confidence: this.confidence,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
