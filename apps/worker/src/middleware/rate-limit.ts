import { Context, Next } from 'hono';

const limits = new Map<string, number[]>();

export const rateLimitMiddleware = async (c: Context, next: Next) => {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const window = 60000;
  const maxRequests = 60;

  const timestamps = limits.get(ip)?.filter((t) => now - t < window) ?? [];
  timestamps.push(now);
  limits.set(ip, timestamps);

  if (timestamps.length > maxRequests) {
    return c.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }, 429);
  }
  await next();
};
