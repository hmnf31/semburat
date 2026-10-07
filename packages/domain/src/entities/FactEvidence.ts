import { ValidationError } from '@semburat/shared';

import type { FactId, SourceId } from '@semburat/shared';

export enum SupportType {
  SUPPORTS = 'supports',
  CONTRADICTS = 'contradicts',
  PARTIAL = 'partial',
  NEUTRAL = 'neutral',
}

export interface FactEvidenceParams {
  factId: FactId;
  sourceId: SourceId;
  evidenceText: string;
  evidenceLocation?: string;
  supportType: SupportType;
  confidence?: number;
}

export class FactEvidence {
  public readonly factId: FactId;
  public readonly sourceId: SourceId;
  public readonly evidenceText: string;
  public readonly evidenceLocation?: string;
  public readonly supportType: SupportType;
  public readonly confidence: number;

  constructor(params: FactEvidenceParams) {
    if (!params.evidenceText || params.evidenceText.trim().length === 0) {
      throw new ValidationError('Evidence text cannot be empty');
    }
    if (params.confidence !== undefined && (params.confidence < 0 || params.confidence > 1)) {
      throw new ValidationError('Confidence must be between 0 and 1');
    }

    this.factId = params.factId;
    this.sourceId = params.sourceId;
    this.evidenceText = params.evidenceText.trim();
    this.evidenceLocation = params.evidenceLocation?.trim();
    this.supportType = params.supportType;
    this.confidence = params.confidence ?? 0.5;
  }

  withSupportType(type: SupportType): FactEvidence {
    return new FactEvidence({ ...this.toParams(), supportType: type });
  }

  public toParams(): FactEvidenceParams {
    return {
      factId: this.factId,
      sourceId: this.sourceId,
      evidenceText: this.evidenceText,
      evidenceLocation: this.evidenceLocation,
      supportType: this.supportType,
      confidence: this.confidence,
    };
  }
}
