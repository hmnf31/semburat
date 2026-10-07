import { ValidationError } from '@semburat/shared';

import type { AuditLogId } from '@semburat/shared';

export type AuditDetails = Record<string, unknown>;

export interface AuditLogParams {
  id: AuditLogId;
  entityType: string;
  entityId: string;
  action: string;
  changes?: AuditDetails | null;
  operator?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export class AuditLog {
  public readonly id: AuditLogId;
  public readonly entityType: string;
  public readonly entityId: string;
  public readonly action: string;
  public readonly changes: AuditDetails | null;
  public readonly operator: string | null;
  public readonly ipAddress: string | null;
  public readonly userAgent: string | null;
  public readonly createdAt: Date;

  constructor(params: AuditLogParams) {
    if (!params.entityType || params.entityType.trim().length === 0) {
      throw new ValidationError('Entity type cannot be empty');
    }
    if (!params.entityId || params.entityId.trim().length === 0) {
      throw new ValidationError('Entity id cannot be empty');
    }
    if (!params.action || params.action.trim().length === 0) {
      throw new ValidationError('Action cannot be empty');
    }

    this.id = params.id;
    this.entityType = params.entityType.trim();
    this.entityId = params.entityId.trim();
    this.action = params.action.trim();
    this.changes = params.changes ?? null;
    this.operator = params.operator?.trim() ?? null;
    this.ipAddress = params.ipAddress?.trim() ?? null;
    this.userAgent = params.userAgent?.trim() ?? null;
    this.createdAt = params.createdAt ?? new Date();
  }

  static record(
    entityType: string,
    entityId: string,
    action: string,
    changes?: AuditDetails,
    operator?: string
  ): AuditLog {
    return new AuditLog({
      id: crypto.randomUUID(),
      entityType,
      entityId,
      action,
      changes,
      operator,
    });
  }
}
