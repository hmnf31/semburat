import { describe, expect, it, vi } from 'vitest';
import { LicenseState } from '@semburat/domain';
import type { ImageCandidate, ImageSourceProvider } from '@semburat/domain';
import { ImageSourcingService } from '../../src/services/ImageSourcingService.js';

function makeProvider(name: string, candidates: ImageCandidate[]): ImageSourceProvider {
  return {
    name,
    search: vi.fn().mockResolvedValue(candidates),
  };
}

const freeImage: ImageCandidate = {
  provider: 'openverse',
  url: 'https://img.test/free.png',
  title: 'Free image',
  licenseState: LicenseState.PUBLIC_DOMAIN,
};

const licensedImage: ImageCandidate = {
  provider: 'openverse',
  url: 'https://img.test/licensed.png',
  title: 'Licensed image',
  licenseState: LicenseState.LICENSED,
};

const fanArt: ImageCandidate = {
  provider: 'deviantart',
  url: 'https://img.test/fanart.png',
  title: 'Fan art',
  licenseState: LicenseState.RESTRICTED,
};

describe('ImageSourcingService', () => {
  it('merges providers, dedupes and annotates license flags', async () => {
    const service = new ImageSourcingService([
      makeProvider('openverse', [freeImage, licensedImage]),
      makeProvider('deviantart', [fanArt]),
    ]);
    const results = await service.search('mobile legends', 10);
    expect(results).toHaveLength(3);
    expect(results[0].publishable).toBe(true);
    expect(results.find((r) => r.url === licensedImage.url)?.attributionRequired).toBe(true);
    expect(results.find((r) => r.url === fanArt.url)?.publishable).toBe(false);
  });

  it('removes duplicate urls across providers', async () => {
    const service = new ImageSourcingService([
      makeProvider('openverse', [freeImage]),
      makeProvider('wikimedia', [{ ...freeImage, provider: 'wikimedia' }]),
    ]);
    const results = await service.search('apa pun', 10);
    expect(results).toHaveLength(1);
  });

  it('can filter out unpublishable candidates', async () => {
    const service = new ImageSourcingService([
      makeProvider('openverse', [freeImage]),
      makeProvider('deviantart', [fanArt]),
    ]);
    const results = await service.search('apa pun', 10, { includeUnpublishable: false });
    expect(results).toHaveLength(1);
    expect(results[0].url).toBe(freeImage.url);
  });

  it('restricts providers when requested', async () => {
    const openverse = makeProvider('openverse', [freeImage]);
    const wikimedia = makeProvider('wikimedia', [{ ...licensedImage, provider: 'wikimedia' }]);
    const service = new ImageSourcingService([openverse, wikimedia]);
    const results = await service.search('apa pun', 10, { providers: ['wikimedia'] });
    expect(results).toHaveLength(1);
    expect(results[0].provider).toBe('wikimedia');
    expect(openverse.search).not.toHaveBeenCalled();
  });

  it('returns nothing for empty queries or when a provider fails', async () => {
    const failing: ImageSourceProvider = {
      name: 'broken',
      search: vi.fn().mockRejectedValue(new Error('boom')),
    };
    const service = new ImageSourcingService([failing]);
    expect(await service.search('  ', 10)).toEqual([]);
    expect(await service.search('ok', 10)).toEqual([]);
  });
});
