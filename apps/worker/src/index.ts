import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env.js';
import { errorMiddleware } from './middleware/error.js';
import { rateLimitMiddleware } from './middleware/rate-limit.js';
import health from './routes/health.js';
import trends from './routes/trends.js';
import articles from './routes/articles.js';
import assets from './routes/assets.js';
import analytics from './routes/analytics.js';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
app.use('*', rateLimitMiddleware);
app.use('*', errorMiddleware);

app.route('/api/health', health);
app.route('/api/trends', trends);
app.route('/api/articles', articles);
app.route('/api/assets', assets);
app.route('/api/analytics', analytics);

app.get('/', (c) => {
  return c.json({ name: 'SEMBURAT Worker', version: '1.0.0', status: 'running' });
});

export default app;
