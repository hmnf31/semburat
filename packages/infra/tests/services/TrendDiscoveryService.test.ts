import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Trend } from '@semburat/domain';
import { TrendDiscoveryService } from '../../src/services/TrendDiscoveryService.js';
import type { TrendRepository } from '@semburat/domain';
import type { ResearchProvider } from '@semburat/domain';
import type { AIProvider } from '@semburat/domain';

describe('TrendDiscoveryService', () => {
  let mockTrendRepo: TrendRepository;
  let mockResearchProvider: ResearchProvider;
  let mockAIProvider: AIProvider;
  let service: TrendDiscoveryService;

  beforeEach(() => {
    mockTrendRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByNormalizedKey: vi.fn(),
      findByStatus: vi.fn(),
      findByScore: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    } as unknown as TrendRepository;

    mockResearchProvider = {
      search: vi.fn(),
      fetchPage: vi.fn(),
    } as unknown as ResearchProvider;

    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as unknown as AIProvider;

    service = new TrendDiscoveryService(mockTrendRepo, mockResearchProvider, mockAIProvider);
  });

  it('discovers trends from queries', async () => {
    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      { url: 'https://a.com', title: 'AI Boom', snippet: '...' },
      { url: 'https://b.com', title: 'AI Boom', snippet: '...' },
    ]);

    const result = await service.discoverTrends(['AI']);
    expect(mockTrendRepo.insert).toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns ranked trends sorted by score desc via repository', async () => {
    const trends = [
      new Trend({ id: '2' as any, title: 'High', normalizedKey: 'high', score: 90 }),
      new Trend({ id: '1' as any, title: 'Low', normalizedKey: 'low', score: 20 }),
    ];
    vi.mocked(mockTrendRepo.findByScore).mockResolvedValue(trends);

    const result = await service.getRankedTrends(1);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(90);
  });

  it('derives signals from real research metadata', async () => {
    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      {
        url: 'https://satu.test/gempa',
        title: 'Gempa di Jayapura',
        snippet: 'BMKG mencatat gempa berkekuatan 5,6',
        publishedAt: new Date(),
      },
      {
        url: 'https://dua.test/gempa',
        title: 'Gempa di Jayapura',
        snippet: 'Warga berlari menyelamatkan diri',
        publishedAt: new Date(),
      },
    ]);

    const [trend] = await service.discoverTrends(['gempa']);
    expect(trend.sourceCount).toBe(2);
    expect(trend.freshness).toBe(100);
    expect(trend.relevance).toBe(100);
    expect(trend.velocity).toBeGreaterThanOrEqual(40);
    expect(trend.score).toBeGreaterThan(0);
  });

  it('lowers the score of high-risk topics', async () => {
    const riskItems = [
      {
        url: 'https://satu.test/politik',
        title: 'Pemilu dan koalisi menuai kritik',
        snippet: 'Kampanye politik berlangsung panas',
        publishedAt: new Date(),
      },
      {
        url: 'https://dua.test/politik',
        title: 'Pemilu dan koalisi menuai kritik',
        snippet: 'Kampanye politik berlangsung panas',
        publishedAt: new Date(),
      },
    ];
    const safeItems = riskItems.map((item) => ({
      ...item,
      url: item.url.replace('.test', '-aman.test'),
      title: 'Festival kuliner bandung digelar akhir pekan',
      snippet: 'Ratusan pedagang mengikuti festival kuliner',
    }));

    vi.mocked(mockResearchProvider.search).mockResolvedValueOnce(riskItems);
    const [risky] = await service.discoverTrends(['pemilu']);

    vi.mocked(mockResearchProvider.search).mockResolvedValueOnce(safeItems);
    const [safe] = await service.discoverTrends(['festival']);

    expect(risky.score).toBeLessThan(safe.score);
  });

  it('does not insert a trend that already exists', async () => {
    const existing = new Trend({
      id: 't-1',
      title: 'AI Boom',
      normalizedKey: 'ai-boom',
      score: 40,
      sourceCount: 1,
    });
    vi.mocked(mockTrendRepo.findByNormalizedKey).mockResolvedValue(existing);
    vi.mocked(mockResearchProvider.search).mockResolvedValue([
      { url: 'https://a.com/1', title: 'AI Boom', snippet: 'AI pertama' },
      { url: 'https://b.com/1', title: 'AI Boom', snippet: 'AI kedua' },
    ]);

    const result = await service.discoverTrends(['AI']);
    expect(result).toEqual([]);
    expect(mockTrendRepo.insert).not.toHaveBeenCalled();
    expect(mockTrendRepo.update).toHaveBeenCalledTimes(1);
    const updated = vi.mocked(mockTrendRepo.update).mock.calls[0][0] as Trend;
    expect(updated.sourceCount).toBe(2);
    expect(updated.score).toBeGreaterThan(0);
  });

  it('returns nothing when research returns no data', async () => {
    vi.mocked(mockResearchProvider.search).mockResolvedValue([]);
    const result = await service.discoverTrends(['AI']);
    expect(result).toEqual([]);
    expect(mockTrendRepo.insert).not.toHaveBeenCalled();
  });
});
