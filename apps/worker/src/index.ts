import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createContainer } from './container.js';
import type { Env } from './env.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { rateLimitMiddleware } from './middleware/rate-limit.js';
import health from './routes/health.js';
import trends from './routes/trends.js';
import articles from './routes/articles.js';
import assets from './routes/assets.js';
import analytics from './routes/analytics.js';
import pipeline from './routes/pipeline.js';
import telegram from './routes/telegram.js';
import media from './routes/media.js';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
app.use('*', rateLimitMiddleware);
app.onError(errorHandler);

app.use('/api/pipeline/*', authMiddleware);

app.route('/api/health', health);
app.route('/api/trends', trends);
app.route('/api/articles', articles);
app.route('/api/assets', assets);
app.route('/api/analytics', analytics);
app.route('/api/pipeline', pipeline);
app.route('/api/telegram/webhook', telegram);
app.route('/media', media);

app.get('/', (c) => {
  const container = createContainer(c.env);
  return c.json({
    name: 'SEMBURAT Worker',
    version: '1.1.0',
    status: 'running',
    environment: c.env.ENVIRONMENT,
    aiMode: container.aiMode,
  });
});

export default app;
