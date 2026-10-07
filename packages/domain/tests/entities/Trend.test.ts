import { describe, it, expect } from 'vitest';
import { Trend, TrendStatus } from '../../src/entities/Trend.js';
import { ValidationError } from '@semburat/shared';

describe('Trend', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Trending Topic',
    normalizedKey: 'trending-topic',
  };

  it('should create a trend with valid data', () => {
    const trend = new Trend(validParams);
    expect(trend.id).toBe(validParams.id);
    expect(trend.title).toBe('Trending Topic');
    expect(trend.normalizedKey).toBe('trending-topic');
    expect(trend.status).toBe(TrendStatus.CANDIDATE);
    expect(trend.score).toBe(0);
    expect(trend.sourceCount).toBe(0);
  });

  it('should throw ValidationError for empty title', () => {
    expect(() => new Trend({ ...validParams, title: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for empty normalizedKey', () => {
    expect(() => new Trend({ ...validParams, normalizedKey: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for score out of range', () => {
    expect(() => new Trend({ ...validParams, score: -1 })).toThrow(ValidationError);
    expect(() => new Trend({ ...validParams, score: 101 })).toThrow(ValidationError);
  });

  it('should throw ValidationError for velocity out of range', () => {
    expect(() => new Trend({ ...validParams, velocity: 101 })).toThrow(ValidationError);
  });

  it('should throw ValidationError for relevance out of range', () => {
    expect(() => new Trend({ ...validParams, relevance: 101 })).toThrow(ValidationError);
  });

  it('should throw ValidationError for freshness out of range', () => {
    expect(() => new Trend({ ...validParams, freshness: 101 })).toThrow(ValidationError);
  });

  it('withScore should return new Trend with updated score', () => {
    const trend = new Trend(validParams);
    const newTrend = trend.withScore(75);
    expect(newTrend.score).toBe(75);
    expect(newTrend.status).toBe(TrendStatus.SCORED);
    expect(newTrend.updatedAt).not.toBe(trend.updatedAt);
  });

  it('withScore should not change status if already scored', () => {
    const trend = new Trend({ ...validParams, score: 50, status: TrendStatus.SCORED });
    const newTrend = trend.withScore(75);
    expect(newTrend.status).toBe(TrendStatus.SCORED);
  });

  it('withScore should throw for invalid score', () => {
    const trend = new Trend(validParams);
    expect(() => trend.withScore(150)).toThrow(ValidationError);
  });

  it('incrementSourceCount should return new Trend with incremented count', () => {
    const trend = new Trend(validParams);
    const newTrend = trend.incrementSourceCount();
    expect(newTrend.sourceCount).toBe(1);
    expect(newTrend.updatedAt).not.toBe(trend.updatedAt);
  });
});
