import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MiniMaxVoiceAdapter } from '../../src/adapters/voice/MiniMaxVoiceAdapter.js';

describe('MiniMaxVoiceAdapter', () => {
  let adapter: MiniMaxVoiceAdapter;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new MiniMaxVoiceAdapter('test-api-key', mockFetch);
  });

  it('synthesize returns storageKey and duration', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        success: true,
        storageKey: 'media/voiceover/abc123.mp3',
        duration: 30,
        format: 'mp3',
        sampleRate: 44100,
        bitrate: 128000,
        provider: 'minimax',
        voice: 'id-ID-Standard-A',
      }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const result = await adapter.synthesize('Hello world', 'id-ID-Standard-A');

    expect(result).toHaveProperty('storageKey');
    expect(result).toHaveProperty('duration');
    expect(typeof result.storageKey).toBe('string');
    expect(typeof result.duration).toBe('number');
    expect(result.duration).toBeGreaterThan(0);
  });

  it('synthesize throws on empty script', async () => {
    await expect(adapter.synthesize('', 'id-ID-Standard-A')).rejects.toThrow(
      'Script cannot be empty'
    );
    await expect(adapter.synthesize('   ', 'id-ID-Standard-A')).rejects.toThrow(
      'Script cannot be empty'
    );
  });

  it('synthesize throws on empty voice', async () => {
    await expect(adapter.synthesize('Hello world', '')).rejects.toThrow('Voice cannot be empty');
    await expect(adapter.synthesize('Hello world', '   ')).rejects.toThrow('Voice cannot be empty');
  });
});
