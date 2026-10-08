import type { D1Database } from '@semburat/db';

export interface Env {
  DB: D1Database;
  ASSETS: R2Bucket;
  ENVIRONMENT: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  TELEGRAM_ALLOWED_USER_IDS?: string;
  MINIMAX_API_KEY?: string;
  R2_PUBLIC_BASE_URL?: string;
  APP_BASE_URL?: string;
  PUBLIC_SITE_URL?: string;
  TREND_QUERIES?: string;
  LOG_LEVEL?: string;
}
