import type { StorageProvider } from '@semburat/domain';

export const KV_MAX_VALUE_BYTES = 25 * 1024 * 1024;

export interface KVNamespaceLike {
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | string,
    options?: { metadata?: Record<string, string>; expirationTtl?: number }
  ): Promise<void>;
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}

export interface KvStorageConfig {
  baseUrl?: string;
  expirationTtl?: number;
}

export class KvStorageProvider implements StorageProvider {
  private readonly kv: KVNamespaceLike;
  private readonly baseUrl?: string;
  private readonly expirationTtl?: number;

  constructor(kv: KVNamespaceLike, config: KvStorageConfig = {}) {
    this.kv = kv;
    this.baseUrl = config.baseUrl?.replace(/\/+$/, '');
    this.expirationTtl = config.expirationTtl;
  }

  async put(key: string, data: Buffer, contentType: string): Promise<string> {
    if (data.byteLength > KV_MAX_VALUE_BYTES) {
      throw new Error(
        `Asset exceeds the Cloudflare KV value limit of ${KV_MAX_VALUE_BYTES} bytes: ${key}`
      );
    }
    const normalizedKey = this.normalizeKey(key);
    await this.kv.put(
      normalizedKey,
      new Uint8Array(data),
      this.expirationTtl
        ? { metadata: { contentType }, expirationTtl: this.expirationTtl }
        : { metadata: { contentType } }
    );
    return normalizedKey;
  }

  async get(key: string): Promise<Buffer | null> {
    const value = await this.kv.get(this.normalizeKey(key), 'arrayBuffer');
    if (!value) return null;
    return Buffer.from(value);
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(this.normalizeKey(key));
  }

  async getSignedUrl(key: string, _expiresIn: number): Promise<string> {
    if (!this.baseUrl) {
      throw new Error(
        'ASSETS_PUBLIC_BASE_URL is not configured: Cloudflare KV cannot create presigned URLs. ' +
          'Point it at the Worker route that serves stored assets (e.g. https://<worker>/media).'
      );
    }
    return `${this.baseUrl}/${this.normalizeKey(key)}`;
  }

  private normalizeKey(key: string): string {
    return key.replace(/\\/g, '/').replace(/^\/+/, '');
  }
}
