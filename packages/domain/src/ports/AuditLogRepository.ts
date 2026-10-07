import type { AuditLog } from '../entities/AuditLog.js';

export interface AuditLogRepository {
  insert(log: AuditLog): Promise<void>;
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}
