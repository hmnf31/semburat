import { Hono } from 'hono';
import type { Context } from 'hono';
import { z } from 'zod';
import { createContainer } from '../container.js';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

const updateSchema = z.object({
  message: z
    .object({
      message_id: z.number(),
      text: z.string().optional(),
      from: z.object({ id: z.number() }).optional(),
      chat: z.object({ id: z.number() }),
    })
    .optional(),
});

const HELP = [
  'Perintah SEMBURAT:',
  '/status - ringkasan tren dan artikel',
  '/review - daftar artikel menunggu review',
  '/approve <articleId> - setujui artikel',
  '/reject <articleId> [alasan] - tolak artikel',
].join('\n');

function isAuthorized(env: Env, fromId?: number): boolean {
  if (!env.TELEGRAM_ALLOWED_USER_IDS) return true;
  const allowed = env.TELEGRAM_ALLOWED_USER_IDS.split(',')
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => Number.isFinite(id));
  if (allowed.length === 0) return true;
  return fromId !== undefined && allowed.includes(fromId);
}

async function sendTelegram(env: Env, chatId: number, text: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function handleCommand(c: Context<{ Bindings: Env }>, text: string, operator: string) {
  const container = createContainer(c.env);
  const [command, ...args] = text.trim().split(/\s+/);

  switch (command) {
    case '/start':
    case '/help':
      return HELP;

    case '/status': {
      const trends = await container.trendRepo.findByScore(0, 1000);
      const queue = await container.reviewQueue.getReviewQueue(100);
      return [
        'Status SEMBURAT',
        `Tren terkumpul: ${trends.length}`,
        `Menunggu review: ${queue.length}`,
        `AI provider: ${container.aiMode}`,
        `Environment: ${c.env.ENVIRONMENT}`,
      ].join('\n');
    }

    case '/review': {
      const queue = await container.reviewQueue.getReviewQueue(10);
      if (queue.length === 0) return 'Antrean review kosong.';
      return queue.map((article) => `${article.id} - ${article.title}`).join('\n');
    }

    case '/approve': {
      const articleId = args[0];
      if (!articleId) return 'Pakai: /approve <articleId>';
      const article = await container.reviewQueue.approve(articleId, operator);
      return `Disetujui: ${article.id} (${article.title})`;
    }

    case '/reject': {
      const articleId = args[0];
      if (!articleId) return 'Pakai: /reject <articleId> [alasan]';
      const reason = args.slice(1).join(' ') || 'no reason given';
      const article = await container.reviewQueue.reject(articleId, operator, reason);
      return `Ditolak: ${article.id} (${article.title}) - ${reason}`;
    }

    default:
      return `Perintah tidak dikenal: ${command}\n\n${HELP}`;
  }
}

app.post('/', async (c) => {
  const secret = c.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    return c.json(
      { error: { code: 'NOT_CONFIGURED', message: 'TELEGRAM_WEBHOOK_SECRET is not set' } },
      503
    );
  }

  const provided = c.req.header('x-telegram-bot-api-secret-token') ?? c.req.query('secret') ?? '';
  if (provided !== secret) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid webhook secret' } }, 401);
  }

  const parsed = updateSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid update' } }, 400);
  }

  const message = parsed.data.message;
  const text = message?.text?.trim();
  if (!message || !text) return c.json({ data: { ignored: true } });

  if (!isAuthorized(c.env, message.from?.id)) {
    return c.json({ data: { ignored: true, reason: 'sender_not_allowed' } });
  }

  if (!text.startsWith('/')) return c.json({ data: { ignored: true, reason: 'not_a_command' } });

  const operator = message.from ? String(message.from.id) : 'telegram';
  const reply = await handleCommand(c, text, operator);
  await sendTelegram(c.env, message.chat.id, reply);

  return c.json({ data: { replied: true } });
});

export default app;
