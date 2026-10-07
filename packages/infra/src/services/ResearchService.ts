import type {
  TrendRepository,
  SourceRepository,
  ResearchRepository,
  ResearchProvider,
  AIProvider,
} from '@semburat/domain';
import { Trend } from '@semburat/domain';
import { Research, ResearchStatus } from '@semburat/domain';
import { Source, SourceType, ReliabilityState, LicenseState } from '@semburat/domain';
import { Fact, VerificationStatus } from '@semburat/domain';
import { FactEvidence, SupportType } from '@semburat/domain';
import type { FactRepository, FactEvidenceRepository } from '@semburat/domain';
import { v4 as uuidv4 } from 'uuid';

export interface ExtractedFact {
  statement: string;
  confidence: number;
  supportType: 'supports' | 'contradicts' | 'partial' | 'neutral';
  sourceUrls: string[];
  evidenceText: string;
}

export interface ExtractedClaim {
  statement: string;
  confidence: number;
  supportType: 'supports' | 'contradicts' | 'partial' | 'neutral';
  sources: string[];
}

export interface ResearchExtractionResult {
  summary: string;
  facts: ExtractedFact[];
  claims: ExtractedClaim[];
  conflicts: string[];
  confidenceScore: number;
}

const EXTRACTION_PROMPT = `You are an editorial research assistant for SEMBURAT, an Indonesian media intelligence platform.

Given the following sources about a trend, extract:
1. A concise summary (2-3 sentences in Indonesian)
2. Key facts with confidence scores (0-1)
3. Key claims with confidence scores (0-1)
4. Any conflicts/contradictions between sources
5. An overall confidence score for the research (0-1)

Sources:
{{SOURCES}}

Return JSON with this structure:
{
  "summary": "string",
  "facts": [
    {"statement": "string", "confidence": 0.0-1.0, "supportType": "supports|contradicts|partial|neutral", "sourceUrls": ["url1", "url2"], "evidenceText": "string"}
  ],
  "claims": [
    {"statement": "string", "confidence": 0.0-1.0, "supportType": "supports|contradicts|partial|neutral", "sources": ["url1", "url2"]}
  ],
  "conflicts": ["string"],
  "confidenceScore": 0.0-1.0
}`;

const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    facts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          supportType: { type: 'string', enum: ['supports', 'contradicts', 'partial', 'neutral'] },
          sourceUrls: { type: 'array', items: { type: 'string' } },
          evidenceText: { type: 'string' },
        },
        required: ['statement', 'confidence', 'supportType', 'sourceUrls', 'evidenceText'],
      },
    },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          supportType: { type: 'string', enum: ['supports', 'contradicts', 'partial', 'neutral'] },
          sources: { type: 'array', items: { type: 'string' } },
        },
        required: ['statement', 'confidence', 'supportType', 'sources'],
      },
    },
    conflicts: { type: 'array', items: { type: 'string' } },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
  },
  required: ['summary', 'facts', 'claims', 'conflicts', 'confidenceScore'],
};

export class ResearchService {
  constructor(
    private readonly trendRepo: TrendRepository,
    private readonly sourceRepo: SourceRepository,
    private readonly researchRepo: ResearchRepository,
    private readonly researchProvider: ResearchProvider,
    private readonly aiProvider: AIProvider,
    private readonly factRepo?: FactRepository,
    private readonly factEvidenceRepo?: FactEvidenceRepository
  ) {}

  async researchTrend(trendId: string): Promise<Research> {
    const trend = await this.trendRepo.findById(trendId);
    if (!trend) {
      throw new Error(`Trend not found: ${trendId}`);
    }

    const searchResults = await this.researchProvider.search(trend.title, 10);

    const sources: Source[] = [];
    const sourceContents = new Map<
      string,
      { content: string; metadata: { title: string; publishedAt?: Date; author?: string } }
    >();

    for (const result of searchResults) {
      const source = await this.getOrCreateSource(result.url, result.title);
      await this.sourceRepo.upsert(source);
      sources.push(source);

      const page = await this.researchProvider.fetchPage(result.url);
      sourceContents.set(result.url, page);
    }

    const sourceTexts = sources
      .map((s) => {
        const content = sourceContents.get(s.url.value);
        return `[Source: ${s.title} (${s.url})]\n${content?.content ?? 'No content available'}\n`;
      })
      .join('\n---\n');

    const prompt = EXTRACTION_PROMPT.replace('{{SOURCES}}', sourceTexts);
    const extractionResult = (await this.aiProvider.generateStructured(
      prompt,
      EXTRACTION_SCHEMA
    )) as ResearchExtractionResult;

    const researchId = uuidv4();
    const research = new Research({
      id: researchId,
      trendId: trend.id,
      summary: extractionResult.summary,
      factsJson: JSON.stringify(extractionResult.facts),
      claimsJson: JSON.stringify(extractionResult.claims),
      conflictsJson: JSON.stringify(extractionResult.conflicts),
      confidenceScore: extractionResult.confidenceScore,
      status: ResearchStatus.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.researchRepo.insert(research);

    if (this.factRepo && this.factEvidenceRepo) {
      await this.persistFactsAndEvidence(research, extractionResult, sources);
    }

    return research;
  }

  private async getOrCreateSource(url: string, title: string): Promise<Source> {
    const domain = new URL(url).hostname.replace('www.', '');
    const existing = await this.sourceRepo.findByDomain(domain);

    if (existing.length > 0) {
      const source = existing[0];
      return new Source({
        ...source.toParams(),
        accessedAt: new Date(),
      });
    }

    const sourceId = uuidv4();
    return new Source({
      id: sourceId,
      url,
      domain,
      title,
      publisher: domain,
      sourceType: SourceType.ESTABLISHED_MEDIA,
      reliabilityState: ReliabilityState.UNVERIFIED,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date(),
    });
  }

  private async persistFactsAndEvidence(
    research: Research,
    extraction: ResearchExtractionResult,
    sources: Source[]
  ): Promise<void> {
    const sourceMap = new Map(sources.map((s) => [s.url.value, s.id]));

    for (const factData of extraction.facts) {
      const factId = uuidv4();
      const fact = new Fact({
        id: factId,
        articleId: research.trendId,
        statement: factData.statement,
        verificationStatus: VerificationStatus.UNVERIFIED,
        confidence: factData.confidence,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.factRepo!.insert(fact);

      for (const sourceUrl of factData.sourceUrls) {
        const sourceId = sourceMap.get(sourceUrl);
        if (sourceId) {
          const evidence = new FactEvidence({
            factId: fact.id,
            sourceId,
            evidenceText: factData.evidenceText,
            supportType: this.mapSupportType(factData.supportType),
            confidence: factData.confidence,
          });
          await this.factEvidenceRepo!.insert(evidence);
        }
      }
    }
  }

  private mapSupportType(type: string): SupportType {
    switch (type) {
      case 'supports':
        return SupportType.SUPPORTS;
      case 'contradicts':
        return SupportType.CONTRADICTS;
      case 'partial':
        return SupportType.PARTIAL;
      default:
        return SupportType.NEUTRAL;
    }
  }

  async getResearchForTrend(trendId: string): Promise<Research | null> {
    return this.researchRepo.findByTrendId(trendId);
  }
}
