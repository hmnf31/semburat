// packages/infra/src/services/ErrorAlertingService.ts

import { createLogger } from '@semburat/shared';

interface ErrorRecord {
  message: string;
  timestamp: Date;
  context: Record<string, unknown>;
  fingerprint: string;
  count: number;
  lastAlerted?: Date;
}

interface AlertChannelConfig {
  telegramBotToken?: string;
  telegramChatId?: string;
  webhookUrl?: string;
}

const logger = createLogger('ErrorAlertingService');

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_ALERTS_PER_WINDOW = 10;
const ERROR_HISTORY_LIMIT = 1000;

export class ErrorAlertingService {
  private readonly errorHistory: Map<string, ErrorRecord> = new Map();
  private readonly alertCounts: Map<string, { count: number; windowStart: number }> = new Map();
  private readonly config: AlertChannelConfig;

  constructor(
    private readonly telegramBotToken?: string,
    private readonly telegramChatId?: string,
    private readonly webhookUrl?: string
  ) {
    this.config = {
      telegramBotToken,
      telegramChatId,
      webhookUrl,
    };
  }

  private generateFingerprint(error: Error, context: Record<string, unknown>): string {
    const errorInfo = `${error.name}:${error.message}:${error.stack?.split('\n')[0] ?? ''}`;
    const contextKeys = Object.keys(context).sort().join(',');
    return `${errorInfo}|${contextKeys}`;
  }

  private shouldAlert(fingerprint: string): boolean {
    const now = Date.now();
    const record = this.alertCounts.get(fingerprint);

    if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      this.alertCounts.set(fingerprint, { count: 1, windowStart: now });
      return true;
    }

    if (record.count < MAX_ALERTS_PER_WINDOW) {
      record.count++;
      return true;
    }

    return false;
  }

  private async sendTelegramAlert(message: string): Promise<void> {
    if (!this.telegramBotToken || !this.telegramChatId) return;

    try {
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Failed to send Telegram alert', {
          status: response.status,
          error: errorText,
        });
      }
    } catch (error) {
      logger.error('Error sending Telegram alert', { error: (error as Error).message });
    }
  }

  private async sendWebhookAlert(payload: Record<string, unknown>): Promise<void> {
    if (!this.webhookUrl) return;

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Failed to send webhook alert', { status: response.status, error: errorText });
      }
    } catch (error) {
      logger.error('Error sending webhook alert', { error: (error as Error).message });
    }
  }

  private logToConsole(
    level: 'error' | 'warn' | 'info',
    message: string,
    context: Record<string, unknown>
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'ErrorAlertingService',
      message,
      context,
    };
    console.log(JSON.stringify(logEntry));
  }

  async captureError(error: Error, context: Record<string, unknown> = {}): Promise<void> {
    const fingerprint = this.generateFingerprint(error, context);
    const now = new Date();

    let record = this.errorHistory.get(fingerprint);
    if (record) {
      record.count++;
      record.lastAlerted = now;
    } else {
      record = {
        message: error.message,
        timestamp: now,
        context,
        fingerprint,
        count: 1,
      };
      this.errorHistory.set(fingerprint, record);
    }

    if (this.errorHistory.size > ERROR_HISTORY_LIMIT) {
      const oldestKey = this.errorHistory.keys().next().value;
      if (oldestKey) this.errorHistory.delete(oldestKey);
    }

    const alertMessage =
      `?? <b>Error Alert</b>\n\n` +
      `<b>Error:</b> ${error.name}: ${error.message}\n` +
      `<b>Fingerprint:</b> <code>${fingerprint.substring(0, 50)}...</code>\n` +
      `<b>Count:</b> ${record.count}\n` +
      `<b>Context:</b> <code>${JSON.stringify(context, null, 2).substring(0, 1000)}</code>`;

    const webhookPayload = {
      timestamp: now.toISOString(),
      level: 'error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      fingerprint,
      count: record.count,
      context,
    };

    if (this.shouldAlert(fingerprint)) {
      await Promise.allSettled([
        this.sendTelegramAlert(alertMessage),
        this.sendWebhookAlert(webhookPayload),
      ]);
    }

    this.logToConsole('error', `Error captured: ${error.message}`, {
      fingerprint,
      count: record.count,
      context,
    });
  }

  async getErrorHistory(
    limit: number
  ): Promise<Array<{ message: string; timestamp: Date; context: Record<string, unknown> }>> {
    const records = Array.from(this.errorHistory.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .map((r) => ({
        message: r.message,
        timestamp: r.timestamp,
        context: r.context,
      }));

    return records;
  }

  async clearErrorHistory(): Promise<void> {
    this.errorHistory.clear();
    this.alertCounts.clear();
    logger.info('Error history cleared');
  }

  getErrorStats(): { totalErrors: number; uniqueFingerprints: number; totalOccurrences: number } {
    let totalOccurrences = 0;
    for (const record of this.errorHistory.values()) {
      totalOccurrences += record.count;
    }
    return {
      totalErrors: totalOccurrences,
      uniqueFingerprints: this.errorHistory.size,
      totalOccurrences,
    };
  }
}
