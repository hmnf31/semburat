export interface FeedItem {
  url: string;
  title: string;
  snippet: string;
  publishedAt?: Date;
  /** Publisher display name from `<source>`, when the feed exposes it (Google News). */
  publisher?: string;
  /** Publisher homepage from `<source url="...">`, when the feed exposes it. */
  publisherUrl?: string;
}

export interface HtmlPage {
  content: string;
  metadata: { title: string; publishedAt?: Date; author?: string };
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const NAMED_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&nbsp;': ' ',
  '&hellip;': '…',
  '&mdash;': '—',
};

function codePointToString(code: number): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return '';
  try {
    return String.fromCodePoint(code);
  } catch {
    return '';
  }
}

export function decodeEntities(input: string): string {
  let out = input.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
    codePointToString(parseInt(hex, 16))
  );
  out = out.replace(/&#(\d+);/g, (_, dec: string) => codePointToString(Number(dec)));
  for (const [entity, value] of Object.entries(NAMED_ENTITIES)) {
    out = out.split(entity).join(value);
  }
  return out;
}

export function stripHtml(input: string): string {
  return decodeEntities(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function tagText(block: string, tag: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!match) return undefined;
  let inner = match[1].trim();
  const cdata = inner.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) inner = cdata[1];
  inner = inner.trim();
  return inner.length > 0 ? inner : undefined;
}

function blockLink(block: string): string | undefined {
  const withHref = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i);
  if (withHref) return decodeEntities(withHref[1]);
  const inner = tagText(block, 'link');
  if (!inner) return undefined;
  const href = inner.match(/href=["']([^"']+)["']/i);
  return decodeEntities(href ? href[1] : inner);
}

function blockSource(block: string): { publisher?: string; publisherUrl?: string } {
  const sourceBlock = block.match(/<source\b[^>]*>[\s\S]*?<\/source>/i);
  if (!sourceBlock) return {};
  const raw = sourceBlock[0];
  const urlMatch = raw.match(/\burl=["']([^"']+)["']/i);
  const name = tagText(raw, 'source');
  return {
    publisher: name ? truncate(stripHtml(name), 120) : undefined,
    publisherUrl: urlMatch ? decodeEntities(urlMatch[1]) : undefined,
  };
}

function parseDate(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const value = decodeEntities(stripHtml(raw));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function resolveUrl(raw: string, base: string): string {
  try {
    return new URL(raw, base).toString();
  } catch {
    return raw;
  }
}

const AGGREGATOR_HOSTS = new Set(['news.google.com', 'news.google.co.id']);

export function hostnameOfUrl(url: string): string | undefined {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return host.length > 0 ? host : undefined;
  } catch {
    return undefined;
  }
}

export function publisherDomainFor(item: FeedItem): string | undefined {
  const fromPublisher = item.publisherUrl ? hostnameOfUrl(item.publisherUrl) : undefined;
  if (fromPublisher) return fromPublisher;
  const host = hostnameOfUrl(item.url);
  if (host && !AGGREGATOR_HOSTS.has(host)) return host;
  return undefined;
}

export function parseFeed(xml: string, sourceUrl: string): FeedItem[] {
  const blocks = xml.match(/<(item|entry)\b[^>]*>[\s\S]*?<\/\1>/gi) ?? [];
  const items: FeedItem[] = [];
  for (const block of blocks) {
    const title = tagText(block, 'title');
    const url = blockLink(block);
    if (!title || !url) continue;
    const description =
      tagText(block, 'description') ??
      tagText(block, 'summary') ??
      tagText(block, 'content') ??
      tagText(block, 'content:encoded');
    const source = blockSource(block);
    items.push({
      url: resolveUrl(decodeEntities(url), sourceUrl),
      title: truncate(stripHtml(title), 300),
      snippet: description ? truncate(stripHtml(description), 400) : '',
      publishedAt:
        parseDate(tagText(block, 'pubDate')) ??
        parseDate(tagText(block, 'published')) ??
        parseDate(tagText(block, 'updated')) ??
        parseDate(tagText(block, 'date')) ??
        parseDate(tagText(block, 'dc:date')),
      publisher: source.publisher,
      publisherUrl: source.publisherUrl ? resolveUrl(source.publisherUrl, sourceUrl) : undefined,
    });
  }
  return items;
}

function metaContent(html: string, key: string): string | undefined {
  const patterns = [
    new RegExp(`<meta\\b[^>]*property=["']${key}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta\\b[^>]*content=["']([^"']+)["'][^>]*property=["']${key}["']`, 'i'),
    new RegExp(`<meta\\b[^>]*name=["']${key}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta\\b[^>]*content=["']([^"']+)["'][^>]*name=["']${key}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]);
  }
  return undefined;
}

export function extractHtmlPage(html: string, url: string, maxLength = 6000): HtmlPage {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const cleaned = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ');
  const title =
    metaContent(html, 'og:title') ?? metaContent(html, 'twitter:title') ?? tagText(html, 'title');
  const publishedRaw =
    metaContent(html, 'article:published_time') ?? metaContent(html, 'datePublished');
  const published = publishedRaw ? parseDate(publishedRaw) : undefined;
  return {
    content: truncate(stripHtml(cleaned), maxLength),
    metadata: {
      title: title ? stripHtml(title) : url,
      publishedAt: published,
      author: metaContent(html, 'author') ?? metaContent(html, 'article:author'),
    },
  };
}

export async function fetchWithTimeout(
  fetchFn: FetchLike,
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchFn(url, {
      signal: controller.signal,
      headers: { accept: 'application/xml, text/xml, text/html, */*' },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const size = Math.max(1, Math.min(limit, items.length));
  const runners = Array.from({ length: size }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}
