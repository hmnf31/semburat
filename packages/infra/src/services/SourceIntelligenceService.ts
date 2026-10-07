import type { SourceRepository } from '@semburat/domain';
import { Source, SourceType, ReliabilityState, LicenseState } from '@semburat/domain';
import { v4 as uuidv4 } from 'uuid';

type SourceStats = {
  total: number;
  byType: Record<string, number>;
  byReliability: Record<string, number>;
};

export class SourceIntelligenceService {
  constructor(private readonly sourceRepo: SourceRepository) {}

  async collectSource(url: string, title: string): Promise<Source> {
    const domain = new URL(url).hostname.replace('www.', '');
    const existing = await this.sourceRepo.findByDomain(domain);

    if (existing.length > 0) {
      const source = existing[0];
      const updated = new Source({
        ...source.toParams(),
        accessedAt: new Date(),
      });
      await this.sourceRepo.upsert(updated);
      return updated;
    }

    const sourceId = uuidv4();
    const sourceType = this.inferSourceType(domain);
    const source = new Source({
      id: sourceId,
      url,
      domain,
      title,
      publisher: domain,
      sourceType,
      reliabilityState: ReliabilityState.UNVERIFIED,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date(),
    });

    await this.sourceRepo.insert(source);
    return source;
  }

  async updateReliability(sourceId: string, state: string): Promise<void> {
    const source = await this.sourceRepo.findById(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    const reliabilityState = this.parseReliabilityState(state);
    const updated = source.withReliability(reliabilityState);
    await this.sourceRepo.upsert(updated);
  }

  async getSourceStats(): Promise<SourceStats> {
    // This is a simplified implementation - in production, use aggregate queries
    const allSources: Source[] = [];

    // We need to get all sources - using a workaround since the repository doesn't have findAll
    // In practice, you would add a findAll method to the repository
    const domains = ['example.com', 'news.example.com', 'rss.example.com']; // placeholder

    for (const domain of domains) {
      const sources = await this.sourceRepo.findByDomain(domain);
      allSources.push(...sources);
    }

    const byType: Record<string, number> = {};
    const byReliability: Record<string, number> = {};

    for (const source of allSources) {
      byType[source.sourceType] = (byType[source.sourceType] ?? 0) + 1;
      byReliability[source.reliabilityState] = (byReliability[source.reliabilityState] ?? 0) + 1;
    }

    return {
      total: allSources.length,
      byType,
      byReliability,
    };
  }

  private inferSourceType(domain: string): SourceType {
    const officialDomains = ['go.id', 'gov.id', 'kominfo.go.id', 'kemenkeu.go.id'];
    const primaryDomains = ['detik.com', 'kompas.com', 'tempo.co', 'cnnindonesia.com'];
    const expertDomains = ['github.com', 'stackoverflow.com', 'arxiv.org'];

    if (officialDomains.some((d) => domain.includes(d))) {
      return SourceType.OFFICIAL;
    }
    if (primaryDomains.some((d) => domain.includes(d))) {
      return SourceType.ESTABLISHED_MEDIA;
    }
    if (expertDomains.some((d) => domain.includes(d))) {
      return SourceType.EXPERT;
    }
    return SourceType.ESTABLISHED_MEDIA;
  }

  private parseReliabilityState(state: string): ReliabilityState {
    const normalized = state.toLowerCase();
    switch (normalized) {
      case 'unverified':
        return ReliabilityState.UNVERIFIED;
      case 'low':
        return ReliabilityState.LOW;
      case 'medium':
        return ReliabilityState.MEDIUM;
      case 'high':
        return ReliabilityState.HIGH;
      default:
        return ReliabilityState.UNVERIFIED;
    }
  }
}
