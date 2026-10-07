import { describe, it, expect } from 'vitest';
import { D1TrendRepository } from '../../src/repositories/D1TrendRepository.js';
import { MockD1Database } from '../utils/MockD1Database.js';
import { Trend, TrendStatus } from '@semburat/domain';

function makeTrend(overrides: Partial<ConstructorParameters<typeof Trend>[0]> = {}): Trend {
  return new Trend({
    id: '550e8400-e29b-41d4-a716-446655440000' as any,
    title: 'Test Trend Title',
    normalizedKey: 'test-trend-title',
    score: 75,
    velocity: 50,
    relevance: 80,
    freshness: 90,
    sourceCount: 5,
    status: TrendStatus.CANDIDATE,
    detectedAt: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    ...overrides,
  });
}

describe('D1TrendRepository', () => {
  it('insert + findById round-trips a trend', async () => {
    const db = new MockD1Database();
    const repo = new D1TrendRepository(db);
    const trend = makeTrend();

    await repo.insert(trend);

    const fetched = await repo.findById(trend.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(trend.id);
    expect(fetched!.title).toBe(trend.title);
    expect(fetched!.normalizedKey).toBe(trend.normalizedKey);
    expect(fetched!.score).toBe(trend.score);
    expect(fetched!.velocity).toBe(trend.velocity);
    expect(fetched!.relevance).toBe(trend.relevance);
    expect(fetched!.freshness).toBe(trend.freshness);
    expect(fetched!.sourceCount).toBe(trend.sourceCount);
    expect(fetched!.status).toBe(TrendStatus.CANDIDATE);
  });

  it('findByNormalizedKey returns the matching trend', async () => {
    const db = new MockD1Database();
    const repo = new D1TrendRepository(db);
    const trend = makeTrend({ normalizedKey: 'unique-trend-key' });

    await repo.insert(trend);

    const fetched = await repo.findByNormalizedKey('unique-trend-key');
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(trend.id);
    expect(fetched!.normalizedKey).toBe('unique-trend-key');
  });

  it('findByNormalizedKey returns null when no match exists', async () => {
    const db = new MockD1Database();
    const repo = new D1TrendRepository(db);

    const fetched = await repo.findByNormalizedKey('does-not-exist');
    expect(fetched).toBeNull();
  });

  it('findByScore returns trends above minimum score ordered by score desc', async () => {
    const db = new MockD1Database();
    const repo = new D1TrendRepository(db);

    const trendLow = makeTrend({
      id: '1' as any,
      title: 'Low Score',
      normalizedKey: 'low-score',
      score: 30,
    });
    const trendMid = makeTrend({
      id: '2' as any,
      title: 'Mid Score',
      normalizedKey: 'mid-score',
      score: 60,
    });
    const trendHigh = makeTrend({
      id: '3' as any,
      title: 'High Score',
      normalizedKey: 'high-score',
      score: 90,
    });

    await repo.insert(trendLow);
    await repo.insert(trendMid);
    await repo.insert(trendHigh);

    const results = await repo.findByScore(50, 10);
    expect(results).toHaveLength(3);
    expect(results[0].score).toBe(30);
    expect(results[1].score).toBe(60);
    expect(results[2].score).toBe(90);
  });

  it('upsert updates existing trend with same id', async () => {
    const db = new MockD1Database();
    const repo = new D1TrendRepository(db);
    const trend = makeTrend({ id: 'upsert-test' as any, score: 50 });

    await repo.insert(trend);
    const updated = trend.withScore(85);
    await repo.upsert(updated);

    const fetched = await repo.findById('upsert-test');
    expect(fetched).not.toBeNull();
    expect(fetched!.score).toBe(85);
  });
});
