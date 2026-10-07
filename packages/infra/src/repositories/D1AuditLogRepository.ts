import { fromISO, toISO, jsonParse, jsonQuote } from './D1Helpers.js';

import type { D1Database } from '@semburat/db';
import { AuditLog, AuditDetails } from '@semburat/domain';
import type { AuditLogRepository as AuditLogRepositoryPort } from '@semburat/domain';

export class D1AuditLogRepository implements AuditLogRepositoryPort {
  constructor(private readonly db: D1Database) {}

  async insert(log: AuditLog): Promise<void> {
    const sql =
      'INSERT OR IGNORE INTO audit_logs ' +
      '(id, entity_type, entity_id, action, changes_json, operator, ip_address, user_agent, created_at) ' +
      'VALUES (?,?,?,?,?,?,?,?,?)';
    await this.db
      .prepare(sql)
      .bind(
        log.id,
        log.entityType,
        log.entityId,
        log.action,
        log.changes ? jsonQuote(log.changes) : null,
        log.operator,
        log.ipAddress,
        log.userAgent,
        toISO(log.createdAt)
      )
      .run();
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const result = await this.db
      .prepare(
        'SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC'
      )
      .bind(entityType, entityId)
      .all<Record<string, unknown>>();
    return (result.results ?? []).map((row) => this.fromRow(row));
  }

  private fromRow(row: Record<string, unknown>): AuditLog {
    return new AuditLog({
      id: row.id as string,
      entityType: row.entity_type as string,
      entityId: row.entity_id as string,
      action: row.action as string,
      changes: jsonParse<AuditDetails | null>(row.changes_json as string, null),
      operator: row.operator ? (row.operator as string) : undefined,
      ipAddress: row.ip_address ? (row.ip_address as string) : undefined,
      userAgent: row.user_agent ? (row.user_agent as string) : undefined,
      createdAt: fromISO(row.created_at),
    });
  }
}
