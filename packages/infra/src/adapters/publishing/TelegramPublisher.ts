import { ContentVariant, Platform } from '@semburat/domain';
import type { Publisher } from '@semburat/domain';

interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id: number;
  };
}

export class TelegramPublisher implements Publisher {
  constructor(
    private readonly botToken: string,
    private readonly chatId: string,
    private readonly fetchFn: typeof fetch = globalThis.fetch
  ) {}

  async publish(variant: ContentVariant): Promise<{ externalId: string; url: string }> {
    if (variant.platform !== Platform.TELEGRAM) {
      throw new Error('TelegramPublisher can only publish to Telegram, got ' + variant.platform);
    }

    const apiUrl = 'https://api.telegram.org/bot' + this.botToken + '/sendMessage';
    const response = await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.chatId,
        text: variant.content,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error('Telegram API error: ' + response.status + ' ' + error);
    }

    const data = (await response.json()) as TelegramResponse;
    const messageId = data.result?.message_id?.toString() ?? 'mock-message-id';

    return {
      externalId: 'telegram:' + messageId,
      url: 'https://t.me/c/' + this.chatId.replace('-100', '') + '/' + messageId,
    };
  }

  async delete(externalId: string): Promise<void> {
    const messageId = externalId.replace('telegram:', '');
    const apiUrl = 'https://api.telegram.org/bot' + this.botToken + '/deleteMessage';

    await this.fetchFn(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.chatId,
        message_id: messageId,
      }),
    });
  }
}
