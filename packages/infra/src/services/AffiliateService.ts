export interface ProductInput {
  name: string;
  merchant: string;
  price: number;
}

export interface AffiliateMatch {
  name: string;
  merchant: string;
  affiliateUrl: string;
  commission: number;
}

export interface AffiliateConfig {
  partnerId: string;
  commissionRate: number;
  baseUrl: string;
}

const DEFAULT_CONFIG: AffiliateConfig = {
  partnerId: process.env.AFFILIATE_PARTNER_ID ?? 'semburat-default',
  commissionRate: Number(process.env.AFFILIATE_COMMISSION_RATE ?? 0.05),
  baseUrl: process.env.AFFILIATE_BASE_URL ?? 'https://affiliate.example.com',
};

export class AffiliateService {
  private readonly config: AffiliateConfig;

  constructor(config: Partial<AffiliateConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async matchAffiliate(_articleId: string, products: ProductInput[]): Promise<AffiliateMatch[]> {
    const matches: AffiliateMatch[] = [];

    for (const product of products) {
      const affiliateUrl = this.buildAffiliateUrl(product);
      const commission = Math.round(product.price * this.config.commissionRate * 100) / 100;

      matches.push({
        name: product.name,
        merchant: product.merchant,
        affiliateUrl,
        commission,
      });
    }

    return matches;
  }

  private buildAffiliateUrl(product: ProductInput): string {
    const params = new URLSearchParams({
      partner: this.config.partnerId,
      merchant: this.sanitize(product.merchant),
      product: this.sanitize(product.name),
      price: String(product.price),
    });
    return `${this.config.baseUrl}/go?${params.toString()}`;
  }

  private sanitize(value: string): string {
    return value.trim().slice(0, 200);
  }
}
