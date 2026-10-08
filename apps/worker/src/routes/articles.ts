import { Hono } from 'hono';
import type { Env } from '../env.js';
import { D1ArticleRepository } from '@semburat/infra';

const app = new Hono<{ Bindings: Env }>();

app.get('/:slug', async (c) => {
  const repo = new D1ArticleRepository(c.env.DB);
  const article = await repo.findBySlug(c.req.param('slug'));
  if (!article) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  }
  return c.json({ data: article });
});

export default app;
