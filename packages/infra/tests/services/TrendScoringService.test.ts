import { describe, it, expect } from 'vitest';
import { TrendScoringService } from '../../src/services/TrendScoringService.js';

describe('TrendScoringService', () => {
  const service = new TrendScoringService();

  it('returns priority for score >= 90', () => {
    expect(service.getRecommendation(95)).toBe('priority');
    expect(service.getRecommendation(90)).toBe('priority');
  });

  it('returns generate for 75-89', () => {
    expect(service.getRecommendation(80)).toBe('generate');
  });

  it('returns queue for 60-74', () => {
    expect(service.getRecommendation(70)).toBe('queue');
  });

  it('returns monitor for 40-59', () => {
    expect(service.getRecommendation(50)).toBe('monitor');
  });

  it('returns ignore for < 40', () => {
    expect(service.getRecommendation(20)).toBe('ignore');
  });

  it('calculates score correctly', () => {
    const score = service.score({
      velocity: 80,
      relevance: 60,
      freshness: 70,
      sourceCount: 10,
      riskScore: 20,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('clamps score to 0-100', () => {
    const high = service.score({
      velocity: 100,
      relevance: 100,
      freshness: 100,
      sourceCount: 100,
      riskScore: 0,
    });
    expect(high).toBeLessThanOrEqual(100);
    const low = service.score({
      velocity: 0,
      relevance: 0,
      freshness: 0,
      sourceCount: 0,
      riskScore: 100,
    });
    expect(low).toBeGreaterThanOrEqual(0);
  });
});
