import { describe, expect, it, vi } from 'vitest';
import { ProviderError } from '@semburat/shared';
import {
  extractHtmlPage,
  mapWithConcurrency,
  parseFeed,
  stripHtml,
} from '../../src/adapters/research/FeedParser.js';
import { NewsAdapter } from '../../src/adapters/research/NewsAdapter.js';
import {
  GOOGLE_NEWS_RSS_HEADLINES,
  RSSAdapter,
  parseFeedList,
} from '../../src/adapters/research/RSSAdapter.js';
import { EnhancedResearchAdapter } from '../../src/adapters/research/EnhancedResearchAdapter.js';
import { GoogleTrendsAdapter } from '../../src/adapters/trends/GoogleTrendsAdapter.js';

const RSS_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Feed Uji</title>
<item>
  <title><![CDATA[Gempa M5,6 Guncang Jayapura]]></title>
  <link>https://news.test/jayapura</link>
  <description>&lt;p&gt;BMKG mencatat gempa berkekuatan 5,6&lt;/p&gt;</description>
  <pubDate>Tue, 06 Oct 2026 08:00:00 GMT</pubDate>
</item>
<item>
  <title>Nilai Rupiah Melemah</title>
  <link>https://news.test/rupiah</link>
  <description>Rupiah melemah terhadap dolar AS</description>
  <pubDate>Mon, 05 Oct 2026 08:00:00 GMT</pubDate>
</item>
</channel></rss>`;

const ATOM_SAMPLE = `<feed xmlns="http://www.w3.org/2005/Atom">
<entry>
  <title>AI untuk Pertanian</title>
  <link href="https://news.test/ai-pertanian"/>
  <updated>2026-10-07T10:00:00Z</updated>
  <summary>Ringkasan AI pertanian</summary>
