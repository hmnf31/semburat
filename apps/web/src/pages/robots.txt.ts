export const prerender = true;

import { SITE_URL } from '../lib/site';

export async function GET(): Promise<Response> {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
