import type { D1Database } from '@semburat/db';

export interface Env {
  DB: D1Database;
  ASSETS: R2Bucket;
  ENVIRONMENT: string;
  OPENROUTER_API_KEY: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  MINIMAX_API_KEY: string;
  APP_BASE_URL: string;
  PUBLIC_SITE_URL: string;
  LOG_LEVEL: string;
}
