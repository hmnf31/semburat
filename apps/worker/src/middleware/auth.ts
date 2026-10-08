import { Context, Next } from 'hono';
import { UnauthorizedError } from '@semburat/shared';

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const expected = c.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !expected || token !== expected) {
    throw new UnauthorizedError('Invalid or missing authorization token');
  }
  await next();
};
