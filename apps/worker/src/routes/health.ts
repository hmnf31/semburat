import { Hono } from 'hono';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  return c.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

export default app;
