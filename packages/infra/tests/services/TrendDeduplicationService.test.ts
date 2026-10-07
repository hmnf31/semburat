import { describe, it, expect } from 'vitest';
import { TrendDeduplicationService } from '../../src/services/TrendDeduplicationService.js';

describe('TrendDeduplicationService', () => {
  const service = new TrendDeduplicationService();

  it('marks exact duplicate keys', () => {
    const trends = [
      { normalizedKey: 'ai', title: 'AI' },
      { normalizedKey: 'ai', title: 'AI' },
    ];
    const result = service.deduplicate(trends);
    expect(result).toHaveLength(2);
    expect(result[0].isDuplicate).toBe(false);
    expect(result[1].isDuplicate).toBe(true);
  });

  it('does not mark unique keys as duplicates', () => {
    const trends = [
      { normalizedKey: 'ai', title: 'AI' },
      { normalizedKey: 'umkm', title: 'UMKM' },
    ];
    const result = service.deduplicate(trends);
    expect(result.every((t) => !t.isDuplicate)).toBe(true);
  });

  it('returns empty array for empty input', () => {
    expect(service.deduplicate([])).toEqual([]);
  });
});
