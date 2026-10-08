import { softLaunchArticles } from '../data/soft-launch-articles';
import { fetchPublishedArticles } from './api';
import type { ApiArticle } from './api';

export type ContentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ContentSource {
  title: string;
  url: string;
  accessedAt?: string;
}

export interface ContentAsset {
  type: 'image' | 'video';
  title: string;
  license: string;
  credit: string;
  sourceUrl?: string;
}

export interface ContentArticle {
  slug: string;
  title: string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  publishedAt: string;
  riskLevel: ContentRiskLevel;
  qualityScore: number;
  sourceCount: number;
  sources: ContentSource[];
  assets: ContentAsset[];
  keyPoints: string[];
  faq: { question: string; answer: string }[];
  fromApi: boolean;
}

export interface ContentCard {
  title: string;
  dek: string;
  category: string;
  categoryHref: string;
  date: string;
  readTime: string;
  slug: string;
}

function categoryHref(category: string): string {
  return `/categories/${category.toLowerCase()}`;
}

function wordsPerMinute(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fromFixture(article: (typeof softLaunchArticles)[number]): ContentArticle {
  return {
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    summary: article.summary,
    body: article.body,
    category: article.category,
    publishedAt: article.publishedAt,
    riskLevel: article.riskLevel,
    qualityScore: article.qualityScore,
    sourceCount: article.sources.length,
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
    faq: article.faq,
    fromApi: false,
  };
}

function fromApi(article: ApiArticle): ContentArticle {
  return {
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    summary: article.summary,
    body: article.body,
    category: article.category,
    publishedAt: article.publishedAt ?? article.updatedAt,
    riskLevel: article.riskLevel,
    qualityScore: article.qualityScore,
    sourceCount: article.sourceCount,
    sources: [],
    assets: [],
    keyPoints: [],
    faq: [],
    fromApi: true,
  };
}

let cache: ContentArticle[] | null = null;

export async function getArticles(): Promise<ContentArticle[]> {
  if (cache) return cache;

  const fixtures = softLaunchArticles
    .filter((article) => article.status === 'published')
    .map(fromFixture);

  const apiArticles = (await fetchPublishedArticles()).map(fromApi);

  const bySlug = new Map<string, ContentArticle>();
  for (const article of apiArticles) bySlug.set(article.slug, article);
  for (const article of fixtures) bySlug.set(article.slug, article);

  cache = [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return cache;
}

export function toCard(article: ContentArticle): ContentCard {
  return {
    title: article.title,
    dek: article.dek,
    category: article.category,
    categoryHref: categoryHref(article.category),
    date: article.publishedAt,
    readTime: String(wordsPerMinute(article.body)),
    slug: article.slug,
  };
}

export async function getArticleCards(limit?: number): Promise<ContentCard[]> {
  const articles = await getArticles();
  const cards = articles.map(toCard);
  return limit === undefined ? cards : cards.slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<ContentArticle | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getCategoryCounts(): Promise<{ label: string; count: number }[]> {
  const articles = await getArticles();
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRelated(slug: string, limit = 4): Promise<ContentCard[]> {
  const articles = await getArticles();
  const current = articles.find((article) => article.slug === slug);
  if (!current) return [];
  return articles
    .filter((article) => article.slug !== slug && article.category === current.category)
    .slice(0, limit)
    .map(toCard);
}
