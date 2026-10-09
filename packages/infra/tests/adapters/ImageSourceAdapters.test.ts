import { describe, expect, it, vi } from 'vitest';
import {
  OpenverseImageAdapter,
  licenseStateForOpenverse,
} from '../../src/adapters/images/OpenverseImageAdapter.js';
import {
  WikimediaImageAdapter,
  licenseStateForWikimedia,
} from '../../src/adapters/images/WikimediaImageAdapter.js';
import { DeviantArtImageAdapter } from '../../src/adapters/images/DeviantArtImageAdapter.js';

const json = (body: unknown) => (): Promise<Response> =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  );

const xml = (body: string) => (): Promise<Response> =>
  Promise.resolve(new Response(body, { status: 200 }));

const OPENVERSE_SAMPLE = {
  results: [
    {
      title: 'MLBB Logo',
      creator: 'Budi',
      url: 'https://img.openverse.test/mlbb.png',
      thumbnail: 'https://img.openverse.test/mlbb-thumb.png',
      foreign_landing_url: 'https://openverse.test/mlbb',
      license: 'cc0',
      license_version: '1.0',
      source: 'wikimedia',
      width: 800,
      height: 600,
      tags: [{ name: 'gaming' }],
    },
    {
      title: 'Foto Turnamen',
      creator: 'Sari',
      url: 'https://img.openverse.test/turnamen.jpg',
      license: 'by-sa',
      license_version: '4.0',
      source: 'flickr',
    },
  ],
};

const WIKIMEDIA_SAMPLE = {
  query: {
    pages: {
      '1': {
        title: 'File:MLBB MENA region.svg',
        imageinfo: [
          {
            thumburl: 'https://upload.wikimedia.test/mlbb.png',
            url: 'https://upload.wikimedia.test/mlbb.svg',
            descriptionurl: 'https://commons.wikimedia.test/File:MLBB_MENA_region.svg',
            extmetadata: {
              LicenseShortName: { value: 'CC BY-SA 4.0' },
              Artist: { value: '<a href="#">Someone</a>' },
            },
          },
        ],
      },
    },
  },
};

const DEVIANTART_SAMPLE = `<?xml version="1.0"?><rss><channel>
<item>
  <title>Obsidia Aspirant - Mobile Legends Wallpaper</title>
  <link>https://www.deviantart.com/deathtototoro/art/Obsidia-1380207762</link>
  <media:content url="https://images-wixmp.test/full.png" width="1920" height="1080" />
  <media:credit role="author" scheme="urn:ebu">DeathToTotoro</media:credit>
  <media:copyright url="https://www.deviantart.com/deathtototoro">Copyright 2026 DeathToTotoro</media:copyright>
  <media:thumbnail url="https://images-wixmp.test/thumb.png" />
</item>
</channel></rss>`;

describe('license mapping helpers', () => {
  it('maps openverse license codes', () => {
    expect(licenseStateForOpenverse('cc0')).toBe('public_domain');
    expect(licenseStateForOpenverse('pdm')).toBe('public_domain');
    expect(licenseStateForOpenverse('by-sa')).toBe('licensed');
    expect(licenseStateForOpenverse('unknown-xyz')).toBe('unknown');
  });

  it('maps wikimedia license names', () => {
    expect(licenseStateForWikimedia('Public domain')).toBe('public_domain');
    expect(licenseStateForWikimedia('CC0')).toBe('public_domain');
    expect(licenseStateForWikimedia('CC BY-SA 4.0')).toBe('licensed');
  });
});

describe('OpenverseImageAdapter', () => {
  it('maps results with license state and credit', async () => {
    const adapter = new OpenverseImageAdapter({ fetchFn: vi.fn(json(OPENVERSE_SAMPLE)) });
    const images = await adapter.search('mobile legends', 5);
    expect(images).toHaveLength(2);
    expect(images[0].licenseState).toBe('public_domain');
    expect(images[0].creditText).toContain('Budi');
    expect(images[0].tags).toEqual(['gaming']);
    expect(images[1].licenseState).toBe('licensed');
  });

  it('requests results with a valid license query parameter', async () => {
    const requested: string[] = [];
    const inner = json(OPENVERSE_SAMPLE);
    const fetchFn = vi.fn((input: string) => {
      requested.push(input);
      return inner();
    });
    await new OpenverseImageAdapter({ fetchFn }).search('mobile legends', 5);
    expect(requested[0]).toContain('license=');
    expect(requested[0]).not.toContain('license_type=');
  });

  it('returns nothing when disabled or empty query', async () => {
    const fetchFn = vi.fn(json(OPENVERSE_SAMPLE));
    expect(await new OpenverseImageAdapter({ enabled: false, fetchFn }).search('x', 3)).toEqual([]);
    expect(await new OpenverseImageAdapter({ fetchFn }).search('   ', 3)).toEqual([]);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('returns nothing on http errors', async () => {
    const adapter = new OpenverseImageAdapter({
      fetchFn: () => Promise.resolve(new Response('', { status: 429 })),
    });
    expect(await adapter.search('x', 3)).toEqual([]);
  });
});

describe('WikimediaImageAdapter', () => {
  it('maps commons imageinfo with license and stripped artist', async () => {
    const adapter = new WikimediaImageAdapter({ fetchFn: vi.fn(json(WIKIMEDIA_SAMPLE)) });
    const images = await adapter.search('mobile legends', 3);
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe('https://upload.wikimedia.test/mlbb.png');
    expect(images[0].title).toBe('MLBB MENA region.svg');
    expect(images[0].creator).toBe('Someone');
    expect(images[0].licenseState).toBe('licensed');
    expect(images[0].creditText).toContain('Someone');
  });
});

describe('DeviantArtImageAdapter', () => {
  it('marks fan art as restricted and needs permission', async () => {
    const adapter = new DeviantArtImageAdapter({ fetchFn: vi.fn(xml(DEVIANTART_SAMPLE)) });
    const images = await adapter.search('mobile legends', 3);
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe('https://images-wixmp.test/full.png');
    expect(images[0].licenseState).toBe('restricted');
    expect(images[0].creator).toBe('DeathToTotoro');
    expect(images[0].creditText).toContain('perlu izin pembuat');
  });
});
