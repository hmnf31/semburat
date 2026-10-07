// packages/shared/src/tracer.ts

import { AsyncLocalStorage } from 'async_hooks';

export interface TraceContext {
  correlationId: string;
  parentSpanId?: string;
  spanId: string;
  startTime: number;
  metadata: Record<string, unknown>;
}

const asyncLocalStorage = new AsyncLocalStorage<TraceContext>();

export function generateCorrelationId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 15)}`;
}

export function generateSpanId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function getCurrentTraceContext(): TraceContext | undefined {
  return asyncLocalStorage.getStore();
}

export function getCorrelationId(): string | undefined {
  return asyncLocalStorage.getStore()?.correlationId;
}

export function runWithTraceContext<T>(context: TraceContext, callback: () => T): T {
  return asyncLocalStorage.run(context, callback);
}

export function createTraceContext(correlationId?: string, parentSpanId?: string): TraceContext {
  return {
    correlationId: correlationId ?? generateCorrelationId(),
    parentSpanId,
    spanId: generateSpanId(),
    startTime: Date.now(),
    metadata: {},
  };
}

export function withCorrelationId<T>(correlationId: string, callback: () => T): T {
  const existingContext = asyncLocalStorage.getStore();
  const newContext: TraceContext = existingContext
    ? { ...existingContext, correlationId }
    : createTraceContext(correlationId);
  return asyncLocalStorage.run(newContext, callback);
}

export function addTraceMetadata(key: string, value: unknown): void {
  const context = asyncLocalStorage.getStore();
  if (context) {
    context.metadata[key] = value;
  }
}

export function getTraceMetadata(): Record<string, unknown> {
  return asyncLocalStorage.getStore()?.metadata ?? {};
}

export function createChildSpan(operationName: string): TraceContext | undefined {
  const parentContext = asyncLocalStorage.getStore();
  if (!parentContext) return undefined;

  const childContext: TraceContext = {
    ...parentContext,
    spanId: generateSpanId(),
    parentSpanId: parentContext.spanId,
    startTime: Date.now(),
    metadata: { ...parentContext.metadata, operation: operationName },
  };

  return childContext;
}

export function runInChildSpan<T>(operationName: string, callback: () => T): T | undefined {
  const childContext = createChildSpan(operationName);
  if (!childContext) return callback();
  return asyncLocalStorage.run(childContext, callback);
}

export function getTraceInfo(): { correlationId: string; spanId: string; duration: number } | null {
  const context = asyncLocalStorage.getStore();
  if (!context) return null;
  return {
    correlationId: context.correlationId,
    spanId: context.spanId,
    duration: Date.now() - context.startTime,
  };
}
