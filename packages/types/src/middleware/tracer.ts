import type { ISpanEvent, ISpan, ESpanKind } from '../models/trace';

/**
 * @file Contains types for express tracer middleware
 */
export interface ITracer {
  $_state: ITraceState;
  $_checkTraceStarted: () => boolean;
  $_computeMapping: (mapping: string) => string | null;
  $_checkSpanExists: (mapping: string) => boolean;
  start: (options?: ITraceStartOptions) => ITracer;
  addSpan: (options: ITraceAddSpanOptions) => ITracer;
  finishSpan: (options: ITraceFinishSpanOptions) => Promise<ITracer>;
  addSpanEvent: (options: ITraceAddSpanEventOptions) => ITracer;
  addSpanAttribute: (options: ITraceAddSpanAttributesOptions) => ITracer;
}

export interface ITraceState {
  traceId: string | null;
  parentId: string | null;
  mapper: Record<string, ISpanMapping>;
}

export interface ISpanMapping {
  instance: ISpan;
  children: Record<string, ISpanMapping>;
}

interface ITraceStartOptions {
  traceId?: string;
  parentId?: string;
}

interface ITraceAddSpanOptions {
  name: string;
  type?: ESpanKind;
  mapping: string;
  attributes?: Record<string, any>;
}

interface ITraceFinishSpanOptions {
  mapping: string;
}

interface ITraceAddSpanEventOptions {
  mapping: string;
  event: Omit<ISpanEvent, 'timestamp'>;
}

interface ITraceAddSpanAttributesOptions {
  mapping: string;
  attributes: Record<string, any>;
}
