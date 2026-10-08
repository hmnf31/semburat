import { Hono } from 'hono';
import type { Env } from '../env.js';
import { D1AssetRepository } from '@semburat/infra';

const app = new Hono<{ Bindings: Env }>();

app.get('/:id', async (c) => {
  const repo = new D1AssetRepository(c.env.DB);
  const asset = await repo.findById(c.req.param('id'));
  if (!asset) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Asset not found' } }, 404);
  }
  return c.json({ data: asset });
});

export default app;
