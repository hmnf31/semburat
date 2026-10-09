import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { softLaunchArticles } from '../apps/web/src/data/soft-launch-articles';

interface ExportedArticle {
  slug: string;
  title: string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  subcategory: string;
  riskLevel: string;
  qualityScore: number;
  publishedAt: string;
  sources: { title: string; url: string; accessedAt?: string }[];
  assets: {
    type: string;
    title: string;
    license: string;
    credit: string;
    sourceUrl?: string;
  }[];
  keyPoints: string[];
  faq: { question: string; answer: string }[];
}

function parseOut(argv: string[]): string {
  const index = argv.indexOf('--out');
  if (index !== -1 && argv[index + 1]) return argv[index + 1];
  return 'social-out/articles.json';
}

function toExported(article: (typeof softLaunchArticles)[number]): ExportedArticle {
  return {
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    summary: article.summary,
    body: article.body,
    category: article.category,
    subcategory: article.subcategory,
    riskLevel: article.riskLevel,
    qualityScore: article.qualityScore,
    publishedAt: article.publishedAt,
    sources: article.sources.map((source) => ({
      title: source.title,
      url: source.url,
      accessedAt: source.accessedAt,
    })),
    assets: article.assets.map((asset) => ({
      type: asset.type,
      title: asset.title,
      license: asset.license,
      credit: asset.credit,
      sourceUrl: asset.sourceUrl,
    })),
    keyPoints: article.keyPoints,
    faq: article.faq.map((item) => ({ question: item.question, answer: item.answer })),
  };
}

const outPath = resolve(process.cwd(), parseOut(process.argv.slice(2)));
const articles = softLaunchArticles
  .filter((article) => article.status === 'published')
  .map(toExported);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ articles }, null, 2) + '\n', 'utf-8');
console.log(`Exported ${articles.length} published articles to ${outPath}`);
