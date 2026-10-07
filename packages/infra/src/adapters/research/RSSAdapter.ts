import type { ResearchProvider } from '@semburat/domain';

export interface RSSItem {
  url: string;
  title: string;
  snippet: string;
}

export class RSSAdapter implements ResearchProvider {
  private readonly items: RSSItem[];

  constructor(items?: RSSItem[]) {
    this.items = items ?? [
      {
        url: 'https://rss.example.com/item/1',
        title: 'RSS: Pembaruan Kebijakan Energi Terbarukan',
        snippet: 'Kebijakan energi terbarukan di Indonesia mendapat pembaruan penting.',
      },
      {
        url: 'https://rss.example.com/item/2',
        title: 'RSS: Inovasi Transportasi Publik di Jakarta',
        snippet: 'Jakarta melanjutkan inovasi transportasi publik untuk mengurangi kemacetan.',
      },
    ];
  }

  async search(query: string, maxResults: number): Promise<RSSItem[]> {
    const filtered = this.items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    const limit = Math.max(0, Math.min(maxResults, filtered.length));
    return filtered.slice(0, limit).map((r) => ({
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
      content: 'Konten RSS dari ' + url + '. Feed ini berisi ringkasan topik terkini.',
      metadata: {
        title: 'RSS Feed',
        publishedAt: new Date(),
        author: 'RSS Publisher',
      },
    };
  }
}
