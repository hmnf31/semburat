export interface GoogleTrendData {
  title: string;
  normalizedKey: string;
  score: number;
  sourceCount: number;
}

export class GoogleTrendsAdapter {
  private readonly trends: GoogleTrendData[];

  constructor(trends?: GoogleTrendData[]) {
    this.trends = trends ?? [
      {
        title: 'Kecerdasan Buatan Indonesia',
        normalizedKey: 'kecerdasan-buatan-indonesia',
        score: 85,
        sourceCount: 12,
      },
      {
        title: 'Transformasi Digital UMKM',
        normalizedKey: 'transformasi-digital-umkm',
        score: 78,
        sourceCount: 8,
      },
      {
        title: 'Energi Terbarukan',
        normalizedKey: 'energi-terbarukan',
        score: 92,
        sourceCount: 15,
      },
      {
        title: 'Transportasi Publik Jakarta',
        normalizedKey: 'transportasi-publik-jakarta',
        score: 65,
        sourceCount: 5,
      },
    ];
  }

  async getTrendingTopics(geo: string): Promise<GoogleTrendData[]> {
    return this.trends;
  }

  getTopTrends(limit: number): GoogleTrendData[] {
    return this.trends.slice(0, limit);
  }
}
