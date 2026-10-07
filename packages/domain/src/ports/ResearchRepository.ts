import type { Research } from '../entities/Research.js';

export interface ResearchRepository {
  insert(research: Research): Promise<void>;
  findById(id: string): Promise<Research | null>;
  findByTrendId(trendId: string): Promise<Research | null>;
  update(research: Research): Promise<void>;
}
