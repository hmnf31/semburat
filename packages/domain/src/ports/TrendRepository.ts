import type { Trend } from '../entities/Trend.js';
import type { TrendStatus } from '../entities/Trend.js';

export interface TrendRepository {
  insert(trend: Trend): Promise<void>;
  findById(id: string): Promise<Trend | null>;
  findByNormalizedKey(key: string): Promise<Trend | null>;
  findByStatus(status: TrendStatus): Promise<Trend[]>;
  findByScore(minScore: number, limit: number): Promise<Trend[]>;
  update(trend: Trend): Promise<void>;
  upsert(trend: Trend): Promise<void>;
}
