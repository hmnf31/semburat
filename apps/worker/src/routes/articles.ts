import { Hono } from 'hono';
import type { Article } from '@semburat/domain';
import { ArticleStatus } from '@semburat/domain';
import { D1ArticleRepository } from '@semburat/infra';
import type { Env } from '../env.js';

const app = new Hono<{ Bindings: Env }>();

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseLimit(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

function toArticleDto(article: Article) {
  return {
    id: article.id,
    slug: article.slug.toString(),
    title: article.title,
    dek: article.dek,
    summary: article.summary,
    body: article.body,
    category: article.category,
    subcategory: article.subcategory ?? null,
    riskLevel: article.riskLevel.toString().toLowerCase(),
    qualityScore: article.qualityScore.value,
    sourceCount: article.sourceCount,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    updatedAt: article.updatedAt.toISOString(),
  };
}

app.get('/', async (c) => {
  const repo = new D1ArticleRepository(c.env.DB);
  const limit = parseLimit(c.req.query('limit'));
  const category = c.req.query('category');
  const { articles } = await repo.findByStatus(ArticleStatus.PUBLISHED, limit);
  const filtered = category
    ? articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
    : articles;

  return c.json({
    data: filtered.map(toArticleDto),
    meta: { limit, category: category ?? null },
  });
});

app.get('/:slug', async (c) => {
  const repo = new D1ArticleRepository(c.env.DB);
  const article = await repo.findBySlug(c.req.param('slug'));
  if (!article || article.status !== ArticleStatus.PUBLISHED) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  }
  return c.json({ data: toArticleDto(article) });
});

export default app;
