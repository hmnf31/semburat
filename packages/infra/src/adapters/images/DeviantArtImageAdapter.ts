import type { ImageCandidate, ImageSourceProvider } from '@semburat/domain';
import { LicenseState } from '@semburat/domain';
import { decodeEntities, stripHtml, type FetchLike } from '../research/FeedParser.js';

export const DEVIANTART_RSS_ENDPOINT = 'https://backend.deviantart.com/rss.xml';

export interface DeviantArtImageAdapterOptions {
  endpoint?: string;
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  userAgent?: string;
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

function attr(block: string, tag: string, name: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*\\b${name}=["']([^"']+)["']`, 'i'));
  return match ? decodeEntities(match[1]) : undefined;
}

function elementText(block: string, tag: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!match) return undefined;
  const text = stripHtml(match[1]);
  return text.length > 0 ? text : undefined;
}

/**
 * Fetches fan artwork from DeviantArt's public RSS feed.
 *
 * Fan art is copyrighted by the individual artist, so every candidate is
 * marked RESTRICTED with an explicit "needs permission" credit. These
 * candidates are surfaced for human review only and must never be published
 * without recorded permission.
 */
export class DeviantArtImageAdapter implements ImageSourceProvider {
  readonly name = 'deviantart';
  private readonly endpoint: string;
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options: DeviantArtImageAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEVIANTART_RSS_ENDPOINT;
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 9000;
    this.userAgent = options.userAgent ?? 'SEMBURAT/1.0 (+https://github.com/hmnf31/semburat)';
  }

  async search(query: string, maxResults: number): Promise<ImageCandidate[]> {
    const trimmed = query.trim();
    if (!this.enabled || !trimmed || maxResults <= 0) return [];
    const url = `${this.endpoint}?q=${encodeURIComponent(trimmed)}&type=deviation`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchFn(url, {
        signal: controller.signal,
        headers: {
          accept: 'application/rss+xml, application/xml, text/xml',
          'user-agent': this.userAgent,
        },
      });
      if (!response.ok) return [];
      const xml = await response.text();
      const items = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) ?? [];
      return items
        .map((block) => this.toCandidate(block))
        .filter((candidate): candidate is ImageCandidate => candidate !== undefined)
        .slice(0, maxResults);
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  private toCandidate(block: string): ImageCandidate | undefined {
    const imageUrl =
      attr(block, 'media:content', 'url') ?? attr(block, 'media:thumbnail', 'url') ?? undefined;
    if (!imageUrl) return undefined;
    const link = elementText(block, 'link') ?? attr(block, 'guid', 'isPermaLink');
    const title = elementText(block, 'title') ?? imageUrl;
    const author = this.creditAuthor(block);
    const copyright = elementText(block, 'media:copyright');
    const creditText = [author, 'DeviantArt', 'perlu izin pembuat'].filter(Boolean).join(' — ');
    return {
      provider: this.name,
      url: imageUrl,
      thumbnailUrl: attr(block, 'media:thumbnail', 'url'),
      sourceUrl: link,
      title,
      creator: author,
      licenseCode: 'fan-art',
      licenseState: LicenseState.RESTRICTED,
      creditText: copyright ? `${creditText} (${copyright})` : creditText,
    };
  }

  private creditAuthor(block: string): string | undefined {
    const match = block.match(
      /<media:credit\b[^>]*role=["']author["'][^>]*>([\s\S]*?)<\/media:credit>/i
    );
    if (!match) return undefined;
    const text = stripHtml(match[1]);
    return text.length > 0 && !text.startsWith('http') ? text : undefined;
  }
}
