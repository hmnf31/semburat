import type { D1Database, D1PreparedStatement, D1Result } from '@semburat/db';

type Row = Record<string, unknown>;

function parseIdentifier(name: string): string {
  return name.replace(/["\s]/g, '');
}

function countQmarks(text: string | undefined): number {
  return text ? (text.match(/\?/g) || []).length : 0;
}

function cmpValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a < b ? -1 : a > b ? 1 : 0;
  const sa = String(a);
  const sb = String(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

export class MockD1Statement implements D1PreparedStatement {
  readonly sql: string;
  readonly params: unknown[] = [];
  private readonly db: MockD1Database;

  constructor(db: MockD1Database, sql: string) {
    this.db = db;
    this.sql = sql.replace(/;\s*$/, '');
  }

  bind(...values: unknown[]): this {
    this.params.push(...values);
    return this;
  }

  async first<T = unknown>(colName?: string): Promise<T | null> {
    const rows = this.executeSelect();
    if (rows.length === 0) return null;
    const row = rows[0];
    if (colName) return (row[colName] ?? null) as T;
    return row as unknown as T;
  }

  async all<T = unknown>(): Promise<D1Result<T>> {
    return { results: this.executeSelect() as unknown as T[], success: true };
  }

  async raw<T = unknown[]>(_colNames?: boolean[]): Promise<T[]> {
    return this.executeSelect() as unknown as T[];
  }

  async run<T = unknown>(): Promise<D1Result<T>> {
    const parsed = this.parseModify();
    const t = this.db.table(parsed.table);
    if (parsed.op === 'insert' || parsed.op === 'insert-or-replace') {
      const row = this.buildRow(parsed.columns);
      const idx = t.findIndex((r) => r.id === row.id);
      if (idx >= 0) t.splice(idx, 1, row);
      else t.push(row);
      return { success: true, meta: { changes: 1 }, results: [] as unknown as T[] };
    }
    if (parsed.op === 'insert-ignore') {
      const row = this.buildRow(parsed.columns);
      if (t.findIndex((r) => r.id === row.id) >= 0) {
        return { success: true, meta: { changes: 0 }, results: [] as unknown as T[] };
      }
      t.push(row);
      return { success: true, meta: { changes: 1 }, results: [] as unknown as T[] };
    }
    if (parsed.op === 'update') {
      const matched = t.filter((r) => this.matchesWhere(r, parsed.where, parsed.setCount));
      for (const r of matched) this.applyAssignments(r, parsed.assignments, 0);
      return { success: true, meta: { changes: matched.length }, results: [] as unknown as T[] };
    }
    if (parsed.op === 'delete') {
      let removed = 0;
      for (let i = t.length - 1; i >= 0; i--) {
        if (this.matchesWhere(t[i], parsed.where, 0)) {
          t.splice(i, 1);
          removed++;
        }
      }
      return { success: true, meta: { changes: removed }, results: [] as unknown as T[] };
    }
    return { success: true, meta: { changes: 0 }, results: [] as unknown as T[] };
  }

  private executeSelect(): Row[] {
    const parsed = this.parseSelect();
    const rows = this.db.table(parsed.table).slice();
    let result = rows;
    const whereClause = parsed.where;
    if (whereClause) {
      result = result.filter((r) => this.matchesWhere(r, whereClause, 0));
    }
    if (parsed.order) {
      this.applyOrder(result, parsed.order);
    }
    if (parsed.limit !== undefined) {
      let n: number;
      if (parsed.limit === '?') {
        n = Number(this.params[countQmarks(whereClause)]);
      } else {
        n = Number(parsed.limit);
      }
      if (!Number.isNaN(n)) result = result.slice(0, n);
    }
    return result;
  }

  private applyOrder(rows: Row[], order: string): void {
    const orderCols = order
      .split(',')
      .map((s) => {
        const m = s.trim().match(/"?([a-zA-Z_]\w*)"?\s*(ASC|DESC)?/i);
        return m ? { col: parseIdentifier(m[1] ?? ''), dir: (m[2] || 'ASC').toUpperCase() } : null;
      })
      .filter(Boolean) as Array<{ col: string; dir: string }>;
    rows.sort((a, b) => {
      for (const o of orderCols) {
        const av = a[o.col];
        const bv = b[o.col];
        if (av === bv) continue;
        const asc = cmpValues(av, bv);
        return o.dir === 'ASC' ? asc : -asc;
      }
      return 0;
    });
  }

  private matchesWhere(row: Row, where: string | undefined, paramOffset: number): boolean {
    if (!where) return true;
    const whereCount = countQmarks(where);
    const whereParams = this.params.slice(paramOffset, paramOffset + whereCount);
    const conditions = where.split(/\s+AND\s+/i);
    let pi = 0;
    for (const cond of conditions) {
      const m = cond.match(/"?([a-zA-Z_]\w*)"?\s*(>=|<=|!=|<>|>|<|=)\s*\?$/i);
      if (!m) continue;
      const col = parseIdentifier(m[1] ?? '');
      const op = m[2];
      const val = whereParams[pi++];
      const rv = row[col];
      const num = (v: unknown) => Number(v);
      switch (op) {
        case '=':
          if (rv != val) return false;
          break;
        case '!=':
        case '<>':
          if (rv == val) return false;
          break;
        case '>=':
          if (!(num(rv) >= num(val))) return false;
          break;
        case '<=':
          if (!(num(rv) <= num(val))) return false;
          break;
        case '>':
          if (!(num(rv) > num(val))) return false;
          break;
        case '<':
          if (!(num(rv) < num(val))) return false;
          break;
      }
    }
    return true;
  }

  private applyAssignments(row: Row, assignments: string[], paramOffset: number): void {
    let pi = 0;
    for (const assign of assignments) {
      const m = assign.match(/"?([a-zA-Z_]\w*)"?\s*=\s*(.+)/);
      if (!m) continue;
      const col = parseIdentifier(m[1] ?? '');
      const rhs = m[2].trim();
      if (rhs === '?') {
        row[col] = this.params[paramOffset + pi++];
      } else if (/^-?\d+(\.\d+)?$/.test(rhs)) {
        row[col] = Number(rhs);
      } else {
        const expr = rhs.match(/"?([a-zA-Z_]\w*)"?\s*\+\s*(\d+)/);
        if (expr) {
          row[col] = Number(row[parseIdentifier(expr[1])] ?? 0) + Number(expr[2]);
        }
      }
    }
  }

  private buildRow(columns: string[]): Row {
    const row: Row = {};
    columns.forEach((col, i) => {
      row[parseIdentifier(col)] = this.params[i];
    });
    return row;
  }

  private parseSelect(): { table: string; where?: string; order?: string; limit?: string } {
    const m =
      /^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?(?:\s+ORDER\s+BY\s+(.+))?(?:\s+LIMIT\s+(.+))?$/i.exec(
        this.sql
      );
    if (!m) return { table: '' };
    return {
      table: parseIdentifier(m[2]),
      where: m[3] ? m[3].trim() : undefined,
      order: m[4] ? m[4].trim() : undefined,
      limit: m[5] ? m[5].trim() : undefined,
    };
  }

  private parseModify(): {
    op: string;
    table: string;
    columns: string[];
    assignments: string[];
    where?: string;
    setCount: number;
  } {
    const insertM =
      /^(INSERT\s+OR\s+(REPLACE|IGNORE)\s+INTO|INSERT\s+INTO)\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)/i.exec(
        this.sql
      );
    if (insertM) {
      const keyword = insertM[1].toUpperCase();
      let op: string;
      if (keyword.includes('OR REPLACE')) op = 'insert-or-replace';
      else if (keyword.includes('OR IGNORE')) op = 'insert-ignore';
      else op = 'insert';
      return {
        op,
        table: parseIdentifier(insertM[3]),
        columns: insertM[4].split(',').map((c) => c.trim()),
        assignments: [],
        where: undefined,
        setCount: 0,
      };
    }
    const updateM = /^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/is.exec(this.sql);
    if (updateM) {
      const assignments = updateM[2].split(',').map((s) => s.trim());
      return {
        op: 'update',
        table: parseIdentifier(updateM[1]),
        columns: [],
        assignments,
        where: updateM[3].trim(),
        setCount: countQmarks(updateM[2]),
      };
    }
    const deleteM = /^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i.exec(this.sql);
    if (deleteM) {
      return {
        op: 'delete',
        table: parseIdentifier(deleteM[1]),
        columns: [],
        assignments: [],
        where: deleteM[2] ? deleteM[2].trim() : undefined,
        setCount: 0,
      };
    }
    return { op: 'noop', table: '', columns: [], assignments: [], setCount: 0 };
  }
}

export class MockD1Database implements D1Database {
  readonly tables: Map<string, Row[]> = new Map();
  lastSql = '';
  lastParams: unknown[] = [];

  table(name: string): Row[] {
    const key = parseIdentifier(name);
    if (!this.tables.has(key)) this.tables.set(key, []);
    return this.tables.get(key)!;
  }

  prepare(query: string): MockD1Statement {
    this.lastSql = query;
    this.lastParams = [];
    return new MockD1Statement(this, query);
  }

  async batch(statements: D1PreparedStatement[]): Promise<D1Result[]> {
    const results: D1Result[] = [];
    for (const stmt of statements) {
      const s = stmt as unknown as MockD1Statement;
      this.lastSql = s.sql;
      this.lastParams = s.params;
      results.push(await s.run());
    }
    return results;
  }
}
