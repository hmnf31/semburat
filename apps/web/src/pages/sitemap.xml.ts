export const prerender = true;

const SITE_URL = 'https://semburat.example.id';
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
  { loc: '/about', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/editorial-policy', lastmod: TODAY, changefreq: 'monthly', priority: '0.3' },
  { loc: '/correction-policy', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { loc: '/contact', lastmod: TODAY, changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacy', lastmod: TODAY, changefreq: 'yearly', priority: '0.2' },
  { loc: '/terms', lastmod: TODAY, changefreq: 'yearly', priority: '0.2' },
];

const categoryPages: SitemapPage[] = [
  'berita',
  'teknologi',
  'ekonomi',
  'kesehatan',
  'kebijaran-publik',
].map((slug) => ({
  loc: `/categories/${slug}`,
  lastmod: TODAY,
  changefreq: 'weekly',
  priority: '0.6',
}));

interface ArticleEntry {
  slug: string;
  date: string;
}

const articlePages: SitemapPage[] = [
  { slug: 'contoh-artikel', date: '2026-10-01' },
  { slug: 'tren-kecerdasan-buatan', date: '2026-09-28' },
].map((article: ArticleEntry) => ({
  loc: `/articles/${article.slug}`,
  lastmod: article.date,
  changefreq: 'monthly',
  priority: '0.7',
}));

const allPages = [...staticPages, ...categoryPages, ...articlePages];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET(): Response {
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
