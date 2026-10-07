export const prerender = true;

const SITE_URL = 'https://semburat.example.id';
const SITE_NAME = 'SEMBURAT';
const SITE_DESCRIPTION = 'Yang sedang muncul, kami rangkai menjadi cerita.';

const items = [
  {
    title: 'Contoh Artikel: Tren Digital Indonesia',
    link: `${SITE_URL}/articles/contoh-artikel`,
    description:
      'Dek placeholder. Konten sesungguhnya akan digantikan oleh artikel yang telah melewati verifikasi fakta dan quality gate editorial.',
    pubDate: 'Sat, 01 Oct 2026 00:00:00 GMT',
    guid: `${SITE_URL}/articles/contoh-artikel`,
  },
  {
    title: 'Tren Kecerdasan Buatan: Pengantar Placeholder',
    link: `${SITE_URL}/articles/tren-kecerdasan-buatan`,
    description:
      'Dek placeholder untuk liputan tren kecerdasan buatan. Akan digantikan oleh konten editorial terverifikasi.',
    pubDate: 'Mon, 28 Sep 2026 00:00:00 GMT',
    guid: `${SITE_URL}/articles/tren-kecerdasan-buatan`,
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const itemElements = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>id</language>
    <lastBuildDate>Sat, 07 Oct 2026 00:00:00 GMT</lastBuildDate>
${itemElements}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
