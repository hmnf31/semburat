import type { D1Database } from '@semburat/db';

export interface Env {
  DB: D1Database;
  ASSETS: KVNamespace;
  ENVIRONMENT: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  AI_PROVIDER?: string;
  AI_BASE_URL?: string;
  AI_API_KEY?: string;
  AI_MODEL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  TELEGRAM_ALLOWED_USER_IDS?: string;
  MINIMAX_API_KEY?: string;
  ASSETS_PUBLIC_BASE_URL?: string;
  R2_PUBLIC_BASE_URL?: string;
  APP_BASE_URL?: string;
  PUBLIC_SITE_URL?: string;
  TREND_QUERIES?: string;
  RESEARCH_MODE?: string;
  RSS_FEEDS?: string;
  REDDIT_SUBREDDITS?: string;
  ENABLE_FANART?: string;
  LOG_LEVEL?: string;
}
