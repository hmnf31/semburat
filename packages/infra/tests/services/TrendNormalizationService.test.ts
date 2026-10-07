import { describe, it, expect } from 'vitest';
import { TrendNormalizationService } from '../../src/services/TrendNormalizationService.js';

describe('TrendNormalizationService', () => {
  const service = new TrendNormalizationService();

  it('normalizes candidates into grouped results', () => {
    const candidates = [
      { title: 'AI Revolution', url: 'https://a.com', source: 'google' },
      { title: 'AI Revolution', url: 'https://b.com', source: 'news' },
      { title: 'Digital UMKM', url: 'https://c.com', source: 'rss' },
    ];
    const result = service.normalize(candidates);
    expect(result).toHaveLength(2);
    expect(result[0].normalizedKey).toBe('ai-revolution');
    expect(result[0].sourceUrls).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(service.normalize([])).toEqual([]);
  });

  it('creates slug-like keys', () => {
    const result = service.normalize([
      { title: 'Hello World!!!', url: 'https://x.com', source: 'x' },
    ]);
    expect(result[0].normalizedKey).toBe('hello-world');
  });
});
