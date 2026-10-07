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
});
