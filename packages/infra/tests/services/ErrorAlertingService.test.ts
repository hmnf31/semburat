// packages/infra/tests/services/ErrorAlertingService.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorAlertingService } from '../../src/services/ErrorAlertingService.js';

describe('ErrorAlertingService', () => {
  let service: ErrorAlertingService;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
    service = new ErrorAlertingService('test-token', 'test-chat-id', 'https://webhook.example.com');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('captureError sends to Telegram when configured', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const error = new Error('Test error');
    await service.captureError(error, { userId: '123', action: 'test' });

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const telegramCall = mockFetch.mock.calls.find((call) =>
      call[0].toString().includes('api.telegram.org')
    );
    expect(telegramCall).toBeDefined();
    if (!telegramCall || !telegramCall[1]?.body) return;
    expect(telegramCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const telegramBody = JSON.parse(telegramCall[1].body as string);
    expect(telegramBody.text).toContain('Test error');
    expect(telegramBody.chat_id).toBe('test-chat-id');

    const webhookCall = mockFetch.mock.calls.find((call) =>
      call[0].toString().includes('webhook.example.com')
    );
    expect(webhookCall).toBeDefined();
    if (!webhookCall || !webhookCall[1]?.body) return;
    const webhookBody = JSON.parse(webhookCall[1].body as string);
    expect(webhookBody.error.message).toBe('Test error');
    expect(webhookBody.context.userId).toBe('123');
  });

  it('captureError does not throw when Telegram is not configured', async () => {
    const serviceWithoutTelegram = new ErrorAlertingService(undefined, undefined, undefined);

    const error = new Error('Test error without telegram');
    await expect(serviceWithoutTelegram.captureError(error, {})).resolves.not.toThrow();
  });

  it('captureError does not throw when Telegram fetch fails', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const error = new Error('Test error with network failure');
    await expect(service.captureError(error, {})).resolves.not.toThrow();
  });

  it('getErrorHistory returns recent errors', async () => {
    const error1 = new Error('First error');
    const error2 = new Error('Second error');
    const error3 = new Error('Third error');

    await service.captureError(error1, { id: 1 });
    await new Promise((r) => setTimeout(r, 1));
    await service.captureError(error2, { id: 2 });
    await new Promise((r) => setTimeout(r, 1));
    await service.captureError(error3, { id: 3 });

    const history = await service.getErrorHistory(2);

    expect(history).toHaveLength(2);
    expect(history[0].message).toBe('Third error');
    expect(history[1].message).toBe('Second error');
  });

  it('getErrorHistory respects limit', async () => {
    for (let i = 0; i < 10; i++) {
      await service.captureError(new Error(`Error ${i}`), {});
    }

    const history = await service.getErrorHistory(5);
    expect(history).toHaveLength(5);
  });

  it('clearErrorHistory clears all errors', async () => {
    await service.captureError(new Error('Error to clear'), {});
    await service.clearErrorHistory();

    const history = await service.getErrorHistory(10);
    expect(history).toHaveLength(0);
  });

  it('groups similar errors by fingerprint', async () => {
    const error = new Error('Repeated error');
    const context = { operation: 'test' };

    await service.captureError(error, context);
    await service.captureError(error, context);
    await service.captureError(error, context);

    const stats = service.getErrorStats();
    expect(stats.uniqueFingerprints).toBe(1);
    expect(stats.totalOccurrences).toBe(3);
  });

  it('rate limits alerts for same fingerprint', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const error = new Error('Rate limited error');
    const context = { id: 'rate-limit-test' };

    for (let i = 0; i < 15; i++) {
      await service.captureError(error, context);
    }

    const telegramCalls = mockFetch.mock.calls.filter((call) =>
      call[0].toString().includes('api.telegram.org')
    );
    expect(telegramCalls.length).toBeLessThanOrEqual(10);
  });

  it('includes correlation_id in context when available', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const error = new Error('Error with correlation');
    await service.captureError(error, { correlation_id: 'corr-123' });

    const webhookCall = mockFetch.mock.calls.find((call) =>
      call[0].toString().includes('webhook.example.com')
    );
    expect(webhookCall).toBeDefined();
    if (!webhookCall || !webhookCall[1]?.body) return;
    const webhookBody = JSON.parse(webhookCall[1].body as string);
    expect(webhookBody.context.correlation_id).toBe('corr-123');
  });
});
