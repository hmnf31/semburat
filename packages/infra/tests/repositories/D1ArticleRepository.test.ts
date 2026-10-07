import { describe, it, expect } from 'vitest';
import { D1ArticleRepository } from '../../src/repositories/D1ArticleRepository.js';
import { MockD1Database } from '../utils/MockD1Database.js';
import { Article, ArticleStatus, FactCheckStatus } from '@semburat/domain';

function makeArticle(overrides: Partial<ConstructorParameters<typeof Article>[0]> = {}): Article {
  return new Article({
    id: '550e8400-e29b-41d4-a716-446655440000',
    researchId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Valid Article Title Here',
    slug: 'valid-article-title',
    dek: 'This is a valid dek for the article',
    summary: 'Summary of the article',
    body: 'This is the body of the article which is long enough to pass validation requirements for the article content.',
    category: 'news',
    status: ArticleStatus.DRAFT,
    factCheckStatus: FactCheckStatus.PENDING,
    ...overrides,
  });
}

describe('D1ArticleRepository', () => {
  it('insert + findById round-trips an article', async () => {
    const db = new MockD1Database();
    const repo = new D1ArticleRepository(db);
    const article = makeArticle();

    await repo.insert(article);

    const fetched = await repo.findById(article.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(article.id);
    expect(fetched!.title).toBe(article.title);
    expect(fetched!.slug.toString()).toBe(article.slug.toString());
    expect(fetched!.status).toBe(ArticleStatus.DRAFT);
    expect(fetched!.version).toBe(1);
    expect(fetched!.factCheckStatus).toBe(FactCheckStatus.PENDING);
  });

  it('findBySlug returns the matching article', async () => {
    const db = new MockD1Database();
    const repo = new D1ArticleRepository(db);
    const article = makeArticle({ slug: 'my-cool-article' });

    await repo.insert(article);

    const fetched = await repo.findBySlug('my-cool-article');
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(article.id);
    expect(fetched!.slug.toString()).toBe('my-cool-article');
  });

  it('findBySlug returns null when no match exists', async () => {
    const db = new MockD1Database();
    const repo = new D1ArticleRepository(db);

    const fetched = await repo.findBySlug('does-not-exist');
    expect(fetched).toBeNull();
  });

  it('updateStatus increments version and sets status', async () => {
    const db = new MockD1Database();
    const repo = new D1ArticleRepository(db);
    const article = makeArticle({ status: ArticleStatus.VERIFIED });

    await repo.insert(article);
    await repo.updateStatus(article.id, ArticleStatus.APPROVED);

    const fetched = await repo.findById(article.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.status).toBe(ArticleStatus.APPROVED);
    expect(fetched!.version).toBe(2);
  });
});
