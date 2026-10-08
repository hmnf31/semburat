import type { StorageProvider } from '@semburat/domain';

export interface R2ObjectBody {
  arrayBuffer(): Promise<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
}

export interface R2BucketLike {
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | string,
    options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
}

export interface R2StorageConfig {
  baseUrl?: string;
}

export class R2StorageProvider implements StorageProvider {
  private readonly bucket: R2BucketLike;
  private readonly baseUrl?: string;

  constructor(bucket: R2BucketLike, config: R2StorageConfig = {}) {
    this.bucket = bucket;
    this.baseUrl = config.baseUrl?.replace(/\/+$/, '');
  }

  async put(key: string, data: Buffer, contentType: string): Promise<string> {
    const normalizedKey = this.normalizeKey(key);
    await this.bucket.put(normalizedKey, new Uint8Array(data), {
      httpMetadata: { contentType },
    });
    return normalizedKey;
  }

  async get(key: string): Promise<Buffer | null> {
    const object = await this.bucket.get(this.normalizeKey(key));
    if (!object) return null;
    return Buffer.from(await object.arrayBuffer());
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(this.normalizeKey(key));
  }

  async getSignedUrl(key: string, _expiresIn: number): Promise<string> {
    if (!this.baseUrl) {
      throw new Error(
        'R2_PUBLIC_BASE_URL is not configured: the Workers R2 binding cannot create presigned URLs. ' +
          'Set a public base URL (bucket custom domain or Worker asset route) instead.'
      );
    }
    return `${this.baseUrl}/${this.normalizeKey(key)}`;
  }

  private normalizeKey(key: string): string {
    return key.replace(/^\/+/, '').replace(/\\/g, '/');
  }
}
