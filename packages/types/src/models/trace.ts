/**
 * @file Contains types for MongoDB trace models
 */

/**
 * Available span status codes
 *
 * @see {@link https://opentelemetry.io/docs/concepts/signals/traces/#span-status} Span status code definition
 *
 * @default 'STATUS_CODE_UNSET'
 */
export enum EStatusCodes {
  OK = 'STATUS_CODE_OK',
  ERROR = 'STATUS_CODE_ERROR',
  UNSET = 'STATUS_CODE_UNSET',
}

/**
 * Available span types
 *
 * @see {@link https://opentelemetry.io/docs/concepts/signals/traces/#span-kind} Span kind definition
 *
 * @default 'INTERNAL'
 */
export enum ESpanKind {
  CLIENT = 'CLIENT',
  SERVER = 'SERVER',
  INTERNAL = 'INTERNAL',
  PRODUCER = 'PRODUCER',
  CONSUMER = 'CONSUMER',
}

/**
 * Span event
 *
 * Describes a singular point in the lifetime of the span
 *
 * @see {@link https://opentelemetry.io/docs/concepts/signals/traces/#span-events} Span event definition
 */
export interface ISpanEvent {
  /** Event name */
  name: string;
  /** Timestamp of the occurring event */
  timestamp: Date;
  /**
   * Optional attribute meta data
   *
   * @default {}
   */
  attributes?: Record<string, any>;
}

/**
 * Span context
 *
 * Holds information which uniquely identifiers the span and the trace associated with it.
 *
 * @see {@link https://opentelemetry.io/docs/concepts/signals/traces/#span-context} Span context definition
 */
export interface ISpanContext {
  traceId: string;
  spanId: string;
}

/**
 * Trace span instance
 *
 * Represents a single unit of work. A span has to always be associated with a trace, and can also be associated to a parent span.
 */
export interface ISpan {
  /** Name of the span */
  name: string;
  /**
   * Span kind
   *
   * @see ESpanType
  */
  type: ESpanKind;
  /**
   * Span context
   *
   * @see ISpanContext
   */
  context: ISpanContext;
  /** Span parent ID. Undefined if the span is the root span */
  parentId: string | null;
  /**
   * Span statuscode
   *
   * @see EStatusCodes
   */
  statusCode: EStatusCodes;
  /**
   * Optional span status message. Has to correlate to statuscode
   *
   * @default ''
   */
  statusMessage: string;
  /** Timestamp recording the start of the span */
  startTime: Date;
  /** Timestamp recording the end of the span */
  endTime: Date;
  /**
   * Optional attribute meta data
   *
   * @default {}
   */
  attributes: Record<string, any>;
  /**
   * Optional span events
   *
   * @see ISpanEvent
   *
   * @default []
   */
  events: ISpanEvent[];
}
