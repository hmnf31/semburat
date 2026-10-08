export const SITE_NAME = 'SEMBURAT';
export const SITE_TAGLINE = 'Yang sedang muncul, kami rangkai menjadi cerita.';
export const SITE_DESCRIPTION =
  'SEMBURAT — platform media intelligence Indonesia. Yang sedang muncul, kami rangkai menjadi cerita.';

export const SITE_URL = (
  import.meta.env.PUBLIC_SITE_URL ?? 'https://semburat-web.pages.dev'
).replace(/\/+$/, '');

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;
export const DEFAULT_OG_IMAGE_TYPE = 'image/svg+xml';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
