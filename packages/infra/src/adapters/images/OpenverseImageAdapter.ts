import type { ImageCandidate, ImageSourceProvider } from '@semburat/domain';
import { LicenseState } from '@semburat/domain';
import type { FetchLike } from '../research/FeedParser.js';

export const OPENVERSE_ENDPOINT = 'https://api.openverse.org/v1/images/';

export interface OpenverseImageAdapterOptions {
  endpoint?: string;
  enabled?: boolean;
  fetchFn?: FetchLike;
  timeoutMs?: number;
  licenseTypes?: string;
}

interface OpenverseResult {
  title?: string;
  creator?: string;
  url?: string;
  thumbnail?: string;
  foreign_landing_url?: string;
  license?: string;
  license_version?: string;
  source?: string;
  width?: number;
  height?: number;
  tags?: Array<{ name?: string }>;
}

interface OpenverseResponse {
  results?: OpenverseResult[];
}

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

const PUBLIC_DOMAIN_CODES = new Set(['cc0', 'pdm', 'pd']);

export function licenseStateForOpenverse(code: string | undefined): LicenseState {
  const normalized = (code ?? '').trim().toLowerCase();
  if (PUBLIC_DOMAIN_CODES.has(normalized)) return LicenseState.PUBLIC_DOMAIN;
  if (normalized.startsWith('by') || normalized.startsWith('cc')) return LicenseState.LICENSED;
  return LicenseState.UNKNOWN;
}

export class OpenverseImageAdapter implements ImageSourceProvider {
  readonly name = 'openverse';
  private readonly endpoint: string;
  private readonly enabled: boolean;
  private readonly fetchFn: FetchLike;
  private readonly timeoutMs: number;
  private readonly licenseTypes: string;

  constructor(options: OpenverseImageAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? OPENVERSE_ENDPOINT;
    this.enabled = options.enabled ?? true;
    this.fetchFn = options.fetchFn ?? defaultFetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.licenseTypes = options.licenseTypes ?? 'cc0,pdm,by,by-sa';
  }

  async search(query: string, maxResults: number): Promise<ImageCandidate[]> {
    const trimmed = query.trim();
    if (!this.enabled || !trimmed || maxResults <= 0) return [];
    const url =
      `${this.endpoint}?q=${encodeURIComponent(trimmed)}` +
      `&license=${encodeURIComponent(this.licenseTypes)}` +
      `&page_size=${Math.min(Math.max(maxResults, 1), 50)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchFn(url, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
      });
      if (!response.ok) return [];
      const payload = (await response.json()) as OpenverseResponse;
      return (payload.results ?? [])
        .map((result) => this.toCandidate(result))
        .filter((candidate): candidate is ImageCandidate => candidate !== undefined)
        .slice(0, maxResults);
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  private toCandidate(result: OpenverseResult): ImageCandidate | undefined {
    if (!result.url) return undefined;
    const licenseState = licenseStateForOpenverse(result.license);
    const licenseLabel = [result.license, result.license_version].filter(Boolean).join(' ');
    const credit = [result.creator, result.source].filter(Boolean).join(' — ');
    return {
      provider: this.name,
      url: result.url,
      thumbnailUrl: result.thumbnail,
      sourceUrl: result.foreign_landing_url,
      title: result.title?.trim() || result.url,
      creator: result.creator?.trim(),
      licenseCode: result.license,
      licenseState,
      creditText: credit ? `${credit}${licenseLabel ? ` (${licenseLabel})` : ''}` : undefined,
      width: result.width,
      height: result.height,
      tags: (result.tags ?? [])
        .map((tag) => tag.name)
        .filter((name): name is string => Boolean(name)),
    };
  }
}
