import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Source, SourceType, ReliabilityState, LicenseState } from '@semburat/domain';
import { SourceIntelligenceService } from '../../src/services/SourceIntelligenceService.js';
import type { SourceRepository } from '@semburat/domain';

describe('SourceIntelligenceService', () => {
  let mockSourceRepo: SourceRepository;
  let service: SourceIntelligenceService;

  beforeEach(() => {
    mockSourceRepo = {
      insert: vi.fn(),
      findById: vi.fn(),
      findByDomain: vi.fn(),
      upsert: vi.fn(),
    } as unknown as SourceRepository;

    service = new SourceIntelligenceService(mockSourceRepo);
  });

  it('creates new source when domain does not exist', async () => {
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockSourceRepo.insert).mockResolvedValue(undefined);

    const source = await service.collectSource('https://example.com/article', 'Test Article');

    expect(source).toBeInstanceOf(Source);
    expect(source.url.toString()).toBe('https://example.com/article');
    expect(source.domain).toBe('example.com');
    expect(source.title).toBe('Test Article');
    expect(source.sourceType).toBe(SourceType.ESTABLISHED_MEDIA);
    expect(source.reliabilityState).toBe(ReliabilityState.UNVERIFIED);
    expect(mockSourceRepo.insert).toHaveBeenCalled();
  });

  it('updates existing source accessedAt when domain exists', async () => {
    const existingSource = new Source({
      id: 'source-1' as any,
      url: 'https://example.com/old',
      domain: 'example.com',
      title: 'Old Title',
      publisher: 'example.com',
      sourceType: SourceType.ESTABLISHED_MEDIA,
      reliabilityState: ReliabilityState.MEDIUM,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date('2024-01-01'),
    });

    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([existingSource]);
    vi.mocked(mockSourceRepo.upsert).mockResolvedValue(undefined);

    const source = await service.collectSource('https://example.com/new-article', 'New Title');

    expect(source.domain).toBe('example.com');
    expect(source.accessedAt).toBeInstanceOf(Date);
    expect(source.accessedAt.getTime()).toBeGreaterThanOrEqual(existingSource.accessedAt.getTime());
    expect(mockSourceRepo.upsert).toHaveBeenCalled();
  });

  it('infers OFFICIAL source type for government domains', async () => {
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockSourceRepo.insert).mockResolvedValue(undefined);

    const source = await service.collectSource('https://kominfo.go.id/berita', 'Kominfo News');

    expect(source.sourceType).toBe(SourceType.OFFICIAL);
  });

  it('infers ESTABLISHED_MEDIA for known news domains', async () => {
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockSourceRepo.insert).mockResolvedValue(undefined);

    const source = await service.collectSource('https://detik.com/berita', 'Detik News');

    expect(source.sourceType).toBe(SourceType.ESTABLISHED_MEDIA);
  });

  it('infers EXPERT for technical domains', async () => {
    vi.mocked(mockSourceRepo.findByDomain).mockResolvedValue([]);
    vi.mocked(mockSourceRepo.insert).mockResolvedValue(undefined);

    const source = await service.collectSource('https://github.com/user/repo', 'GitHub Repo');

    expect(source.sourceType).toBe(SourceType.EXPERT);
  });

  it('updates reliability state', async () => {
    const source = new Source({
      id: 'source-1' as any,
      url: 'https://example.com',
      domain: 'example.com',
      title: 'Test',
      publisher: 'example.com',
      sourceType: SourceType.ESTABLISHED_MEDIA,
      reliabilityState: ReliabilityState.UNVERIFIED,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date(),
    });

    vi.mocked(mockSourceRepo.findById).mockResolvedValue(source);
    vi.mocked(mockSourceRepo.upsert).mockResolvedValue(undefined);

    await service.updateReliability('source-1', 'high');

    expect(mockSourceRepo.findById).toHaveBeenCalledWith('source-1');
    expect(mockSourceRepo.upsert).toHaveBeenCalled();
    const upserted = vi.mocked(mockSourceRepo.upsert).mock.calls[0][0];
    expect(upserted.reliabilityState).toBe(ReliabilityState.HIGH);
  });

  it('throws error when updating reliability for non-existent source', async () => {
    vi.mocked(mockSourceRepo.findById).mockResolvedValue(null);

    await expect(service.updateReliability('non-existent', 'high')).rejects.toThrow(
      'Source not found'
    );
  });

  it('parses reliability state case-insensitively', async () => {
    const source = new Source({
      id: 'source-1' as any,
      url: 'https://example.com',
      domain: 'example.com',
      title: 'Test',
      publisher: 'example.com',
      sourceType: SourceType.ESTABLISHED_MEDIA,
      reliabilityState: ReliabilityState.UNVERIFIED,
      licenseState: LicenseState.UNKNOWN,
      createdAt: new Date(),
    });

    vi.mocked(mockSourceRepo.findById).mockResolvedValue(source);
    vi.mocked(mockSourceRepo.upsert).mockResolvedValue(undefined);

    await service.updateReliability('source-1', 'HIGH');

    const upserted = vi.mocked(mockSourceRepo.upsert).mock.calls[0][0];
    expect(upserted.reliabilityState).toBe(ReliabilityState.HIGH);
  });

  it('returns source stats', async () => {
    const sources = [
      new Source({
        id: 's1' as any,
        url: 'https://a.com',
        domain: 'a.com',
        title: 'A',
        publisher: 'a.com',
        sourceType: SourceType.OFFICIAL,
        reliabilityState: ReliabilityState.HIGH,
        licenseState: LicenseState.UNKNOWN,
        createdAt: new Date(),
      }),
      new Source({
        id: 's2' as any,
        url: 'https://b.com',
        domain: 'b.com',
        title: 'B',
        publisher: 'b.com',
        sourceType: SourceType.ESTABLISHED_MEDIA,
        reliabilityState: ReliabilityState.MEDIUM,
        licenseState: LicenseState.UNKNOWN,
        createdAt: new Date(),
      }),
    ];

    vi.mocked(mockSourceRepo.findByDomain).mockImplementation(async (domain) =>
      sources.filter((s) => s.domain === domain)
    );

    const stats = await service.getSourceStats();

    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.byType).toBeDefined();
    expect(stats.byReliability).toBeDefined();
  });
});
