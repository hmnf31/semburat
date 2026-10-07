// packages/shared/src/logger.ts

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  correlation_id?: string;
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const SENSITIVE_FIELDS = new Set([
  'password',
  'token',
  'apiKey',
  'secret',
  'apikey',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'session',
  'private_key',
  'privateKey',
]);

const SENSITIVE_SUBSTRINGS = [
  'password',
  'token',
  'apikey',
  'secret',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'session',
  'private_key',
  'privatekey',
];

function redactSensitiveData(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.has(lowerKey) || SENSITIVE_SUBSTRINGS.some((s) => lowerKey.includes(s))) {
      result[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = redactSensitiveData(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) =>
        v && typeof v === 'object' ? redactSensitiveData(v as Record<string, unknown>) : v
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

export class Logger {
  private readonly service: string;
  private readonly minLevel: LogLevel;
  private static levelOrder: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor(service: string, minLevel: LogLevel = 'info') {
    this.service = service;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return Logger.levelOrder[level] <= Logger.levelOrder[this.minLevel];
  }

  private formatEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      metadata: metadata ? redactSensitiveData(metadata) : undefined,
    };
  }

  private write(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    this.write(this.formatEntry('error', message, metadata));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    this.write(this.formatEntry('warn', message, metadata));
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    this.write(this.formatEntry('info', message, metadata));
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    this.write(this.formatEntry('debug', message, metadata));
  }

  child(additionalMetadata: Record<string, unknown>): Logger {
    const childLogger = new Logger(this.service, this.minLevel);
    const originalMethods = {
      error: childLogger.error.bind(childLogger),
      warn: childLogger.warn.bind(childLogger),
      info: childLogger.info.bind(childLogger),
      debug: childLogger.debug.bind(childLogger),
    };

    childLogger.error = (message: string, metadata?: Record<string, unknown>) =>
      originalMethods.error(message, { ...additionalMetadata, ...metadata });
    childLogger.warn = (message: string, metadata?: Record<string, unknown>) =>
      originalMethods.warn(message, { ...additionalMetadata, ...metadata });
    childLogger.info = (message: string, metadata?: Record<string, unknown>) =>
      originalMethods.info(message, { ...additionalMetadata, ...metadata });
    childLogger.debug = (message: string, metadata?: Record<string, unknown>) =>
      originalMethods.debug(message, { ...additionalMetadata, ...metadata });

    return childLogger;
  }
}

export function createLogger(service: string, minLevel?: LogLevel): Logger {
  return new Logger(service, minLevel);
}

export const defaultLogger = createLogger('semburat');
