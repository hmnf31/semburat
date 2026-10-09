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

/** Removes residual decoding artifacts (U+FFFD) left over from mislabeled encodings. */
export function cleanText(input: string): string {
  return input
    .replace(/(\uFFFD+\??)/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const WINDOWS1252_HIGH: Record<number, number> = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178,
};

function decodeWindows1252(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i];
    out += String.fromCharCode(WINDOWS1252_HIGH[byte] ?? byte);
  }
  return out;
}

function decodeUtf16(bytes: Uint8Array, littleEndian: boolean): string {
  try {
    return new TextDecoder(littleEndian ? 'utf-16le' : 'utf-16be').decode(bytes);
  } catch {
    let out = '';
    for (let i = 0; i + 1 < bytes.length; i += 2) {
      out += String.fromCharCode(
        littleEndian ? bytes[i] | (bytes[i + 1] << 8) : (bytes[i] << 8) | bytes[i + 1]
      );
    }
    return out;
  }
}

function asciiHead(bytes: Uint8Array, length = 1024): string {
  let out = '';
  for (let i = 0; i < Math.min(length, bytes.length); i += 1) {
    out += bytes[i] < 0x80 ? String.fromCharCode(bytes[i]) : '?';
  }
  return out;
}

function declaredCharset(bytes: Uint8Array): string | undefined {
  const head = asciiHead(bytes);
  const xml = head.match(/<\?xml[^>]*encoding\s*=\s*["']([^"']+)["']/i)?.[1];
  if (xml) return xml;
  const meta = head.match(/<meta[^>]+charset\s*=\s*["']([^"']+)["']/i)?.[1];
  if (meta) return meta;
  return head.match(/content\s*=\s*["'][^"']*charset=([^"'>\s]+)/i)?.[1];
}

function charsetFromHeader(contentType: string | null): string | undefined {
  if (!contentType) return undefined;
  const match = contentType.match(/charset\s*=\s*["']?([A-Za-z0-9._-]+)/i);
  return match ? match[1] : undefined;
}

function normalizeCharset(charset: string): string {
  const clean = charset.toLowerCase();
  if (
    clean === 'latin1' ||
    clean === 'latin-1' ||
    clean === 'iso8859-1' ||
    clean === 'iso-8859-1'
  ) {
    return 'windows-1252';
  }
  if (clean === 'utf8') return 'utf-8';
  return clean;
}

/** Decodes a byte buffer, preferring a strict UTF-8 pass then the declared charset. */
export function decodeCharsetBytes(bytes: Uint8Array, contentTypeHeader?: string): string {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.subarray(3));
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return decodeUtf16(bytes.subarray(2), true);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return decodeUtf16(bytes.subarray(2), false);
  }

  const declared = normalizeCharset(
    declaredCharset(bytes) ?? charsetFromHeader(contentTypeHeader ?? null) ?? 'utf-8'
  );

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    // not valid UTF-8; use the declared encoding below
  }

  if (declared === 'windows-1252') return decodeWindows1252(bytes);
  if (declared === 'utf-8') return decodeWindows1252(bytes);
  if (declared.startsWith('utf-16')) {
    const littleEndian = declared === 'utf-16le';
    return decodeUtf16(bytes, littleEndian);
  }
  try {
    return new TextDecoder(declared, { fatal: true }).decode(bytes);
  } catch {
    // fall back to a permissive decode
  }
  try {
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return decodeWindows1252(bytes);
  }
}

/** Reads a Response body honoring BOM, the HTTP charset, and the declared document charset. */
export async function decodeHttpText(response: Response): Promise<string> {
  const bytes = new Uint8Array(await response.arrayBuffer());
  return decodeCharsetBytes(bytes, response.headers.get('content-type') ?? undefined);
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
      title: truncate(cleanText(stripHtml(title)), 300),
      snippet: description ? truncate(cleanText(stripHtml(description)), 400) : '',
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
    content: truncate(cleanText(stripHtml(cleaned)), maxLength),
    metadata: {
      title: title ? cleanText(stripHtml(title)) : url,
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
