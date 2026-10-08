export const prerender = true;

import { categories } from '../data/categories';
import { getArticles } from '../lib/content';
import { SITE_URL } from '../lib/site';

const TODAY = new Date().toISOString().split('T')[0];

interface SitemapPage {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const staticPages: SitemapPage[] = [
  { loc: '/', lastmod: TODAY, changefreq: 'daily', priority: '1.0' },
  { loc: '/trending', lastmod: TODAY, changefreq: 'daily', priority: '0.8' },
  { loc: '/categories', lastmod: TODAY, changefreq: 'weekly', priority: '0.7' },
  { loc: '/about', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/editorial-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/source-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/ai-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/correction-policy', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { loc: '/contact', lastmod: TODAY, changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacy', lastmod: TODAY, changefreq: 'yearly', priority: '0.2' },
  { loc: '/terms', lastmod: TODAY, changefreq: 'yearly', priority: '0.2' },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const categoryPages: SitemapPage[] = Object.keys(categories).map((slug) => ({
    loc: `/categories/${slug}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.6',
  }));

  const articlePages: SitemapPage[] = (await getArticles()).map((article) => ({
    loc: `/articles/${article.slug}`,
    lastmod: article.publishedAt.split('T')[0],
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const allPages = [...staticPages, ...categoryPages, ...articlePages];

  const urls = allPages
    .map((page) => {
      const tags: string[] = [`<loc>${escapeXml(`${SITE_URL}${page.loc}`)}</loc>`];
      if (page.lastmod) {
        tags.push(`<lastmod>${page.lastmod}</lastmod>`);
      }
      tags.push(`<changefreq>${page.changefreq}</changefreq>`);
      tags.push(`<priority>${page.priority}</priority>`);
      return `  <url>\n    ${tags.join('\n    ')}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
