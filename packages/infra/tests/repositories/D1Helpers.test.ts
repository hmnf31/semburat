import { describe, it, expect } from 'vitest';
import { toISO, fromISO } from '../../src/repositories/D1Helpers.js';

describe('D1Helpers.toISO', () => {
  it('returns null for undefined and null so D1 does not receive undefined binds', () => {
    expect(toISO(undefined)).toBeNull();
    expect(toISO(null)).toBeNull();
  });

  it('returns an ISO string for a valid date', () => {
    const iso = toISO(new Date('2026-01-02T03:04:05.000Z'));
    expect(iso).toBe('2026-01-02T03:04:05.000Z');
  });

  it('round-trips through fromISO', () => {
    const date = new Date('2026-05-06T07:08:09.000Z');
    expect(fromISO(toISO(date))?.toISOString()).toBe(date.toISOString());
  });
});
