import type { Source } from '../entities/Source.js';

export interface SourceRepository {
  insert(source: Source): Promise<void>;
  findById(id: string): Promise<Source | null>;
  findByDomain(domain: string): Promise<Source[]>;
  upsert(source: Source): Promise<void>;
}
