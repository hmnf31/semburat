import { Hono } from 'hono';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

app.post('/events', async (c) => {
  // Insert analytics event
  return c.json({ data: { received: true } }, 201);
});

export default app;
