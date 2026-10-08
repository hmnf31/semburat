import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AnalyticsEvent } from '@semburat/domain';
import { D1AnalyticsEventRepository } from '@semburat/infra';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

const eventSchema = z.object({
  content_id: z.string().trim().min(1),
  event_type: z.string().trim().min(1),
  value: z.number().min(0).optional(),
  metadata: z.record(z.unknown()).optional(),
});

app.post('/events', async (c) => {
  const parsed = eventSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid analytics event',
          details: parsed.error.issues,
        },
      },
      400
    );
  }

  const event = new AnalyticsEvent({
    id: randomUUID(),
    contentId: parsed.data.content_id,
    eventType: parsed.data.event_type,
    value: parsed.data.value,
    metadata: parsed.data.metadata,
    occurredAt: new Date(),
  });

  const repo = new D1AnalyticsEventRepository(c.env.DB);
  await repo.insert(event);

  return c.json({ data: { received: true, id: event.id } }, 201);
});

export default app;
