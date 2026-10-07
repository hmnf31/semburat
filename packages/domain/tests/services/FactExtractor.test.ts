import { describe, it, expect } from 'vitest';
import { FactExtractor } from '../../src/services/FactExtractor.js';
import type { SourceId } from '@semburat/shared';

describe('FactExtractor', () => {
  const extractor = new FactExtractor();

  it('should extract claims from text', () => {
    const text =
      'The government announced new policy. It will affect many people. Experts say it is good.';
    const claims = extractor.extractClaims(text, 'source-1' as SourceId);
    expect(claims.length).toBeGreaterThan(0);
    expect(claims[0]).toHaveProperty('statement');
    expect(claims[0]).toHaveProperty('confidence');
  });

  it('should return empty array for empty text', () => {
    const claims = extractor.extractClaims('', 'source-1' as SourceId);
    expect(claims).toEqual([]);
  });

  it('should return empty array for whitespace only', () => {
    const claims = extractor.extractClaims('   ', 'source-1' as SourceId);
    expect(claims).toEqual([]);
  });

  it('should filter out very short sentences', () => {
    const text = 'Hi. This is a valid sentence that is long enough. Bye.';
    const claims = extractor.extractClaims(text, 'source-1' as SourceId);
    expect(claims.every((c) => c.statement.length > 20)).toBe(true);
  });

  it('should filter out very long sentences', () => {
    const text = 'A'.repeat(600) + '. This is a valid sentence that is long enough.';
    const claims = extractor.extractClaims(text, 'source-1' as SourceId);
    expect(claims.every((c) => c.statement.length < 500)).toBe(true);
  });

  it('should set default confidence', () => {
    const text = 'This is a valid sentence that is long enough to be extracted.';
    const claims = extractor.extractClaims(text, 'source-1' as SourceId);
    expect(claims[0].confidence).toBe(0.7);
  });
});
