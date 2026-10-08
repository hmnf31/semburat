import { describe, expect, it } from 'vitest';
import { MockD1Database } from '../../../../packages/infra/tests/utils/MockD1Database';
import app from '../index.js';
import type { Env } from '../env.js';
function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: new MockD1Database() as never,
    ASSETS: undefined as never,
    ENVIRONMENT: 'test',
    TELEGRAM_WEBHOOK_SECRET: 'test-secret',
    ...overrides,
  } as Env;
}
const auth = { Authorization: 'Bearer test-secret' };
type StatusBody = { data: { aiMode: string; environment: string; trends: { total: number } } };
type ErrorBody = { error: { code: string } };
type DiscoverBody = { data: { trends: unknown[] }; meta: { queries: string[]; aiMode: string } };
type HealthBody = { status: string };
type TrendsBody = { data: unknown[] };
type ReceivedBody = { data: { received: boolean } };
const readBody = <T>(res: Response): Promise<T> => res.json() as Promise<T>;
describe('pipeline routes', () => {
  it('rejects requests without an authorization token', async () => {
    const res = await app.request('/api/pipeline/status', {}, makeEnv());
    expect(res.status).toBe(401);
  });
  it('rejects requests with the wrong token', async () => {
    const res = await app.request(
      '/api/pipeline/status',
      { headers: { Authorization: 'Bearer wrong' } },
      makeEnv()
    );
    expect(res.status).toBe(401);
  });
  it('returns pipeline status for an authorized caller', async () => {
    const res = await app.request('/api/pipeline/status', { headers: auth }, makeEnv());
    expect(res.status).toBe(200);
    const body = await readBody<StatusBody>(res);
    expect(body.data.aiMode).toBe('mock');
    expect(body.data.environment).toBe('test');
    expect(body.data.trends.total).toBe(0);
  });
  it('validates the discover body', async () => {
    const res = await app.request(
      '/api/pipeline/discover',
      {
        method: 'POST',
        headers: { ...auth, 'content-type': 'application/json' },
        body: JSON.stringify({ queries: [] }),
      },
      makeEnv()
    );
    expect(res.status).toBe(400);
    const body = await readBody<ErrorBody>(res);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
  it('discovers trends from the default queries', async () => {
    const res = await app.request(
      '/api/pipeline/discover',
      { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: '{}' },
      makeEnv()
    );
    expect(res.status).toBe(200);
    const body = await readBody<DiscoverBody>(res);
    expect(Array.isArray(body.data.trends)).toBe(true);
    expect(body.meta.queries.length).toBeGreaterThan(0);
    expect(body.meta.aiMode).toBe('mock');
  });
});
describe('read routes', () => {
  it('serves health without authentication', async () => {
    const res = await app.request('/api/health', {}, makeEnv());
    expect(res.status).toBe(200);
    const body = await readBody<HealthBody>(res);
    expect(body.status).toBe('ok');
  });
  it('returns an empty trends list', async () => {
    const res = await app.request('/api/trends', {}, makeEnv());
    expect(res.status).toBe(200);
    const body = await readBody<TrendsBody>(res);
    expect(body.data).toEqual([]);
  });
  it('rejects invalid analytics events', async () => {
    const res = await app.request(
      '/api/analytics/events',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ event_type: '' }),
      },
      makeEnv()
    );
    expect(res.status).toBe(400);
  });
  it('stores a valid analytics event', async () => {
    const res = await app.request(
      '/api/analytics/events',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content_id: 'art_1', event_type: 'view', value: 1 }),
      },
      makeEnv()
    );
    expect(res.status).toBe(201);
    const body = await readBody<ReceivedBody>(res);
    expect(body.data.received).toBe(true);
  });
});
