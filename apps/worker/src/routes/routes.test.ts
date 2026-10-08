import { describe, expect, it } from 'vitest';
import { MockD1Database } from '../../../../packages/infra/tests/utils/MockD1Database';
import app from '../index.js';
import type { Env } from '../env.js';
function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: new MockD1Database() as never,
    ASSETS: undefined as never,
    ENVIRONMENT: 'test',
    RESEARCH_MODE: 'offline',
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
type ArticleListBody = { data: Array<{ slug: string; body: string }>; meta: { limit: number } };
type ArticleDetailBody = { data: { slug: string; qualityScore: number } };

function seedArticle(db: MockD1Database, overrides: Record<string, unknown> = {}): void {
  db.table('articles').push({
    id: 'art_1',
    research_id: 'res_1',
    title: 'Judul artikel uji',
    slug: 'artikel-uji',
    dek: 'Ringkasan singkat artikel uji untuk pengujian.',
    summary: '',
    body: 'Isi artikel yang cukup panjang untuk memenuhi validasi domain. '.repeat(3),
    category: 'Teknologi',
    subcategory: null,
    status: 'published',
    risk_level: 'low',
    quality_score: 80,
    seo_title: null,
    meta_description: null,
    canonical_url: null,
    hero_asset_id: null,
    topic_id: null,
    source_count: 2,
    fact_check_status: 'complete',
    version: 1,
    published_at: '2026-10-01T00:00:00.000Z',
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    ...overrides,
  });
}
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
describe('public article routes', () => {
  it('lists only published articles', async () => {
    const db = new MockD1Database();
    seedArticle(db);
    seedArticle(db, { id: 'art_2', slug: 'draft-uji', status: 'draft' });
    const res = await app.request('/api/articles', {}, makeEnv({ DB: db as never }));
    expect(res.status).toBe(200);
    const body = await readBody<ArticleListBody>(res);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].slug).toBe('artikel-uji');
    expect(body.meta.limit).toBe(20);
  });
  it('returns a published article by slug', async () => {
    const db = new MockD1Database();
    seedArticle(db);
    const res = await app.request('/api/articles/artikel-uji', {}, makeEnv({ DB: db as never }));
    expect(res.status).toBe(200);
    const body = await readBody<ArticleDetailBody>(res);
    expect(body.data.slug).toBe('artikel-uji');
    expect(body.data.qualityScore).toBe(80);
  });
  it('hides drafts and unknown slugs', async () => {
    const db = new MockD1Database();
    seedArticle(db, { id: 'art_2', slug: 'draft-uji', status: 'draft' });
    const draft = await app.request('/api/articles/draft-uji', {}, makeEnv({ DB: db as never }));
    expect(draft.status).toBe(404);
    const missing = await app.request('/api/articles/tidak-ada', {}, makeEnv({ DB: db as never }));
    expect(missing.status).toBe(404);
  });
});
