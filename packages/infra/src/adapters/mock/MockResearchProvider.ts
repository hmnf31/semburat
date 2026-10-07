import type { ResearchProvider } from '@semburat/domain';

export interface MockSearchResult {
  url: string;
  title: string;
  snippet: string;
}

export interface MockPageResult {
  content: string;
  metadata: { title: string; publishedAt?: Date; author?: string };
}

export class MockResearchProvider implements ResearchProvider {
  private readonly searchIndex: MockSearchResult[];
  private readonly pageStore: Map<string, MockPageResult>;

  constructor(index?: MockSearchResult[], pages?: Map<string, MockPageResult>) {
    this.searchIndex = index ?? [
      {
        url: 'https://example.com/news/one',
        title: 'Sumber Berita Mock 1',
        snippet: 'Potongan berita mock pertama mengenai tren yang sedang ramai.',
      },
      {
        url: 'https://example.com/news/two',
        title: 'Sumber Berita Mock 2',
        snippet: 'Potongan berita mock kedua dengan konteks tambahan.',
      },
      {
        url: 'https://example.com/news/three',
        title: 'Sumber Berita Mock 3',
        snippet: 'Potongan berita mock ketiga sebagai pelengkap fakta.',
      },
    ];
    this.pageStore = pages ?? new Map<string, MockPageResult>();
  }

  setIndex(index: MockSearchResult[]): void {
    this.searchIndex.length = 0;
    this.searchIndex.push(...index);
  }

  setPage(url: string, content: string, metadata: MockPageResult['metadata']): void {
    this.pageStore.set(url, { content, metadata });
  }

  async search(query: string, maxResults: number): Promise<MockSearchResult[]> {
    const limit = Math.max(0, Math.min(maxResults, this.searchIndex.length));
    return this.searchIndex.slice(0, limit).map((r) => ({
      url: r.url,
      title: r.title + (query ? ` — ${query}` : ''),
      snippet: r.snippet,
    }));
  }

  async fetchPage(url: string): Promise<MockPageResult> {
    const stored = this.pageStore.get(url);
    if (stored) return stored;
    return {
      content:
        'Konten mock untuk halaman ' +
        url +
        '. Berita ini membahas isu terkini yang relevan dengan riset kami. ' +
        'Beberapa fakta utama disampaikan lengkap dengan konteks sumbernya.',
      metadata: {
        title: 'Halaman Mock ' + url,
        publishedAt: new Date('2026-01-01T00:00:00.000Z'),
        author: 'Penulis Mock',
      },
    };
  }
}
