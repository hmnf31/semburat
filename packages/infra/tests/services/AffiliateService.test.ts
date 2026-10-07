import { describe, it, expect } from 'vitest';
import { AffiliateService } from '../../src/services/AffiliateService.js';

describe('AffiliateService', () => {
  it('matchAffiliate generates affiliate URLs and commission for products', async () => {
    const service = new AffiliateService({
      partnerId: 'test-partner',
      commissionRate: 0.1,
      baseUrl: 'https://aff.test',
    });

    const matches = await service.matchAffiliate('article-1', [
      { name: 'Wireless Mouse', merchant: 'Tokopedia', price: 250000 },
      { name: 'Mechanical Keyboard', merchant: 'Bukalapak', price: 750000 },
    ]);

    expect(matches).toHaveLength(2);
    expect(matches[0]).toEqual({
      name: 'Wireless Mouse',
      merchant: 'Tokopedia',
      affiliateUrl:
        'https://aff.test/go?partner=test-partner&merchant=Tokopedia&product=Wireless+Mouse&price=250000',
      commission: 25000,
    });
    expect(matches[1].commission).toBe(75000);
  });

  it('matchAffiliate returns empty array when no products', async () => {
    const service = new AffiliateService();
    const matches = await service.matchAffiliate('article-1', []);
    expect(matches).toEqual([]);
  });
});
