import { FactEvidence, SupportType } from '../entities/FactEvidence.js';
import { VerificationStatus } from '../entities/Fact.js';

export interface VerificationResult {
  status: VerificationStatus;
  confidence: number;
}

export class FactVerifier {
  verifyClaim(claim: string, evidence: FactEvidence[]): VerificationResult {
    if (!evidence || evidence.length === 0) {
      return { status: VerificationStatus.UNVERIFIED, confidence: 0 };
    }

    const supports = evidence.filter((e) => e.supportType === SupportType.SUPPORTS);
    const contradicts = evidence.filter((e) => e.supportType === SupportType.CONTRADICTS);
    const partial = evidence.filter((e) => e.supportType === SupportType.PARTIAL);

    const avgSupportConfidence =
      supports.length > 0
        ? supports.reduce((sum, e) => sum + e.confidence, 0) / supports.length
        : 0;
    const avgContradictConfidence =
      contradicts.length > 0
        ? contradicts.reduce((sum, e) => sum + e.confidence, 0) / contradicts.length
        : 0;

    if (contradicts.length > 0 && avgContradictConfidence > avgSupportConfidence) {
      return { status: VerificationStatus.CONTRADICTED, confidence: avgContradictConfidence };
    }
    if (supports.length > 0 && avgSupportConfidence >= 0.7) {
      return { status: VerificationStatus.VERIFIED, confidence: avgSupportConfidence };
    }
    if (partial.length > 0 || (supports.length > 0 && avgSupportConfidence >= 0.4)) {
      return { status: VerificationStatus.PARTIALLY_VERIFIED, confidence: avgSupportConfidence };
    }
    if (supports.length > 0) {
      return { status: VerificationStatus.NEEDS_REVIEW, confidence: avgSupportConfidence };
    }

    return { status: VerificationStatus.UNVERIFIED, confidence: 0 };
  }
}
