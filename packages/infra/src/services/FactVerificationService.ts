import { Fact, FactEvidence, VerificationStatus } from '@semburat/domain';
import type { AIProvider, FactRepository, FactEvidenceRepository } from '@semburat/domain';

interface VerificationResult {
  verificationStatus: VerificationStatus;
  confidence: number;
}

export class FactVerificationService {
  constructor(
    private readonly aiProvider: AIProvider,
    private readonly factRepo: FactRepository,
    private readonly factEvidenceRepo: FactEvidenceRepository
  ) {}

  async verifyArticleFacts(articleId: string): Promise<Fact[]> {
    const facts = await this.factRepo.findByArticleId(articleId);
    if (facts.length === 0) {
      return [];
    }

    const updatedFacts: Fact[] = [];

    for (const fact of facts) {
      const evidence = await this.factEvidenceRepo.findByFactId(fact.id);
      const evaluation = await this.evaluateVerification(fact, evidence);

      const updatedFact = fact
        .withVerificationStatus(evaluation.verificationStatus)
        .withConfidence(evaluation.confidence);

      updatedFacts.push(updatedFact);
    }

    await this.factRepo.bulkInsert(updatedFacts);
    return updatedFacts;
  }

  private async evaluateVerification(
    fact: Fact,
    evidence: FactEvidence[]
  ): Promise<VerificationResult> {
    const evidenceBlock =
      evidence.length > 0
        ? evidence
            .map((e) => `[${e.supportType}] ${e.evidenceText} (sumber: ${e.sourceId})`)
            .join('\n')
        : '(tidak ada bukti)';

    const prompt = [
      'You are an editorial verification assistant for an Indonesian media intelligence platform.',
      'Evaluate whether the factual claim below is supported by the provided evidence.',
      '',
      'CLAIM:',
      fact.statement,
      '',
      'EVIDENCE:',
      evidenceBlock,
      '',
      'INSTRUCTIONS:',
      '1. Berdasarkan bukti yang diberikan, tetapkan verificationStatus menjadi salah satu: unverified, partially_verified, verified, contradicted, atau needs_review.',
      '2. Berikan confidence score antara 0 dan 1.',
      '3. Jika bukti tidak ada atau tidak cukup, gunakan unverified atau needs_review.',
      '4. Jika bukti bertentangan dengan klaim, gunakan contradicted.',
      '5. Jika bukti sebagian mendukung, gunakan partially_verified.',
      '6. Jika bukti kuat dan mendukung penuh, gunakan verified.',
    ].join('\n');

    const schema = {
      type: 'object',
      properties: {
        verificationStatus: {
          type: 'string',
          enum: ['unverified', 'partially_verified', 'verified', 'contradicted', 'needs_review'],
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
      required: ['verificationStatus', 'confidence'],
    };

    const result = (await this.aiProvider.generateStructured(prompt, schema)) as VerificationResult;
    return result;
  }
}
