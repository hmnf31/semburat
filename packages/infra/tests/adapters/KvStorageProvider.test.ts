import { describe, expect, it } from 'vitest';

import {
  KvStorageProvider,
  KV_MAX_VALUE_BYTES,
} from '../../src/adapters/storage/KvStorageProvider.js';

function createFakeKv() {
  const store = new Map<string, { value: ArrayBuffer; metadata?: Record<string, string> }>();
  return {
    store,
    put: async (
      key: string,
      value: ArrayBuffer | ArrayBufferView | string,
      options?: { metadata?: Record<string, string> }
    ) => {
      const buffer =
        typeof value === 'string'
          ? new TextEncoder().encode(value).buffer
          : value instanceof ArrayBuffer
            ? value
            : (value.buffer.slice(
                value.byteOffset,
                value.byteOffset + value.byteLength
              ) as ArrayBuffer);
      store.set(key, { value: buffer, metadata: options?.metadata });
    },
    get: async (key: string, type?: 'arrayBuffer'): Promise<ArrayBuffer | string | null> => {
      const entry = store.get(key);
      if (!entry) return null;
      return type === 'arrayBuffer' ? entry.value : new TextDecoder().decode(entry.value);
    },
    delete: async (key: string) => {
      store.delete(key);
    },
  };
}

describe('KvStorageProvider', () => {
  it('stores and retrieves a value as a Buffer', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never);
    const key = await provider.put('assets/1/a.png', Buffer.from('hello'), 'image/png');
    expect(key).toBe('assets/1/a.png');
    expect(kv.store.get(key)?.metadata).toEqual({ contentType: 'image/png' });
    const data = await provider.get('assets/1/a.png');
    expect(data?.toString()).toBe('hello');
  });

  it('normalizes leading slashes and backslashes', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never);
    await provider.put('\\assets\\1\\a.png', Buffer.from('x'), 'image/png');
    expect(kv.store.has('assets/1/a.png')).toBe(true);
  });

  it('deletes values', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never);
    await provider.put('k', Buffer.from('x'), 'text/plain');
    await provider.delete('k');
    expect(await provider.get('k')).toBeNull();
  });

  it('rejects values above the KV limit', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never);
    const oversized = Buffer.alloc(KV_MAX_VALUE_BYTES + 1);
    await expect(provider.put('big', oversized, 'application/octet-stream')).rejects.toThrow(
      /KV value limit/
    );
  });

  it('derives public URLs from the configured base URL', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never, {
      baseUrl: 'https://worker.example/media/',
    });
    expect(await provider.getSignedUrl('assets/1/a.png', 60)).toBe(
      'https://worker.example/media/assets/1/a.png'
    );
  });

  it('throws when no public base URL is configured', async () => {
    const kv = createFakeKv();
    const provider = new KvStorageProvider(kv as never);
    await expect(provider.getSignedUrl('k', 60)).rejects.toThrow(/ASSETS_PUBLIC_BASE_URL/);
  });
});
