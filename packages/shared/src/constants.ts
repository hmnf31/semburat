// packages/shared/src/constants.ts
export const APP_NAME = 'SEMBURAT';
export const VERSION = '0.0.0';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_LANGUAGE = 'id';
export const SUPPORTED_LANGUAGES = ['id', 'en'] as const;
export const MAX_TITLE_LENGTH = 200;
export const MAX_SLUG_LENGTH = 250;
export const MAX_EXCERPT_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 100000;
export const MIN_VERIFICATION_SOURCES = 2;
export const MAX_ASSET_SIZE_MB = 50;
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'] as const;
export const SUPPORTED_AUDIO_FORMATS = ['audio/mp3', 'audio/wav', 'audio/ogg'] as const;
export const CACHE_TTL_SECONDS = 3600;
export const RATE_LIMIT_WINDOW_MS = 60000;
export const RATE_LIMIT_MAX_REQUESTS = 100;
