import type { ResearchProvider } from '@semburat/domain';

export interface NewsSearchResult {
  url: string;
  title: string;
  snippet: string;
}

export class NewsAdapter implements ResearchProvider {
  private readonly index: NewsSearchResult[];

  constructor(index?: NewsSearchResult[]) {
    this.index = index ?? [
      {
        url: 'https://news.example.com/artikel-1',
        title: 'Berita Terkini: Perkembangan Teknologi AI di Indonesia',
        snippet:
          'Indonesia semakin mengembangkan kecerdasan buatan untuk berbagai sektor industri.',
      },
      {
        url: 'https://news.example.com/artikel-2',
        title: 'Ekonomi Digital Indonesia Tumbuh 10% pada 2026',
        snippet: 'Perekonomian digital Indonesia menunjukkan pertumbuhan signifikan di tahun ini.',
      },
      {
        url: 'https://news.example.com/artikel-3',
        title: 'Pemerintah Luncurkan Program Transformasi Digital',
        snippet: 'Program transformasi digital nasional resmi diluncurkan untuk mendukung UMKM.',
      },
    ];
  }

  async search(query: string, maxResults: number): Promise<NewsSearchResult[]> {
    const limit = Math.max(0, Math.min(maxResults, this.index.length));
    return this.index.slice(0, limit).map((r) => ({
      url: r.url,
      title: r.title,
      snippet: r.snippet,
    }));
  }

  async fetchPage(url: string): Promise<{
    content: string;
    metadata: { title: string; publishedAt?: Date; author?: string };
  }> {
    return {
      content:
        'Konten berita dari ' +
        url +
        '. Artikel ini membahas perkembangan terkini dengan data yang relevan.',
      metadata: {
        title: 'Artikel Berita',
        publishedAt: new Date(),
        author: 'Redaksi',
      },
    };
  }
}
