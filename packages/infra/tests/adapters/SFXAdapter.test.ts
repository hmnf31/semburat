import { describe, it, expect, beforeEach } from 'vitest';
import { SFXAdapter } from '../../src/adapters/sfx/SFXAdapter.js';

describe('SFXAdapter', () => {
  let adapter: SFXAdapter;

  beforeEach(() => {
    adapter = new SFXAdapter();
  });

  it('search returns matching SFX by query', async () => {
    const results = await adapter.search('whoosh transition');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('name');
    expect(results[0]).toHaveProperty('storageKey');
    expect(results[0].name.toLowerCase()).toContain('whoosh');
  });

  it('search returns empty for unknown query', async () => {
    const results = await adapter.search('xyzunknownquery123');
    expect(results).toEqual([]);
  });

  it('search returns empty for empty query', async () => {
    const results = await adapter.search('');
    expect(results).toEqual([]);
    const results2 = await adapter.search('   ');
    expect(results2).toEqual([]);
  });
});
