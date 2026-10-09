import type { TrendRepository, ResearchProvider, AIProvider } from '@semburat/domain';
import { Trend, TrendStatus } from '@semburat/domain';
import { TrendNormalizationService } from './TrendNormalizationService.js';
import { TrendDeduplicationService } from './TrendDeduplicationService.js';
import { TrendScoringService } from './TrendScoringService.js';

interface DiscoveryItem {
  url: string;
  title: string;
  snippet: string;
  publishedAt?: Date;
  publisherDomain?: string;
  query: string;
}

interface ScoredSignals {
  velocity: number;
  relevance: number;
  freshness: number;
  sourceCount: number;
  riskScore: number;
}

const RISK_CATEGORIES: Record<string, string[]> = {
  health: ['kesehatan', 'virus', 'wabah', 'epidemi', 'penyakit', 'obat', 'rumah sakit', 'gizi'],
  crime: [
    'kriminal',
    'tersangka',
    'penyidikan',
    'penangkapan',
    'penganiayaan',
    'pembunuhan',
    'perampokan',
    'narkoba',
  ],
  politics: [
    'pemilu',
    'politik',
    'presiden',
    'menteri',
    'gubernur',
    'koalisi',
    'oposisi',
    'dapil',
    'kampanye',
  ],
  finance: [
    'investasi',
    'saham',
    'rupiah',
    'inflasi',
    'bunga',
    'kredit',
    'reksa dana',
    'cryptocurrency',
    'buntut penipuan',
  ],
  safety: ['bencana', 'gempa', 'banjir', 'kecelakaan', 'tsunami', 'longsor', 'evakuasi', 'darurat'],
};

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function queryTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

function relevanceFor(query: string, texts: string[]): number {
  const terms = queryTerms(query);
  if (terms.length === 0) return 50;
  const haystack = texts.join(' ').toLowerCase();
  const hits = terms.filter((term) =>
    new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(haystack)
  ).length;
  return Math.min(100, Math.round((hits / terms.length) * 100));
}

function freshnessFor(publishedAt: Date | undefined, now: number): number {
  if (!publishedAt || Number.isNaN(publishedAt.getTime())) return 50;
  const hours = (now - publishedAt.getTime()) / 3_600_000;
  if (hours < 0) return 100;
  if (hours <= 6) return 100;
  if (hours <= 24) return 80;
  if (hours <= 72) return 60;
  if (hours <= 168) return 40;
  return 20;
}

function velocityFor(items: DiscoveryItem[], now: number): number {
  const recentDomains = new Set(
    items
      .filter((item) => !item.publishedAt || now - item.publishedAt.getTime() <= 48 * 3_600_000)
      .map((item) => item.publisherDomain ?? hostnameOf(item.url))
  );
  return Math.min(100, recentDomains.size * 20);
}

function riskFor(texts: string[]): number {
  const haystack = texts.join(' ').toLowerCase();
  let score = 0;
  for (const terms of Object.values(RISK_CATEGORIES)) {
    if (terms.some((term) => haystack.includes(term))) score += 35;
  }
  return Math.min(90, score);
}

export class TrendDiscoveryService {
  constructor(
    private readonly trendRepo: TrendRepository,
    private readonly researchProvider: ResearchProvider,
    private readonly aiProvider: AIProvider,
    private readonly normalizer = new TrendNormalizationService(),
    private readonly deduplicator = new TrendDeduplicationService(),
    private readonly scorer = new TrendScoringService()
  ) {}

  async discoverTrends(queries: string[]): Promise<Trend[]> {
    const items = await this.collect(queries);
    if (items.length === 0) return [];

    const normalized = this.normalizer.normalize(
      items.map((item) => ({
        title: item.title,
        url: item.url,
        source: item.publisherDomain ?? hostnameOf(item.url),
      }))
    );
    const deduped = this.deduplicator.deduplicate(normalized);
    const now = Date.now();
    const trends: Trend[] = [];

    for (const item of deduped) {
      if (item.isDuplicate) continue;
      const group = items.filter((candidate) => this.sameKey(candidate.title, item.normalizedKey));
      const signals = this.signalsFor(group, now);
      const score = this.scorer.score(signals);

      const existing = await this.trendRepo.findByNormalizedKey(item.normalizedKey);
      if (existing) {
        const updated = existing.incrementSourceCount().withScore(score);
        await this.trendRepo.update(updated);
        continue;
      }

      const trend = new Trend({
        id: crypto.randomUUID(),
        title: item.title,
        normalizedKey: item.normalizedKey,
        score,
        velocity: signals.velocity,
        relevance: signals.relevance,
        freshness: signals.freshness,
        sourceCount: signals.sourceCount,
        status: TrendStatus.CANDIDATE,
        detectedAt: new Date(now),
        createdAt: new Date(now),
        updatedAt: new Date(now),
      });
      await this.trendRepo.insert(trend);
      trends.push(trend);
    }
    return trends;
  }

  async getRankedTrends(limit: number): Promise<Trend[]> {
    const all = await this.trendRepo.findByScore(0, 1000);
    return all.slice(0, limit);
  }

  private async collect(queries: string[]): Promise<DiscoveryItem[]> {
    const items: DiscoveryItem[] = [];
    const chunkSize = 4;
    for (let index = 0; index < queries.length; index += chunkSize) {
      const chunk = queries.slice(index, index + chunkSize);
      const results = await Promise.all(
        chunk.map(async (query) => {
          const found = await this.researchProvider.search(query, 10);
          return found.map((result) => ({ ...result, query }));
        })
      );
      items.push(...results.flat());
    }
    return items;
  }

  private sameKey(title: string, normalizedKey: string): boolean {
    const key = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return key === normalizedKey;
  }

  private signalsFor(group: DiscoveryItem[], now: number): ScoredSignals {
    const texts = group.map((item) => `${item.title} ${item.snippet}`);
    const queries = [...new Set(group.map((item) => item.query))];
    const relevance = Math.max(...queries.map((query) => relevanceFor(query, texts)), 0);
    const freshness = Math.max(...group.map((item) => freshnessFor(item.publishedAt, now)), 0);
    return {
      velocity: velocityFor(group, now),
      relevance,
      freshness,
      sourceCount: new Set(group.map((item) => item.publisherDomain ?? hostnameOf(item.url))).size,
      riskScore: riskFor(texts),
    };
  }
}
