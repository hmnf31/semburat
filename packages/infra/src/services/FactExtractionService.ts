import { Fact, FactEvidence, VerificationStatus, SupportType } from '@semburat/domain';
import type { AIProvider, FactRepository, FactEvidenceRepository } from '@semburat/domain';
import type { Research } from '@semburat/domain';
import { ResearchRepository } from '@semburat/domain';
import { randomUUID } from 'node:crypto';

interface ClaimInput {
  statement: string;
  sources?: string[];
  confidence?: number;
}

interface ExtractedFact {
  statement: string;
  confidence: number;
  evidence: {
    text: string;
    sourceId: string;
    supportType: SupportType;
  }[];
}

export class FactExtractionService {
  constructor(
    private readonly aiProvider: AIProvider,
    private readonly factRepo: FactRepository,
    private readonly factEvidenceRepo: FactEvidenceRepository,
    private readonly researchRepo: ResearchRepository
  ) {}

  async extractFactsFromResearch(researchId: string, articleId: string): Promise<Fact[]> {
    const research = await this.researchRepo.findById(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    const claims = this.parseClaims(research);
    if (claims.length === 0) {
      return [];
    }

    const prompt = this.buildPrompt(claims, research.summary);
    const schema = {
      type: 'object',
      properties: {
        facts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              statement: { type: 'string' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              evidence: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    sourceId: { type: 'string' },
                    supportType: {
                      type: 'string',
                      enum: ['supports', 'contradicts', 'partial', 'neutral'],
                    },
                  },
                  required: ['text', 'sourceId', 'supportType'],
                },
              },
            },
            required: ['statement', 'confidence', 'evidence'],
          },
        },
      },
      required: ['facts'],
    };

    const result = (await this.aiProvider.generateStructured(prompt, schema)) as {
      facts: ExtractedFact[];
    };

    if (!result.facts || !Array.isArray(result.facts)) {
      return [];
    }

    const facts: Fact[] = [];
    for (const extracted of result.facts) {
      const factId = randomUUID();
      const fact = new Fact({
        id: factId,
        articleId,
        statement: extracted.statement,
        confidence: extracted.confidence ?? 0,
        verificationStatus: VerificationStatus.UNVERIFIED,
      });

      const evidenceEntities = (extracted.evidence ?? []).map(
        (e) =>
          new FactEvidence({
            factId: fact.id,
            sourceId: e.sourceId,
            evidenceText: e.text,
            supportType: e.supportType ?? SupportType.SUPPORTS,
            confidence: extracted.confidence ?? 0.5,
          })
      );

      await this.factRepo.insert(fact);
      for (const ev of evidenceEntities) {
        await this.factEvidenceRepo.insert(ev);
      }
      facts.push(fact);
    }

    return facts;
  }

  private parseClaims(research: Research): ClaimInput[] {
    try {
      const parsed = JSON.parse(research.claimsJson ?? '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed as ClaimInput[];
    } catch {
      return [];
    }
  }

  private buildPrompt(claims: ClaimInput[], summary: string): string {
    const claimsText = claims.map((c, i) => `[${i + 1}] ${c.statement}`).join('\n');

    return [
      'You are an editorial fact-extraction assistant for an Indonesian media intelligence platform.',
      'Extract verifiable factual claims from the research below.',
      '',
      'RESEARCH SUMMARY:',
      summary,
      '',
      'CLAIMS:',
      claimsText,
      '',
      'INSTRUCTIONS:',
      '1. Identify distinct factual claims that can be verified against sources.',
      '2. For each claim, provide the statement, a confidence score (0-1), and supporting evidence.',
      '3. Each piece of evidence must include: text (the exact or near-exact quote from a source),',
      '   sourceId (a stable identifier for the source), and supportType (one of: supports, contradicts, partial, neutral).',
      '4. Return only claims that are factual and verifiable. Avoid opinions, speculation, or editorializing.',
      '5. Use Bahasa Indonesia for statements when the source material is in Indonesian.',
    ].join('\n');
  }
}
