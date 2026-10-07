import type { Fact } from '../entities/Fact.js';

export interface FactRepository {
  insert(fact: Fact): Promise<void>;
  findById(id: string): Promise<Fact | null>;
  findByArticleId(articleId: string): Promise<Fact[]>;
  bulkInsert(facts: Fact[]): Promise<void>;
}
