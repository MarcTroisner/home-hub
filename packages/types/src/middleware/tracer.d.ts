/**
 * @file Contains shared types for tracers
 */

interface ITracerNewSpan {
  name: string;
  mapping: string;
  attributes?: Record<string, any>;
}

interface ITracerNewAttributes {
  mapping: string;
  attributes: Record<string, any>;
}

interface ITracerSpanEvent extends Omit<ISpanEvent, 'timestamp'> {
  mapping: string;
  attributes?: Record<string, any>;
}

interface ITracerState {
  active: boolean;
  traceId: string;
  parentId: string | null;
  spans: Record<string, ITracerSpan>;
}

interface ITracerSpan {
  instance: ISpan;
  children: Record<string, ITracerSpan>;
}

export interface ITracer {
  $_state: ITracerState;
  $_getSpan: (mapping: string) => ITracerSpan | null;
  $_setSpanInstance: (mapping: string, instance: ISpan) => void;
  startTrace: () => void;
  createSpan: (options: ITracerNewSpan) => void;
  finishSpan: (mapping: string) => void;
  addSpanEvent: (options: ITracerSpanEvent) => void;
  addSpanAttributes: (options: ITracerNewAttributes) => void;
  includeTraceInformation: (mapping?: string) => void;
}
