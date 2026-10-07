// packages/shared/src/errors.ts
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} not found: ${id}` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, id });
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFLICT', 409, details);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: Record<string, unknown>) {
    super(message, 'UNAUTHORIZED', 401, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: Record<string, unknown>) {
    super(message, 'FORBIDDEN', 403, details);
    this.name = 'ForbiddenError';
  }
}

export class ProviderError extends AppError {
  public readonly provider: string;
  public readonly originalError?: Error;

  constructor(
    provider: string,
    message: string,
    originalError?: Error,
    details?: Record<string, unknown>
  ) {
    super(`${provider}: ${message}`, 'PROVIDER_ERROR', 502, { provider, ...details });
    this.name = 'ProviderError';
    this.provider = provider;
    this.originalError = originalError;
  }
}

export class QualityGateError extends AppError {
  public readonly gate: string;
  public readonly reason: string;

  constructor(gate: string, reason: string, details?: Record<string, unknown>) {
    super(`Quality gate failed: ${gate} - ${reason}`, 'QUALITY_GATE_FAILED', 422, {
      gate,
      reason,
      ...details,
    });
    this.name = 'QualityGateError';
    this.gate = gate;
    this.reason = reason;
  }
}
