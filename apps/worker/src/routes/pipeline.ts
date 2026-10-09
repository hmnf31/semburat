import { Hono } from 'hono';
import { z } from 'zod';
import { createContainer } from '../container.js';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

const DEFAULT_QUERIES = ['MLBB MPL', 'gta 6', 'viral indonesia', 'teknologi indonesia'];

const discoverBody = z.object({
  queries: z.array(z.string().trim().min(2)).min(1).max(20).optional(),
});

const batchBody = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});

const imageSearchBody = z.object({
  query: z.string().trim().min(2).max(120),
  limit: z.number().int().min(1).max(24).optional(),
  includeUnpublishable: z.boolean().optional(),
  providers: z.array(z.string().trim().min(1)).optional(),
});

const assetIngestBody = z.object({
  articleId: z.string().uuid(),
  query: z.string().trim().min(2).max(120),
  limit: z.number().int().min(1).max(12).optional(),
  includeUnpublishable: z.boolean().optional(),
  providers: z.array(z.string().trim().min(1)).optional(),
  type: z.enum(['image', 'thumbnail', 'hero', 'og']).optional(),
  altText: z.string().trim().max(200).optional(),
  setAsHero: z.boolean().optional(),
});

function parseQueries(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_QUERIES;
  const queries = raw
    .split(',')
    .map((q) => q.trim())
    .filter((q) => q.length > 0);
  return queries.length > 0 ? queries : DEFAULT_QUERIES;
}

app.post('/discover', async (c) => {
  const parsed = discoverBody.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        error: { code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.issues },
      },
      400
    );
  }

  const container = createContainer(c.env);
  const queries = parsed.data.queries ?? parseQueries(c.env.TREND_QUERIES);
  const trends = await container.trendDiscovery.discoverTrends(queries);

  return c.json({
    data: { trends, count: trends.length },
    meta: { queries, aiMode: container.aiMode, environment: c.env.ENVIRONMENT },
  });
});

app.post('/process/:trendId', async (c) => {
  const trendId = c.req.param('trendId');
  const container = createContainer(c.env);
  const article = await container.pipeline.processTrend(trendId);

  return c.json({
    data: article,
    meta: { trendId, aiMode: container.aiMode, environment: c.env.ENVIRONMENT },
  });
});

app.post('/process-batch', async (c) => {
  const parsed = batchBody.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        error: { code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.issues },
      },
      400
    );
  }

  const container = createContainer(c.env);
  const articles = await container.pipeline.processTrendBatch(parsed.data.limit ?? 5);

  return c.json({
    data: { articles, count: articles.length },
    meta: { aiMode: container.aiMode, environment: c.env.ENVIRONMENT },
  });
});

app.post('/images', async (c) => {
  const parsed = imageSearchBody.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        error: { code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.issues },
      },
      400
    );
  }

  const container = createContainer(c.env);
  const images = await container.imageSourcing.search(parsed.data.query, parsed.data.limit ?? 6, {
    includeUnpublishable: parsed.data.includeUnpublishable,
    providers: parsed.data.providers,
  });

  return c.json({
    data: { images, count: images.length, query: parsed.data.query },
    meta: { environment: c.env.ENVIRONMENT },
  });
});

app.post('/assets', async (c) => {
  const parsed = assetIngestBody.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        error: { code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.issues },
      },
      400
    );
  }

  const container = createContainer(c.env);
  const result = await container.imageIngestion.ingest(parsed.data.articleId, parsed.data.query, {
    limit: parsed.data.limit,
    includeUnpublishable: parsed.data.includeUnpublishable,
    providers: parsed.data.providers,
    type: parsed.data.type,
    altText: parsed.data.altText,
    setAsHero: parsed.data.setAsHero,
  });

  return c.json({
    data: {
      articleId: parsed.data.articleId,
      query: parsed.data.query,
      count: result.ingested.length,
      heroAssetId: result.heroAssetId,
      ingested: result.ingested.map((item) => ({
        asset: item.asset.toParams(),
        publicUrl: item.publicUrl,
        provider: item.provider,
      })),
      skipped: result.skipped,
    },
    meta: { environment: c.env.ENVIRONMENT },
  });
});

app.get('/status', async (c) => {
  const container = createContainer(c.env);
  const trends = await container.trendRepo.findByScore(0, 1000);

  return c.json({
    data: {
      trends: { total: trends.length },
      aiMode: container.aiMode,
      researchProvider: container.researchProvider.constructor.name,
      environment: c.env.ENVIRONMENT,
    },
  });
});

export default app;
