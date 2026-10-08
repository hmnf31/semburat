import { Hono } from 'hono';
import type { Env } from '../env.js';
import { D1TrendRepository } from '@semburat/infra';
import type { TrendStatus } from '@semburat/domain';

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  const repo = new D1TrendRepository(c.env.DB);
  const status = c.req.query('status');
  const minScore = parseInt(c.req.query('min_score') || '0');
  const limit = parseInt(c.req.query('limit') || '20');

  let trends;
  if (status) {
    trends = await repo.findByStatus(status as TrendStatus);
  } else {
    trends = await repo.findByScore(minScore, limit);
  }

  return c.json({ data: trends, meta: { limit, cursor: null } });
});

export default app;
