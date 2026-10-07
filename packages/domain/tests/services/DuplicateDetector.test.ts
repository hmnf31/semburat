import { describe, it, expect } from 'vitest';
import { DuplicateDetector } from '../../src/services/DuplicateDetector.js';

describe('DuplicateDetector', () => {
  const detector = new DuplicateDetector();

  it('should detect exact duplicate', () => {
    const titles = ['Breaking News: Major Event Happens Today'];
    expect(detector.isDuplicate('Breaking News: Major Event Happens Today', titles)).toBe(true);
  });

  it('should detect near duplicate with high similarity', () => {
    const titles = ['Breaking News: Major Event Happens Today'];
    expect(detector.isDuplicate('Breaking News: Major Event Happened Today', titles)).toBe(true);
  });

  it('should not detect different articles as duplicate', () => {
    const titles = ['Breaking News: Major Event Happens Today'];
    expect(detector.isDuplicate('Sports Team Wins Championship Game', titles)).toBe(false);
  });

  it('should not detect duplicate in empty list', () => {
    expect(detector.isDuplicate('Any Title', [])).toBe(false);
  });

  it('calculateSimilarity should return 1 for identical strings', () => {
    expect(detector.calculateSimilarity('same string', 'same string')).toBe(1);
  });

  it('calculateSimilarity should return 0 for completely different strings', () => {
    expect(detector.calculateSimilarity('abc def', 'xyz uvw')).toBe(0);
  });

  it('calculateSimilarity should return high value for similar strings', () => {
    const sim = detector.calculateSimilarity('breaking news today', 'breaking news now');
    expect(sim).toBeGreaterThanOrEqual(0.5);
  });

  it('calculateSimilarity should handle case insensitivity', () => {
    expect(detector.calculateSimilarity('UPPERCASE', 'uppercase')).toBe(1);
  });

  it('calculateSimilarity should ignore punctuation', () => {
    const sim = detector.calculateSimilarity('hello, world!', 'hello world');
    expect(sim).toBe(1);
  });
});
