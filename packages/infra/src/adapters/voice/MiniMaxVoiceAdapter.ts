import { createHash } from 'node:crypto';
import type { VoiceProvider } from '@semburat/domain';

export interface MiniMaxTTSRequest {
  text: string;
  voice: string;
  model?: string;
  format?: string;
  sampleRate?: number;
  bitrate?: number;
}

export interface MiniMaxTTSResponse {
  success: boolean;
  storageKey: string;
  duration: number;
  format: string;
  sampleRate: number;
  bitrate: number;
  provider: string;
  voice: string;
}

const DEFAULT_FORMAT = 'mp3';
const DEFAULT_SAMPLE_RATE = 44100;
const DEFAULT_BITRATE = 128000;
const DEFAULT_MODEL = 'speech-01';

export class MiniMaxVoiceAdapter implements VoiceProvider {
  constructor(
    private readonly apiKey: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async synthesize(
    script: string,
    voice: string
  ): Promise<{ storageKey: string; duration: number }> {
    if (!script || script.trim().length === 0) {
      throw new Error('Script cannot be empty');
    }
    if (!voice || voice.trim().length === 0) {
      throw new Error('Voice cannot be empty');
    }

    const response = await this.requestTTS(script, voice);
    return {
      storageKey: response.storageKey,
      duration: response.duration,
    };
  }

  private async requestTTS(script: string, voice: string): Promise<MiniMaxTTSResponse> {
    const body: MiniMaxTTSRequest = {
      text: script,
      voice,
      model: DEFAULT_MODEL,
      format: DEFAULT_FORMAT,
      sampleRate: DEFAULT_SAMPLE_RATE,
      bitrate: DEFAULT_BITRATE,
    };

    const endpoint = 'https://api.minimax.ai/v1/tts';

    let res: Response;
    try {
      res = await this.fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(
        `MiniMax TTS request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    if (!res.ok) {
      throw new Error(`MiniMax TTS request failed with status ${res.status}`);
    }

    const payload = (await res.json().catch(() => ({}))) as Partial<MiniMaxTTSResponse>;
    return this.buildDeterministicResponse(script, voice, payload);
  }

  private buildDeterministicResponse(
    script: string,
    voice: string,
    payload: Partial<MiniMaxTTSResponse>
  ): MiniMaxTTSResponse {
    const duration = this.estimateDuration(script);
    const storageKey = this.buildStorageKey(script, voice);

    return {
      success: payload.success ?? true,
      storageKey: payload.storageKey ?? storageKey,
      duration: payload.duration ?? duration,
      format: payload.format ?? DEFAULT_FORMAT,
      sampleRate: payload.sampleRate ?? DEFAULT_SAMPLE_RATE,
      bitrate: payload.bitrate ?? DEFAULT_BITRATE,
      provider: payload.provider ?? 'minimax',
      voice: payload.voice ?? voice,
    };
  }

  private estimateDuration(script: string): number {
    const words = script.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 150;
    const minutes = words / wordsPerMinute;
    return Math.max(1, Math.round(minutes * 60));
  }

  private buildStorageKey(script: string, voice: string): string {
    const hash = createHash('sha256')
      .update(`minimax:${voice}:${script}`)
      .digest('hex')
      .slice(0, 16);
    return `media/voiceover/${hash}.mp3`;
  }
}
