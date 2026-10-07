import type { SourceId } from '@semburat/shared';

export interface ExtractedClaim {
  statement: string;
  confidence: number;
}

export class FactExtractor {
  extractClaims(text: string, sourceId: SourceId): ExtractedClaim[] {
    void sourceId;
    if (!text || text.trim().length === 0) {
      return [];
    }

    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && s.length < 500);

    return sentences.map((sentence) => ({
      statement: sentence,
      confidence: 0.7,
    }));
  }
}
