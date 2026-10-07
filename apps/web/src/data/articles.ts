export interface ArticleSource {
  title: string;
  url: string;
}

export interface ArticleCredit {
  creator: string;
  license: string;
  credit: string;
  sourceUrl: string;
}

export interface ArticleData {
  title: string;
  dek: string;
  date: string;
  readTime: string;
  category: string;
  categoryHref: string;
  body: string[];
  sources: ArticleSource[];
  credit: ArticleCredit;
}

export interface ArticleCardData {
  title: string;
  dek: string;
  category: string;
  categoryHref: string;
  date: string;
  readTime: string;
  slug: string;
}

export const articles: Record<string, ArticleData> = {
  'contoh-artikel': {
    title: 'Contoh Artikel: Tren Digital Indonesia',
    dek: 'Dek placeholder. Konten sesungguhnya akan digantikan oleh artikel yang telah melewati verifikasi fakta dan quality gate editorial.',
    date: '2026-10-01',
    readTime: '5 menit',
    category: 'Berita',
    categoryHref: '/categories/berita',
    body: [
      'Placeholder paragraf pertama. Alur kerja editorial SEMBURAT menghasilkan konten dari sumber terverifikasi, bukan dari parafrase otomatis.',
      'Placeholder paragraf kedua. Setiap klaim dilacak ke sumber aslinya, termasuk waktu akses dan status lisensi aset visual yang digunakan.',
      'Placeholder paragraf ketiga. Ketika bukti tidak mencukupi, sistem menyatakan ketidakpastian alih-alih mengisi celah dengan teks buatan.',
    ],
    sources: [
      { title: 'Sumber placeholder 1 (example.com)', url: 'https://example.com/sumber-1' },
      { title: 'Sumber placeholder 2 (example.com)', url: 'https://example.com/sumber-2' },
    ],
    credit: {
      creator: 'Kreator placeholder',
      license: 'CC BY 4.0 (placeholder)',
      credit: 'Kredit visual placeholder',
      sourceUrl: 'https://example.com/kredit-visual',
    },
  },
  'tren-kecerdasan-buatan': {
    title: 'Tren Kecerdasan Buatan: Pengantar Placeholder',
    dek: 'Dek placeholder untuk liputan tren kecerdasan buatan. Akan digantikan oleh konten editorial terverifikasi.',
    date: '2026-09-28',
    readTime: '7 menit',
    category: 'Teknologi',
    categoryHref: '/categories/teknologi',
    body: [
      'Placeholder paragraf pertama. Tren diidentifikasi dari sumber-sumber yang dapat dilacak, bukan dari spekulasi.',
      'Placeholder paragraf kedua. Topik berisiko tinggi seperti klaim keuangan atau kesehatan memerlukan verifikasi lebih ketat dan tinjauan manusia.',
      'Placeholder paragraf ketiga. Provenansi sumber, model, dan aset dicatat untuk setiap artikel yang diterbitkan.',
    ],
    sources: [
      { title: 'Sumber placeholder 1 (example.com)', url: 'https://example.com/sumber-3' },
      { title: 'Sumber placeholder 2 (example.com)', url: 'https://example.com/sumber-4' },
    ],
    credit: {
      creator: 'Kreator placeholder',
      license: 'CC BY-SA 4.0 (placeholder)',
      credit: 'Kredit visual placeholder',
      sourceUrl: 'https://example.com/kredit-visual-2',
    },
  },
};

export const relatedArticles: ArticleCardData[] = [
  {
    title: 'Contoh artikel: tren digital Indonesia',
    dek: 'Ringkasan placeholder artikel terkait.',
    category: 'Berita',
    categoryHref: '/categories/berita',
    date: '2026-10-01',
    readTime: '5',
    slug: 'contoh-artikel',
  },
  {
    title: 'Tren kecerdasan buatan: pengantar placeholder',
    dek: 'Ringkasan placeholder artikel terkait kedua.',
    category: 'Teknologi',
    categoryHref: '/categories/teknologi',
    date: '2026-09-28',
    readTime: '7',
    slug: 'tren-kecerdasan-buatan',
  },
];
