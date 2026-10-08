import { Context, Next } from 'hono';
import { AppError } from '@semburat/shared';

export const errorMiddleware = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      return c.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        err.statusCode as 400
      );
    }
    console.error('Unhandled error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500);
  }
};