</entry>
</feed>`;

const HTML_SAMPLE = `<html><head>
<title>Judul Halaman</title>
<meta property="og:title" content="OG Judul" />
<meta name="author" content="Redaksi" />
<meta property="article:published_time" content="2026-10-06T08:00:00Z" />
</head><body>
<script>var x = 1;</script>
<p>Kalimat <b>pertama</b>.</p><p>Kalimat kedua.</p>
</body></html>`;

const feedResponse =
  (body: string, status = 200) =>
  (_url: string): Promise<Response> =>
    Promise.resolve(new Response(body, { status }));

describe('parseFeed', () => {
  it('parses RSS items with CDATA, entities and dates', () => {
    const items = parseFeed(RSS_SAMPLE, 'https://feeds.test/rss');
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('Gempa M5,6 Guncang Jayapura');
    expect(items[0].url).toBe('https://news.test/jayapura');
    expect(items[0].snippet).toContain('BMKG mencatat gempa');
    expect(items[0].snippet).not.toContain('<p>');
    expect(items[0].publishedAt?.toISOString()).toBe('2026-10-06T08:00:00.000Z');
  });

  it('parses Atom entries and resolves relative links', () => {
    const items = parseFeed(ATOM_SAMPLE, 'https://feeds.test/atom');
    expect(items).toHaveLength(1);
    expect(items[0].url).toBe('https://news.test/ai-pertanian');
    expect(items[0].publishedAt?.toISOString()).toBe('2026-10-07T10:00:00.000Z');
  });

  it('returns an empty list for non-feed payloads', () => {
    expect(parseFeed('<html><body>halo</body></html>', 'https://feeds.test')).toEqual([]);
  });
});

describe('stripHtml', () => {
  it('removes tags and decodes entities', () => {
    expect(stripHtml('<p>A &amp; B</p>')).toBe('A & B');
    expect(stripHtml('angka &#65; ok')).toBe('angka A ok');
  });
});

describe('extractHtmlPage', () => {
  it('extracts metadata and readable body text', () => {
    const page = extractHtmlPage(HTML_SAMPLE, 'https://news.test/artikel');
    expect(page.metadata.title).toBe('OG Judul');
    expect(page.metadata.author).toBe('Redaksi');
    expect(page.metadata.publishedAt?.toISOString()).toBe('2026-10-06T08:00:00.000Z');
    expect(page.content).toContain('Kalimat pertama.');
    expect(page.content).not.toContain('var x');
  });

  it('falls back to the url when no title is present', () => {
    const page = extractHtmlPage('<body>tanpa judul</body>', 'https://news.test/x');
    expect(page.metadata.title).toBe('https://news.test/x');
  });
});

describe('mapWithConcurrency', () => {
  it('keeps input order and honours the concurrency limit', async () => {
    let active = 0;
    let peak = 0;
    const results = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (value) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return value * 2;
    });
    expect(results).toEqual([2, 4, 6, 8, 10]);
    expect(peak).toBeLessThanOrEqual(2);
  });
});

describe('NewsAdapter', () => {
  it('searches the configured endpoint and returns feed items', async () => {
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new NewsAdapter({ fetchFn });
    const results = await adapter.search('gempa', 5);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const requested = vi.mocked(fetchFn).mock.calls[0][0] as string;
    expect(requested).toContain('q=gempa');
    expect(requested).toContain('hl=id');
    expect(results[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns no results when disabled', async () => {
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new NewsAdapter({ fetchFn, enabled: false });
    expect(await adapter.search('gempa', 5)).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('returns no results on http errors or network failures', async () => {
    const failing = new NewsAdapter({
      fetchFn: () => Promise.resolve(new Response('', { status: 503 })),
    });
    expect(await failing.search('gempa', 5)).toEqual([]);
    const broken = new NewsAdapter({
      fetchFn: () => Promise.reject(new Error('network down')),
    });
    expect(await broken.search('gempa', 5)).toEqual([]);
  });

  it('fetches and extracts page content', async () => {
    const adapter = new NewsAdapter({ fetchFn: feedResponse(HTML_SAMPLE) });
    const page = await adapter.fetchPage('https://news.test/artikel');
    expect(page.metadata.title).toBe('OG Judul');
    expect(page.content).toContain('Kalimat kedua.');
  });

  it('throws ProviderError for unexpected status codes', async () => {
    const adapter = new NewsAdapter({
      fetchFn: () => Promise.resolve(new Response('missing', { status: 404 })),
    });
    await expect(adapter.fetchPage('https://news.test/hilang')).rejects.toBeInstanceOf(
      ProviderError
    );
  });
});

describe('RSSAdapter', () => {
  it('merges configured feeds, filters by query and sorts by recency', async () => {
    const feeds = ['https://feeds.test/satu', 'https://feeds.test/dua'];
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new RSSAdapter({ feeds, fetchFn });
    const results = await adapter.search('rupiah', 10);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Nilai Rupiah Melemah');
    expect(results[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns nothing without feeds or when disabled', async () => {
    expect(await new RSSAdapter({ feeds: [] }).search('apa pun', 5)).toEqual([]);
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new RSSAdapter({ feeds: ['https://feeds.test/satu'], fetchFn, enabled: false });
    expect(await adapter.search('gempa', 5)).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('keeps working when one feed fails', async () => {
    const fetchFn = vi.fn((url: string) =>
      url.includes('mati')
        ? Promise.resolve(new Response('', { status: 500 }))
        : Promise.resolve(new Response(RSS_SAMPLE, { status: 200 }))
    );
    const adapter = new RSSAdapter({
      feeds: ['https://feeds.test/mati', 'https://feeds.test/hidup'],
      fetchFn,
    });
    const results = await adapter.search('gempa', 10);
    expect(results).toHaveLength(1);
  });

  it('parses feed lists from configuration strings', () => {
    expect(parseFeedList(' https://a.test/rss , ,https://b.test/rss ')).toEqual([
      'https://a.test/rss',
      'https://b.test/rss',
    ]);
    expect(parseFeedList(undefined)).toEqual([]);
  });

  it('ships with a default feed', () => {
    const adapter = new RSSAdapter();
    expect(adapter).toBeDefined();
    expect(GOOGLE_NEWS_RSS_HEADLINES).toContain('news.google.com');
  });
});

describe('GoogleTrendsAdapter', () => {
  it('derives ranked topics from headline frequency', async () => {
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new GoogleTrendsAdapter({ fetchFn });
    const topics = await adapter.getTrendingTopics('ID');
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(topics.length).toBeGreaterThan(0);
    for (const topic of topics) {
      expect(topic.score).toBeGreaterThanOrEqual(0);
      expect(topic.score).toBeLessThanOrEqual(100);
      expect(topic.sourceCount).toBeGreaterThanOrEqual(1);
      expect(topic.normalizedKey).not.toContain(' ');
    }
    expect(topics[0].sourceCount).toBeGreaterThanOrEqual(topics[topics.length - 1].sourceCount);
  });

  it('returns no topics when disabled or failing', async () => {
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    expect(
      await new GoogleTrendsAdapter({ fetchFn, enabled: false }).getTrendingTopics('ID')
    ).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
    const broken = new GoogleTrendsAdapter({
      fetchFn: () => Promise.reject(new Error('network down')),
    });
    expect(await broken.getTrendingTopics('ID')).toEqual([]);
  });

  it('limits the number of reported topics', async () => {
    const adapter = new GoogleTrendsAdapter({ fetchFn: feedResponse(RSS_SAMPLE), maxTopics: 2 });
    expect((await adapter.getTrendingTopics('ID')).length).toBeLessThanOrEqual(2);
  });
});

describe('EnhancedResearchAdapter', () => {
  it('merges news, rss and trends results and removes duplicate urls', async () => {
    const fetchFn = vi.fn(feedResponse(RSS_SAMPLE));
    const adapter = new EnhancedResearchAdapter(
      new NewsAdapter({ fetchFn }),
      new RSSAdapter({ feeds: ['https://feeds.test/satu'], fetchFn }),
      new GoogleTrendsAdapter({ fetchFn })
    );
    const results = await adapter.search('gempa', 20);
    expect(results.length).toBeGreaterThan(0);
    const urls = results.map((result) => result.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('routes feed urls to the rss adapter and article urls to the news adapter', async () => {
    const feedFetch = vi.fn(feedResponse(RSS_SAMPLE));
    const pageFetch = vi.fn(feedResponse(HTML_SAMPLE));
    const rssAdapter = new RSSAdapter({ fetchFn: feedFetch });
    const newsAdapter = new NewsAdapter({ fetchFn: pageFetch });
    const adapter = new EnhancedResearchAdapter(newsAdapter, rssAdapter, new GoogleTrendsAdapter());
    await adapter.fetchPage('https://news.test/rss');
    expect(feedFetch).toHaveBeenCalledTimes(1);
    expect(pageFetch).not.toHaveBeenCalled();
    await adapter.fetchPage('https://news.test/artikel');
    expect(pageFetch).toHaveBeenCalledTimes(1);
  });
});
