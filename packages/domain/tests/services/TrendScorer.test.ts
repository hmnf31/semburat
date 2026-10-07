import { describe, it, expect } from 'vitest';
import { TrendScorer } from '../../src/services/TrendScorer.js';

describe('TrendScorer', () => {
  const scorer = new TrendScorer();

  it('should calculate score based on weighted factors', () => {
    const input = {
      velocity: 80,
      relevance: 90,
      freshness: 70,
      sourceCount: 5,
      riskScore: 10,
    };
    const score = scorer.calculateScore(input);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return 0 for all zero inputs', () => {
    const input = {
      velocity: 0,
      relevance: 0,
      freshness: 0,
      sourceCount: 0,
      riskScore: 0,
    };
    const score = scorer.calculateScore(input);
    expect(score).toBe(0);
  });

  it('should cap score at 100', () => {
    const input = {
      velocity: 100,
      relevance: 100,
      freshness: 100,
      sourceCount: 20,
      riskScore: 0,
    };
    const score = scorer.calculateScore(input);
    expect(score).toBe(100);
  });

  it('should reduce score with high risk', () => {
    const lowRisk = {
      velocity: 80,
      relevance: 80,
      freshness: 80,
      sourceCount: 5,
      riskScore: 10,
    };
    const highRisk = {
      ...lowRisk,
      riskScore: 80,
    };
    expect(scorer.calculateScore(highRisk)).toBeLessThan(scorer.calculateScore(lowRisk));
  });

  it('getRecommendation should return PRIORITY for score >= 80', () => {
    expect(scorer.getRecommendation(80)).toBe('PRIORITY');
    expect(scorer.getRecommendation(100)).toBe('PRIORITY');
  });

  it('getRecommendation should return GENERATE for score >= 60', () => {
    expect(scorer.getRecommendation(60)).toBe('GENERATE');
    expect(scorer.getRecommendation(79)).toBe('GENERATE');
  });

  it('getRecommendation should return QUEUE for score >= 40', () => {
    expect(scorer.getRecommendation(40)).toBe('QUEUE');
    expect(scorer.getRecommendation(59)).toBe('QUEUE');
  });

  it('getRecommendation should return MONITOR for score >= 20', () => {
    expect(scorer.getRecommendation(20)).toBe('MONITOR');
    expect(scorer.getRecommendation(39)).toBe('MONITOR');
  });

  it('getRecommendation should return IGNORE for score < 20', () => {
    expect(scorer.getRecommendation(0)).toBe('IGNORE');
    expect(scorer.getRecommendation(19)).toBe('IGNORE');
  });
});
