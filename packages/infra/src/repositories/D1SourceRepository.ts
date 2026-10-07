import { fromISO, toISO } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { Source, SourceType, ReliabilityState, LicenseState } from '@semburat/domain';
import type { SourceRepository as SourceRepositoryPort } from '@semburat/domain';

export class D1SourceRepository implements SourceRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(source: Source): Promise<void> {
    await this.upsert(source);
  }

  async findById(id: string): Promise<Source | null> {
    const row = await this.db
      .prepare('SELECT * FROM sources WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? this.fromRow(row) : null;
  }

  async findByDomain(domain: string): Promise<Source[]> {
    const result = await this.db
      .prepare('SELECT * FROM sources WHERE domain = ? ORDER BY created_at')
      .bind(domain)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  async upsert(source: Source): Promise<void> {
    const sql =
      'INSERT OR REPLACE INTO sources ' +
      '(id, url, domain, title, publisher, published_at, accessed_at, source_type, ' +
      'reliability_state, license_state, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        source.id,
        source.url.toString(),
        source.domain,
        source.title,
        source.publisher || null,
        toISO(source.publishedAt),
        toISO(source.accessedAt),
        source.sourceType,
        source.reliabilityState,
        source.licenseState,
        toISO(source.createdAt)
      )
      .run();
  }

  private fromRow(row: Record<string, unknown>): Source {
    return new Source({
      id: row.id as string,
      url: row.url as string,
      domain: row.domain as string,
      title: row.title as string,
      publisher: row.publisher ? (row.publisher as string) : undefined,
      publishedAt: fromISO(row.published_at),
      accessedAt: fromISO(row.accessed_at),
      sourceType: row.source_type as SourceType,
      reliabilityState: row.reliability_state as ReliabilityState,
      licenseState: row.license_state as LicenseState,
      createdAt: fromISO(row.created_at),
    });
  }
}
