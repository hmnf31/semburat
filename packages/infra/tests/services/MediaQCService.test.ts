import { describe, it, expect, beforeEach } from 'vitest';
import { MediaQCService } from '../../src/services/MediaQCService.js';

describe('MediaQCService', () => {
  let service: MediaQCService;

  beforeEach(() => {
    service = new MediaQCService();
  });

  it('checkVideoQC passes for valid params', async () => {
    const result = await service.checkVideoQC({
      duration: 30,
      resolution: '1080x1920',
      hasAudio: true,
      textReadable: true,
    });

    expect(result.passed).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('checkVideoQC fails for too short duration', async () => {
    const result = await service.checkVideoQC({
      duration: 10,
      resolution: '1080x1920',
      hasAudio: true,
      textReadable: true,
    });

    expect(result.passed).toBe(false);
    expect(result.issues).toContain('Duration too short (min 15s)');
  });

  it('checkVideoQC fails for missing audio', async () => {
    const result = await service.checkVideoQC({
      duration: 30,
      resolution: '1080x1920',
      hasAudio: false,
      textReadable: true,
    });

    expect(result.passed).toBe(false);
    expect(result.issues).toContain('Missing audio track');
  });
});
