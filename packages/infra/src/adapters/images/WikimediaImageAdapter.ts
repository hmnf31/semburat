import type { ImageCandidate, ImageSourceProvider } from '@semburat/domain';
import { LicenseState } from '@semburat/domain';
import { stripHtml, type FetchLike } from '../research/FeedParser.js';

export const WIKIMEDIA_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';

export interface WikimediaImageAdapterOptions {
  endpoint?: string;
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  userAgent?: string;
}

interface WikimediaMetadataValue {
  value?: string;
}

interface WikimediaImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
  extmetadata?: Record<string, WikimediaMetadataValue>;
}

interface WikimediaPage {
  title?: string;
  imageinfo?: WikimediaImageInfo[];
}

interface WikimediaResponse {
  query?: { pages?: Record<string, WikimediaPage> };
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

export function licenseStateForWikimedia(shortName: string | undefined): LicenseState {
  const normalized = (shortName ?? '').trim().toLowerCase();
  if (!normalized) return LicenseState.UNKNOWN;
  if (
    normalized.includes('public domain') ||
    normalized.includes('pd-') ||
    normalized.includes('cc0')
  ) {
    return LicenseState.PUBLIC_DOMAIN;
  }
  if (normalized.includes('cc by') || normalized.includes('cc-by')) {
    return LicenseState.LICENSED;
  }
  return LicenseState.UNKNOWN;
}

export class WikimediaImageAdapter implements ImageSourceProvider {
  readonly name = 'wikimedia';
  private readonly endpoint: string;
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options: WikimediaImageAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? WIKIMEDIA_ENDPOINT;
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.userAgent = options.userAgent ?? 'SEMBURAT/1.0 (+https://github.com/hmnf31/semburat)';
  }

  async search(query: string, maxResults: number): Promise<ImageCandidate[]> {
    const trimmed = query.trim();
    if (!this.enabled || !trimmed || maxResults <= 0) return [];
    const limit = Math.min(Math.max(maxResults, 1), 50);
    const url =
      `${this.endpoint}?action=query&generator=search&gsrnamespace=6` +
      `&gsrsearch=${encodeURIComponent(trimmed)}&gsrlimit=${limit}` +
      '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280&format=json';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchFn(url, {
        signal: controller.signal,
        headers: { accept: 'application/json', 'user-agent': this.userAgent },
      });
      if (!response.ok) return [];
      const payload = (await response.json()) as WikimediaResponse;
      const pages = Object.values(payload.query?.pages ?? {});
      return pages
        .map((page) => this.toCandidate(page))
        .filter((candidate): candidate is ImageCandidate => candidate !== undefined)
        .slice(0, maxResults);
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  private toCandidate(page: WikimediaPage): ImageCandidate | undefined {
    const info = page.imageinfo?.[0];
    const imageUrl = info?.thumburl ?? info?.url;
    if (!imageUrl) return undefined;
    const meta = info?.extmetadata ?? {};
    const licenseShort = meta.LicenseShortName?.value;
    const artistRaw = meta.Artist?.value;
    const artist = artistRaw ? stripHtml(artistRaw) : undefined;
    const licenseState = licenseStateForWikimedia(licenseShort);
    const title = (page.title ?? imageUrl).replace(/^File:/i, '');
    const credit = [artist, 'Wikimedia Commons', licenseShort].filter(Boolean).join(' — ');
    return {
      provider: this.name,
      url: imageUrl,
      sourceUrl: info?.descriptionurl,
      title,
      creator: artist,
      licenseCode: licenseShort,
      licenseState,
      creditText: credit || undefined,
    };
  }
}
