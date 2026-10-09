import { Hono } from 'hono';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

app.get('*', async (c) => {
  const url = new URL(c.req.url);
  const marker = '/media/';
  const index = url.pathname.indexOf(marker);
  const key = decodeURIComponent(index >= 0 ? url.pathname.slice(index + marker.length) : '');

  if (!key || key.includes('..')) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Asset not found' } }, 404);
  }

  const object = await c.env.ASSETS.getWithMetadata<{ contentType?: string }>(key, 'arrayBuffer');
  if (!object.value) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Asset not found' } }, 404);
  }

  return new Response(object.value, {
    headers: {
      'Content-Type': object.metadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

export default app;
