import type { StorageProvider } from '@semburat/domain';

export class MockStorageProvider implements StorageProvider {
  private readonly store = new Map<string, { data: Buffer; contentType: string }>();

  async put(key: string, data: Buffer, contentType: string): Promise<string> {
    this.store.set(key, { data: Buffer.from(data), contentType });
    return key;
  }

  async get(key: string): Promise<Buffer | null> {
    const entry = this.store.get(key);
    return entry ? Buffer.from(entry.data) : null;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async getSignedUrl(key: string, _expiresIn: number): Promise<string> {
    if (!this.store.has(key)) {
      return `https://mock.local/${key}?missing=true`;
    }
    return `https://mock.local/${key}?expires=${_expiresIn}`;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
