/**
 * Minimal D1 binding interface mirroring the Cloudflare Workers `D1Database`
 * binding. Infrastructure repositories depend on this abstraction so they can be
 * tested against an in-memory mock and remain decoupled from the Cloudflare
 * runtime types.
 *
 * The shape is structurally compatible with the real Cloudflare D1 binding:
 *
 *   env.DB.prepare("SELECT ...").bind(...values).first() / .all() / .run()
 */
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(colNames?: boolean[]): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success?: boolean;
  meta?: D1ResultMeta;
  lastRowId?: number | null;
  changes?: number | null;
  duration?: number | null;
}

export interface D1ResultMeta {
  changed_db?: boolean;
  size_after_checkpoints?: number;
  rows_written?: number;
  rows_read?: number;
  total_row_count?: number;
  database?: string;
  [key: string]: unknown;
}
