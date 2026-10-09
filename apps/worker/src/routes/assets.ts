import { Hono } from 'hono';
import type { Env } from '../env.js';
import { D1AssetRepository } from '@semburat/infra';

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  const articleId = c.req.query('articleId');
  if (!articleId) {
    return c.json(
      { error: { code: 'VALIDATION_ERROR', message: 'articleId query parameter is required' } },
      400
    );
  }
  const repo = new D1AssetRepository(c.env.DB);
  const assets = await repo.findByArticleId(articleId);
  return c.json({ data: { assets, count: assets.length, articleId } });
});

app.get('/:id', async (c) => {
  const repo = new D1AssetRepository(c.env.DB);
  const asset = await repo.findById(c.req.param('id'));
  if (!asset) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Asset not found' } }, 404);
  }
  return c.json({ data: asset });
});

export default app;
