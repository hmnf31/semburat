import type { ImageCandidate, ImageSourceProvider } from '@semburat/domain';
import { LicenseValidationService } from './LicenseValidationService.js';

export interface SourcedImage extends ImageCandidate {
  /** Credit is mandatory when the asset is reused. */
  attributionRequired: boolean;
  /** Whether the current license state allows publication without further permission. */
  publishable: boolean;
}

export interface ImageSourcingOptions {
  perProviderLimit?: number;
  /** When false, restricted/unpublishable candidates are filtered out. */
  includeUnpublishable?: boolean;
  /** Restrict to specific providers by name. */
  providers?: string[];
}

export class ImageSourcingService {
  constructor(
    private readonly providers: ImageSourceProvider[],
    private readonly licenseValidator = new LicenseValidationService()
  ) {}

  async search(
    query: string,
    maxResults = 6,
    options: ImageSourcingOptions = {}
  ): Promise<SourcedImage[]> {
    const trimmed = query.trim();
    if (!trimmed || maxResults <= 0) return [];
    const perProvider = options.perProviderLimit ?? Math.max(1, Math.ceil(maxResults / 2));
    const selected = options.providers
      ? this.providers.filter((provider) => options.providers?.includes(provider.name))
      : this.providers;

    const batches = await Promise.all(
      selected.map((provider) =>
        provider.search(trimmed, perProvider).catch(() => [] as ImageCandidate[])
      )
    );

    const seen = new Set<string>();
    const sourced: SourcedImage[] = [];
    for (const candidate of batches.flat()) {
      if (seen.has(candidate.url)) continue;
      seen.add(candidate.url);
      sourced.push(this.decorate(candidate));
    }

    const includeUnpublishable = options.includeUnpublishable ?? true;
    return sourced
      .filter((image) => includeUnpublishable || image.publishable)
      .sort((a, b) => Number(b.publishable) - Number(a.publishable))
      .slice(0, maxResults);
  }

  private decorate(candidate: ImageCandidate): SourcedImage {
    return {
      ...candidate,
      attributionRequired: this.licenseValidator.requiresCredit(candidate.licenseState),
      publishable: this.licenseValidator.canBePublished(candidate.licenseState),
    };
  }
}
