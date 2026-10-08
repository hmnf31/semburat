export interface ArticleSource {
  title: string;
  url: string;
  accessedAt?: string;
}

export interface ArticleCredit {
  creator: string;
  license: string;
  credit: string;
  sourceUrl?: string;
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
  keyPoints?: string[];
  faq?: { question: string; answer: string }[];
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  qualityScore?: number;
  assets?: { type: "image" | "video"; title: string; license: string; credit: string; sourceUrl?: string }[];
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

import { softLaunchArticles } from "./soft-launch-articles";

const CATEGORY_HREF: Record<string, string> = {
  Viral: "/categories/viral",
  Teknologi: "/categories/teknologi",
  Gaming: "/categories/gaming",
  Explainer: "/categories/explainer",
};

function wordsPerMinute(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function toArticleData(a: typeof softLaunchArticles[number]): ArticleData {
  const readTime = wordsPerMinute(a.body);
  return {
    title: a.title,
    dek: a.dek,
    date: a.publishedAt,
    readTime: String(readTime),
    category: a.category,
    categoryHref: CATEGORY_HREF[a.category] ?? "/categories",
    body: [a.body],
    sources: a.sources.map((s) => ({ title: s.title, url: s.url, accessedAt: s.accessedAt })),
    credit: {
      creator: a.assets[0]?.credit ?? "Kreator tidak diketahui",
      license: a.assets[0]?.license ?? "Lisensi tidak diketahui",
      credit: a.assets[0]?.credit ?? "",
      sourceUrl: a.assets[0]?.sourceUrl,
    },
    keyPoints: a.keyPoints,
    faq: a.faq,
    riskLevel: a.riskLevel,
    qualityScore: a.qualityScore,
    assets: a.assets.map((as) => ({
      type: as.type,
      title: as.title,
      license: as.license,
      credit: as.credit,
      sourceUrl: as.sourceUrl,
    })),
  };
}

export const articles: Record<string, ArticleData> = Object.fromEntries(
  softLaunchArticles.map((a) => [a.slug, toArticleData(a)]),
);

export function relatedArticlesFor(slug: string, limit = 4): ArticleCardData[] {
  const current = softLaunchArticles.find((a) => a.slug === slug);
  if (!current) return [];
  return softLaunchArticles
    .filter((a) => a.slug !== slug && a.category === current.category)
    .slice(0, limit)
    .map((a) => ({
      title: a.title,
      dek: a.dek,
      category: a.category,
      categoryHref: CATEGORY_HREF[a.category] ?? "/categories",
      date: a.publishedAt,
      readTime: String(wordsPerMinute(a.body)),
      slug: a.slug,
    }));
}

export const relatedArticles: ArticleCardData[] = [];

