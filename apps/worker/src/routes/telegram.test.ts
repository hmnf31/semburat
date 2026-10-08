import { describe, expect, it } from 'vitest';
import { MockD1Database } from '../../../../packages/infra/tests/utils/MockD1Database';
import app from '../index.js';
import type { Env } from '../env.js';
function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: new MockD1Database() as never,
    ASSETS: undefined as never,
    ENVIRONMENT: 'test',
    ...overrides,
  } as Env;
}
function webhook(text: string, secret?: string): RequestInit {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(secret ? { 'x-telegram-bot-api-secret-token': secret } : {}),
    },
    body: JSON.stringify({
      update_id: 1,
      message: { message_id: 1, text, from: { id: 42 }, chat: { id: 42 } },
    }),
  };
}
type WebhookBody = { data: { ignored?: boolean; replied?: boolean; reason?: string } };
const readBody = <T>(res: Response): Promise<T> => res.json() as Promise<T>;
const URL_PATH = '/api/telegram/webhook';
describe('telegram webhook', () => {
  it('is unavailable when no webhook secret is configured', async () => {
    const res = await app.request(URL_PATH, webhook('/status'), makeEnv());
    expect(res.status).toBe(503);
  });
  it('rejects an invalid webhook secret', async () => {
    const res = await app.request(
      URL_PATH,
      webhook('/status', 'wrong'),
      makeEnv({ TELEGRAM_WEBHOOK_SECRET: 'test-secret' })
    );
    expect(res.status).toBe(401);
  });
  it('ignores non-command messages', async () => {
    const res = await app.request(
      URL_PATH,
      webhook('halo dunia', 'test-secret'),
      makeEnv({ TELEGRAM_WEBHOOK_SECRET: 'test-secret' })
    );
    expect(res.status).toBe(200);
    const body = await readBody<WebhookBody>(res);
    expect(body.data.ignored).toBe(true);
  });
  it('replies to the status command', async () => {
    const res = await app.request(
      URL_PATH,
      webhook('/status', 'test-secret'),
      makeEnv({ TELEGRAM_WEBHOOK_SECRET: 'test-secret' })
    );
    expect(res.status).toBe(200);
    const body = await readBody<WebhookBody>(res);
    expect(body.data.replied).toBe(true);
  });
  it('blocks senders that are not on the allow list', async () => {
    const res = await app.request(
      URL_PATH,
      webhook('/status', 'test-secret'),
      makeEnv({ TELEGRAM_WEBHOOK_SECRET: 'test-secret', TELEGRAM_ALLOWED_USER_IDS: '7' })
    );
    expect(res.status).toBe(200);
    const body = await readBody<WebhookBody>(res);
    expect(body.data.reason).toBe('sender_not_allowed');
  });
  it('explains unknown commands', async () => {
    const res = await app.request(
      URL_PATH,
      webhook('/unknown-command', 'test-secret'),
      makeEnv({ TELEGRAM_WEBHOOK_SECRET: 'test-secret' })
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
